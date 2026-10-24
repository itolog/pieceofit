import { AlertCircle, RefreshCw } from "lucide-react";
import { Trans, useTranslation } from "react-i18next";

import { DecisionForm } from "@/components/decision-form";
import { LanguageToggle } from "@/components/language-toggle";
import { ResultsPanel } from "@/components/results-panel";
import { ThemeToggle } from "@/components/theme-toggle";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useDecision } from "@/hooks/use-decision";
import { useModels } from "@/hooks/use-models";

import { toRequest } from "./utils/to-request";

export const App = () => {
  const { t } = useTranslation();
  const { state: models, reload } = useModels();
  const { status, run, cancel } = useDecision();

  return (
    <div className="mx-auto flex min-h-svh max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="font-heading text-xl font-semibold">
            {t("app.title")}
          </h1>
          <p className="text-muted-foreground text-sm">{t("app.subtitle")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={reload}>
            <RefreshCw /> {t("app.reloadModels")}
          </Button>
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header>

      {models.kind === "error" && (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>{t("app.ollamaUnreachable.title")}</AlertTitle>
          <AlertDescription>
            {t("app.ollamaUnreachable.description", {
              message: models.message,
            })}
          </AlertDescription>
        </Alert>
      )}
      {models.kind === "ready" && models.models.length === 0 && (
        <Alert>
          <AlertCircle />
          <AlertTitle>{t("app.noModels.title")}</AlertTitle>
          <AlertDescription>
            <Trans
              i18nKey="app.noModels.description"
              components={{ code: <code /> }}
            />
          </AlertDescription>
        </Alert>
      )}

      <main className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)]">
        {models.kind === "loading" ? (
          <p className="text-muted-foreground text-sm">
            {t("app.loadingModels")}
          </p>
        ) : (
          <DecisionForm
            models={models.kind === "ready" ? models.models : []}
            busy={status.kind === "loading"}
            onSubmit={(values) => void run(toRequest(values))}
            onCancel={cancel}
          />
        )}
        <aside className="flex flex-col gap-3 lg:sticky lg:top-6">
          <h2 className="font-heading text-base font-medium">
            {t("app.answers")}
          </h2>
          <ResultsPanel status={status} />
        </aside>
      </main>
    </div>
  );
};
