import { DopamineConfig, AchievementStats, ToneTransformationResult } from "@/types/tone";

/**
 * Logic: 학습 성취감 강화 로직
 * 사용자의 지적 허영심을 자극하는 리워드성 멘트 생성
 */
export function generateAchievementMessage(stats: AchievementStats): string {
  const memes = ["폼 미쳤다", "이게 섹스지", "지식 폼 미침", "뇌섹남/녀 등극", "상위 1% 능지"];
  const randomMeme = memes[Math.floor(Math.random() * memes.length)];

  if (stats.errorRate === 0) {
    return `[경축] 오답률 0% 실화냐? 인간 지능의 한계를 넘어서버림... ${randomMeme} ㄷㄷ`;
  }

  if (stats.streakDays >= 7) {
    return `7일 연속 학습 실화? 당신은 이미 지식의 정점에 서 있음. ${randomMeme} 인정함.`;
  }

  if (stats.difficulty === '고급') {
    return `이 고난도 개념을 뚫다니... 천재적인 통찰력에 무릎을 탁 치고 감. ${randomMeme}!`;
  }

  if (stats.sessionTimeSeconds < 60) {
    return `가볍게 훑었지만 핵심은 다 잡았네? 효율성 ㅆㅅㅌㅊ. ${randomMeme}`;
  }

  return `오늘도 지식 한 입 완료! 대단해! ${randomMeme}`;
}

/**
 * Logic: 갤러리식 문체 변환 로직
 * 커뮤니티 특유의 구어체와 강조형 문장으로 재구성
 */
export function convertToGalleryStyle(text: string, intensity: number): string {
  if (intensity < 20) return text;

  // 문장 단위 분리
  const sentences = text.split(/[.!?]\s+/);
  
  const transformed = sentences.map(s => {
    let converted = s.trim();
    if (!converted) return "";

    // 반말 어미 변환
    converted = converted
      .replace(/입니다|해요|하세요/g, "임")
      .replace(/합니다|해요/g, "함")
      .replace(/인가요|했나요/g, "했냐")
      .replace(/있습니다/g, "있음")
      .replace(/것입니다/g, "거임");

    // 핵심 키워드 강조 (대괄호)
    if (intensity > 50) {
      const keywords = ["프로세스", "스레드", "데드락", "메모리", "OS", "운영체제"];
      keywords.forEach(k => {
        const regex = new RegExp(k, 'g');
        converted = converted.replace(regex, `[${k}]`);
      });
    }

    return converted;
  });

  return transformed.join(". ") + (intensity > 30 ? " ㄷㄷ" : "");
}

/**
 * Logic: 도파민 트리거 삽입 로직
 * 학습 내용 중간에 자극적인 비유나 밈 삽입
 */
export function insertDopamineTriggers(text: string, keywords: string[]): { text: string; triggers: string[] } {
  const triggers = [
    "이거 모르면 진짜 능지 처참함",
    "여기서 무릎을 탁 쳐야 정상임",
    "뇌에 직접 꽂히는 소리 들림?",
    "이게 바로 팩트 폭격임",
    "ㄹㅇ루다가 중요한 포인트임"
  ];

  let result = text;
  const insertedTriggers: string[] = [];

  if (text.length > 300) {
    const midPoint = Math.floor(text.length / 2);
    const trigger = triggers[Math.floor(Math.random() * triggers.length)];
    result = text.slice(0, midPoint) + `\n\n(${trigger})\n\n` + text.slice(midPoint);
    insertedTriggers.push(trigger);
  }

  return { text: result, triggers: insertedTriggers };
}

/**
 * Module: 도파민 어조 제너레이터 통합 엔진
 */
export function transformToDopamineTone(
  sourceText: string,
  config: DopamineConfig,
  stats: AchievementStats,
  keywords: string[]
): ToneTransformationResult {
  // 1. 트리거 삽입
  const { text: triggeredText, triggers } = insertDopamineTriggers(sourceText, keywords);
  
  // 2. 문체 변환
  const transformedText = convertToGalleryStyle(triggeredText, config.intensity);
  
  // 3. 성취 메시지 생성
  const achievementMessage = generateAchievementMessage(stats);

  return {
    originalText: sourceText,
    transformedText,
    triggersInserted: triggers,
    achievementMessage
  };
}
