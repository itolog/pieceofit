import { Plus, X } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { MAX_OPTIONS, MIN_OPTIONS } from "@/models/decision.model";
import { DecisionFormValues } from "@/types/decision-form.type";

import { ChoiceOptionsFieldProps } from "./choice-options-field.type";

// Options of a `choice` question: a name the model answers with, plus an
// optional description (empty → the name describes itself).
export const ChoiceOptionsField = ({
  questionIndex,
}: ChoiceOptionsFieldProps) => {
  const { control, register, formState } = useFormContext<DecisionFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `questions.${questionIndex}.options`,
  });
  const errors = formState.errors.questions?.[questionIndex]?.options;

  return (
    <div className="flex flex-col gap-2">
      <div className="text-muted-foreground grid grid-cols-[minmax(0,12rem)_1fr_2rem] gap-2 text-xs">
        <span>Option</span>
        <span>Description (optional)</span>
      </div>
      {fields.map((field, index) => (
        <div key={field.id} className="flex flex-col gap-1">
          <div className="grid grid-cols-[minmax(0,12rem)_1fr_2rem] gap-2">
            <Input
              {...register(`questions.${questionIndex}.options.${index}.name`)}
              aria-label={`Option ${index + 1} name`}
              aria-invalid={Boolean(errors?.[index]?.name)}
              placeholder="technical"
              className="font-mono"
            />
            <Input
              {...register(
                `questions.${questionIndex}.options.${index}.description`,
              )}
              aria-label={`Option ${index + 1} description`}
              placeholder="Outages, errors, and configuration"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={`Remove option ${index + 1}`}
              disabled={fields.length <= MIN_OPTIONS}
              onClick={() => remove(index)}>
              <X />
            </Button>
          </div>
          <FieldError errors={[errors?.[index]?.name]} />
        </div>
      ))}
      <FieldError errors={[errors?.root]} />
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="self-start"
        disabled={fields.length >= MAX_OPTIONS}
        onClick={() => append({ name: "", description: "" })}>
        <Plus /> Add option
      </Button>
    </div>
  );
};
