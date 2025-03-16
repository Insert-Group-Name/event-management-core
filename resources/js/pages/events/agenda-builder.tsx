import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Calendar, Clock, MapPin, Users, ChevronRight, ArrowLeft } from "lucide-react"
import { format } from "date-fns"
import ActivityBuilder from "@/components/agenda/activity-builder"
import { type AgendaItem } from "@/types/agenda-item"
import { type CreateSlideData, type Slide } from "@/types/agenda-slide"

export default function AgendaBuilder() {
  const { eventId } = useParams<{ eventId: string }>()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [event, setEvent] = useState<any>(null)
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([])
  const [slides, setSlides] = useState<Record<number, Slide[]>>({})
  const [currentActivityId, setCurrentActivityId] = useState<number | null>(null)
  const [isCreatingActivity, setIsCreatingActivity] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  useEffect(() => {
    if (!eventId) return
    
    // In a real app, fetch event, agenda items, and slides from API
    // For now, we'll use mock data
    setIsLoading(false)
    setEvent({
      id: parseInt(eventId),
      title: "Sample Conference 2025",
      date: new Date("2025-03-15"),
      location: "San Francisco, CA"
    })
    
    setAgendaItems([
      {
        id: 1,
        title: "Opening Keynote",
        description: "Welcome to the conference",
        start_time: "2025-03-15T09:00:00",
        end_time: "2025-03-15T10:00:00",
        event_id: parseInt(eventId),
        order: 0,
        location: "Main Hall",
        speaker: "Jane Smith",
        created_at: "2025-03-01T00:00:00",
        updated_at: "2025-03-01T00:00:00"
      },
      {
        id: 2,
        title: "Coffee Break",
        description: "Networking opportunity",
        start_time: "2025-03-15T10:00:00",
        end_time: "2025-03-15T10:30:00",
        event_id: parseInt(eventId),
        order: 1,
        location: "Lobby",
        speaker: "",
        created_at: "2025-03-01T00:00:00",
        updated_at: "2025-03-01T00:00:00"
      }
    ])
    
    // Mock slides for the first agenda item
    setSlides({
      1: [
        {
          id: 1,
          title: "Welcome Poll",
          duration: 60,
          slide_type: "poll",
          activity_id: 1,
          order: 0,
          content: {
            question: "Where are you joining from today?",
            options: ["North America", "Europe", "Asia", "Other"]
          },
          created_at: "2025-03-01T00:00:00",
          updated_at: "2025-03-01T00:00:00"
        },
        {
          id: 2,
          title: "Rate our opening",
          duration: 30,
          slide_type: "rating",
          activity_id: 1,
          order: 1,
          content: {
            question: "How would you rate our opening session?",
            maxRating: 5
          },
          created_at: "2025-03-01T00:00:00",
          updated_at: "2025-03-01T00:00:00"
        }
      ]
    })
  }, [eventId])
  
  const handleSaveActivity = async (activityData: AgendaItem, slidesData: CreateSlideData[]) => {
    setIsSaving(true)
    
    try {
      // In a real app, save to API
      console.log("Saving activity:", activityData)
      console.log("Saving slides:", slidesData)
      
      // Mock API response
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (activityData.id) {
        // Update existing activity
        setAgendaItems(prev => 
          prev.map(item => item.id === activityData.id ? activityData : item)
        )
        
        // Update slides
        setSlides(prev => ({
          ...prev,
          [activityData.id]: slidesData.map((slide, index) => ({
            ...slide,
            id: prev[activityData.id]?.[index]?.id || Math.floor(Math.random() * 1000) + 100,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })) as Slide[]
        }))
      } else {
        // Create new activity
        const newId = Math.floor(Math.random() * 1000) + 100
        const newActivity = {
          ...activityData,
          id: newId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        
        setAgendaItems(prev => [...prev, newActivity])
        
        // Create slides
        setSlides(prev => ({
          ...prev,
          [newId]: slidesData.map((slide, index) => ({
            ...slide,
            id: Math.floor(Math.random() * 1000) + 100,
            activity_id: newId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })) as Slide[]
        }))
      }
      
      setIsCreatingActivity(false)
      setCurrentActivityId(null)
    } catch (error) {
      console.error("Error saving activity:", error)
    } finally {
      setIsSaving(false)
    }
  }
  
  if (isLoading) {
    return <div className="p-8">Loading...</div>
  }
  
  if (!event) {
    return <div className="p-8">Event not found</div>
  }
  
  // Editing or creating an activity
  if (isCreatingActivity || currentActivityId !== null) {
    const currentActivity = currentActivityId 
      ? agendaItems.find(item => item.id === currentActivityId) 
      : undefined
    
    const currentSlides = currentActivityId ? slides[currentActivityId] || [] : []
    
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => {
            setIsCreatingActivity(false)
            setCurrentActivityId(null)
          }}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Agenda
        </Button>
        
        <ActivityBuilder
          eventId={parseInt(eventId || "0")}
          agendaItem={currentActivity}
          slides={currentSlides}
          onSave={handleSaveActivity}
          isSubmitting={isSaving}
        />
      </div>
    )
  }
  
  // Agenda overview
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Button 
            variant="ghost" 
            className="mb-2"
            onClick={() => navigate(`/events/${eventId}`)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Event
          </Button>
          <h1 className="text-3xl font-bold">{event.title}</h1>
          <div className="flex items-center text-muted-foreground mt-1">
            <Calendar className="h-4 w-4 mr-1" />
            <span className="mr-4">{format(new Date(event.date), "MMMM d, yyyy")}</span>
            <MapPin className="h-4 w-4 mr-1" />
            <span>{event.location}</span>
          </div>
        </div>
        
        <Button onClick={() => setIsCreatingActivity(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Activity
        </Button>
      </div>
      
      <Tabs defaultValue="timeline" className="w-full">
        <TabsList>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="timeline" className="mt-6">
          <div className="space-y-4">
            {agendaItems.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Activities Yet</h3>
                  <p className="text-muted-foreground mb-4 text-center max-w-md">
                    Start building your event agenda by adding activities like sessions, 
                    breaks, and networking opportunities.
                  </p>
                  <Button onClick={() => setIsCreatingActivity(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add First Activity
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="relative pl-8 border-l-2 border-border">
                {agendaItems
                  .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
                  .map((item) => (
                    <div key={item.id} className="mb-8 relative">
                      <div className="absolute -left-[41px] w-8 h-8 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                        <Clock className="h-4 w-4 text-primary" />
                      </div>
                      
                      <Card className="cursor-pointer hover:border-primary transition-colors" 
                        onClick={() => setCurrentActivityId(item.id)}
                      >
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle>{item.title}</CardTitle>
                            <div className="text-sm text-muted-foreground">
                              {format(new Date(item.start_time), "h:mm a")} - {format(new Date(item.end_time), "h:mm a")}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground mb-2">{item.description}</p>
                          
                          <div className="flex items-center text-sm text-muted-foreground">
                            {item.location && (
                              <div className="flex items-center mr-4">
                                <MapPin className="h-3 w-3 mr-1" />
                                <span>{item.location}</span>
                              </div>
                            )}
                            
                            {item.speaker && (
                              <div className="flex items-center">
                                <Users className="h-3 w-3 mr-1" />
                                <span>{item.speaker}</span>
                              </div>
                            )}
                          </div>
                          
                          {slides[item.id] && slides[item.id].length > 0 && (
                            <div className="mt-4 pt-4 border-t">
                              <div className="text-sm font-medium mb-2">
                                {slides[item.id].length} Interactive Slides
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {slides[item.id].map((slide) => (
                                  <div 
                                    key={slide.id}
                                    className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full"
                                  >
                                    {slide.slide_type}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="mt-4"
                            onClick={(e) => {
                              e.stopPropagation()
                              setCurrentActivityId(item.id)
                            }}
                          >
                            Edit Activity <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="list" className="mt-6">
          <div className="space-y-2">
            {agendaItems.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Activities Yet</h3>
                  <p className="text-muted-foreground mb-4 text-center max-w-md">
                    Start building your event agenda by adding activities like sessions, 
                    breaks, and networking opportunities.
                  </p>
                  <Button onClick={() => setIsCreatingActivity(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add First Activity
                  </Button>
                </CardContent>
              </Card>
            ) : (
              agendaItems
                .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
                .map((item) => (
                  <Card key={item.id} className="cursor-pointer hover:border-primary transition-colors"
                    onClick={() => setCurrentActivityId(item.id)}
                  >
                    <CardContent className="p-4 flex justify-between items-center">
                      <div>
                        <div className="font-medium">{item.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(item.start_time), "h:mm a")} - {format(new Date(item.end_time), "h:mm a")}
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        {slides[item.id] && (
                          <div className="text-sm text-muted-foreground mr-4">
                            {slides[item.id].length} slides
                          </div>
                        )}
                        <Button variant="ghost" size="icon">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 