import { AnswerRow } from "@/types/answer-row.type";

import {
  CHAR_WIDTH,
  MAX_LABEL_WIDTH,
  MIN_LABEL_WIDTH,
} from "./label-width.model";

// Left margin that fits the longest category label at 12px, within bounds.
export const labelWidth = (rows: AnswerRow[]): number =>
  Math.min(
    MAX_LABEL_WIDTH,
    Math.max(
      MIN_LABEL_WIDTH,
      Math.max(...rows.map((row) => row.label.length)) * CHAR_WIDTH + 12,
    ),
  );
