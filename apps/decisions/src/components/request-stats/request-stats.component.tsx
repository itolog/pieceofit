import { Clock, Cpu, ListChecks, Type } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Duration } from "@/components/duration";
import { StatTile } from "@/components/stat-tile";
import { formatDecimal } from "@/utils/format-decimal";

import { RequestStatsProps } from "./request-stats.type";

// A finished request at a glance: how long it took, how much the model read,
// how many questions it answered and which model did it. Output tokens show
// only when non-zero: decision models read probabilities instead of
// generating, so they report 0.
export const RequestStats = ({ result }: RequestStatsProps) => {
  const { t, i18n } = useTranslation();
  const { usage, answers, model } = result.response;
  const count = (value: number) => formatDecimal(value, 0, i18n.language);

  return (
    <dl className="bg-card ring-foreground/10 grid grid-cols-2 gap-x-4 gap-y-3 rounded-xl p-3 shadow-sm ring-1 sm:grid-cols-4">
      <StatTile
        icon={Clock}
        label={t("stats.time")}
        value={<Duration ms={result.elapsedMs} />}
      />
      <StatTile
        icon={Type}
        label={t("stats.tokens")}
        value={usage ? count(usage.input_tokens) : "—"}
        detail={
          usage && usage.output_tokens > 0
            ? t("stats.tokensInOut", {
                input: count(usage.input_tokens),
                output: count(usage.output_tokens),
              })
            : t("stats.tokensRead")
        }
      />
      <StatTile
        icon={ListChecks}
        label={t("stats.questions")}
        value={count(Object.keys(answers).length)}
      />
      <StatTile
        icon={Cpu}
        label={t("stats.model")}
        value={<span className="font-mono text-base">{model}</span>}
      />
    </dl>
  );
};
