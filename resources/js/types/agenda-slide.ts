export type SlideType = "poll" | "quiz" | "qa" | "rating" | "checkin" | "selfie" | "speaker";

export interface BaseSlide {
  id: number;
  title: string;
  duration: number; // in seconds
  slide_type: SlideType;
  activity_id: number;
  order: number;
  created_at: string;
  updated_at: string;
}

// Poll slide content
export interface PollSlideContent {
  question: string;
  options: string[];
}

// Quiz slide content
export interface QuizSlideContent {
  question: string;
  options: string[];
  correctAnswer: string;
}

// Q&A slide content
export interface QaSlideContent {
  question: string;
}

// Rating slide content
export interface RatingSlideContent {
  question: string;
  maxRating: number;
}

// Check-in slide content
export interface CheckinSlideContent {
  location: string;
}

// Selfie slide content
export interface SelfieSlideContent {
  prompt: string;
}

// Speaker slide content
export interface SpeakerSlideContent {
  speakerId: string;
}

export interface PollSlide extends BaseSlide {
  slide_type: "poll";
  content: PollSlideContent;
}

export interface QuizSlide extends BaseSlide {
  slide_type: "quiz";
  content: QuizSlideContent;
}

export interface QaSlide extends BaseSlide {
  slide_type: "qa";
  content: QaSlideContent;
}

export interface RatingSlide extends BaseSlide {
  slide_type: "rating";
  content: RatingSlideContent;
}

export interface CheckinSlide extends BaseSlide {
  slide_type: "checkin";
  content: CheckinSlideContent;
}

export interface SelfieSlide extends BaseSlide {
  slide_type: "selfie";
  content: SelfieSlideContent;
}

export interface SpeakerSlide extends BaseSlide {
  slide_type: "speaker";
  content: SpeakerSlideContent;
}

export type Slide = PollSlide | QuizSlide | QaSlide | RatingSlide | CheckinSlide | SelfieSlide | SpeakerSlide;

export type CreateSlideData = Omit<BaseSlide, 'id' | 'created_at' | 'updated_at'> & {
  content: Record<string, unknown>;
};

export type UpdateSlideData = Partial<CreateSlideData>; 