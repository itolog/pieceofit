// Named after Nivo's bar tooltip props, so the component can be passed to
// `tooltip` as is.
export type ProbabilityTooltipProps = {
  /** The hovered option or level. */
  indexValue: string | number;
  /** Its probability, 0..1. */
  value: number;
  /** The bar's colour, shown as a short line key. */
  color: string;
};
