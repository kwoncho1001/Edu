export type VillainType = 'OVERCONFIDENCE' | 'TIME_WASTER' | 'CONCEPT_CONFUSION' | 'LAZY_READING';

export interface Villain {
  id: string;
  name: string;
  type: VillainType;
  description: string;
  hp: number;
  maxHp: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  weaknessTags: string[];
}

export interface LearningLog {
  id: string;
  timestamp: number;
  subject: string;
  isCorrect: boolean;
  responseTime: number; // in seconds
  predictedScore: number;
  actualScore: number;
}

export interface MetacognitionStats {
  accuracyIndex: number; // 0 to 100
  confidenceBias: number; // -100 to 100 (negative: underconfident, positive: overconfident)
  vulnerabilityRadar: Record<string, number>;
}

export interface EradicationMission {
  id: string;
  villainId: string;
  targetQuestions: string[];
  timeLimit: number;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  damageDealt: number;
}
