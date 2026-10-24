import { useTranslation } from "react-i18next";

import { RequestStatsProps } from "./request-stats.type";

// Time and token counts of a finished request. Output tokens show only when
// non-zero: decision models read probabilities instead of generating, so
// they report 0.
export const RequestStats = ({ result }: RequestStatsProps) => {
  const { t } = useTranslation();
  const { usage } = result.response;
  const elapsed = t("results.elapsed", { ms: Math.round(result.elapsedMs) });
  const tokens =
    usage &&
    (usage.output_tokens > 0
      ? t("results.tokensInOut", {
          input: usage.input_tokens,
          output: usage.output_tokens,
        })
      : t("results.tokens", { count: usage.input_tokens }));

  return (
    <p className="text-muted-foreground text-xs">
      {tokens ? `${elapsed} · ${tokens}` : elapsed}
    </p>
  );
};
