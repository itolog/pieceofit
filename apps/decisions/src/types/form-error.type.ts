import { FORM_ERRORS } from "@/models/form-errors.model";

export type FormErrorKey = (typeof FORM_ERRORS)[keyof typeof FORM_ERRORS];
