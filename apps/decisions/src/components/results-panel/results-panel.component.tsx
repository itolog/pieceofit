import { AlertCircle, Loader2 } from "lucide-react";

import { AnswerCard } from "@/components/answer-card";
import { RawJson } from "@/components/raw-json";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { ResultsPanelProps } from "./results-panel.type";
import { redactImages } from "./utils/redact-images";

// What the last request produced: a placeholder, progress, an error, or one
// card per answer plus the raw JSON on both sides.
export const ResultsPanel = ({ status, stats }: ResultsPanelProps) => {
  if (status.kind === "idle") {
    return (
      <div className="text-muted-foreground rounded-xl border border-dashed p-8 text-center text-sm">
        Fill in the state and questions, then press <b>Decide</b>.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {status.kind === "loading" && (
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Loader2 className="size-4 animate-spin" />
          Deciding… the first request also loads the model.
        </div>
      )}
      {status.kind === "error" && (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>Request failed</AlertTitle>
          <AlertDescription>{status.message}</AlertDescription>
        </Alert>
      )}
      {status.kind === "done" && (
        <>
          {stats && <p className="text-muted-foreground text-xs">{stats}</p>}
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
      <RawJson label="Request" value={redactImages(status.request)} />
      {status.kind === "done" && (
        <RawJson label="Response" value={status.result.response} />
      )}
    </div>
  );
};
