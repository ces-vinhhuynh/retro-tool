import { Question, Section } from '../types/health-check';

export function calcAverage(
  questions: Question[],
  scores: Record<string, { average_score: number }>,
) {
  const scoredQuestionIds = Object.keys(scores);
  const validQuestions = questions.filter(
    (q) =>
      q.section !== Section.AdditionalQuestions &&
      scoredQuestionIds.includes(q.id),
  );
  const sum = validQuestions.reduce(
    (acc, question) => acc + (scores[question.id]?.average_score ?? 0),
    0,
  );
  return validQuestions.length
    ? (sum / validQuestions.length).toFixed(1)
    : '0.0';
}

export function calcSectionAverage(
  section: Section,
  questions: Question[],
  scores: Record<string, { average_score: number }>,
) {
  const scoredQuestionIds = Object.keys(scores);
  const validQuestions = questions.filter(
    (q) => q.section === section && scoredQuestionIds.includes(q.id),
  );
  const sum = validQuestions.reduce(
    (acc, question) => acc + (scores[question.id]?.average_score ?? 0),
    0,
  );
  return validQuestions.length
    ? (sum / validQuestions.length).toFixed(1)
    : '0.0';
}
