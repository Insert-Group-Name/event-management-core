import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Clock, X, Plus, ChevronDown, ChevronRight, AlertCircle } from "lucide-react"
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
  const [activities, setActivities] = useState<Partial<AgendaItem>[]>(
    agendaItem ? [agendaItem] : []
  )
  
  const [activitySlides, setActivitySlides] = useState<Record<number, CreateSlideData[]>>(
    agendaItem?.id ? { 
      [agendaItem.id]: slides.map(slide => ({
        title: slide.title,
        duration: slide.duration,
        slide_type: slide.slide_type,
        activity_id: slide.activity_id,
        order: slide.order,
        content: slide.content
      }))
    } : {}
  )
  
  const [expandedActivity, setExpandedActivity] = useState<number | null>(null)
  const [editingSlideIndex, setEditingSlideIndex] = useState<number | null>(null)
  const [editingActivityIndex, setEditingActivityIndex] = useState<number | null>(null)
  const newTimeInputRef = useRef<HTMLInputElement>(null)
  const [showValidationErrors, setShowValidationErrors] = useState(false)
  
  const handleActivityChange = (index: number, field: string, value: any) => {
    setActivities(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }
  
  const handleAddActivity = () => {
    // Default time is one hour after the last activity, or current time if no activities
    let defaultStartTime = new Date()
    let defaultEndTime = new Date()
    
    if (activities.length > 0) {
      const lastActivity = activities[activities.length - 1]
      if (lastActivity.end_time) {
        defaultStartTime = new Date(lastActivity.end_time)
        defaultEndTime = new Date(defaultStartTime)
        defaultEndTime.setHours(defaultEndTime.getHours() + 1)
      }
    }
    
    // Format dates for input fields
    const formattedStartTime = format(defaultStartTime, "yyyy-MM-dd'T'HH:mm")
    const formattedEndTime = format(defaultEndTime, "yyyy-MM-dd'T'HH:mm")
    
    const newActivity: Partial<AgendaItem> = {
      title: "",
      description: "",
      start_time: formattedStartTime,
      end_time: formattedEndTime,
      location: "",
      speaker: "",
      order: activities.length,
      event_id: eventId
    }
    
    setActivities(prev => [...prev, newActivity])
    setEditingActivityIndex(activities.length)
    
    // Focus the time input of the new activity
    setTimeout(() => {
      if (newTimeInputRef.current) {
        newTimeInputRef.current.focus()
      }
    }, 100)
  }
  
  const handleRemoveActivity = (index: number) => {
    setActivities(prev => prev.filter((_, i) => i !== index))
    
    if (editingActivityIndex === index) {
      setEditingActivityIndex(null)
    } else if (editingActivityIndex !== null && editingActivityIndex > index) {
      setEditingActivityIndex(editingActivityIndex - 1)
    }
  }
  
  const toggleExpandActivity = (index: number) => {
    setExpandedActivity(expandedActivity === index ? null : index)
    setEditingActivityIndex(null)
  }
  
  const handleAddSlide = (activityIndex: number, type: SlideType) => {
    const activity = activities[activityIndex]
    if (!activity) return
    
    const activityId = activity.id || -activityIndex - 1 // Negative for new activities
    
    const newSlide: CreateSlideData = {
      title: `New ${type}`,
      duration: 30, // Default 30 seconds
      slide_type: type,
      activity_id: activityId,
      order: activitySlides[activityId]?.length || 0,
      content: getDefaultContentForType(type, activity)
    }
    
    setActivitySlides(prev => ({
      ...prev,
      [activityId]: [...(prev[activityId] || []), newSlide]
    }))
    
    // Set editing to the new slide
    setEditingSlideIndex((prev) => (activitySlides[activityId]?.length || 0))
  }
  
  const handleUpdateSlide = (activityIndex: number, slideIndex: number, data: Partial<CreateSlideData>) => {
    const activity = activities[activityIndex]
    if (!activity) return
    
    const activityId = activity.id || -activityIndex - 1
    
    setActivitySlides(prev => {
      const activitySlidesList = [...(prev[activityId] || [])]
      activitySlidesList[slideIndex] = { ...activitySlidesList[slideIndex], ...data }
      
      return {
        ...prev,
        [activityId]: activitySlidesList
      }
    })
  }
  
  const handleRemoveSlide = (activityIndex: number, slideIndex: number) => {
    const activity = activities[activityIndex]
    if (!activity) return
    
    const activityId = activity.id || -activityIndex - 1
    
    setActivitySlides(prev => {
      const activitySlidesList = (prev[activityId] || []).filter((_, i) => i !== slideIndex)
      
      return {
        ...prev,
        [activityId]: activitySlidesList
      }
    })
    
    if (editingSlideIndex === slideIndex) {
      setEditingSlideIndex(null)
    } else if (editingSlideIndex !== null && editingSlideIndex > slideIndex) {
      setEditingSlideIndex(editingSlideIndex - 1)
    }
  }
  
  const getDefaultContentForType = (type: SlideType, activity: Partial<AgendaItem>): Record<string, unknown> => {
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
        return { location: activity.location || "Event location" }
      case "selfie":
        return { prompt: "Take a selfie at the event!" }
      case "speaker":
        return { speakerId: "" }
      default:
        return {}
    }
  }
  
  const handleSubmit = () => {
    // Filter out empty activities
    const validActivities = activities.filter(a => a.title && a.start_time && a.end_time)
    
    if (validActivities.length === 0) {
      return
    }
    
    // If we only have one activity (editing mode), submit directly
    if (agendaItem && validActivities.length === 1) {
      const activity = validActivities[0]
      const activityId = activity.id || -1
      onSave(activity as AgendaItem, activitySlides[activityId] || [])
      return
    }
    
    // TODO: Handle saving multiple activities if we implement that
    alert("Multiple activities not implemented yet")
  }
  
  const formatTime = (timeString?: string) => {
    if (!timeString) return ""
    try {
      return format(parseISO(timeString), "h:mm a")
    } catch (e) {
      return timeString
    }
  }
  
  const getSlideTypeTag = (type: SlideType) => {
    switch (type) {
      case "poll":
        return "Polls"
      case "quiz":
        return "Quiz"
      case "qa":
        return "Q&A"
      case "rating":
        return "Rating"
      case "checkin":
        return "Check-in"
      case "selfie":
        return "Selfie"
      case "speaker":
        return "Speaker"
      default:
        return type
    }
  }
  
  // Check if activity has validation errors
  const activityHasErrors = (activity: Partial<AgendaItem>) => {
    return !activity.title || !activity.start_time || !activity.end_time
  }
  
  // Get specific validation errors for an activity
  const getActivityErrors = (activity: Partial<AgendaItem>) => {
    const errors: string[] = []
    
    if (!activity.title) errors.push('Title is required')
    if (!activity.start_time) errors.push('Start time is required')
    if (!activity.end_time) errors.push('End time is required')
    
    return errors
  }
  
  // Check if button should be disabled
  const isSaveButtonDisabled = isSubmitting || 
    activities.length === 0 || 
    activities.some(a => activityHasErrors(a))
  
  // Handle attempted save when validation fails
  const handleAttemptSave = () => {
    if (isSaveButtonDisabled) {
      setShowValidationErrors(true)
      
      // Find the first activity with errors and expand/edit it
      const firstErrorIndex = activities.findIndex(activityHasErrors)
      if (firstErrorIndex !== -1) {
        setExpandedActivity(firstErrorIndex)
        setEditingActivityIndex(firstErrorIndex)
      }
    } else {
      handleSubmit()
    }
  }
  
  return (
    <div className="space-y-4">
      {/* Show validation message at top when there are errors */}
      {showValidationErrors && isSaveButtonDisabled && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 rounded-md flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-red-600 dark:text-red-400">Unable to save</p>
            <p className="text-sm text-red-600/90 dark:text-red-400/90">
              {activities.length === 0 
                ? 'Please add at least one activity.' 
                : 'Please fill in all required fields (title, start time, end time).'}
            </p>
          </div>
        </div>
      )}
      
      <div className="max-w-3xl mx-auto">
        {/* Activity timeline */}
        <div className="space-y-4">
          {activities.map((activity, activityIndex) => (
            <div key={activityIndex} className="relative">
              <div className="flex">
                {/* Time column */}
                <div className="w-24 text-right pr-4 pt-8 flex-shrink-0">
                  {editingActivityIndex === activityIndex ? (
                    <div className="space-y-1">
                      <Input
                        ref={newTimeInputRef}
                        type="time"
                        value={activity.start_time ? format(new Date(activity.start_time), "HH:mm") : ""}
                        onChange={(e) => {
                          // Extract time from the input and combine with the date from start_time
                          const timeValue = e.target.value
                          if (!timeValue) return
                          
                          const [hours, minutes] = timeValue.split(':').map(Number)
                          const date = activity.start_time ? new Date(activity.start_time) : new Date()
                          date.setHours(hours, minutes)
                          
                          handleActivityChange(activityIndex, 'start_time', format(date, "yyyy-MM-dd'T'HH:mm"))
                        }}
                        className={`w-full ${showValidationErrors && !activity.start_time ? 'border-red-500 focus:border-red-500' : ''}`}
                      />
                      {showValidationErrors && !activity.start_time && (
                        <p className="text-xs text-red-500">Required</p>
                      )}
                    </div>
                  ) : (
                    <div className="text-gray-600">{formatTime(activity.start_time)}</div>
                  )}
                </div>
                
                {/* Activity content */}
                <div className="flex-1">
                  <Card 
                    className={`w-full border-0 bg-gray-100 dark:bg-gray-800 ${
                      expandedActivity === activityIndex ? 'pb-4' : ''
                    } ${showValidationErrors && activityHasErrors(activity) && 'border-l-2 border-l-red-500'}`}
                  >
                    <CardContent className="p-4">
                      <div 
                        className="flex items-start cursor-pointer"
                        onClick={() => {
                          if (editingActivityIndex !== activityIndex) {
                            toggleExpandActivity(activityIndex)
                          }
                        }}
                      >
                        <div className="flex-1">
                          {editingActivityIndex === activityIndex ? (
                            <div className="space-y-4">
                              <div className="space-y-1">
                                <Input 
                                  value={activity.title || ""}
                                  onChange={(e) => handleActivityChange(activityIndex, 'title', e.target.value)}
                                  placeholder="Activity title"
                                  className={`text-lg font-medium border-0 border-b bg-transparent px-0 focus-visible:ring-0 focus-visible:ring-offset-0 ${
                                    showValidationErrors && !activity.title ? 'border-red-500 focus:border-red-500' : ''
                                  }`}
                                />
                                {showValidationErrors && !activity.title && (
                                  <p className="text-xs text-red-500">Title is required</p>
                                )}
                              </div>
                              <div className="flex gap-4">
                                <div className="w-1/2 space-y-1">
                                  <Label htmlFor={`activity-start-${activityIndex}`}>Start Time</Label>
                                  <Input
                                    id={`activity-start-${activityIndex}`}
                                    type="datetime-local"
                                    value={activity.start_time || ""}
                                    onChange={(e) => handleActivityChange(activityIndex, 'start_time', e.target.value)}
                                    className={showValidationErrors && !activity.start_time ? 'border-red-500 focus:border-red-500' : ''}
                                  />
                                  {showValidationErrors && !activity.start_time && (
                                    <p className="text-xs text-red-500">Start time is required</p>
                                  )}
                                </div>
                                <div className="w-1/2 space-y-1">
                                  <Label htmlFor={`activity-end-${activityIndex}`}>End Time</Label>
                                  <Input
                                    id={`activity-end-${activityIndex}`}
                                    type="datetime-local"
                                    value={activity.end_time || ""}
                                    onChange={(e) => handleActivityChange(activityIndex, 'end_time', e.target.value)}
                                    className={showValidationErrors && !activity.end_time ? 'border-red-500 focus:border-red-500' : ''}
                                  />
                                  {showValidationErrors && !activity.end_time && (
                                    <p className="text-xs text-red-500">End time is required</p>
                                  )}
                                </div>
                              </div>
                              <div>
                                <Label htmlFor={`activity-location-${activityIndex}`}>Location</Label>
                                <Input
                                  id={`activity-location-${activityIndex}`}
                                  value={activity.location || ""}
                                  onChange={(e) => handleActivityChange(activityIndex, 'location', e.target.value)}
                                  placeholder="Location"
                                />
                              </div>
                              <div>
                                <Label htmlFor={`activity-description-${activityIndex}`}>Description</Label>
                                <Textarea
                                  id={`activity-description-${activityIndex}`}
                                  value={activity.description || ""}
                                  onChange={(e) => handleActivityChange(activityIndex, 'description', e.target.value)}
                                  placeholder="Description"
                                  rows={3}
                                />
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setEditingActivityIndex(null)}
                                >
                                  Done
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => handleRemoveActivity(activityIndex)}
                                >
                                  Delete
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center">
                                <div className="text-lg font-medium">
                                  {activity.title || "Untitled Activity"}
                                </div>
                                {showValidationErrors && activityHasErrors(activity) && (
                                  <div className="ml-2 text-red-500 flex items-center">
                                    <AlertCircle className="h-4 w-4 mr-1" />
                                    <span className="text-xs">Missing required fields</span>
                                  </div>
                                )}
                              </div>
                              
                              {/* Slide types as tags */}
                              <div className="flex flex-wrap gap-2 mt-2">
                                {activity.id && activitySlides[activity.id]?.map((slide, i) => (
                                  <div 
                                    key={i}
                                    className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-sm"
                                  >
                                    {getSlideTypeTag(slide.slide_type)}
                                  </div>
                                ))}
                                {!activity.id && activitySlides[-activityIndex - 1]?.map((slide, i) => (
                                  <div 
                                    key={i}
                                    className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-sm"
                                  >
                                    {getSlideTypeTag(slide.slide_type)}
                                  </div>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                        
                        <div className="flex items-center">
                          {editingActivityIndex !== activityIndex && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                setEditingActivityIndex(activityIndex)
                              }}
                            >
                              Edit
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleExpandActivity(activityIndex)
                            }}
                          >
                            {expandedActivity === activityIndex ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      
                      {/* Expanded content for slides */}
                      {expandedActivity === activityIndex && (
                        <div className="mt-4 pl-6 border-l-2 border-gray-200 dark:border-gray-700">
                          <div className="space-y-3">
                            {/* List existing slides */}
                            {activity.id && activitySlides[activity.id]?.map((slide, slideIndex) => (
                              <div key={slideIndex} className="flex items-center justify-between group">
                                <div 
                                  className="flex-1 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded cursor-pointer"
                                  onClick={() => setEditingSlideIndex(slideIndex)}
                                >
                                  <div className="font-medium">{slide.title}</div>
                                  <div className="text-sm text-gray-500 flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {slide.duration}s
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="opacity-0 group-hover:opacity-100"
                                  onClick={() => handleRemoveSlide(activityIndex, slideIndex)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                            {!activity.id && activitySlides[-activityIndex - 1]?.map((slide, slideIndex) => (
                              <div key={slideIndex} className="flex items-center justify-between group">
                                <div 
                                  className="flex-1 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded cursor-pointer"
                                  onClick={() => setEditingSlideIndex(slideIndex)}
                                >
                                  <div className="font-medium">{slide.title}</div>
                                  <div className="text-sm text-gray-500 flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {slide.duration}s
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="opacity-0 group-hover:opacity-100"
                                  onClick={() => handleRemoveSlide(activityIndex, slideIndex)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                            
                            {/* Add slide button */}
                            <div className="flex items-center justify-between">
                              <Select onValueChange={(value) => handleAddSlide(activityIndex, value as SlideType)}>
                                <SelectTrigger className="w-[220px]">
                                  <SelectValue placeholder="Add a slide" />
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
                            
                            {/* Edit slide form */}
                            {editingSlideIndex !== null && (
                              <div className="mt-4 p-4 bg-white dark:bg-gray-900 rounded border">
                                {activity.id && activitySlides[activity.id]?.[editingSlideIndex] && (
                                  <SlideEditor
                                    slide={activitySlides[activity.id][editingSlideIndex]}
                                    onChange={(data) => handleUpdateSlide(activityIndex, editingSlideIndex, data)}
                                  />
                                )}
                                {!activity.id && activitySlides[-activityIndex - 1]?.[editingSlideIndex] && (
                                  <SlideEditor
                                    slide={activitySlides[-activityIndex - 1][editingSlideIndex]}
                                    onChange={(data) => handleUpdateSlide(activityIndex, editingSlideIndex, data)}
                                  />
                                )}
                                <div className="flex justify-end mt-4">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => setEditingSlideIndex(null)}
                                  >
                                    Done
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          ))}
          
          {/* Add activity button */}
          <div className="flex justify-center mt-8">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full w-12 h-12 p-0"
              onClick={handleAddActivity}
            >
              <Plus className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Save button */}
      <div className="flex justify-end mt-8">
        <Button
          onClick={handleAttemptSave}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Activities"}
        </Button>
      </div>
    </div>
  )
} 