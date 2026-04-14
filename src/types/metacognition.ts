export type MetacognitiveType = 'Underestimated' | 'Overestimated' | 'SkillDeficient' | 'Mastery';

export interface LearningLog {
  id: string;
  timestamp: string;
  subject: string;
  questionId: string;
  isCorrect: boolean;
  responseTime: number; // in milliseconds
  hintUsed: boolean;
  confidenceLevel: number; // 1-5
  predictedScore?: number;
  actualScore?: number;
  errorType?: 'Concept' | 'Calculation' | 'Mistake';
}

export interface MetacognitiveProfile {
  userId: string;
  confidenceAccuracy: number; // 0-1
  averageMCI: number; // Metacognitive Inconsistency Index
  dominantType: MetacognitiveType;
}

export interface VillainPattern {
  id: string;
  name: string;
  description: string;
  triggerCondition: (logs: LearningLog[]) => boolean;
  feedbackMessage: string;
}

export interface LearningPlan {
  id: string;
  subject: string;
  plannedQuantity: number; // e.g., number of questions or pages
  actualQuantity: number;
  plannedTime: number; // in minutes
  actualTime: number;
  status: 'Pending' | 'InProgress' | 'Completed' | 'Failed';
}

export interface MetacognitiveFeedback {
  type: MetacognitiveType | 'VillainAlert' | 'StrategyNudge';
  title: string;
  message: string;
  actionGuide: string;
  severity: 'Low' | 'Medium' | 'High';
}

export interface MetacognitiveReport {
  mci: number;
  feedback: MetacognitiveFeedback[];
  planExecutionGap: number; // percentage
  suggestedDifficulty: 'Lower' | 'Maintain' | 'Higher';
  vulnerabilityScore: number;
  improvementStrategies: string[];
}
