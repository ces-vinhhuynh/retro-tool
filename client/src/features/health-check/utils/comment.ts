import { Answer, Question, Response, Section } from '../types/health-check';

export const getCommentCount = (responses: Response[], questionId: string) => {
  return responses.reduce((count, response) => {
    const answer = (response.answers as Answer)[questionId];
    return count + (answer?.comment?.length || 0);
  }, 0);
};

export function calcTotalComments(
  responses: Response[],
  questions: Question[],
) {
  const validIds = new Set(questions.map((q) => q.id));
  return responses.reduce(
    (total, response) =>
      total +
      Object.entries(response?.answers ?? {}).reduce(
        (sum, [qid, ans]) =>
          sum + (validIds.has(qid) ? (ans as Answer)?.comment?.length || 0 : 0),
        0,
      ),
    0,
  );
}

export function getTopChallenges(responses: Response[], questions: Question[]) {
  const additionalQuestionIds = questions
    .filter(({ section }) => section === Section.AdditionalQuestions)
    .map(({ id }) => id);

  const challenges: string[] = [];
  responses.forEach((response) => {
    additionalQuestionIds.forEach((qid) => {
      const answer = (response.answers as Answer)[qid];
      if (answer?.comment) {
        challenges.push(...answer.comment);
      }
    });
  });
  return challenges;
}
