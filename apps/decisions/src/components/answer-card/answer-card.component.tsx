import { ProbabilityChart } from "@/components/probability-chart";
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
import { formatPercent } from "@/utils/format-percent";

import { AnswerCardProps } from "./answer-card.type";
import { answerHeadline } from "./utils/answer-headline";
import { toRows } from "./utils/to-rows";

// One question's answer: the headline result, then a meter for yes/no (a
// single ratio) or a bar per option / level for choice and score.
export const AnswerCard = ({ name, answer, instructions }: AnswerCardProps) => {
  const headline = answerHeadline(answer);

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="font-mono">{name}</CardTitle>
        {instructions && <CardDescription>{instructions}</CardDescription>}
        <CardAction className="flex gap-1">
          <Badge variant="secondary">{answer.type}</Badge>
          {answer.type !== "noul" && (
            <Badge
              variant="outline"
              title="How concentrated the probabilities are">
              conf {answer.confidence.toFixed(2)}
            </Badge>
          )}
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="font-heading text-2xl font-semibold">{headline}</p>
        {answer.type === "noul" ? (
          <div className="flex items-center gap-3 text-sm">
            <span className="text-muted-foreground">P(yes)</span>
            <Progress
              value={answer.noul * 100}
              aria-label="Probability of yes"
              className="flex-1"
            />
            <span className="font-mono text-xs tabular-nums">
              {formatPercent(answer.noul)}
            </span>
          </div>
        ) : (
          <ProbabilityChart
            rows={toRows(answer)}
            label={`${name}: probability of each ${answer.type === "choice" ? "option" : "level"}`}
          />
        )}
      </CardContent>
    </Card>
  );
};
