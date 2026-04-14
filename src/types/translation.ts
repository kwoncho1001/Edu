export type AnalogyCategory = 'Cooking' | 'Gaming' | 'Sports' | 'DailyLife' | 'Work';

export interface AcademicTerm {
  id: string;
  term: string;
  definition: string;
  context: string;
  importance: 'High' | 'Medium' | 'Low';
  category?: string;
}

export interface AnalogyModel {
  termId: string;
  analogy: string;
  sourceConcept: string;
  targetConcept: string;
  complexityScore: number; // 1-100, lower is easier
}

export interface TransformationRule {
  intensity: number; // 0-100
  style: 'Aggressive' | 'Soft' | 'Humorous';
  preferredCategory: AnalogyCategory;
}

export interface TranslationResult {
  originalText: string;
  extractedTerms: AcademicTerm[];
  analogies: AnalogyModel[];
  translatedText: string;
  cognitiveLoadReduction: number; // percentage
}

export interface UserHistory {
  userId: string;
  preferredCategories: AnalogyCategory[];
  lastTranslatedAt: string;
}
