import type React from "react"

import { useState, useEffect } from "react"
import { Pause, Play, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import PollSlide from "./slide-types/poll-slide"
import QuizSlide from "./slide-types/quiz-slide"
import QaSlide from "./slide-types/qa-slide"
import RatingSlide from "./slide-types/rating-slide"
import CheckinSlide from "./slide-types/checkin-slide"
import SelfieSlide from "./slide-types/selfie-slide"

type SlideType = "poll" | "quiz" | "qa" | "rating" | "checkin" | "selfie"

interface Slide {
  id: string
  type: SlideType
  content: any
  duration: number // in seconds
}

interface EventStoryProps {
  slides: Slide[]
  onClose: () => void
  onComplete: () => void
}

export default function EventStory({
  slides = defaultSlides,
  onClose = () => {},
  onComplete = () => {},
}: EventStoryProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [progress, setProgress] = useState<number[]>(slides.map(() => 0))
  const [isPaused, setIsPaused] = useState(false)
  const [touchStart, setTouchStart] = useState(0)

  const currentSlide = slides[currentSlideIndex]

  useEffect(() => {
    if (!currentSlide || isPaused) return

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = [...prev]
        const increment = 100 / (currentSlide.duration * 10) // 10 updates per second
        newProgress[currentSlideIndex] = Math.min(100, newProgress[currentSlideIndex] + increment)

        if (newProgress[currentSlideIndex] >= 100) {
          clearInterval(interval)
          if (currentSlideIndex < slides.length - 1) {
            setTimeout(() => {
              setCurrentSlideIndex((prev) => prev + 1)
            }, 300)
          } else {
            onComplete()
          }
        }

        return newProgress
      })
    }, 100)

    return () => clearInterval(interval)
  }, [currentSlideIndex, currentSlide, isPaused, slides.length, onComplete])

  const goToNextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      setProgress((prev) => {
        const newProgress = [...prev]
        newProgress[currentSlideIndex] = 100
        return newProgress
      })
      setCurrentSlideIndex((prev) => prev + 1)
    } else {
      onComplete()
    }
  }

  const goToPreviousSlide = () => {
    if (currentSlideIndex > 0) {
      setProgress((prev) => {
        const newProgress = [...prev]
        newProgress[currentSlideIndex] = 0
        newProgress[currentSlideIndex - 1] = 0
        return newProgress
      })
      setCurrentSlideIndex((prev) => prev - 1)
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientX
    const diff = touchStart - touchEnd

    // If swipe distance is significant
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swipe left, go to next slide
        goToNextSlide()
      } else {
        // Swipe right, go to previous slide
        goToPreviousSlide()
      }
    }
  }

  const renderSlide = (slide: Slide) => {
    switch (slide.type) {
      case "poll":
        return (
          <PollSlide
            question={slide.content.question}
            options={slide.content.options}
            onVote={(option) => console.log("Voted:", option)}
          />
        )
      case "quiz":
        return (
          <QuizSlide
            question={slide.content.question}
            options={slide.content.options}
            correctAnswer={slide.content.correctAnswer}
            onAnswer={(answer) => console.log("Answered:", answer)}
          />
        )
      case "qa":
        return (
          <QaSlide question={slide.content.question} onSubmit={(answer) => console.log("Q&A submitted:", answer)} />
        )
      case "rating":
        return (
          <RatingSlide
            question={slide.content.question}
            maxRating={slide.content.maxRating}
            onRate={(rating) => console.log("Rated:", rating)}
          />
        )
      case "checkin":
        return (
          <CheckinSlide
            location={slide.content.location}
            onCheckin={() => console.log("Checked in at:", slide.content.location)}
          />
        )
      case "selfie":
        return <SelfieSlide prompt={slide.content.prompt} onCapture={(image) => console.log("Selfie captured")} />
      default:
        return <div>Unsupported slide type</div>
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black flex flex-col z-50"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Progress bars */}
      <div className="flex gap-1 p-2 z-10">
        {slides.map((_, index) => (
          <Progress
            key={index}
            value={progress[index]}
            className="h-1 flex-1 bg-gray-700"
            indicatorClassName="bg-white"
          />
        ))}
      </div>

      {/* Controls */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-black/20 rounded-full"
          onClick={() => setIsPaused(!isPaused)}
        >
          {isPaused ? <Play size={20} /> : <Pause size={20} />}
        </Button>
        <Button variant="ghost" size="icon" className="text-white hover:bg-black/20 rounded-full" onClick={onClose}>
          <X size={20} />
        </Button>
      </div>

      {/* Navigation */}
      <div className="absolute inset-y-0 left-0 w-1/5 z-10" onClick={goToPreviousSlide} />
      <div className="absolute inset-y-0 right-0 w-1/5 z-10" onClick={goToNextSlide} />

      {/* Current slide */}
      <div className="flex-1 flex items-center justify-center overflow-hidden">{renderSlide(currentSlide)}</div>
    </div>
  )
}

// Default slides for preview
const defaultSlides: Slide[] = [
  {
    id: "poll-1",
    type: "poll",
    content: {
      question: "What topic would you like to hear more about?",
      options: ["Product Roadmap", "Technical Deep Dive", "Customer Success Stories", "Team Building"],
    },
    duration: 15,
  },
  {
    id: "quiz-1",
    type: "quiz",
    content: {
      question: "When was our company founded?",
      options: ["2010", "2015", "2018", "2020"],
      correctAnswer: "2015",
    },
    duration: 10,
  },
  {
    id: "qa-1",
    type: "qa",
    content: {
      question: "What's one feature you'd like to see in our product?",
    },
    duration: 20,
  },
  {
    id: "rating-1",
    type: "rating",
    content: {
      question: "How would you rate this session so far?",
      maxRating: 5,
    },
    duration: 10,
  },
  {
    id: "checkin-1",
    type: "checkin",
    content: {
      location: "Main Conference Hall",
    },
    duration: 8,
  },
  {
    id: "selfie-1",
    type: "selfie",
    content: {
      prompt: "Take a selfie with your team!",
    },
    duration: 15,
  },
]

