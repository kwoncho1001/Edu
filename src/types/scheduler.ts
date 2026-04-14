export type MasteryLevel = 'Easy' | 'Normal' | 'Hard';

export interface LearningCard {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  lastReviewedAt?: string;
  nextReviewAt: string;
  intervalHours: number;
  masteryCount: number; // Number of consecutive 'Easy' ratings
  status: 'Learning' | 'Reviewing' | 'Mastered';
  priority: number;
}

export interface ReviewHistory {
  id: string;
  cardId: string;
  reviewedAt: string;
  feedback: MasteryLevel;
  previousInterval: number;
  newInterval: number;
}

export interface ForgettingCurveConfig {
  initialInterval: number; // 24 hours
  maxInterval: number; // 365 days in hours
  masteryThreshold: number; // 3 consecutive 'Easy'
}
