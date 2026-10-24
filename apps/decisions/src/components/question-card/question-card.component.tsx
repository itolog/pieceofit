import { Trash2 } from "lucide-react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { ChoiceOptionsField } from "@/components/choice-options-field";
import { FormFieldError } from "@/components/form-field-error";
import { ScoreLevelsField } from "@/components/score-levels-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
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
import { QUESTION_TYPE_STYLES } from "@/models/question-type.model";
import { DecisionFormValues } from "@/types/decision-form.type";

import { QuestionCardProps } from "./question-card.type";
import { questionFieldId } from "./utils/question-field-id";

// Editor for one question: its key, type, instructions and the criteria the
// chosen type needs.
export const QuestionCard = ({
  index,
  canRemove,
  onRemove,
}: QuestionCardProps) => {
  const { t } = useTranslation();
  const { control, register, formState } = useFormContext<DecisionFormValues>();
  const type = useWatch({ control, name: `questions.${index}.type` });
  const errors = formState.errors.questions?.[index];

  return (
    <Card
      size="sm"
      className={`border-l-4 transition-colors ${QUESTION_TYPE_STYLES[type].edge}`}>
      <CardHeader className="flex flex-row items-start gap-2">
        <Field data-invalid={Boolean(errors?.name)} className="flex-1">
          <FieldLabel htmlFor={questionFieldId(index, "name")}>
            {t("question.key")}
          </FieldLabel>
          <Input
            {...register(`questions.${index}.name`)}
            id={questionFieldId(index, "name")}
            aria-invalid={Boolean(errors?.name)}
            placeholder="urgent"
            className="font-mono"
          />
          <FormFieldError error={errors?.name} />
        </Field>
        <Controller
          control={control}
          name={`questions.${index}.type`}
          render={({ field }) => (
            <Field className="w-36">
              <FieldLabel htmlFor={questionFieldId(index, "type")}>
                {t("question.type")}
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
                      {t(`question.types.${value}`)}
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
          aria-label={t("question.remove")}
          disabled={!canRemove}
          onClick={onRemove}>
          <Trash2 />
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Field data-invalid={Boolean(errors?.instructions)}>
          <FieldLabel htmlFor={questionFieldId(index, "instructions")}>
            {t("question.text")}
          </FieldLabel>
          <Textarea
            {...register(`questions.${index}.instructions`)}
            id={questionFieldId(index, "instructions")}
            aria-invalid={Boolean(errors?.instructions)}
            rows={2}
            placeholder={t("question.textPlaceholder")}
          />
          <FieldDescription>{t(`question.hints.${type}`)}</FieldDescription>
          <FormFieldError error={errors?.instructions} />
        </Field>

        {type === "noul" && (
          <div className="grid gap-3 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor={questionFieldId(index, "true")}>
                {t("question.trueMeans")}
              </FieldLabel>
              <Input
                {...register(`questions.${index}.trueDescription`)}
                id={questionFieldId(index, "true")}
                placeholder={t("question.truePlaceholder")}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor={questionFieldId(index, "false")}>
                {t("question.falseMeans")}
              </FieldLabel>
              <Input
                {...register(`questions.${index}.falseDescription`)}
                id={questionFieldId(index, "false")}
                placeholder={t("question.falsePlaceholder")}
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
