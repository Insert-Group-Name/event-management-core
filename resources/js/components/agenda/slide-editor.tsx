import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { type CreateSlideData } from "@/types/agenda-slide"
import { Plus, Minus, X } from "lucide-react"

interface SlideEditorProps {
  slide: CreateSlideData
  onChange: (data: Partial<CreateSlideData>) => void
}

export default function SlideEditor({ slide, onChange }: SlideEditorProps) {
  const [title, setTitle] = useState(slide.title)
  const [duration, setDuration] = useState(slide.duration)
  
  // Update local state when slide prop changes
  useEffect(() => {
    setTitle(slide.title)
    setDuration(slide.duration)
  }, [slide])
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    onChange({ title: newTitle })
  }
  
  const handleDurationChange = (value: number[]) => {
    const newDuration = value[0]
    setDuration(newDuration)
    onChange({ duration: newDuration })
  }
  
  const updateContent = (updates: Record<string, unknown>) => {
    onChange({
      content: {
        ...slide.content,
        ...updates
      }
    })
  }
  
  const renderSlideTypeEditor = () => {
    switch (slide.slide_type) {
      case "poll":
        return renderPollEditor()
      case "quiz":
        return renderQuizEditor()
      case "qa":
        return renderQaEditor()
      case "rating":
        return renderRatingEditor()
      case "checkin":
        return renderCheckinEditor()
      case "selfie":
        return renderSelfieEditor()
      case "speaker":
        return renderSpeakerEditor()
      default:
        return <div>Unknown slide type</div>
    }
  }
  
  const renderPollEditor = () => {
    const question = slide.content.question as string || ""
    const options = slide.content.options as string[] || []
    
    const handleAddOption = () => {
      updateContent({ options: [...options, `Option ${options.length + 1}`] })
    }
    
    const handleRemoveOption = (index: number) => {
      const newOptions = [...options]
      newOptions.splice(index, 1)
      updateContent({ options: newOptions })
    }
    
    const handleOptionChange = (index: number, value: string) => {
      const newOptions = [...options]
      newOptions[index] = value
      updateContent({ options: newOptions })
    }
    
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="poll-question">Question</Label>
          <Textarea
            id="poll-question"
            value={question}
            onChange={(e) => updateContent({ question: e.target.value })}
            placeholder="Enter your poll question"
          />
        </div>
        
        <div className="space-y-2">
          <Label>Options</Label>
          {options.map((option, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveOption(index)}
                disabled={options.length <= 2}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddOption}
            className="mt-2"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Option
          </Button>
        </div>
      </div>
    )
  }
  
  const renderQuizEditor = () => {
    const question = slide.content.question as string || ""
    const options = slide.content.options as string[] || []
    const correctAnswer = slide.content.correctAnswer as string || ""
    
    const handleAddOption = () => {
      updateContent({ options: [...options, `Option ${options.length + 1}`] })
    }
    
    const handleRemoveOption = (index: number) => {
      const newOptions = [...options]
      newOptions.splice(index, 1)
      
      // If the correct answer was removed, update it
      const removedOption = options[index]
      if (removedOption === correctAnswer) {
        updateContent({ 
          options: newOptions,
          correctAnswer: newOptions.length > 0 ? newOptions[0] : ""
        })
      } else {
        updateContent({ options: newOptions })
      }
    }
    
    const handleOptionChange = (index: number, value: string) => {
      const newOptions = [...options]
      const oldValue = newOptions[index]
      newOptions[index] = value
      
      // If the correct answer was changed, update it
      if (oldValue === correctAnswer) {
        updateContent({ 
          options: newOptions,
          correctAnswer: value
        })
      } else {
        updateContent({ options: newOptions })
      }
    }
    
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="quiz-question">Question</Label>
          <Textarea
            id="quiz-question"
            value={question}
            onChange={(e) => updateContent({ question: e.target.value })}
            placeholder="Enter your quiz question"
          />
        </div>
        
        <div className="space-y-2">
          <Label>Options</Label>
          {options.map((option, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2">
                <Input
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                />
                <Button
                  variant={option === correctAnswer ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateContent({ correctAnswer: option })}
                >
                  Correct
                </Button>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveOption(index)}
                disabled={options.length <= 2}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddOption}
            className="mt-2"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Option
          </Button>
        </div>
      </div>
    )
  }
  
  const renderQaEditor = () => {
    const question = slide.content.question as string || ""
    
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="qa-question">Question</Label>
          <Textarea
            id="qa-question"
            value={question}
            onChange={(e) => updateContent({ question: e.target.value })}
            placeholder="Enter your question for the audience"
          />
        </div>
      </div>
    )
  }
  
  const renderRatingEditor = () => {
    const question = slide.content.question as string || ""
    const maxRating = slide.content.maxRating as number || 5
    
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="rating-question">Question</Label>
          <Textarea
            id="rating-question"
            value={question}
            onChange={(e) => updateContent({ question: e.target.value })}
            placeholder="Enter your rating question"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="max-rating">Maximum Rating: {maxRating}</Label>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => updateContent({ maxRating: Math.max(1, maxRating - 1) })}
              disabled={maxRating <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <Slider
                value={[maxRating]}
                min={1}
                max={10}
                step={1}
                onValueChange={(value) => updateContent({ maxRating: value[0] })}
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => updateContent({ maxRating: Math.min(10, maxRating + 1) })}
              disabled={maxRating >= 10}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    )
  }
  
  const renderCheckinEditor = () => {
    const location = slide.content.location as string || ""
    
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="checkin-location">Location</Label>
          <Input
            id="checkin-location"
            value={location}
            onChange={(e) => updateContent({ location: e.target.value })}
            placeholder="Enter the check-in location"
          />
        </div>
      </div>
    )
  }
  
  const renderSelfieEditor = () => {
    const prompt = slide.content.prompt as string || ""
    
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="selfie-prompt">Selfie Prompt</Label>
          <Textarea
            id="selfie-prompt"
            value={prompt}
            onChange={(e) => updateContent({ prompt: e.target.value })}
            placeholder="Enter a prompt for the selfie"
          />
        </div>
      </div>
    )
  }
  
  const renderSpeakerEditor = () => {
    const speakerId = slide.content.speakerId as string || ""
    
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="speaker-id">Speaker ID</Label>
          <Input
            id="speaker-id"
            value={speakerId}
            onChange={(e) => updateContent({ speakerId: e.target.value })}
            placeholder="Enter the speaker ID"
          />
          <p className="text-xs text-muted-foreground">
            This will display information about the speaker from the event's speaker list.
          </p>
        </div>
      </div>
    )
  }
  
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit {slide.slide_type.charAt(0).toUpperCase() + slide.slide_type.slice(1)} Slide</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="slide-title">Slide Title</Label>
          <Input
            id="slide-title"
            value={title}
            onChange={handleTitleChange}
            placeholder="Enter slide title"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="slide-duration">
            Duration: {formatDuration(duration)}
          </Label>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleDurationChange([Math.max(5, duration - 5)])}
              disabled={duration <= 5}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <Slider
                id="slide-duration"
                value={[duration]}
                min={5}
                max={300}
                step={5}
                onValueChange={handleDurationChange}
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleDurationChange([Math.min(300, duration + 5)])}
              disabled={duration >= 300}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="border-t pt-4">
          {renderSlideTypeEditor()}
        </div>
      </CardContent>
    </Card>
  )
} 