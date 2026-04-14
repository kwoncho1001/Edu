import { 
  AcademicTerm, 
  AnalogyModel, 
  TranslationResult, 
  TransformationRule, 
  AnalogyCategory 
} from "@/types/translation";

/**
 * Logic: 학술 개념 추출 및 문맥 분석
 * 입력된 텍스트에서 핵심 용어와 문맥을 식별합니다.
 */
export function extractAcademicConcepts(text: string): AcademicTerm[] {
  // 실제 구현에서는 NLP 라이브러리나 LLM을 사용하겠지만, 
  // 여기서는 명세에 따른 로직 구조를 구현합니다.
  const mockTerms: AcademicTerm[] = [
    {
      id: "term-1",
      term: "데드락 (Deadlock)",
      definition: "두 개 이상의 프로세스가 서로 상대방이 보유하고 있는 자원을 기다리며 무한 대기에 빠지는 상태",
      context: "운영체제 자원 관리",
      importance: "High"
    },
    {
      id: "term-2",
      term: "컨텍스트 스위칭 (Context Switching)",
      definition: "CPU가 한 프로세스에서 다른 프로세스로 전환할 때 현재 상태를 저장하고 복구하는 과정",
      context: "멀티태스킹 시스템",
      importance: "Medium"
    }
  ];

  // 텍스트 분석 시뮬레이션
  return mockTerms.filter(t => text.includes(t.term.split(' ')[0]));
}

/**
 * Logic: 인지 부하 기반 비유 치환 로직
 * 핵심 개념을 일상 경험과 연관된 비유 모델로 변환합니다.
 */
export function generateAnalogies(
  terms: AcademicTerm[], 
  category: AnalogyCategory
): AnalogyModel[] {
  const analogyDatabase: Record<string, Record<AnalogyCategory, string>> = {
    "term-1": {
      Cooking: "좁은 주방에서 두 요리사가 서로의 칼과 도마가 비기를 기다리며 멍하니 서 있는 상황",
      Gaming: "팀원 둘이 서로 '니가 먼저 가라'며 핑만 찍고 아무도 안 움직여서 게임 터지는 상황",
      Sports: "농구에서 두 선수가 공을 동시에 잡고 서로 안 놔주려고 버티는 점프볼 직전 상황",
      DailyLife: "외나무다리에서 만난 두 염소가 서로 비켜주길 기다리며 노려보는 상황",
      Work: "기획팀은 디자인을 기다리고, 디자인팀은 기획안을 기다리며 업무가 멈춘 상태"
    },
    "term-2": {
      Cooking: "한 화구에서 스테이크 굽다가 잠시 내려놓고 파스타 면 삶기로 전환하는 과정",
      Gaming: "롤 하다가 카톡 답장하려고 화면 전환(Alt+Tab)하는 찰나의 순간",
      Sports: "농구에서 공격권이 넘어가자마자 수비 태세로 순식간에 전환하는 동작",
      DailyLife: "유튜브 보다가 엄마 들어오면 순식간에 인강 화면으로 바꾸는 고도의 기술",
      Work: "보고서 쓰다가 갑자기 걸려온 전화를 받고 상담 모드로 머릿속을 교체하는 작업"
    }
  };

  return terms.map(term => ({
    termId: term.id,
    sourceConcept: term.term,
    targetConcept: analogyDatabase[term.id]?.[category] || "적절한 비유를 찾는 중...",
    analogy: analogyDatabase[term.id]?.[category] || "일상적인 사례로 설명이 필요함",
    complexityScore: 30 // 1-100
  }));
}

/**
 * Logic: 인지 부하 검증 및 문체 최적화
 * 생성된 비유가 인지 부하를 낮추는지 검증하고 문체를 다듬습니다.
 */
export function optimizeCognitiveLoad(
  analogies: AnalogyModel[],
  rule: TransformationRule
): string {
  return analogies.map(a => {
    let optimized = a.targetConcept;

    // Business Rule: 전문 용어가 2개 이상 포함되면 일상 어휘로 치환
    // (시뮬레이션: '프로세스', '자원' 등의 단어가 포함된 경우 더 쉽게 변경)
    if (optimized.includes("프로세스") || optimized.includes("자원")) {
      optimized = optimized.replace("프로세스", "사람").replace("자원", "도구");
    }

    // Business Rule: 어조가 딱딱하면 구어체/의성어 추가
    if (rule.intensity > 50) {
      optimized = `ㄹㅇ ${optimized} 같은 거임. 딱 봐도 감 오지?`;
    }

    return `**${a.sourceConcept}**? 이건 그냥 ${optimized}`;
  }).join("\n\n");
}

/**
 * Module: 학술 텍스트 번역 엔진 통합 프로세스
 */
export async function translateAcademicText(
  sourceText: string,
  rule: TransformationRule
): Promise<TranslationResult> {
  // 1. 개념 추출
  const terms = extractAcademicConcepts(sourceText);
  
  // 2. 비유 생성
  const analogies = generateAnalogies(terms, rule.preferredCategory);
  
  // 3. 문체 최적화 및 최종 텍스트 생성
  const translatedText = optimizeCognitiveLoad(analogies, rule);

  // 4. 인지 부하 감소율 계산 (가상)
  const reduction = terms.length > 0 ? 85 : 0;

  return {
    originalText: sourceText,
    extractedTerms: terms,
    analogies,
    translatedText,
    cognitiveLoadReduction: reduction
  };
}
