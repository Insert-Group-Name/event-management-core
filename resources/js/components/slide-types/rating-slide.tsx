import { useState } from "react"
import { Star } from "lucide-react"

interface RatingSlideProps {
  question: string
  maxRating: number
  onRate: (rating: number) => void
}

export default function RatingSlide({ question, maxRating = 5, onRate }: RatingSlideProps) {
  const [rating, setRating] = useState<number | null>(null)
  const [hoveredRating, setHoveredRating] = useState<number | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleRate = (value: number) => {
    setRating(value)
    onRate(value)
    setIsSubmitted(true)
  }

  return (
    <div className="w-full max-w-md px-4 py-8 text-white relative">
      <div className="space-y-8 flex flex-col items-center relative z-10">
        <h2 className="text-xl font-bold text-center">{question}</h2>

        <div className="flex gap-2">
          {Array.from({ length: maxRating }).map((_, i) => {
            const value = i + 1
            const isActive = (hoveredRating || rating || 0) >= value

            return (
              <button
                key={i}
                className={`transition-transform ${!isSubmitted && (hoveredRating || 0) >= value ? "scale-110" : ""}`}
                onMouseEnter={() => !isSubmitted && setHoveredRating(value)}
                onMouseLeave={() => !isSubmitted && setHoveredRating(null)}
                onClick={() => !isSubmitted && handleRate(value)}
                disabled={isSubmitted}
              >
                <Star
                  size={42}
                  className={`transition-colors ${isActive ? "fill-yellow-400 text-yellow-400" : "text-white/40"}`}
                />
              </button>
            )
          })}
        </div>

        {isSubmitted && (
          <div className="text-center animate-fade-in">
            <p className="text-lg font-medium">Thanks for your rating!</p>
            <p className="text-white/70">
              You rated {rating} out of {maxRating}
            </p>
          </div>
        )}

        {!isSubmitted && (
          <p className="text-white/70 text-center">
            {hoveredRating ? `${hoveredRating} ${hoveredRating === 1 ? "star" : "stars"}` : "Tap a star to rate"}
          </p>
        )}
      </div>
      {/* Add colorful background */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-amber-600 opacity-90 -z-10" />
    </div>
  )
}

