import { Answer, Score } from '@/types';
import { questions } from '@/data/questions';

export function calculateScore(answers: Answer[]): Score {
  const scores: Score = {
    SG: 0,
    RE: 0,
    FC: 0,
    QL: 0
  };

  answers.forEach((answer) => {
    const questionId = answer.questionId;
    const question = questions.find(q => q.id === questionId);
    
    if (!question) return; // 質問が見つからない場合はスキップ
    
    // direction属性に基づいてスコアを調整
    const adjustedScore = question.direction === 'negative' ? -answer.score : answer.score;

    // 質問IDに基づいて軸を判定（24問対応）
    if (questionId >= 1 && questionId <= 6) {
      scores.SG += adjustedScore;
    } else if (questionId >= 7 && questionId <= 12) {
      scores.RE += adjustedScore;
    } else if (questionId >= 13 && questionId <= 18) {
      scores.FC += adjustedScore;
    } else if (questionId >= 19 && questionId <= 24) {
      scores.QL += adjustedScore;
    }
  });

  return scores;
}

export function determineType(scores: Score): string {
  let typeCode = '';

  // 各軸の判定。
  // 同点（スコア0）の扱いは軸ごとにあえて分散させている。
  // 全軸を一律 ">= 0" にすると、バランスよく答えた人・迷って揺れた人が
  // 必ず最も極端な「SRFQ（鶏むね仙人）」に落ちてしまうため。
  // 同点時は S/R/F/Q に一律で寄せず、より共感されやすい中庸タイプ
  //（GRFL＝女子会ランチの守護神）へ着地するよう境界を調整している。
  typeCode += scores.SG > 0 ? 'S' : 'G';   // 同点 → G（みんな型）
  typeCode += scores.RE >= 0 ? 'R' : 'E';  // 同点 → R（計画型）
  typeCode += scores.FC >= 0 ? 'F' : 'C';  // 同点 → F（質重視型）
  typeCode += scores.QL > 0 ? 'Q' : 'L';   // 同点 → L（じっくり型）

  return typeCode;
}

export function getTypeFromAnswers(answers: Answer[]): string {
  const scores = calculateScore(answers);
  return determineType(scores);
}