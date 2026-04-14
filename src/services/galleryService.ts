import { ConceptPost, Difficulty, Gallery, HierarchyLevel } from "@/types/gallery";

/**
 * Logic: 지식 계층 동기화 및 업데이트
 * 시험 경향성 변화(빈도 점수)에 따라 기존 지식 위계를 재평가합니다.
 */
export function syncKnowledgeHierarchy(posts: ConceptPost[]): ConceptPost[] {
  return posts.map(post => {
    const freq = post.frequencyScore || 0;
    let newLevel: HierarchyLevel = post.hierarchyLevel || 'Supplementary';

    // 비즈니스 룰: 빈도 20% 이상 상승(가정: 점수 80점 이상) 시 Core 격상
    if (freq >= 80) {
      newLevel = 'Core';
    } else if (freq >= 40) {
      newLevel = 'Advanced';
    } else {
      newLevel = 'Supplementary';
    }

    return { ...post, hierarchyLevel: newLevel };
  });
}

/**
 * Logic: 지식 위계 자동 분류 엔진
 * 빈도, 중요도, 난이도에 따라 계층을 자동 분류합니다.
 */
export function autoClassifyHierarchy(post: Partial<ConceptPost>): HierarchyLevel {
  const freq = post.frequencyScore || 0;
  const isDifficult = post.difficulty === '고급' || post.difficulty === '심화';
  
  // 비즈니스 룰 적용
  if (freq >= 70) return 'Core';
  if (isDifficult || freq >= 40) return 'Advanced';
  return 'Supplementary';
}

/**
 * Logic: 개인화 학습 경로 최적화
 * 사용자의 숙련도(정답률 등)를 분석하여 동적 로드맵을 생성합니다.
 */
export function optimizePersonalizedPath(
  posts: ConceptPost[],
  userProficiency: { level: string; accuracy: number }
): ConceptPost[] {
  // 1. 숙련도에 따른 필터링 및 정렬
  let optimized = [...posts];

  if (userProficiency.level === '초급') {
    // Core 우선 배정
    optimized.sort((a, b) => {
      if (a.hierarchyLevel === 'Core' && b.hierarchyLevel !== 'Core') return -1;
      if (a.hierarchyLevel !== 'Core' && b.hierarchyLevel === 'Core') return 1;
      return (a.order || 0) - (b.order || 0);
    });
  }

  return optimized;
}

/**
 * Logic: 개인화된 학습 경로 설계 로직
 * 사용자의 진단 점수에 따라 최적의 갤러리 탐색 순서를 제시합니다.
 */
export function designPersonalizedPath(
  score: number,
  allGalleries: Gallery[]
): { recommendedIds: string[]; pathType: string; supplementaryIds: string[] } {
  let recommendedIds: string[] = [];
  let pathType = "";
  let supplementaryIds: string[] = [];

  if (score < 40) {
    pathType = "기초 다지기";
    recommendedIds = allGalleries
      .filter(g => g.posts.some(p => p.difficulty === "입문"))
      .map(g => g.id);
  } else if (score < 80) {
    pathType = "핵심 응용";
    recommendedIds = allGalleries
      .filter(g => g.posts.some(p => p.difficulty === "초급" || p.difficulty === "중급"))
      .map(g => g.id);
    // 취약 영역 보충 과제 (단순화: 첫 번째 기초 갤러리 할당)
    const basic = allGalleries.find(g => g.posts.some(p => p.difficulty === "입문"));
    if (basic) supplementaryIds.push(basic.id);
  } else {
    pathType = "심화 탐구";
    recommendedIds = allGalleries
      .filter(g => g.posts.some(p => p.difficulty === "고급" || p.difficulty === "심화"))
      .map(g => g.id);
  }

  return { recommendedIds, pathType, supplementaryIds };
}

/**
 * Logic: 학습 콘텐츠 자동 분절 및 갤러리 생성 로직
 * 방대한 텍스트를 분석하여 10개 이상의 갤러리 단위로 자동 분절합니다.
 */
