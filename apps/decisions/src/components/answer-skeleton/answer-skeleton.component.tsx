import { TypeBadge } from "@/components/type-badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QUESTION_TYPE_STYLES } from "@/models/question-type.model";

import { ROW_WIDTHS } from "./answer-skeleton.model";
import { AnswerSkeletonProps } from "./answer-skeleton.type";
import { skeletonRows } from "./utils/skeleton-rows";

// The shape of an answer that is still being computed: the question is
// known, the numbers are not.
export const AnswerSkeleton = ({ name, question }: AnswerSkeletonProps) => {
  const rows = Array.from({ length: skeletonRows(question) }, (_, i) => i);

  return (
    <Card
      size="sm"
      aria-hidden
      className={`border-l-4 ${QUESTION_TYPE_STYLES[question.type].edge}`}>
      <CardHeader>
        <CardTitle className="font-mono">{name}</CardTitle>
        <CardDescription>{question.instructions}</CardDescription>
        <CardAction>
          <TypeBadge type={question.type} />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="skeleton-shimmer h-7 w-28 rounded-md" />
        {rows.map((row) => (
          <div key={row} className="flex items-center gap-3">
            <div className="skeleton-shimmer h-3 w-20 rounded-full" />
            <div
              className="skeleton-shimmer h-3 rounded-full"
              style={{ width: ROW_WIDTHS[row % ROW_WIDTHS.length] }}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
