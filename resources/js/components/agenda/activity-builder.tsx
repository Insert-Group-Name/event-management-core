import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Clock, MapPin, Users, ChevronRight, ChevronLeft, X } from "lucide-react"
import { format, parseISO } from "date-fns"
import { type AgendaItem } from "@/types/agenda-item"
import { type Slide, type SlideType, type CreateSlideData } from "@/types/agenda-slide"
import SlideEditor from "./slide-editor"

interface ActivityBuilderProps {
  eventId: number
  agendaItem?: AgendaItem
  slides?: Slide[]
  onSave: (agendaItem: AgendaItem, slides: CreateSlideData[]) => void
  isSubmitting?: boolean
}

export default function ActivityBuilder({ 
  eventId, 
  agendaItem, 
  slides = [], 
  onSave, 
  isSubmitting = false 
}: ActivityBuilderProps) {
  const [currentStep, setCurrentStep] = useState<"details" | "slides">("details")
  const [activityData, setActivityData] = useState<Partial<AgendaItem>>({
    title: agendaItem?.title || "",
    description: agendaItem?.description || "",
    start_time: agendaItem?.start_time || "",
    end_time: agendaItem?.end_time || "",
    location: agendaItem?.location || "",
    speaker: agendaItem?.speaker || "",
    order: agendaItem?.order || 0,
    event_id: eventId,
  })
  
  const [slidesList, setSlidesList] = useState<CreateSlideData[]>(
    slides.map(slide => ({
      title: slide.title,
      duration: slide.duration,
      slide_type: slide.slide_type,
      activity_id: slide.activity_id,
      order: slide.order,
      content: slide.content
    })) || []
  )
  
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(-1)
  
  const handleActivityChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setActivityData(prev => ({
      ...prev,
      [name]: name === "order" ? parseInt(value) || 0 : value
    }))
  }
  
  const handleAddSlide = (type: SlideType) => {
    const newSlide: CreateSlideData = {
      title: `New ${type} slide`,
      duration: 30, // Default 30 seconds
      slide_type: type,
      activity_id: agendaItem?.id || 0,
      order: slidesList.length,
      content: getDefaultContentForType(type)
    }
    
    setSlidesList(prev => [...prev, newSlide])
    setCurrentSlideIndex(slidesList.length)
  }
  
  const handleUpdateSlide = (index: number, data: Partial<CreateSlideData>) => {
    setSlidesList(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], ...data }
      return updated
    })
  }
  
  const handleRemoveSlide = (index: number) => {
    setSlidesList(prev => {
      const updated = prev.filter((_, i) => i !== index)
      // Update order for remaining slides
      return updated.map((slide, i) => ({ ...slide, order: i }))
    })
    
    if (currentSlideIndex === index) {
      setCurrentSlideIndex(-1)
    } else if (currentSlideIndex > index) {
      setCurrentSlideIndex(currentSlideIndex - 1)
    }
  }
  
  const handleSave = () => {
    if (!activityData.title || !activityData.start_time || !activityData.end_time) {
      setCurrentStep("details")
      return
    }
    
    onSave(activityData as AgendaItem, slidesList)
  }
  
  const getDefaultContentForType = (type: SlideType): Record<string, unknown> => {
    switch (type) {
      case "poll":
        return { question: "Your question here?", options: ["Option 1", "Option 2", "Option 3"] }
      case "quiz":
        return { 
          question: "Your quiz question here?", 
          options: ["Option 1", "Option 2", "Option 3"], 
          correctAnswer: "Option 1" 
        }
      case "qa":
        return { question: "Ask your audience a question..." }
      case "rating":
        return { question: "How would you rate this session?", maxRating: 5 }
      case "checkin":
        return { location: activityData.location || "Event location" }
      case "selfie":
        return { prompt: "Take a selfie at the event!" }
      case "speaker":
        return { speakerId: "" }
      default:
        return {}
    }
  }
  
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {agendaItem ? "Edit Activity" : "Create New Activity"}
        </h2>
        
        <div className="flex items-center gap-2">
          <Button 
            variant={currentStep === "details" ? "default" : "outline"}
            onClick={() => setCurrentStep("details")}
          >
            Details
          </Button>
          <Button 
            variant={currentStep === "slides" ? "default" : "outline"}
            onClick={() => setCurrentStep("slides")}
          >
            Slides
          </Button>
        </div>
      </div>
      
      {currentStep === "details" && (
        <Card>
          <CardHeader>
            <CardTitle>Activity Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={activityData.title}
                onChange={handleActivityChange}
                placeholder="Enter activity title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={activityData.description}
                onChange={handleActivityChange}
                placeholder="Enter activity description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_time">Start Time</Label>
                <Input
                  id="start_time"
                  name="start_time"
                  type="datetime-local"
                  value={activityData.start_time}
                  onChange={handleActivityChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_time">End Time</Label>
                <Input
                  id="end_time"
                  name="end_time"
                  type="datetime-local"
                  value={activityData.end_time}
                  onChange={handleActivityChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={activityData.location}
                onChange={handleActivityChange}
                placeholder="Enter location"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="speaker">Speaker</Label>
              <Input
                id="speaker"
                name="speaker"
                value={activityData.speaker}
                onChange={handleActivityChange}
                placeholder="Enter speaker name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="order">Display Order</Label>
              <Input
                id="order"
                name="order"
                type="number"
                value={activityData.order?.toString()}
                onChange={handleActivityChange}
                placeholder="Enter display order"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setCurrentStep("slides")}>
              Next: Add Slides <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {currentStep === "slides" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Slides Timeline */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Slides Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {slidesList.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No slides added yet. Add your first slide to get started.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {slidesList.map((slide, index) => (
                        <div 
                          key={index}
                          className={`p-3 border rounded-md cursor-pointer flex items-center justify-between ${
                            currentSlideIndex === index ? "border-primary bg-primary/10" : "border-border"
                          }`}
                          onClick={() => setCurrentSlideIndex(index)}
                        >
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                              {index + 1}
                            </div>
                            <div>
                              <div className="font-medium">{slide.title}</div>
                              <div className="text-xs text-muted-foreground flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {formatDuration(slide.duration)}
                              </div>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={(e) => {
                              e.stopPropagation()
                              handleRemoveSlide(index)
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="pt-4">
                    <Select onValueChange={(value) => handleAddSlide(value as SlideType)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Add a new slide..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="poll">Poll Slide</SelectItem>
                        <SelectItem value="quiz">Quiz Slide</SelectItem>
                        <SelectItem value="qa">Q&A Slide</SelectItem>
                        <SelectItem value="rating">Rating Slide</SelectItem>
                        <SelectItem value="checkin">Check-in Slide</SelectItem>
                        <SelectItem value="selfie">Selfie Slide</SelectItem>
                        <SelectItem value="speaker">Speaker Slide</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Slide Editor */}
          <div className="md:col-span-2">
            {currentSlideIndex >= 0 && currentSlideIndex < slidesList.length ? (
              <SlideEditor 
                slide={slidesList[currentSlideIndex]}
                onChange={(data) => handleUpdateSlide(currentSlideIndex, data)}
              />
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center min-h-[400px] text-center">
                  <PlusCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Slide Selected</h3>
                  <p className="text-muted-foreground mb-4">
                    Select a slide from the timeline or add a new one to start editing
                  </p>
                  <Select onValueChange={(value) => handleAddSlide(value as SlideType)}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Add a new slide..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="poll">Poll Slide</SelectItem>
                      <SelectItem value="quiz">Quiz Slide</SelectItem>
                      <SelectItem value="qa">Q&A Slide</SelectItem>
                      <SelectItem value="rating">Rating Slide</SelectItem>
                      <SelectItem value="checkin">Check-in Slide</SelectItem>
                      <SelectItem value="selfie">Selfie Slide</SelectItem>
                      <SelectItem value="speaker">Speaker Slide</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
      
      <div className="flex justify-between">
        {currentStep === "slides" && (
          <Button variant="outline" onClick={() => setCurrentStep("details")}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Details
          </Button>
        )}
        
        <Button 
          onClick={handleSave} 
          disabled={isSubmitting || !activityData.title || !activityData.start_time || !activityData.end_time}
        >
          {isSubmitting ? "Saving..." : "Save Activity"}
        </Button>
      </div>
    </div>
  )
} 