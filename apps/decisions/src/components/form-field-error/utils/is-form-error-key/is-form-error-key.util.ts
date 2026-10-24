import { FORM_ERRORS } from "@/models/form-errors.model";
import { FormErrorKey } from "@/types/form-error.type";

// Whether a validation message is one of ours (an i18n key) rather than a
// message zod produced itself.
export const isFormErrorKey = (message: string): message is FormErrorKey => {
  return Object.values(FORM_ERRORS).some((key) => key === message);
};
