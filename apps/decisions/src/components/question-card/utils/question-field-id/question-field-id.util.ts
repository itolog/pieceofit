// DOM id linking a question's label to its input; unique per question.
export const questionFieldId = (index: number, field: string): string =>
  `questions-${index}-${field}`;
