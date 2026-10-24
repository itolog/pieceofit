// The subset of Nivo's custom-layer props this layer reads, so the component
// can be listed in `layers` as is.
export type BarValueLabelsProps = {
  /** Positions of horizontal bars, as Nivo computes them. */
  bars: readonly {
    key: string;
    x: number;
    y: number;
    width: number;
    height: number;
    data: { value: number | null };
  }[];
};
