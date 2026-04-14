export type Difficulty = 'BASIC' | 'INTERMEDIATE' | 'ADVANCED' | 'KILLER';

export interface ConceptNode {
  id: string;
  name: string;
  description: string;
  relatedIds: string[];
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  initialVariables: Record<string, number>;
  logic: (variables: Record<string, number>) => string;
}

export interface AdvancedQuiz {
  id: string;
  question: string;
  expectedKeywords: string[];
  rubric: string;
  difficulty: Difficulty;
  conceptId: string;
}

export interface EvaluationSession {
  id: string;
  startTime: number;
  endTime?: number;
  score: number;
  competencyMap: Record<string, number>;
  feedback: string;
}

export interface SimulationLog {
  id: string;
  scenarioId: string;
  timestamp: number;
  variables: Record<string, number>;
  hypothesis: string;
  outcome: string;
}
