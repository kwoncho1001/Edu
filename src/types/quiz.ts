export interface ConceptRelation {
  id: string;
  targetId: string;
  type: 'parent' | 'child' | 'precedent' | 'opposite' | 'related';
  description: string;
}

export interface DeepQuiz {
  id: string;
  subject: string;
  question: string;
  relatedConcepts: string[];
  expectedKeywords: string[];
  modelAnswer: string;
  complexity: number; // 1-10
  rubric: {
    logicWeight: number;
    keywordWeight: number;
    causalityWeight: number;
  };
}

export interface QuizEvaluation {
  score: number;
  feedback: string;
  missingKeywords: string[];
  logicAnalysis: string;
  causalityScore: number;
  isSufficient: boolean;
}

export interface LearnerKnowledgeVector {
  subject: string;
  mastery: number; // 0-100
  recentAccuracy: number;
  history: { quizId: string; score: number }[];
}
