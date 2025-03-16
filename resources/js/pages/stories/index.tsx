import { useState } from "react"
import { Head } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import EventStory from "@/pages/events/event-story"
import type { EventAgenda } from "@/types/event-types"

interface EventStoryPageProps {
  event: {
    id: number
    title: string
    description: string
    agenda: EventAgenda
  }
}

export default function StoryView({ event }: EventStoryPageProps) {
  const [isStoryOpen, setIsStoryOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  const handleOpenStory = () => {
    setIsStoryOpen(true)
  }

  const handleCloseStory = () => {
    setIsStoryOpen(false)
  }

  return (
    <>
      <Head title={`${event.title} - Story View`} />

      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">{event.title}</h1>
        <p className="text-gray-600 mb-8">{event.description}</p>

        <div className="flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-12 rounded-lg shadow-xl text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Experience the event in story mode</h2>
          <p className="mb-6">View activities, interact with polls, take quizzes, and more!</p>
          
          <Button 
            size="lg" 
            onClick={handleOpenStory}
            className="bg-white text-blue-600 hover:bg-gray-100"
          >
            <Play className="mr-2 h-5 w-5" /> 
            Launch Story View
          </Button>
        </div>

        {/* Event timeline preview could go here */}
        <div className="mt-12">
          <h3 className="text-xl font-semibold mb-4">Event Timeline</h3>
          <div className="space-y-4">
            {event.agenda.activities.map((activity) => (
              <div 
                key={activity.id} 
                className="border border-gray-200 rounded-md p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{activity.title}</h4>
                    <p className="text-sm text-gray-500">{activity.description}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {activity.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                    {activity.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>{activity.location}</span>
                  <span>
                    {activity.slides.length} interactive elements
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isStoryOpen && (
        <EventStory 
          agenda={event.agenda}
          onClose={handleCloseStory}
          currentTime={currentTime}
          setCurrentTime={setCurrentTime}
        />
      )}
    </>
  )
} 