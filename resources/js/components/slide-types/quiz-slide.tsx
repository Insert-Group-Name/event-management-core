import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle } from "lucide-react"

// Define the option type that can be either a string or an object with id and text
export type QuizOption = string | { id: string; text: string }

interface QuizSlideProps {
  question: string
  options: QuizOption[]
  correctAnswer: string | { id: string; text: string }
  onAnswer: (answer: QuizOption) => void
}

export default function QuizSlide({ question, options, correctAnswer, onAnswer }: QuizSlideProps) {
  const [selectedOption, setSelectedOption] = useState<QuizOption | null>(null)
  const [hasAnswered, setHasAnswered] = useState(false)

  // Helper function to get option text
  const getOptionText = (option: QuizOption): string => {
    return typeof option === 'string' ? option : option.text
  }

  // Helper function to get option id/key for React lists
  const getOptionKey = (option: QuizOption): string => {
    return typeof option === 'string' ? option : option.id
  }

  // Helper function to check if two options are the same
  const isSameOption = (a: QuizOption | null, b: QuizOption | null): boolean => {
    if (a === null || b === null) return false
    
    if (typeof a === 'string' && typeof b === 'string') {
      return a === b
    }
    
    if (typeof a === 'object' && typeof b === 'object') {
      return a.id === b.id
    }
    
    if (typeof a === 'string' && typeof b === 'object') {
      return a === b.text || a === b.id
    }
    
    if (typeof a === 'object' && typeof b === 'string') {
      return a.text === b || a.id === b
    }
    
    return false
  }

  // Helper function to check if an option is the correct answer
  const isCorrectOption = (option: QuizOption): boolean => {
    if (typeof correctAnswer === 'string') {
      return typeof option === 'string' 
        ? option === correctAnswer 
        : option.id === correctAnswer || option.text === correctAnswer
    } else {
      return typeof option === 'string'
        ? option === correctAnswer.text || option === correctAnswer.id
        : option.id === correctAnswer.id
    }
  }

  const handleAnswer = () => {
    if (!selectedOption) return

    setHasAnswered(true)
    onAnswer(selectedOption)
  }

  const isCorrect = selectedOption ? isCorrectOption(selectedOption) : false

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
                key={getOptionKey(option)}
                variant={isSameOption(selectedOption, option) ? "default" : "outline"}
                className={`w-full justify-start h-auto py-4 px-4 text-left ${
                  isSameOption(selectedOption, option)
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-black/30 text-white border-white/20 hover:bg-white/20"
                }`}
                onClick={() => setSelectedOption(option)}
              >
                {getOptionText(option)}
              </Button>
            ))}

            <Button className="w-full mt-4" disabled={!selectedOption} onClick={handleAnswer}>
              Submit Answer
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {options.map((option) => {
              const isOptionCorrect = isCorrectOption(option)

              return (
                <div
                  key={getOptionKey(option)}
                  className={`p-4 rounded-lg border flex items-center justify-between ${
                    isOptionCorrect
                      ? "bg-green-900/20 border-green-500/30"
                      : isSameOption(option, selectedOption) && !isOptionCorrect
                        ? "bg-red-900/20 border-red-500/30"
                        : "bg-black/30 border-white/20"
                  }`}
                >
                  <span>{getOptionText(option)}</span>
                  {isOptionCorrect && <CheckCircle2 className="text-green-500" size={20} />}
                  {isSameOption(option, selectedOption) && !isOptionCorrect && <XCircle className="text-red-500" size={20} />}
                </div>
              )
            })}

            <div
              className={`p-4 rounded-lg text-center ${
                isCorrect ? "bg-green-900/20 text-green-400" : "bg-red-900/20 text-red-400"
              }`}
            >
              {isCorrect ? (
                "You got it right! 🎉"
              ) : (
                <span>
                  Correct answer: {getOptionText(correctAnswer)}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
      {/* Add colorful background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-teal-500 opacity-90 -z-10" />
    </div>
  )
}

