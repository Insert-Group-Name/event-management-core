export type SlideType = "poll" | "quiz" | "qa" | "rating" | "checkin" | "selfie" | "speaker"

export interface Slide {
  id: string
  type: SlideType
  content: Record<string, unknown>
  duration: number // in seconds
}

export interface Speaker {
  id: string
  name: string
  title: string
  company: string
  bio: string
  photoUrl: string
  socials: {
    twitter?: string
    linkedin?: string
    github?: string
    website?: string
  }
}

export interface Activity {
  id: string
  title: string
  description: string
  startTime: Date
  endTime: Date
  startDate?: string
  endDate?: string
  type: "session" | "break" | "networking" | "workshop" | "keynote"
  location: string
  slides: Slide[]
  speakers?: Speaker[]
}

export interface EventAgenda {
  id: string
  title: string
  date: Date
  activities: Activity[]
}

