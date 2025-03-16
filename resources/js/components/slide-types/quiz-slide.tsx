import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle } from "lucide-react"

interface QuizSlideProps {
  question: string
  options: string[]
  correctAnswer: string
  onAnswer: (answer: string) => void
}

export default function QuizSlide({ question, options, correctAnswer, onAnswer }: QuizSlideProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [hasAnswered, setHasAnswered] = useState(false)

  const handleAnswer = () => {
    if (!selectedOption) return

    setHasAnswered(true)
    onAnswer(selectedOption)
  }

  const isCorrect = selectedOption === correctAnswer

  return (
    <div className="w-full max-w-md px-4 py-8 text-white relative">
      <div className="space-y-6 relative z-10">
        <div className="flex items-center justify-center">
          <span className="bg-primary/20 text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">Quiz</span>
        </div>

        <h2 className="text-xl font-bold text-center mb-6">{question}</h2>

        {!hasAnswered ? (
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

            <Button className="w-full mt-4" disabled={!selectedOption} onClick={handleAnswer}>
              Submit Answer
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {options.map((option) => {
              const isOptionCorrect = option === correctAnswer

              return (
                <div
                  key={option}
                  className={`p-4 rounded-lg border flex items-center justify-between ${
                    isOptionCorrect
                      ? "bg-green-900/20 border-green-500/30"
                      : option === selectedOption && !isOptionCorrect
                        ? "bg-red-900/20 border-red-500/30"
                        : "bg-black/30 border-white/20"
                  }`}
                >
                  <span>{option}</span>
                  {isOptionCorrect && <CheckCircle2 className="text-green-500" size={20} />}
                  {option === selectedOption && !isOptionCorrect && <XCircle className="text-red-500" size={20} />}
                </div>
              )
            })}

            <div
              className={`p-4 rounded-lg text-center ${
                isCorrect ? "bg-green-900/20 text-green-400" : "bg-red-900/20 text-red-400"
              }`}
            >
              {isCorrect ? "You got it right! 🎉" : `Correct answer: ${correctAnswer}`}
            </div>
          </div>
        )}
      </div>
      {/* Add colorful background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-teal-500 opacity-90 -z-10" />
    </div>
  )
}

