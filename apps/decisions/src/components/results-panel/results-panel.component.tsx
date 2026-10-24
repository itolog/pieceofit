import { AlertCircle, Loader2 } from "lucide-react";
import { Trans, useTranslation } from "react-i18next";

import { AnswerCard } from "@/components/answer-card";
import { RawJson } from "@/components/raw-json";
import { RequestStats } from "@/components/request-stats";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { ResultsPanelProps } from "./results-panel.type";
import { redactImages } from "./utils/redact-images";

// What the last request produced: a placeholder, progress, an error, or one
// card per answer plus the raw JSON on both sides.
export const ResultsPanel = ({ status }: ResultsPanelProps) => {
  const { t } = useTranslation();

  if (status.kind === "idle") {
    return (
      <div className="text-muted-foreground rounded-xl border border-dashed p-8 text-center text-sm">
        <Trans i18nKey="results.idle" components={{ b: <b /> }} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {status.kind === "loading" && (
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Loader2 className="size-4 animate-spin" />
          {t("results.loading")}
        </div>
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
