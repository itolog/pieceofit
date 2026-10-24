import { useTranslation } from "react-i18next";

import { DurationProps } from "./duration.type";
import { formatDuration } from "./utils/format-duration";

// A duration as a person reads it ("3,7 с", "1 хв і 5 с"), never raw ms.
// `dateTime` stays a machine-readable ISO 8601 duration, independent of the
// locale, so it is built with toFixed rather than Intl.
export const Duration = ({ ms }: DurationProps) => {
  const { i18n } = useTranslation();
  return (
    <time dateTime={`PT${(ms / 1000).toFixed(1)}S`}>
      {formatDuration(ms, i18n.language)}
    </time>
  );
};
