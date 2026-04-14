export type ToneStyle = 'friendly' | 'aggressive' | 'humorous';

export interface TranslationMapping {
  academicTerm: string;
  slangTerm: string;
  metaphor: string;
}

export interface DopamineConfig {
  intensity: number; // 0 to 100
  style: ToneStyle;
  useSlang: boolean;
}

export interface ImmersionState {
  focusLevel: number; // 0 to 100
  lastInteractionTime: number;
  isBored: boolean;
}

export interface TranslationHistory {
  id: string;
  source: string;
  output: string;
  timestamp: number;
}
