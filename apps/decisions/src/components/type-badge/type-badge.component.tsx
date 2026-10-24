import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/badge";
import { QUESTION_TYPE_STYLES } from "@/models/question-type.model";

import { TypeBadgeProps } from "./type-badge.type";

// A question type's colour dot with its name, so the colour never has to be
// read on its own.
export const TypeBadge = ({ type }: TypeBadgeProps) => {
  const { t } = useTranslation();
  return (
    <Badge variant="outline" className="gap-1.5">
      <span
        aria-hidden
        className={`size-2 rounded-full ${QUESTION_TYPE_STYLES[type].dot}`}
      />
      {t(`question.types.${type}`)}
    </Badge>
  );
};
