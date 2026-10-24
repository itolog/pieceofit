// First `question_N` key not taken yet, starting after the current count.
export const nextQuestionName = (taken: string[]): string => {
  let n = taken.length + 1;
  while (taken.includes(`question_${n}`)) n += 1;
  return `question_${n}`;
};
