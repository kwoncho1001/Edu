export type VillainGrade = 1 | 2 | 3 | 4 | 5;
export type VillainType = 'OVERCONFIDENCE' | 'TIME_WASTER' | 'CONCEPT_CONFUSION' | 'LAZY_READING';

export interface Villain {
  id: string;
  name: string;
  grade?: VillainGrade; // Keep optional for new logic
  type: VillainType; // Back to non-optional
  weaknessTags: string[];
  hp: number;
  maxHp: number;
  appearance?: string; // Keep optional
  description: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'; // Back to non-optional
}

export interface MetacognitionStats {
  accuracyIndex: number; // 0 to 100
  confidenceBias: number; // -100 to 100
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

export interface Mission {
  id: string;
  villainId: string;
  title: string;
  problemIds: string[];
  timeLimit: number; // in seconds
  status: 'InProgress' | 'Completed' | 'Failed';
  startTime?: string;
}

export interface VulnerabilityDiagnosis {
  area: string;
  accuracy: number;
  priority: number; // 1 (High) to 5 (Low)
  errorType: 'Concept' | 'Mistake' | 'Calculation';
}

export interface MissionReward {
  exp: number;
  currency: number;
  badgeId?: string;
  streakBonus: number;
}

export interface MissionResult {
  isSuccess: boolean;
  accuracy: number;
  damageDealt: number;
  rewards?: MissionReward;
  remainingHp: number;
}

export interface KnowledgeNode {
  id: string;
  label: string;
  type: 'Concept' | 'Villain';
  status: 'Mastered' | 'Vulnerable' | 'Locked';
  score: number;
}

export interface KnowledgeLink {
  source: string;
  target: string;
  strength: number;
}

export interface KnowledgeGraphData {
  nodes: KnowledgeNode[];
  links: KnowledgeLink[];
}
