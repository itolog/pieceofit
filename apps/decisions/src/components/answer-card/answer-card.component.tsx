import { useTranslation } from "react-i18next";

import { ProbabilityChart } from "@/components/probability-chart";
import { TypeBadge } from "@/components/type-badge";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { QUESTION_TYPE_STYLES } from "@/models/question-type.model";
import { formatDecimal } from "@/utils/format-decimal";
import { formatPercent } from "@/utils/format-percent";

import { AnswerCardProps } from "./answer-card.type";
import { answerHeadline } from "./utils/answer-headline";
import { toRows } from "./utils/to-rows";

// One question's answer: the headline result, then a meter for yes/no (a
// single ratio) or a bar per option / level for choice and score.
export const AnswerCard = ({ name, answer, instructions }: AnswerCardProps) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const labels = { yes: t("answer.yes"), no: t("answer.no"), locale };

  return (
    <Card
      size="sm"
      className={`border-l-4 ${QUESTION_TYPE_STYLES[answer.type].edge}`}>
      <CardHeader>
        <CardTitle className="font-mono">{name}</CardTitle>
        {instructions && <CardDescription>{instructions}</CardDescription>}
        <CardAction className="flex gap-1">
          <TypeBadge type={answer.type} />
          {answer.type !== "noul" && (
            <Badge variant="outline" title={t("answer.confidenceHint")}>
              {t("answer.confidence", {
                value: formatDecimal(answer.confidence, 2, locale),
              })}
            </Badge>
          )}
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p
          className={`text-3xl font-bold tracking-tight ${
            // A chosen option is an identifier the API returns, not a word.
            answer.type === "choice" ? "font-mono" : "font-heading"
          }`}>
          {answerHeadline(answer, labels)}
        </p>
        {answer.type === "noul" ? (
          <div className="flex items-center gap-3 text-sm">
            <span className="text-muted-foreground">{t("answer.pYes")}</span>
            <Progress
              value={answer.noul * 100}
              aria-label={t("answer.pYesLabel")}
              className="flex-1"
            />
            <span className="font-mono text-xs tabular-nums">
              {formatPercent(answer.noul, locale)}
            </span>
          </div>
        ) : (
          <ProbabilityChart
            rows={toRows(answer, labels)}
            identifiers={answer.type === "choice"}
            label={t(
              answer.type === "choice"
                ? "answer.chartLabelChoice"
                : "answer.chartLabelScore",
              { name },
            )}
          />
        )}
      </CardContent>
    </Card>
  );
};
