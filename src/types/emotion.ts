import { Difficulty } from "./gallery";

export type EmotionState = 'Interest' | 'Boredom' | 'Confusion' | 'Frustration' | 'Excitement';
export type GoalType = 'Challenge' | 'Stability';

export interface UserEmotionProfile {
  userId: string;
  currentEmotion: EmotionState;
  goalType: GoalType;
  streakDays: number;
  totalPoints: number;
  lastInterventionTime?: string;
}

export interface AchievementFeedback {
  points: number;
  message: string;
  animationType: 'confetti' | 'firework' | 'sparkle';
}

export interface Intervention {
  type: 'Comfort' | 'Rest' | 'Guidance';
  message: string;
  actionLabel?: string;
}

export interface GrowthData {
  growthIndex: number;
  level: number;
  passionLevel: 'Normal' | 'Passionate' | 'Burning';
  weeklySummary: string;
  dailyProgress: { date: string; score: number }[];
}
