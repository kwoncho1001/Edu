export interface ReasoningStep {
  id: string;
  description: string;
  isKeyPath: boolean;
  order: number;
}

export interface ComplexQuestion {
  id: string;
  title: string;
  scenario: string;
  combinedConcepts: string[];
  idealPath: string[]; // IDs of ReasoningSteps
  options: ReasoningStep[];
  difficulty: number;
}

export interface EvaluationSession {
  id: string;
  startTime: string;
  endTime?: string;
  responses: {
    questionId: string;
    selectedPath: string[];
    timePerStep: Record<string, number>;
  }[];
}

export interface CompetencyReport {
  overallScore: number;
  principleUnderstanding: number; // 0-100
  applicationPower: number; // 0-100
  logicalConsistency: number; // 0-100
  connectivityIndex: number; // 0.0 - 1.0
  areaScores: { area: string; score: number }[];
  feedback: {
    type: 'Principle' | 'Application';
    message: string;
  }[];
  bottlenecks: string[]; // Descriptions of where logic failed
}
