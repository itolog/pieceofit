import { StatTileProps } from "./stat-tile.type";

// One figure of a summary row: a quiet label above a bold value.
export const StatTile = ({
  icon: Icon,
  label,
  value,
  detail,
}: StatTileProps) => (
  <div className="flex min-w-0 flex-col gap-1">
    <dt className="text-muted-foreground flex items-center gap-1.5 text-xs">
      <Icon aria-hidden className="text-primary size-3.5 shrink-0" />
      {label}
    </dt>
    <dd className="truncate text-lg leading-tight font-semibold">{value}</dd>
    {detail && (
      <dd className="text-muted-foreground truncate text-xs">{detail}</dd>
    )}
  </div>
);
