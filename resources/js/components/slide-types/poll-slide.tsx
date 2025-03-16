"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { BarChart2 } from "lucide-react"

interface PollSlideProps {
  question: string
  options: string[]
  onVote: (option: string) => void
}

export default function PollSlide({ question, options, onVote }: PollSlideProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [hasVoted, setHasVoted] = useState(false)
  const [results, setResults] = useState<Record<string, number>>(() => {
    // Simulate some initial votes
    return options.reduce(
      (acc, option) => {
        acc[option] = Math.floor(Math.random() * 30)
        return acc
      },
      {} as Record<string, number>,
    )
  })

  const handleVote = () => {
    if (!selectedOption) return

    setHasVoted(true)
    onVote(selectedOption)

    // Update results
    setResults((prev) => ({
      ...prev,
      [selectedOption]: (prev[selectedOption] || 0) + 1,
    }))
  }

  const totalVotes = Object.values(results).reduce((sum, count) => sum + count, 0)

  return (
    <div className="w-full max-w-md px-4 py-8 text-white">
      <div className="space-y-6 relative z-10">
        <h2 className="text-xl font-bold text-center mb-6">{question}</h2>

        {!hasVoted ? (
          <div className="space-y-3">
            {options.map((option) => (
              <Button
                key={option}
                variant={selectedOption === option ? "default" : "outline"}
                className={`w-full justify-start h-auto py-4 px-4 text-left ${
                  selectedOption === option
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-black/30 text-white border-white/20 hover:bg-white/20"
                }`}
                onClick={() => setSelectedOption(option)}
              >
                {option}
              </Button>
            ))}

            <Button className="w-full mt-4" disabled={!selectedOption} onClick={handleVote}>
              Vote
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Results</span>
              <span className="text-sm text-gray-400">{totalVotes} votes</span>
            </div>

            {options.map((option) => {
              const count = results[option] || 0
              const percentage = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0

              return (
                <div key={option} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{option}</span>
                    <span>{percentage}%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                  </div>
                </div>
              )
            })}

            <div className="flex justify-center mt-4">
              <BarChart2 className="text-white/60" />
              <span className="text-sm text-white/60 ml-2">Live results</span>
            </div>
          </div>
        )}
      </div>
      {/* Add colorful background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-500 opacity-90 -z-10" />
    </div>
  )
}

