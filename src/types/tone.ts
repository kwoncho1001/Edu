export type ToneIntensity = 'Friendly' | 'Stimulating' | 'Humorous';

export interface DopamineConfig {
  intensity: number; // 0 to 100
  concept: ToneIntensity;
  useColloquial: boolean;
  memePreference: string[];
}

export interface AchievementStats {
  difficulty: '초급' | '중급' | '고급';
  streakDays: number;
  errorRate: number;
  sessionTimeSeconds: number;
}

export interface ToneTransformationResult {
  originalText: string;
  transformedText: string;
  triggersInserted: string[];
  achievementMessage: string;
}
