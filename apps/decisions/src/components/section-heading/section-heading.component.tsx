import { SectionHeadingProps } from "./section-heading.type";

// A numbered heading, so the page reads as three steps rather than one long
// column.
export const SectionHeading = ({
  step,
  title,
  children,
}: SectionHeadingProps) => (
  <div className="flex items-center gap-3">
    <span className="bg-primary text-primary-foreground grid size-6 shrink-0 place-items-center rounded-full text-xs font-semibold">
      {step}
    </span>
    <h2 className="font-heading text-base font-semibold">{title}</h2>
    {children && (
      <div className="ml-auto flex items-center gap-2">{children}</div>
    )}
  </div>
);