export function segmentContentToGalleries(rawText: string, domain: string): Partial<Gallery>[] {
  const MIN_GALLERIES = 10;
  const CONTENT_LIMIT = 300;
  
  // 의미론적 키워드 분석 (단순화: 줄바꿈 및 문단 기준)
  const paragraphs = rawText.split(/\n\n+/).filter(p => p.trim().length > 50);
  
  if (paragraphs.length < MIN_GALLERIES) {
    // 데이터가 짧을 경우 통합 모드 안내를 위한 플래그 포함 가능
    return [{ title: "통합 갤러리", description: "분량이 적어 통합된 갤러리입니다.", domain }];
  }

  return paragraphs.slice(0, 15).map((para, idx) => {
    const title = para.split(/[.\n]/)[0].slice(0, 30);
    const difficulty: Difficulty = idx < 3 ? "입문" : idx < 8 ? "중급" : "고급";
    
    return {
      id: `gen-gal-${idx}`,
      title: `${idx + 1}. ${title}`,
      description: `${domain} 핵심 개념 파트 ${idx + 1}`,
      domain,
      status: "draft",
      posts: [
        {
          id: `gen-post-${idx}`,
          title: "핵심 요약",
          content: para.slice(0, CONTENT_LIMIT),
          difficulty,
          dependencies: [],
          isCompleted: false,
          order: 0,
          hierarchyLevel: idx < 5 ? 'Core' : 'Advanced'
        }
      ]
    };
  });
}

/**
 * Logic: 심리적 장벽 완화를 위한 게이미피케이션 로직
 * 갤러리 완료 시 보상(뱃지, 포인트)을 계산합니다.
 */
export function calculateRewards(gallery: Gallery, streakDays: number) {
  const isFullyCompleted = gallery.posts.every(p => p.isCompleted) && gallery.posts.length >= 10;
  
  let points = 0;
  let badge = null;

  if (isFullyCompleted) {
    badge = "갤러리 마스터";
    points += 500;
  }

  // 연속 학습 보너스
  points += streakDays * 50;

  return { points, badge, isFullyCompleted };
}

/**
 * Logic: 인지 부하 완화형 텍스트 재구성 로직
 */
export function restructureText(text: string): string {
  let sentences = text.split(/[.!?]\s/);
  sentences = sentences.flatMap(s => {
    const words = s.split(/\s+/);
    if (words.length > 30) {
      const mid = Math.floor(words.length / 2);
      return [words.slice(0, mid).join(" ") + "...", words.slice(mid).join(" ")];
    }
    return s;
  });

  const termMap: Record<string, string> = {
    "추상화": "복잡한 걸 쳐내고 핵심만 남기는 것",
    "캡슐화": "내용물을 숨기고 껍데기만 보여주는 것",
    "다형성": "하나의 리모컨으로 여러 기계를 조종하는 것",
    "상속": "부모의 능력을 물려받아 쓰는 것"
  };

  let restructured = sentences.join(". ");
  Object.entries(termMap).forEach(([key, val]) => {
    restructured = restructured.replace(new RegExp(key, "g"), `${key}(${val})`);
  });

  if (restructured.includes("때문에") || restructured.includes("결과적으로")) {
    restructured = restructured.split(". ").map(s => `• ${s}`).join("\n");
  }

  if (restructured.length > 0 && !restructured.startsWith("**")) {
    const firstSentence = restructured.split(/[.\n]/)[0];
    restructured = `**${firstSentence}**\n${restructured.slice(firstSentence.length)}`;
  }

  return restructured;
}

/**
 * Logic: 개념 파편화 및 우선순위 추출 로직
 */
export function fragmentAndPrioritize(rawText: string): Partial<ConceptPost>[] {
  const fragments = rawText.split(/\n\n|(?=란\s|은\s|는\s|분류하면)/).filter(f => f.trim().length > 10);
  
  return fragments.map((frag, index) => {
    const title = frag.split(/[은는란]/)[0].trim().slice(0, 20) || `개념 ${index + 1}`;
    
    let score = 0;
    const words = frag.split(/\s+/);
    const wordFreq: Record<string, number> = {};
    words.forEach(w => wordFreq[w] = (wordFreq[w] || 0) + 1);
    if (Object.values(wordFreq).some(f => f >= 3)) score += 2;
    
    const difficulty: Difficulty = score >= 2 ? "고급" : "입문";

    return {
      id: Math.random().toString(36).substr(2, 9),
      title,
      content: restructureText(frag),
      difficulty,
      order: index,
      dependencies: [],
      isCompleted: false,
      hierarchyLevel: autoClassifyHierarchy({ difficulty, frequencyScore: score * 10 })
    };
  });
}

/**
 * Logic: 학습 몰입도 유지형 시각화 로직
 */
export function getVisualizationMeta(post: ConceptPost) {
  const isHighPriority = post.difficulty === "고급" || post.difficulty === "심화" || post.hierarchyLevel === 'Core';
  const isLongText = post.content.length > 300;
  
  return {
    layout: isLongText ? "two-column" : "standard",
    showIcon: isHighPriority,
    theme: isHighPriority ? "highlight" : "default",
    infographicType: post.content.includes("•") ? "process" : "none"
  };
}
