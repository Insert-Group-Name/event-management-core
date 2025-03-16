import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { Pause, Play, X, Calendar, Clock, Info, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { format } from "date-fns"
import PollSlide from "@/components/slide-types/poll-slide"
import QuizSlide from "@/components/slide-types/quiz-slide"
import QaSlide from "@/components/slide-types/qa-slide"
import RatingSlide from "@/components/slide-types/rating-slide"
import CheckinSlide from "@/components/slide-types/checkin-slide"
import SelfieSlide from "@/components/slide-types/selfie-slide"
import SpeakerSlide from "@/components/slide-types/speaker-slide"
import type { Activity, EventAgenda, Slide } from "@/types/event-types"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface EventStoryProps {
  agenda: EventAgenda
  onClose: () => void
  currentTime: Date
  setCurrentTime: (time: Date) => void
}

export default function EventStory({
  agenda,
  onClose = () => {},
  currentTime = new Date(),
  setCurrentTime,
}: EventStoryProps) {
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0)
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [progress, setProgress] = useState<number[]>([])
  const [isPaused, setIsPaused] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const [showTimeControls, setShowTimeControls] = useState(false)
  const [showEventInfo, setShowEventInfo] = useState(false)

  // Filter activities that are currently happening or have already happened
  const availableActivities = useMemo(() => {
    return agenda.activities
      .filter((activity) => {
        // Include activities that have started (or are about to start within 5 minutes)
        return activity.startTime <= new Date(currentTime.getTime() + 5 * 60 * 1000)
      })
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
  }, [agenda.activities, currentTime])

  // Get the current activity
  const currentActivity = availableActivities[currentActivityIndex] || null

  // Get the current slide
  const currentSlide = currentActivity?.slides[currentSlideIndex] || null

  // Initialize progress array when activities change
  useEffect(() => {
    if (currentActivity) {
      setProgress(currentActivity.slides.map(() => 0))
    }
  }, [currentActivity])

  // Handle slide progress
  useEffect(() => {
    if (!currentSlide || isPaused || !currentActivity) return

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = [...prev]
        const increment = 100 / (currentSlide.duration * 10) // 10 updates per second
        newProgress[currentSlideIndex] = Math.min(100, newProgress[currentSlideIndex] + increment)

        if (newProgress[currentSlideIndex] >= 100) {
          clearInterval(interval)
          if (currentSlideIndex < currentActivity.slides.length - 1) {
            setTimeout(() => {
              setCurrentSlideIndex((prev) => prev + 1)
            }, 300)
          } else if (currentActivityIndex < availableActivities.length - 1) {
            setTimeout(() => {
              setCurrentActivityIndex((prev) => prev + 1)
              setCurrentSlideIndex(0)
            }, 300)
          }
        }

        return newProgress
      })
    }, 100)

    return () => clearInterval(interval)
  }, [currentSlideIndex, currentSlide, isPaused, currentActivity, currentActivityIndex, availableActivities.length])

  const goToNextSlide = () => {
    if (!currentActivity) return

    if (currentSlideIndex < currentActivity.slides.length - 1) {
      setProgress((prev) => {
        const newProgress = [...prev]
        newProgress[currentSlideIndex] = 100
        return newProgress
      })
      setCurrentSlideIndex((prev) => prev + 1)
    } else if (currentActivityIndex < availableActivities.length - 1) {
      setCurrentActivityIndex((prev) => prev + 1)
      setCurrentSlideIndex(0)
    }
  }

  const goToPreviousSlide = () => {
    if (!currentActivity) return

    if (currentSlideIndex > 0) {
      setProgress((prev) => {
        const newProgress = [...prev]
        newProgress[currentSlideIndex] = 0
        newProgress[currentSlideIndex - 1] = 0
        return newProgress
      })
      setCurrentSlideIndex((prev) => prev - 1)
    } else if (currentActivityIndex > 0) {
      const prevActivity = availableActivities[currentActivityIndex - 1]
      setCurrentActivityIndex((prev) => prev - 1)
      setCurrentSlideIndex(prevActivity.slides.length - 1)
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

  // Time control functions
  const jumpToTime = (hours: number, minutes = 0) => {
    const newDate = new Date(currentTime)
    newDate.setHours(hours, minutes, 0, 0)
    setCurrentTime(newDate)
  }

  const addTime = (minutes: number) => {
    const newDate = new Date(currentTime.getTime() + minutes * 60 * 1000)
    setCurrentTime(newDate)
  }

  const renderSlide = (slide: Slide, activity: Activity) => {
    switch (slide.type) {
      case "poll":
        return (
          <PollSlide
            question={slide.content.question as string}
            options={slide.content.options as string[]}
            onVote={(option) => console.log("Voted:", option)}
          />
        )
      case "quiz":
        return (
          <QuizSlide
            question={slide.content.question as string}
            options={slide.content.options as string[]}
            correctAnswer={slide.content.correctAnswer as string}
            onAnswer={(answer) => console.log("Answered:", answer)}
          />
        )
      case "qa":
        return (
          <QaSlide question={slide.content.question as string} onSubmit={(answer) => console.log("Q&A submitted:", answer)} />
        )
      case "rating":
        return (
          <RatingSlide
            question={slide.content.question as string}
            maxRating={slide.content.maxRating as number}
            onRate={(rating) => console.log("Rated:", rating)}
          />
        )
      case "checkin":
        return (
          <CheckinSlide
            location={slide.content.location as string}
            onCheckin={() => console.log("Checked in at:", activity.location)}
          />
        )
      case "selfie":
        return (
          <SelfieSlide 
            prompt={slide.content.prompt as string} 
            onCapture={(image) => console.log("Selfie captured", image)} 
          />
        )
      case "speaker":
        {
          const speaker = activity.speakers?.find((s) => s.id === slide.content.speakerId)
          if (!speaker) return <div>Speaker not found</div>

          // Find upcoming sessions for this speaker
          const upcomingSessions = agenda.activities
            .filter((a) => a.startTime > currentTime && a.speakers?.some((s) => s.id === speaker.id))
            .map((a) => ({
              title: a.title,
              time: format(
                a.startTime instanceof Date ? a.startTime : new Date(a.startTime), 
                "h:mm a"
              ),
              location: a.location,
            }))

          return <SpeakerSlide speaker={speaker} nextSessions={upcomingSessions} />
        }
      default:
        return <div>Unsupported slide type</div>
    }
  }

  // Event Info Overlay
  const renderEventInfo = () => {
    return (
      <div className="fixed inset-0 bg-black/95 z-50 overflow-auto">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">{agenda.title}</h2>
            <Button variant="ghost" size="icon" className="text-white" onClick={() => setShowEventInfo(false)}>
              <X size={20} />
            </Button>
          </div>

          <Tabs defaultValue="agenda" className="text-white">
            <TabsList className="bg-black/50 border border-white/20">
              <TabsTrigger value="agenda" className="data-[state=active]:bg-primary">
                Agenda
              </TabsTrigger>
              <TabsTrigger value="speakers" className="data-[state=active]:bg-primary">
                Speakers
              </TabsTrigger>
            </TabsList>

            <TabsContent value="agenda" className="mt-4">
              <div className="space-y-4">
                {agenda.activities.map((activity) => (
                  <Card key={activity.id} className="bg-black/50 border border-white/20">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-white">{activity.title}</h3>
                          <p className="text-sm text-white/70">{activity.description}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs border-white/20 text-white"
                          onClick={() => {
                            // Set time to this activity and close overlay
                            setCurrentTime(new Date(activity.startTime.getTime() + 60 * 1000)) // 1 minute after start
                            setShowEventInfo(false)
                          }}
                        >
                          Jump to
                        </Button>
                      </div>
                      <div className="flex justify-between text-xs text-white/70 mt-2">
                        <span>{activity.location}</span>
                        <span>
                          {format(activity.startTime, "h:mm a")} - {format(activity.endTime, "h:mm a")}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="speakers" className="mt-4">
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                {agenda.activities
                  .flatMap((activity) => activity.speakers || [])
                  // Remove duplicates
                  .filter((speaker, index, self) => index === self.findIndex((s) => s.id === speaker.id))
                  .map((speaker) => (
                    <Card key={speaker.id} className="bg-black/50 border border-white/20">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 rounded-full overflow-hidden">
                            <img
                              src={speaker.photoUrl || "/placeholder.svg?height=64&width=64"}
                              alt={speaker.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-medium text-white">{speaker.name}</h3>
                            <p className="text-sm text-white/70">{speaker.title}</p>
                            <p className="text-xs text-white/50">{speaker.company}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    )
  }

  // Time Controls Overlay
  const renderTimeControls = () => {
    return (
      <div className="fixed inset-x-0 bottom-0 bg-black/90 p-4 z-50 border-t border-white/20">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-white/70" />
            <span className="text-white font-mono">{format(currentTime, "HH:mm:ss")}</span>
          </div>
          <Button variant="ghost" size="icon" className="text-white" onClick={() => setShowTimeControls(false)}>
            <X size={20} />
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-4">
          <Button size="sm" variant="outline" className="text-white border-white/20" onClick={() => jumpToTime(9, 0)}>
            9:00 AM
          </Button>
          <Button size="sm" variant="outline" className="text-white border-white/20" onClick={() => jumpToTime(10, 30)}>
            10:30 AM
          </Button>
          <Button size="sm" variant="outline" className="text-white border-white/20" onClick={() => jumpToTime(12, 0)}>
            12:00 PM
          </Button>
          <Button size="sm" variant="outline" className="text-white border-white/20" onClick={() => jumpToTime(14, 0)}>
            2:00 PM
          </Button>
        </div>

        <div className="flex justify-between gap-2">
          <Button size="sm" variant="outline" className="text-white border-white/20" onClick={() => addTime(-15)}>
            -15 min
          </Button>
          <Button size="sm" variant="outline" className="text-white border-white/20" onClick={() => addTime(-5)}>
            -5 min
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-white border-white/20"
            onClick={() => setCurrentTime(new Date())}
          >
            Now
          </Button>
          <Button size="sm" variant="outline" className="text-white border-white/20" onClick={() => addTime(5)}>
            +5 min
          </Button>
          <Button size="sm" variant="outline" className="text-white border-white/20" onClick={() => addTime(15)}>
            +15 min
          </Button>
        </div>
      </div>
    )
  }

  // If no activities are available yet
  if (availableActivities.length === 0) {
    // Calculate time until first activity
    const firstActivity = agenda.activities[0]
    
    // Make sure startTime is a Date object
    const startTime = firstActivity ? (firstActivity.startTime instanceof Date 
      ? firstActivity.startTime 
      : new Date(firstActivity.startTime)) : null
    const timeUntilStart = startTime ? startTime.getTime() - currentTime.getTime() : 0

    // Convert to days, hours, minutes
    const days = Math.floor(timeUntilStart / (1000 * 60 * 60 * 24))
    const hours = Math.floor((timeUntilStart % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((timeUntilStart % (1000 * 60 * 60)) / (1000 * 60))

    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50 p-6 text-white">
        <h2 className="text-2xl font-bold mb-4">Event hasn't started yet</h2>

        <div className="flex gap-4 mb-6">
          {days > 0 && (
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold">{days}</div>
              <div className="text-sm text-white/70">days</div>
            </div>
          )}
          <div className="flex flex-col items-center">
            <div className="text-4xl font-bold">{hours}</div>
            <div className="text-sm text-white/70">hours</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-4xl font-bold">{minutes}</div>
            <div className="text-sm text-white/70">minutes</div>
          </div>
        </div>

        <p className="text-center mb-6">
          The first activity starts at {startTime ? format(startTime, "h:mm a") : ""}
        </p>

        <div className="flex gap-2">
          <Button onClick={onClose}>Close</Button>
          <Button variant="outline" onClick={() => setShowTimeControls(true)}>
            Adjust Time
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              // Set time to 5 minutes after event start
              if (startTime) {
                setCurrentTime(new Date(startTime.getTime() + 5 * 60 * 1000))
              }
            }}
          >
            Skip to Event
          </Button>
        </div>

        {showTimeControls && renderTimeControls()}
      </div>
    )
  }

  // If no current activity is selected
  if (!currentActivity) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50 p-6 text-white">
        <h2 className="text-2xl font-bold mb-4">No active sessions</h2>
        <div className="flex gap-2">
          <Button onClick={onClose}>Close</Button>
          <Button variant="outline" onClick={() => setShowTimeControls(true)}>
            Adjust Time
          </Button>
        </div>
        {showTimeControls && renderTimeControls()}
      </div>
    )
  }

  return (
    <div
      className="fixed inset-0 bg-black flex flex-col z-50"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Event info */}
      <div className="bg-black/80 p-2 flex items-center justify-between">
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2 text-white/70" />
          <span className="text-sm text-white/70">{format(agenda.date, "MMMM d, yyyy")}</span>
        </div>
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-2 text-white/70" />
          <span className="text-sm text-white/70">{format(currentTime, "h:mm a")}</span>
        </div>
      </div>

      {/* Activity timeline */}
      <div className="flex overflow-x-auto gap-1 p-2 bg-black/60">
        {availableActivities.map((activity, index) => (
          <Button
            key={activity.id}
            variant={index === currentActivityIndex ? "default" : "outline"}
            size="sm"
            className={`text-xs whitespace-nowrap ${
              index === currentActivityIndex
                ? "bg-primary text-primary-foreground"
                : "bg-black/30 text-white/70 border-white/20"
            }`}
            onClick={() => {
              setCurrentActivityIndex(index)
              setCurrentSlideIndex(0)
            }}
          >
            {format(activity.startTime, "h:mm")} - {activity.title}
          </Button>
        ))}
      </div>

      {/* Progress bars for current activity slides */}
      <div className="flex gap-1 p-2 z-10 bg-black/40">
        {currentActivity.slides.map((_, i) => (
          <Progress
            key={i}
            value={i < currentSlideIndex ? 100 : i === currentSlideIndex ? progress[i] : 0}
            className="h-1.5 w-full"
          />
        ))}
      </div>

      {/* Current activity info */}
      <div className="bg-black/60 p-2">
        <div className="text-sm font-medium text-white">{currentActivity.title}</div>
        <div className="flex justify-between text-xs text-white/70">
          <span>{currentActivity.location}</span>
          <span>
            {format(currentActivity.startTime, "h:mm a")} - {format(currentActivity.endTime, "h:mm a")}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute top-16 right-4 flex items-center gap-2 z-10">
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-black/20 rounded-full"
          onClick={() => setShowEventInfo(true)}
        >
          <Info size={20} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-black/20 rounded-full"
          onClick={() => setShowTimeControls(!showTimeControls)}
        >
          <Settings size={20} />
        </Button>
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
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        {currentSlide && renderSlide(currentSlide, currentActivity)}
      </div>

      {/* Overlays */}
      {showTimeControls && renderTimeControls()}
      {showEventInfo && renderEventInfo()}
    </div>
  )
}

