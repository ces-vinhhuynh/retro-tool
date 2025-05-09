import { Question, Section } from '../types/health-check';

export function calcAverage(
  questions: Question[],
  scores: Record<string, { average_score: number }>,
) {
  const valid = questions.filter(
    (q) => q.section !== Section.AdditionalQuestions,
  );
  const sum = valid.reduce(
    (acc, q) => acc + (scores[q.id]?.average_score ?? 0),
    0,
  );
  return valid.length ? (sum / valid.length).toFixed(1) : '0.0';
}

export function calcSectionAverage(
  section: Section,
  questions: Question[],
  scores: Record<string, { average_score: number }>,
) {
  const filtered = questions.filter((q) => q.section === section);
  const sum = filtered.reduce(
    (acc, q) => acc + (scores[q.id]?.average_score ?? 0),
    0,
  );
  return filtered.length ? (sum / filtered.length).toFixed(1) : '0.0';
}
