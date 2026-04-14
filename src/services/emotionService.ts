import { UserEmotionProfile, AchievementFeedback, Intervention, GrowthData, EmotionState } from "@/types/emotion";
import { Difficulty } from "@/types/gallery";

/**
 * Logic: 즉각적 성취 기반 감정 피드백
 * 난이도와 연속 성공에 따른 보상 및 메시지 산출
 */
export function calculateAchievementFeedback(
  difficulty: Difficulty,
  consecutiveSuccess: number,
  profile: UserEmotionProfile
): AchievementFeedback {
  let basePoints = difficulty === '고급' ? 100 : difficulty === '중급' ? 50 : 20;
  
  // 연속 학습 성공 가중치
  if (consecutiveSuccess >= 10) basePoints *= 2.0;
  else if (consecutiveSuccess >= 5) basePoints *= 1.5;
  else if (consecutiveSuccess >= 3) basePoints *= 1.2;

  const messages = {
    Challenge: [
      "미쳤다... 이 난이도를 뚫어버리네? 당신은 진짜다.",
      "뇌에 지식 직접 꽂히는 소리 들림? 폼 미쳤다.",
      "이게 바로 갓생의 길. 다음 단계도 찢어버리자."
    ],
    Stability: [
      "차근차근 잘하고 있어요! 성장이 눈에 보입니다.",
      "오늘도 한 걸음 더! 당신의 노력을 응원해요.",
      "안정적인 페이스! 지식이 차곡차곡 쌓이고 있네요."
    ]
  };

  const pool = messages[profile.goalType];
  const message = pool[Math.floor(Math.random() * pool.length)];

  return {
    points: Math.round(basePoints),
    message,
    animationType: consecutiveSuccess >= 5 ? 'firework' : 'confetti'
  };
}

/**
 * Logic: 학습 자괴감 완화 알림 시스템
 * 오답률이나 세션 시간을 분석하여 위로/격려 인터벤션 생성
 */
export function checkSelfDoubtIntervention(
  sessionMinutes: number,
  errorRate: number,
  lastInterventionTime?: string
): Intervention | null {
  // 10분 이내 재발송 금지
  if (lastInterventionTime) {
    const last = new Date(lastInterventionTime).getTime();
    if (Date.now() - last < 10 * 60 * 1000) return null;
  }

  // 연속 오답률 60% 초과 시
  if (errorRate > 0.6) {
    return {
      type: 'Comfort',
      message: "잠깐! 오답은 실패가 아니라 뇌가 업데이트 중인 증거임. 자괴감 ㄴㄴ, 넌 성장 중이다.",
      actionLabel: "쉬운 문제로 멘탈 회복하기"
    };
  }

  // 세션 90분 초과 시
  if (sessionMinutes > 90) {
    return {
      type: 'Rest',
      message: "90분이나 달렸다고? 뇌 과부하 오기 직전임. 10분만 쉬고 오자. 커피 한 잔 고?",
      actionLabel: "강제 휴식 모드"
    };
  }

  return null;
}

/**
 * Logic: 성장 가시화 대시보드 로직
 * 학습 데이터를 기반으로 성장 지수 및 레벨 산출
 */
export function calculateGrowthIndex(
  completionCount: number,
  avgDifficultyCoeff: number,
  streakDays: number
): GrowthData {
  // 난이도 가중치 1.5배 적용 (고급 기준)
  const growthIndex = Math.round((completionCount * avgDifficultyCoeff * 10) + (streakDays * 50));
  
  const level = Math.floor(Math.sqrt(growthIndex / 10)) + 1;
  const passionLevel = streakDays >= 7 ? 'Burning' : streakDays >= 3 ? 'Passionate' : 'Normal';

  return {
    growthIndex,
    level,
    passionLevel,
    weeklySummary: `이번 주 당신은 ${completionCount}개의 지식을 정복했습니다. 특히 ${passionLevel === 'Burning' ? '폭발적인' : '꾸준한'} 열정이 돋보이네요!`,
    dailyProgress: [
      { date: 'Mon', score: 20 },
      { date: 'Tue', score: 45 },
      { date: 'Wed', score: growthIndex % 100 }
    ]
  };
}
