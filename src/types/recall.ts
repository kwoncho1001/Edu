export interface KnowledgeItem {
  id: string;
  content: string;
  category: string;
  tags: string[];
  fixationLevel: number; // 0-100
  lastReviewedAt?: string;
  nextReviewAt: string;
  intervalDays: number;
}

export interface RecallQuiz {
  id: string;
  knowledgeId: string;
  question: string;
  answer: string;
  options?: string[];
  hints: string[];
  type: 'multiple-choice' | 'subjective' | 'summary';
  difficulty: number;
}

export interface RecallLog {
  id: string;
  knowledgeId: string;
  isCorrect: boolean;
  responseTime: number;
  hintUsedCount: number;
  timestamp: string;
}

export interface RecallSession {
  streak: number;
  totalRecalled: number;
  todayRecalled: number;
}
