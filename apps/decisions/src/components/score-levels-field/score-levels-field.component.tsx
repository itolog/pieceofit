import { Plus, X } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { MAX_OPTIONS, MIN_OPTIONS } from "@/models/decision.model";
import { DecisionFormValues } from "@/types/decision-form.type";

import { ScoreLevelsFieldProps } from "./score-levels-field.type";

// Levels of a `score` question, lowest first. The model numbers them from 0
// and answers with a probability-weighted level.
export const ScoreLevelsField = ({ questionIndex }: ScoreLevelsFieldProps) => {
  const { control, register, formState } = useFormContext<DecisionFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `questions.${questionIndex}.levels`,
  });
  const errors = formState.errors.questions?.[questionIndex]?.levels;

  return (
    <div className="flex flex-col gap-2">
      <span className="text-muted-foreground text-xs">
        Levels, lowest first
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
              aria-label={`Level ${index} description`}
              aria-invalid={Boolean(errors?.[index]?.description)}
              placeholder={index === 0 ? "No impact" : "Critical"}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={`Remove level ${index}`}
              disabled={fields.length <= MIN_OPTIONS}
              onClick={() => remove(index)}>
              <X />
            </Button>
          </div>
          <FieldError errors={[errors?.[index]?.description]} />
        </div>
      ))}
      <FieldError errors={[errors?.root]} />
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="self-start"
        disabled={fields.length >= MAX_OPTIONS}
        onClick={() => append({ description: "" })}>
        <Plus /> Add level
      </Button>
    </div>
  );
};
