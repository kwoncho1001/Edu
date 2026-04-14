import { Difficulty } from "./gallery";

export interface LogicStep {
  id: string;
  description: string;
  order: number;
}

export interface ProblemDNA {
  id: string;
  originalProblemId: string;
  coreConceptId: string;
  logicSteps: LogicStep[];
  difficultyCoefficient: number; // 0.1 ~ 2.0
  parameters: Record<string, any>;
}

export interface VariantProblem {
  id: string;
  dnaId: string;
  content: string;
  options: string[];
  answer: string;
  explanation: string;
  difficulty: Difficulty;
  logicPath: string[]; // IDs of logic steps involved
}

export interface UserErrorLog {
  problemId: string;
  userId: string;
  selectedOption: string;
  isCorrect: boolean;
  timeSpent: number; // seconds
  timestamp: string;
}

export interface VulnerabilityReport {
  weakDNAIds: string[];
  errorType: 'Calculation' | 'Logic' | 'Concept';
  feedback: string;
  recommendedDNAIds: string[];
}
