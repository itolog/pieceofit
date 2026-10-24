// Validation messages are i18n keys, translated where they are shown
// (FormFieldError); the limits they quote come from i18n's defaultVariables.
export const FORM_ERRORS = {
  required: "errors.required",
  keyFormat: "errors.keyFormat",
  keyTaken: "errors.keyTaken",
  optionCount: "errors.optionCount",
  levelCount: "errors.levelCount",
  duplicateOption: "errors.duplicateOption",
  modelRequired: "errors.modelRequired",
  questionsMin: "errors.questionsMin",
  questionsMax: "errors.questionsMax",
  stateRequired: "errors.stateRequired",
} as const;
