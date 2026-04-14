export type ReviewInterval = 1 | 3 | 7 | 14 | 30;

export interface KnowledgeCard {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: number;
  lastReviewedAt?: number;
  nextReviewAt: number;
  masteryLevel: number; // 0 to 100
  reviewCount: number;
}

export interface ReviewSchedule {
  cardId: string;
  scheduledAt: number;
  interval: ReviewInterval;
}

export interface StudyLog {
  id: string;
  cardId: string;
  timestamp: number;
  isSuccess: boolean;
  responseTime: number;
}
