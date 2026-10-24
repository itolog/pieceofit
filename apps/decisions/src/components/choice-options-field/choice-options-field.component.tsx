import { Plus, X } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { FormFieldError } from "@/components/form-field-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MAX_OPTIONS, MIN_OPTIONS } from "@/models/decision.model";
import { DecisionFormValues } from "@/types/decision-form.type";

import { ChoiceOptionsFieldProps } from "./choice-options-field.type";

// Options of a `choice` question: a name the model answers with, plus an
// optional description (empty → the name describes itself).
export const ChoiceOptionsField = ({
  questionIndex,
}: ChoiceOptionsFieldProps) => {
  const { t } = useTranslation();
  const { control, register, formState } = useFormContext<DecisionFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `questions.${questionIndex}.options`,
  });
  const errors = formState.errors.questions?.[questionIndex]?.options;

  return (
    <div className="flex flex-col gap-2">
      <div className="text-muted-foreground grid grid-cols-[minmax(0,12rem)_1fr_2rem] gap-2 text-xs">
        <span>{t("question.options.option")}</span>
        <span>{t("question.options.description")}</span>
      </div>
      {fields.map((field, index) => (
        <div key={field.id} className="flex flex-col gap-1">
          <div className="grid grid-cols-[minmax(0,12rem)_1fr_2rem] gap-2">
            <Input
              {...register(`questions.${questionIndex}.options.${index}.name`)}
              aria-label={t("question.options.nameLabel", { n: index + 1 })}
              aria-invalid={Boolean(errors?.[index]?.name)}
              placeholder="technical"
              className="font-mono"
            />
            <Input
              {...register(
                `questions.${questionIndex}.options.${index}.description`,
              )}
              aria-label={t("question.options.descriptionLabel", {
                n: index + 1,
              })}
              placeholder={t("question.options.descriptionPlaceholder")}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={t("question.options.remove", { n: index + 1 })}
              disabled={fields.length <= MIN_OPTIONS}
              onClick={() => remove(index)}>
              <X />
            </Button>
          </div>
          <FormFieldError error={errors?.[index]?.name} />
        </div>
      ))}
      <FormFieldError error={errors?.root} />
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="self-start"
        disabled={fields.length >= MAX_OPTIONS}
        onClick={() => append({ name: "", description: "" })}>
        <Plus /> {t("question.options.add")}
      </Button>
    </div>
  );
};
