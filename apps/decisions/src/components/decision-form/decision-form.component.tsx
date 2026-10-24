import { useEffect, useEffectEvent, useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Loader2, Plus, X } from "lucide-react";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import { useTranslation } from "react-i18next";

import { FormFieldError } from "@/components/form-field-error";
import { QuestionCard } from "@/components/question-card";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MAX_QUESTIONS } from "@/models/decision.model";
import { DEFAULT_PRESET, PRESETS } from "@/presets/presets.model";
import { decisionFormSchema } from "@/schemas/decision-form.schema";
import { DecisionFormValues } from "@/types/decision-form.type";

import { ACCEPTED_IMAGE_TYPES, EMPTY_QUESTION } from "./decision-form.model";
import { DecisionFormProps } from "./decision-form.type";
import { fileToImage } from "./utils/file-to-image";
import { fromPreset } from "./utils/from-preset";
import { nextQuestionName } from "./utils/next-question-name";

// State, images and questions for one /v1/systemone call. Starts from a
// preset; everything is editable.
export const DecisionForm = ({
  models,
  busy,
  onSubmit,
  onCancel,
}: DecisionFormProps) => {
  const { t } = useTranslation();
  // useForm reads defaultValues only on mount; the lazy initializer keeps the
  // preset from being re-parsed on every render.
  const [defaultValues] = useState(() =>
    fromPreset(DEFAULT_PRESET.body, models[0]?.name ?? ""),
  );
  const form = useForm<DecisionFormValues>({
    resolver: zodResolver(decisionFormSchema),
    defaultValues,
  });
  const { control, register, formState, getValues, setValue, reset } = form;
  const questions = useFieldArray({ control, name: "questions" });
  const images = useFieldArray({ control, name: "images" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const modelName = useWatch({ control, name: "model" });
  const selectedModel = models.find((model) => model.name === modelName);

  // Keep the selection valid when the model list changes (first load,
  // reload after `ollama pull`).
  useEffect(() => {
    if (!models.some((model) => model.name === getValues("model"))) {
      setValue("model", models[0]?.name ?? "");
    }
  }, [models, getValues, setValue]);

  const loadPreset = (id: string) => {
    const preset = PRESETS.find((item) => item.id === id);
    if (preset) reset(fromPreset(preset.body, getValues("model")));
  };

  const addImages = async (files: FileList | null) => {
    if (!files) return;
    const picked = await Promise.all([...files].map(fileToImage));
    images.append(picked);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const submit = form.handleSubmit(onSubmit);

  // ⌘/Ctrl + Enter submits from anywhere on the page.
  const onShortcut = useEffectEvent((event: KeyboardEvent) => {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      void submit();
    }
  });
  useEffect(() => {
    window.addEventListener("keydown", onShortcut);
    return () => window.removeEventListener("keydown", onShortcut);
  }, []);

  return (
    <FormProvider {...form}>
      <form
        className="flex flex-col gap-6"
        noValidate
        onSubmit={(event) => void submit(event)}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="preset">{t("form.preset")}</FieldLabel>
            <Select defaultValue={DEFAULT_PRESET.id} onValueChange={loadPreset}>
              <SelectTrigger id="preset" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRESETS.map((preset) => (
                  <SelectItem key={preset.id} value={preset.id}>
                    {t(preset.labelKey)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldDescription>{t("form.presetHint")}</FieldDescription>
          </Field>
          <Controller
            control={control}
            name="model"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="model">{t("form.model")}</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    id="model"
                    className="w-full font-mono"
                    aria-invalid={fieldState.invalid}>
                    <SelectValue placeholder={t("form.noModels")} />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((model) => (
                      <SelectItem
                        key={model.name}
                        value={model.name}
                        className="font-mono">
                        {model.name}
                        {model.vision && (
                          <span className="text-muted-foreground font-sans text-xs">
                            {t("form.vision")}
                          </span>
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormFieldError error={fieldState.error} />
              </Field>
            )}
          />
        </div>

        <Field data-invalid={Boolean(formState.errors.state)}>
          <FieldLabel htmlFor="state">{t("form.state")}</FieldLabel>
          <Textarea
            {...register("state")}
            id="state"
            rows={5}
            aria-invalid={Boolean(formState.errors.state)}
            placeholder={t("form.statePlaceholder")}
            className="font-mono text-sm"
          />
          <FieldDescription>{t("form.stateHint")}</FieldDescription>
          <FormFieldError error={formState.errors.state} />
        </Field>

        <Field>
          <FieldLabel>{t("form.images")}</FieldLabel>
          <div className="flex flex-wrap items-center gap-2">
            {images.fields.map((image, index) => (
              <div
                key={image.id}
                className="group relative size-20 overflow-hidden rounded-md border">
                <img
                  src={`data:${image.mimeType};base64,${image.data}`}
                  alt={image.name}
                  className="size-full object-cover"
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="icon-xs"
                  className="absolute top-1 right-1"
                  aria-label={t("form.removeImage", { name: image.name })}
                  onClick={() => images.remove(index)}>
                  <X />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              disabled={!selectedModel?.vision}
              onClick={() => fileInputRef.current?.click()}>
              <ImagePlus /> {t("form.addImages")}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_IMAGE_TYPES.join(",")}
              multiple
              hidden
              onChange={(event) => void addImages(event.target.files)}
            />
          </div>
          <FieldDescription>
            {selectedModel?.vision
              ? t("form.imagesHint")
              : t("form.imagesUnsupported")}
          </FieldDescription>
        </Field>

        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-base font-medium">
              {t("form.questions")}{" "}
              <span className="text-muted-foreground font-normal">
                {questions.fields.length}/{MAX_QUESTIONS}
              </span>
            </h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={questions.fields.length >= MAX_QUESTIONS}
              onClick={() =>
                questions.append({
                  ...EMPTY_QUESTION,
                  name: nextQuestionName(
                    getValues("questions").map((question) => question.name),
                  ),
                })
              }>
              <Plus /> {t("form.addQuestion")}
            </Button>
          </div>
          {questions.fields.map((question, index) => (
            <QuestionCard
              key={question.id}
              index={index}
              canRemove={questions.fields.length > 1}
              onRemove={() => questions.remove(index)}
            />
          ))}
          <FormFieldError error={formState.errors.questions?.root} />
        </section>

        <div className="bg-background/80 sticky bottom-0 flex items-center gap-2 border-t py-3 backdrop-blur">
          <Button type="submit" disabled={busy || models.length === 0}>
            {busy && <Loader2 className="animate-spin" />}
            {t("form.decide")}
          </Button>
          {busy && (
            <Button type="button" variant="outline" onClick={onCancel}>
              {t("form.cancel")}
            </Button>
          )}
          <span className="text-muted-foreground ml-auto text-xs">
            ⌘/Ctrl + Enter
          </span>
        </div>
      </form>
    </FormProvider>
  );
};
