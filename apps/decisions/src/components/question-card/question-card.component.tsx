import { Trash2 } from "lucide-react";
import { Controller, useFormContext, useWatch } from "react-hook-form";

import { ChoiceOptionsField } from "@/components/choice-options-field";
import { ScoreLevelsField } from "@/components/score-levels-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { QUESTION_TYPES } from "@/models/decision.model";
import { DecisionFormValues } from "@/types/decision-form.type";

import {
  QUESTION_TYPE_HINTS,
  QUESTION_TYPE_LABELS,
} from "./question-card.model";
import { QuestionCardProps } from "./question-card.type";
import { questionFieldId } from "./utils/question-field-id";

// Editor for one question: its key, type, instructions and the criteria the
// chosen type needs.
export const QuestionCard = ({
  index,
  canRemove,
  onRemove,
}: QuestionCardProps) => {
  const { control, register, formState } = useFormContext<DecisionFormValues>();
  const type = useWatch({ control, name: `questions.${index}.type` });
  const errors = formState.errors.questions?.[index];

  return (
    <Card size="sm">
      <CardHeader className="flex flex-row items-start gap-2">
        <Field data-invalid={Boolean(errors?.name)} className="flex-1">
          <FieldLabel htmlFor={questionFieldId(index, "name")}>Key</FieldLabel>
          <Input
            {...register(`questions.${index}.name`)}
            id={questionFieldId(index, "name")}
            aria-invalid={Boolean(errors?.name)}
            placeholder="urgent"
            className="font-mono"
          />
          <FieldError errors={[errors?.name]} />
        </Field>
        <Controller
          control={control}
          name={`questions.${index}.type`}
          render={({ field }) => (
            <Field className="w-36">
              <FieldLabel htmlFor={questionFieldId(index, "type")}>
                Type
              </FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  id={questionFieldId(index, "type")}
                  className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {QUESTION_TYPES.map((value) => (
                    <SelectItem key={value} value={value}>
                      {QUESTION_TYPE_LABELS[value]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          )}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="mt-6"
          aria-label="Remove question"
          disabled={!canRemove}
          onClick={onRemove}>
          <Trash2 />
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Field data-invalid={Boolean(errors?.instructions)}>
          <FieldLabel htmlFor={questionFieldId(index, "instructions")}>
            Question
          </FieldLabel>
          <Textarea
            {...register(`questions.${index}.instructions`)}
            id={questionFieldId(index, "instructions")}
            aria-invalid={Boolean(errors?.instructions)}
            rows={2}
            placeholder="Is this support request urgent?"
          />
          <FieldDescription>{QUESTION_TYPE_HINTS[type]}</FieldDescription>
          <FieldError errors={[errors?.instructions]} />
        </Field>

        {type === "noul" && (
          <div className="grid gap-3 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor={questionFieldId(index, "true")}>
                True means (optional)
              </FieldLabel>
              <Input
                {...register(`questions.${index}.trueDescription`)}
                id={questionFieldId(index, "true")}
                placeholder="Needs a reply within the hour"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor={questionFieldId(index, "false")}>
                False means (optional)
              </FieldLabel>
              <Input
                {...register(`questions.${index}.falseDescription`)}
                id={questionFieldId(index, "false")}
                placeholder="Can wait for the normal queue"
              />
            </Field>
          </div>
        )}
        {type === "choice" && <ChoiceOptionsField questionIndex={index} />}
        {type === "score" && <ScoreLevelsField questionIndex={index} />}
      </CardContent>
    </Card>
  );
};
