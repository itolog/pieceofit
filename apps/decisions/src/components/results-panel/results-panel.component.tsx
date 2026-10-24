import { AlertCircle, ChartBar } from "lucide-react";
import { Trans, useTranslation } from "react-i18next";

import { AnswerCard } from "@/components/answer-card";
import { AnswerSkeleton } from "@/components/answer-skeleton";
import { RawJson } from "@/components/raw-json";
import { RequestStats } from "@/components/request-stats";
import { ThinkingIndicator } from "@/components/thinking-indicator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { ResultsPanelProps } from "./results-panel.type";
import { redactImages } from "./utils/redact-images";

// What the last request produced: a placeholder, progress, an error, or one
// card per answer plus the raw JSON on both sides.
export const ResultsPanel = ({ status }: ResultsPanelProps) => {
  const { t } = useTranslation();

  if (status.kind === "idle") {
    return (
      <div className="text-muted-foreground bg-card/60 flex flex-col items-center gap-3 rounded-xl border-2 border-dashed p-8 text-center text-sm">
        <span className="bg-accent text-accent-foreground grid size-10 place-items-center rounded-full">
          <ChartBar className="size-5" />
        </span>
        <p>
          <Trans i18nKey="results.idle" components={{ b: <b /> }} />
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {status.kind === "loading" && (
        <>
          <ThinkingIndicator model={status.request.model} />
          {Object.entries(status.request.questions).map(([name, question]) => (
            <AnswerSkeleton key={name} name={name} question={question} />
          ))}
        </>
      )}
      {status.kind === "error" && (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>{t("results.failed")}</AlertTitle>
          <AlertDescription>
            <p>{status.message}</p>
            {status.modelMissing && (
              <code>
                {t("results.pullHint", { model: status.request.model })}
              </code>
            )}
          </AlertDescription>
        </Alert>
      )}
      {status.kind === "done" && (
        <>
          <RequestStats result={status.result} />
          {Object.entries(status.result.response.answers).map(
            ([name, answer]) => (
              <AnswerCard
                key={name}
                name={name}
                answer={answer}
                instructions={status.request.questions[name]?.instructions}
              />
            ),
          )}
        </>
      )}
      <RawJson
        label={t("results.request")}
        value={redactImages(status.request)}
      />
      {status.kind === "done" && (
        <RawJson label={t("results.response")} value={status.result.response} />
      )}
    </div>
  );
};
