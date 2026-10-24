import { useTranslation } from "react-i18next";

import { FieldError } from "@/components/ui/field";

import { FormFieldErrorProps } from "./form-field-error.type";
import { isFormErrorKey } from "./utils/is-form-error-key";

// shadcn's FieldError for a validation message that is an i18n key. A
// message zod wrote itself (not a key) is shown as is.
export const FormFieldError = ({ error }: FormFieldErrorProps) => {
  const { t } = useTranslation();
  const message = error?.message;
  if (!message) return null;
  return (
    <FieldError>{isFormErrorKey(message) ? t(message) : message}</FieldError>
  );
};
