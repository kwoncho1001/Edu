export type Difficulty = '하' | '중' | '상' | '최상';

export interface Concept {
  id: string;
  name: string;
  summary: string;
  keyPoints: string[];
  category: string;
  mastery: number; // 0 to 100
}

export interface ExamQuestion {
  id: string;
  text: string;
  imageUrl?: string;
  options: string[];
  answer: number;
  explanation: string;
  difficulty: Difficulty;
  conceptId: string;
  tags: string[];
  hitRate: number; // Probability of appearing in actual exam
  failRate: number; // User's fail rate or global fail rate
}

export interface Mapping {
  id: string;
  conceptId: string;
  questionId: string;
  weight: number; // Strength of connection
  frequency: number; // How often this concept appears in this form
}

export interface VariantPattern {
  id: string;
  conceptId: string;
  title: string;
  description: string;
  logic: string; // e.g., "Condition Change", "Option Addition"
  predictedQuestion: string;
  masteryLevel: number;
}

export interface UserExamData {
  userId: string;
  solvedQuestionIds: string[];
  wrongQuestionIds: string[];
  conceptMastery: Record<string, number>;
}
