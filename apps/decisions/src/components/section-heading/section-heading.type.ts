import { ReactNode } from "react";

export type SectionHeadingProps = {
  /** Position in the flow: input → questions → answers. */
  step: number;
  title: string;
  /** Right-aligned extras: a counter, an action button. */
  children?: ReactNode;
};
