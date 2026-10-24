import { ReactNode } from "react";

import { LucideIcon } from "lucide-react";

export type StatTileProps = {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
  /** Secondary detail under the value, e.g. a breakdown. */
  detail?: string;
};
