import { Plus, X } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { FormFieldError } from "@/components/form-field-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MAX_OPTIONS, MIN_OPTIONS } from "@/models/decision.model";
import { DecisionFormValues } from "@/types/decision-form.type";

import { ScoreLevelsFieldProps } from "./score-levels-field.type";

// Levels of a `score` question, lowest first. The model numbers them from 0
// and answers with a probability-weighted level.
export const ScoreLevelsField = ({ questionIndex }: ScoreLevelsFieldProps) => {
  const { t } = useTranslation();
  const { control, register, formState } = useFormContext<DecisionFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `questions.${questionIndex}.levels`,
  });
  const errors = formState.errors.questions?.[questionIndex]?.levels;

  return (
    <div className="flex flex-col gap-2">
      <span className="text-muted-foreground text-xs">
        {t("question.levels.hint")}
      </span>
      {fields.map((field, index) => (
        <div key={field.id} className="flex flex-col gap-1">
          <div className="grid grid-cols-[2rem_1fr_2rem] items-center gap-2">
            <span className="text-muted-foreground text-center font-mono text-sm">
              {index}
            </span>
            <Input
              {...register(
                `questions.${questionIndex}.levels.${index}.description`,
              )}
              aria-label={t("question.levels.label", { n: index })}
              aria-invalid={Boolean(errors?.[index]?.description)}
              placeholder={t(
                index === 0
                  ? "question.levels.lowPlaceholder"
                  : "question.levels.highPlaceholder",
              )}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={t("question.levels.remove", { n: index })}
              disabled={fields.length <= MIN_OPTIONS}
              onClick={() => remove(index)}>
              <X />
            </Button>
          </div>
          <FormFieldError error={errors?.[index]?.description} />
        </div>
      ))}
      <FormFieldError error={errors?.root} />
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="self-start"
        disabled={fields.length >= MAX_OPTIONS}
        onClick={() => append({ description: "" })}>
        <Plus /> {t("question.levels.add")}
      </Button>
    </div>
  );
};
