"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, MapPin, RotateCcw, Play } from "lucide-react"
import { format, addMinutes, isBefore, isAfter } from "date-fns"
import EventStory from "./event-story"
import type { Activity, EventAgenda, Speaker, Slide } from "@/types/event-types"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

// Add the DevTimeControls component
interface DevTimeControlsProps {
  currentTime: Date
  setCurrentTime: (time: Date) => void
  eventStart: Date
  openStory: () => void
}

function DevTimeControls({ currentTime, setCurrentTime, eventStart, openStory }: DevTimeControlsProps) {
  const [useRealTime, setUseRealTime] = useState(true)
  const [sliderValue, setSliderValue] = useState(() => {
    const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes()
    const eventMinutes = eventStart.getHours() * 60 + eventStart.getMinutes()
    // Ensure we don't go below 0 for the slider
    return Math.max(0, currentMinutes - eventMinutes)
  })

  // Update real time when enabled
  useEffect(() => {
    if (useRealTime) {
      const interval = setInterval(() => {
        setCurrentTime(new Date())
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [useRealTime, setCurrentTime])

  // Convert minutes since event start to a Date
  const minutesToDate = (minutes: number) => {
    const newDate = new Date(eventStart)
    newDate.setMinutes(eventStart.getMinutes() + minutes)
    return newDate
  }

  // Handle slider change
  const handleSliderChange = (value: number[]) => {
    const minutes = value[0]
    setSliderValue(minutes)

    if (useRealTime) {
      setUseRealTime(false)
    }

    setCurrentTime(minutesToDate(minutes))
  }

  // Jump to specific times
  const jumpToTime = (hours: number, minutes = 0) => {
    const newDate = new Date(currentTime)
    newDate.setHours(hours, minutes, 0, 0)
    setCurrentTime(newDate)

    const newMinutes = hours * 60 + minutes - (eventStart.getHours() * 60 + eventStart.getMinutes())
    setSliderValue(Math.max(0, newMinutes))

    if (useRealTime) {
      setUseRealTime(false)
    }
  }

  // Reset to real time
  const resetToRealTime = () => {
    setUseRealTime(true)
    setCurrentTime(new Date())
  }

  // Calculate max minutes (event duration)
  const maxMinutes = 8 * 60 // 8 hours

  return (
    <Card className="mb-6 border-dashed border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-sm font-medium text-yellow-800 dark:text-yellow-400">
              Developer Time Controls
            </CardTitle>
            <CardDescription>Adjust time for testing the event agenda</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="use-real-time" checked={useRealTime} onCheckedChange={setUseRealTime} />
            <Label htmlFor="use-real-time">Use real time</Label>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4 text-yellow-800 dark:text-yellow-400" />
              <span className="font-mono">{format(currentTime, "HH:mm:ss")}</span>
            </div>
            <Button variant="outline" size="sm" onClick={resetToRealTime} className="flex items-center gap-1">
              <RotateCcw className="h-3 w-3" /> Reset
            </Button>
          </div>

          <div className="pt-2">
            <Slider
              value={[sliderValue]}
              min={-60} // Allow setting time to 1 hour before event start
              max={maxMinutes}
              step={5}
              onValueChange={handleSliderChange}
              className="my-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{format(minutesToDate(-60), "h:mm a")}</span>
              <span>{format(eventStart, "h:mm a")}</span>
              <span>{format(minutesToDate(maxMinutes), "h:mm a")}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => jumpToTime(eventStart.getHours(), eventStart.getMinutes() - 30)}
            >
              {format(minutesToDate(-30), "h:mm a")}
            </Button>
            <Button size="sm" variant="outline" onClick={() => jumpToTime(9, 0)}>
              9:00 AM
            </Button>
            <Button size="sm" variant="outline" onClick={() => jumpToTime(10, 30)}>
              10:30 AM
            </Button>
            <Button size="sm" variant="outline" onClick={() => jumpToTime(12, 0)}>
              12:00 PM
            </Button>
            <Button size="sm" variant="outline" onClick={() => jumpToTime(14, 0)}>
              2:00 PM
            </Button>
            <Button size="sm" variant="outline" onClick={() => jumpToTime(16, 0)}>
              4:00 PM
            </Button>
            <Button size="sm" variant="outline" onClick={() => jumpToTime(17, 30)}>
              5:30 PM
            </Button>
          </div>

          <Button onClick={openStory} className="w-full">
            Open Story View
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Update the Page component to use the DevTimeControls
export default function Page() {
  const [showStory, setShowStory] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Create a sample event agenda
  const eventStart = new Date()
  eventStart.setHours(9, 0, 0, 0) // Set to 9:00 AM today

  // Update the current time every minute - REMOVE THIS as it's now handled by DevTimeControls
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrentTime(new Date())
  //   }, 60000) // Update every minute

  //   return () => clearInterval(interval)
  // }, [])

  // Sample speakers
  const speakers: Speaker[] = [
    {
      id: "speaker-1",
      name: "Alex Johnson",
      title: "Chief Technology Officer",
      company: "TechInnovate",
      bio: "Alex has over 15 years of experience in software development and has led teams at major tech companies. They specialize in AI and machine learning applications.",
      photoUrl: "/placeholder.svg?height=128&width=128",
      socials: {
        twitter: "https://twitter.com",
        linkedin: "https://linkedin.com",
        github: "https://github.com",
      },
    },
    {
      id: "speaker-2",
      name: "Sam Rivera",
      title: "Product Design Lead",
      company: "DesignForward",
      bio: "Sam is passionate about creating intuitive user experiences and has worked on products used by millions of people worldwide.",
      photoUrl: "/placeholder.svg?height=128&width=128",
      socials: {
        twitter: "https://twitter.com",
        linkedin: "https://example.com",
        website: "https://example.com",
      },
    },
    {
      id: "speaker-3",
      name: "Jordan Lee",
      title: "VP of Engineering",
      company: "CloudScale",
      bio: "Jordan specializes in cloud infrastructure and has helped numerous companies scale their applications to serve global audiences.",
      photoUrl: "/placeholder.svg?height=128&width=128",
      socials: {
        linkedin: "https://linkedin.com",
        github: "https://github.com",
      },
    },
  ]

  // Create a more diverse set of slides to ensure all types are used
  const createSlides = (id: string, type: Activity["type"], speakerIds: string[] = []): Slide[] => {
    const slides: Slide[] = []

    // Add speaker slide if speakers are provided
    if (speakerIds.length > 0) {
      slides.push({
        id: `${id}-slide-speaker`,
        type: "speaker",
        content: {
          speakerId: speakerIds[0],
        },
        duration: 15,
      })
    }

    // Add type-specific slides
    switch (type) {
      case "keynote":
        slides.push(
          {
            id: `${id}-slide-poll`,
            type: "poll",
            content: {
              question: "What are you most interested in learning today?",
              options: ["Technical details", "Case studies", "Future roadmap", "Integration tips"],
            },
            duration: 20,
          },
          {
            id: `${id}-slide-qa`,
            type: "qa",
            content: {
              question: "What questions do you have for our keynote speaker?",
            },
            duration: 25,
          },
        )
        break
      case "session":
        slides.push(
          {
            id: `${id}-slide-quiz`,
            type: "quiz",
            content: {
              question: "Which of these is a best practice for scaling applications?",
              options: ["Monolithic architecture", "Microservices", "Single database", "Manual deployments"],
              correctAnswer: "Microservices",
            },
            duration: 20,
          },
          {
            id: `${id}-slide-poll`,
            type: "poll",
            content: {
              question: "How familiar are you with this topic?",
              options: ["Beginner", "Intermediate", "Advanced", "Expert"],
            },
            duration: 15,
          },
        )
        break
      case "workshop":
        slides.push(
          {
            id: `${id}-slide-qa`,
            type: "qa",
            content: {
              question: "What specific challenges are you facing with this technology?",
            },
            duration: 25,
          },
          {
            id: `${id}-slide-selfie`,
            type: "selfie",
            content: {
              prompt: "Take a selfie with your workshop team!",
            },
            duration: 20,
          },
        )
        break
      case "networking":
        slides.push(
          {
            id: `${id}-slide-checkin`,
            type: "checkin",
            content: {
              location: "Networking Area",
            },
            duration: 15,
          },
          {
            id: `${id}-slide-selfie`,
            type: "selfie",
            content: {
              prompt: "Take a selfie with someone new you've met!",
            },
            duration: 20,
          },
        )
        break
      case "break":
        slides.push({
          id: `${id}-slide-checkin`,
          type: "checkin",
          content: {
            location: "Break Area",
          },
          duration: 10,
        })
        break
    }

    // Add rating slide for all except breaks
    if (type !== "break") {
      slides.push({
        id: `${id}-slide-rating`,
        type: "rating",
        content: {
          question: "How would you rate this session?",
          maxRating: 5,
        },
        duration: 15,
      })
    }

    return slides
  }

  // Create sample activities
  const createActivity = (
    id: string,
    title: string,
    description: string,
    startTime: Date,
    durationMinutes: number,
    type: Activity["type"],
    location: string,
    speakerIds: string[] = [],
  ): Activity => {
    const endTime = new Date(startTime)
    endTime.setMinutes(endTime.getMinutes() + durationMinutes)

    const activitySpeakers = speakers.filter((speaker) => speakerIds.includes(speaker.id))

    return {
      id,
      title,
      description,
      startTime,
      endTime,
      type,
      location,
      speakers: activitySpeakers,
      slides: createSlides(id, type, speakerIds),
    }
  }

  // Create a sample agenda with activities throughout the day
  const agenda: EventAgenda = {
    id: "event-1",
    title: "Tech Innovation Summit 2025",
    date: eventStart,
    activities: [
      createActivity(
        "activity-1",
        "Welcome & Opening Remarks",
        "Join us for the official opening of the Tech Innovation Summit 2025.",
        eventStart,
        30,
        "keynote",
        "Main Hall",
        ["speaker-1"],
      ),
      createActivity(
        "activity-2",
        "Coffee Break",
        "Grab a coffee and network with other attendees.",
        addMinutes(eventStart, 30),
        15,
        "break",
        "Lobby",
      ),
      createActivity(
        "activity-3",
        "Cloud Infrastructure at Scale",
        "Learn how to build and maintain cloud infrastructure that can handle millions of users.",
        addMinutes(eventStart, 45),
        60,
        "session",
        "Room A",
        ["speaker-3"],
      ),
      createActivity(
        "activity-4",
        "UX Design Workshop",
        "Hands-on workshop exploring the latest trends in user experience design.",
        addMinutes(eventStart, 45),
        60,
        "workshop",
        "Room B",
        ["speaker-2"],
      ),
      createActivity(
        "activity-5",
        "Networking Lunch",
        "Connect with peers over lunch and discuss the morning sessions.",
        addMinutes(eventStart, 105),
        60,
        "networking",
        "Dining Hall",
      ),
      createActivity(
        "activity-6",
        "AI in Product Development",
        "Discover how artificial intelligence is transforming product development.",
        addMinutes(eventStart, 165),
        60,
        "session",
        "Room A",
        ["speaker-1"],
      ),
      createActivity(
        "activity-7",
        "Scaling Teams Workshop",
        "Practical strategies for growing and managing engineering teams.",
        addMinutes(eventStart, 165),
        60,
        "workshop",
        "Room B",
        ["speaker-3"],
      ),
      createActivity(
        "activity-8",
        "Afternoon Break",
        "Refresh with snacks and beverages.",
        addMinutes(eventStart, 225),
        15,
        "break",
        "Lobby",
      ),
      createActivity(
        "activity-9",
        "Future of Tech Panel",
        "Industry leaders discuss emerging technologies and future trends.",
        addMinutes(eventStart, 240),
        60,
        "session",
        "Main Hall",
        ["speaker-1", "speaker-2", "speaker-3"],
      ),
      createActivity(
        "activity-10",
        "Closing Remarks & Networking Reception",
        "Wrap up the day with final thoughts and continue conversations over drinks.",
        addMinutes(eventStart, 300),
        90,
        "networking",
        "Main Hall",
      ),
    ],
  }

  // Filter activities based on current time for the agenda view
  const pastActivities = agenda.activities.filter(
    (activity) => isBefore(activity.startTime, currentTime) && isBefore(currentTime, activity.endTime),
  )

  const upcomingActivities = agenda.activities
    .filter((activity) => isAfter(activity.startTime, currentTime))
    .slice(0, 3) // Show next 3 upcoming activities

  return (
    <div className="container flex flex-col min-h-screen py-4">
      {/* Main content - only shown when story is not visible */}
      {!showStory && (
        <>
          <header className="mb-6">
            <h1 className="text-3xl font-bold">{agenda.title}</h1>
            <p className="text-muted-foreground">{format(agenda.date, "EEEE, MMMM d, yyyy")}</p>
          </header>

          <DevTimeControls
            currentTime={currentTime}
            setCurrentTime={setCurrentTime}
            eventStart={eventStart}
            openStory={() => setShowStory(true)}
          />

          <Card className="mb-6">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Event Stories</CardTitle>
                  <CardDescription>View interactive stories for this event</CardDescription>
                </div>
                <Button onClick={() => setShowStory(true)} className="flex items-center gap-2">
                  <Play size={16} />
                  View Stories
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p>Access interactive slides, polls, and content for each session.</p>
            </CardContent>
          </Card>

          <Tabs defaultValue="agenda" className="flex-1">
            <TabsList>
              <TabsTrigger value="agenda">Agenda</TabsTrigger>
              <TabsTrigger value="speakers">Speakers</TabsTrigger>
            </TabsList>

            <TabsContent value="agenda" className="space-y-6">
              {/* Current activity */}
              {pastActivities.length > 0 ? (
                <div>
                  <h2 className="text-lg font-medium mb-3">Happening Now</h2>
                  {pastActivities.map((activity) => (
                    <Card key={activity.id} className="mb-4">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{activity.title}</CardTitle>
                            <CardDescription>{activity.description}</CardDescription>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => setShowStory(true)}>
                            View Story
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col gap-2 text-sm">
                          <div className="flex items-center text-muted-foreground">
                            <Clock className="h-4 w-4 mr-2" />
                            <span>
                              {format(activity.startTime, "h:mm a")} - {format(activity.endTime, "h:mm a")}
                            </span>
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <MapPin className="h-4 w-4 mr-2" />
                            <span>{activity.location}</span>
                          </div>
                          {activity.speakers && activity.speakers.length > 0 && (
                            <div className="flex items-center gap-2 mt-2">
                              {activity.speakers.map((speaker) => (
                                <div key={speaker.id} className="flex items-center">
                                  <div className="w-6 h-6 rounded-full overflow-hidden mr-2">
                                    <img
                                      src={speaker.photoUrl || "/placeholder.svg"}
                                      alt={speaker.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <span className="text-sm">{speaker.name}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>No activities in progress</CardTitle>
                    <CardDescription>Check the upcoming activities below</CardDescription>
                  </CardHeader>
                </Card>
              )}

              {/* Upcoming activities */}
              <div>
                <h2 className="text-lg font-medium mb-3">Coming Up</h2>
                {upcomingActivities.map((activity) => (
                  <Card key={activity.id} className="mb-4">
                    <CardHeader className="pb-2">
                      <CardTitle>{activity.title}</CardTitle>
                      <CardDescription>{activity.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col gap-2 text-sm">
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>
                            {format(activity.startTime, "h:mm a")} - {format(activity.endTime, "h:mm a")}
                          </span>
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{activity.location}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="speakers" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {speakers.map((speaker) => (
                  <Card key={speaker.id}>
                    <CardHeader className="text-center">
                      <div className="flex justify-center mb-4">
                        <div className="w-24 h-24 rounded-full overflow-hidden">
                          <img
                            src={speaker.photoUrl || "/placeholder.svg"}
                            alt={speaker.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <CardTitle>{speaker.name}</CardTitle>
                      <CardDescription>
                        {speaker.title} at {speaker.company}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-4">{speaker.bio}</p>

                      <div className="flex justify-center gap-3">
                        {speaker.socials.twitter && (
                          <a
                            href={speaker.socials.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M22 5.8a8.49 8.49 0 0 1-2.36.64 4.13 4.13 0 0 0 1.81-2.27 8.21 8.21 0 0 1-2.61 1 4.1 4.1 0 0 0-7 3.74 11.64 11.64 0 0 1-8.45-4.29 4.16 4.16 0 0 0-.55 2.07 4.09 4.09 0 0 0 1.82 3.41 4.05 4.05 0 0 1-1.86-.51v.05a4.1 4.1 0 0 0 3.3 4 3.93 3.93 0 0 1-1.1.17 4.9 4.9 0 0 1-.77-.07 4.11 4.11 0 0 0 3.83 2.84A8.22 8.22 0 0 1 3 18.34a7.93 7.93 0 0 1-1-.06 11.57 11.57 0 0 0 6.29 1.85A11.59 11.59 0 0 0 20 8.45v-.53a8.43 8.43 0 0 0 2-2.12Z" />
                            </svg>
                          </a>
                        )}
                        {speaker.socials.linkedin && (
                          <a
                            href={speaker.socials.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M6.5 8.25v10.5H3V8.25h3.5ZM6.75 5a1.75 1.75 0 1 1-3.5 0 1.75 1.75 0 0 1 3.5 0ZM21 14.75c0-3.314-1.657-5.5-4.25-5.5-1.5 0-2.5.5-3.25 1.5v-2.5h-3.5v10.5h3.5V15c0-1.38.62-2.5 2-2.5s2 1.12 2 2.5v3.75H21v-4Z" />
                            </svg>
                          </a>
                        )}
                        {speaker.socials.github && (
                          <a
                            href={speaker.socials.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.933.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
                            </svg>
                          </a>
                        )}
                        {speaker.socials.website && (
                          <a
                            href={speaker.socials.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}

      {/* Event Story */}
      {showStory && (
        <EventStory
          agenda={agenda}
          currentTime={currentTime}
          setCurrentTime={setCurrentTime}
          onClose={() => setShowStory(false)}
        />
      )}
    </div>
  )
}

