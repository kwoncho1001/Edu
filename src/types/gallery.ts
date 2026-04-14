export type Difficulty = '입문' | '초급' | '중급' | '고급' | '심화';
export type HierarchyLevel = 'Core' | 'Advanced' | 'Supplementary';

export interface ConceptPost {
  id: string;
  title: string;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  difficulty: Difficulty;
  hierarchyLevel?: HierarchyLevel;
  parentId?: string; // For hierarchy
  dependencies: string[]; // IDs of posts that must be completed first
  isCompleted: boolean;
  order: number;
  frequencyScore?: number; // For auto-classification
}

export interface Gallery {
  id: string;
  title: string;
  description: string;
  domain: string;
  posts: ConceptPost[];
  status: 'draft' | 'published' | 'archived';
  progress: number;
}

export interface Roadmap {
  id: string;
  title: string;
  galleries: Gallery[];
  totalProgress: number;
}

export interface UserProgress {
  userId: string;
  completedPostIds: string[];
  lastAccessedPostId?: string;
}
