"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle } from "lucide-react"

interface QaSlideProps {
  question: string
  onSubmit: (answer: string) => void
}

export default function QaSlide({ question, onSubmit }: QaSlideProps) {
  const [answer, setAnswer] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (!answer.trim()) return
    onSubmit(answer)
    setSubmitted(true)
  }

  return (
    <div className="w-full max-w-md px-4 py-8 text-white relative">
      <div className="space-y-6 relative z-10">
        <div className="flex items-center justify-center">
          <span className="bg-primary/20 text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
            Question
          </span>
        </div>

        <h2 className="text-xl font-bold text-center mb-4">{question}</h2>

        {!submitted ? (
          <div className="space-y-4">
            <Textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className="min-h-[120px] bg-black/30 border-white/20 placeholder:text-white/40 text-white"
            />

            <Button className="w-full" disabled={!answer.trim()} onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        ) : (
          <div className="p-6 rounded-lg bg-green-900/20 border border-green-500/30 flex flex-col items-center justify-center text-center gap-2">
            <CheckCircle className="text-green-500 mb-2" size={48} />
            <h3 className="text-lg font-medium">Thanks for your input!</h3>
            <p className="text-white/70">Your response has been recorded.</p>
          </div>
        )}
      </div>
      {/* Add colorful background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-pink-600 opacity-90 -z-10" />
    </div>
  )
}

