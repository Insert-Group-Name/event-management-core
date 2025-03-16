import { useState } from "react"
import { Head } from "@inertiajs/react"
import { router } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { type Event } from "@/types/event"
import { type AgendaItem } from "@/types/agenda-item"
import { type Slide, type CreateSlideData } from "@/types/agenda-slide"
import AppLayout from "@/layouts/app-layout"
import ActivityBuilder from "@/components/agenda/activity-builder"

interface AgendaEditorProps {
  event: Event
  agendaItem: AgendaItem
  slides: Slide[]
}

export default function AgendaEditor({ event, agendaItem, slides }: AgendaEditorProps) {
  const [isSaving, setIsSaving] = useState(false)
  
  // Create breadcrumbs for navigation
  const breadcrumbs = [
    {
      title: "Events",
      href: "/events"
    },
    {
      title: event.name || "Event",
      href: `/events/${event.id}`
    },
    {
      title: "Agenda",
      href: `/events/${event.id}/agenda`
    },
    {
      title: agendaItem.title || "Item",
      href: `/events/${event.id}/agenda/${agendaItem.id}`
    }
  ]
  
  // Handle saving the activity and its slides
  const handleSaveActivity = async (updatedActivity: AgendaItem, updatedSlides: CreateSlideData[]) => {
    setIsSaving(true)
    
    try {
      // In a real implementation, this would use Inertia to send a PUT request
      console.log("Updating activity:", updatedActivity)
      console.log("Updating slides:", updatedSlides)
      
      // Mock API call with delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // On success, redirect back to the agenda index
      router.visit(`/events/${event.id}/agenda`)
    } catch (error) {
      console.error("Error saving:", error)
      setIsSaving(false)
    }
  }
  
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Edit ${agendaItem.title}`} />
      
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.visit(`/events/${event.id}/agenda`)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Agenda
          </Button>
        </div>
        
        <ActivityBuilder
          eventId={event.id}
          agendaItem={agendaItem}
          slides={slides}
          onSave={handleSaveActivity}
          isSubmitting={isSaving}
        />
      </div>
    </AppLayout>
  )
} 