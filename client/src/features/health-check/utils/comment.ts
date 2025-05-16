import {
  Answers,
  QuestionAnswer,
  Question,
  Response,
  Section,
  Challenge,
} from '../types/health-check';

export const getCommentCount = (responses: Response[], questionId: string) => {
  return responses.reduce((count, response) => {
    const answer = (response.answers as Answers)[questionId];
    return count + (answer?.comment?.length ?? 0);
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
          sum +
          (validIds.has(qid)
            ? (ans as QuestionAnswer)?.comment?.length || 0
            : 0),
        0,
      ),
    0,
  );
}

export function getTopChallenges(responses: Response[], questions: Question[]) {
  const additionalQuestionIds = questions
    .filter(({ section }) => section === Section.AdditionalQuestions)
    .map(({ id }) => id);

  const challenges: Challenge[] = [];
  responses.forEach((response) => {
    additionalQuestionIds.forEach((qid) => {
      const answer = (response.answers as Answers)[qid];
      const comments = answer?.comment;
      if (comments) {
        comments.forEach((comment) => {
          challenges.push({
            additionalQuestionId: qid,
            text: comment,
            response: response,
          });
        });
      }
    });
  });
  return challenges;
}

export function getCommentsByQuestionId(
  responses: Response[],
  questionId: string,
) {
  return responses.reduce<{ comment: string; created_at: string }[]>(
    (acc, response) => {
      const answer = (response.answers as Answers)[questionId];
      const createdAt = response.created_at ?? '';
      if (!answer?.comment) return acc;

      if (Array.isArray(answer.comment)) {
        answer.comment.forEach((comment) => {
          acc.push({ comment, created_at: createdAt });
        });
      } else {
        acc.push({ comment: answer.comment, created_at: createdAt });
      }
      return acc;
    },
    [],
  );
}
