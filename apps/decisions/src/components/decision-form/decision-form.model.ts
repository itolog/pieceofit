import { QuestionValues } from "@/types/decision-form.type";

// Every question carries all types' fields (see the form schema), seeded
// with two blank rows so switching to choice / score starts editable.
export const EMPTY_QUESTION: QuestionValues = {
  name: "",
  type: "noul",
  instructions: "",
  trueDescription: "",
  falseDescription: "",
  options: [
    { name: "", description: "" },
    { name: "", description: "" },
  ],
  levels: [{ description: "" }, { description: "" }],
};

export const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];
