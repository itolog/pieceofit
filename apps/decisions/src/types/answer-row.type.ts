// One bar of an answer: an option or level, its probability, and whether
// it is the model's pick.
export type AnswerRow = {
  label: string;
  probability: number;
  picked: boolean;
};
