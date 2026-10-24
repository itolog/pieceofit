import { RawJsonProps } from "./raw-json.type";

// A collapsed, scrollable JSON dump — the table view behind the charts.
export const RawJson = ({ label, value }: RawJsonProps) => (
  <details className="rounded-md border text-sm">
    <summary className="cursor-pointer px-3 py-2 font-medium">{label}</summary>
    <pre className="bg-muted max-h-96 overflow-auto px-3 py-2 font-mono text-xs">
      {JSON.stringify(value, null, 2)}
    </pre>
  </details>
);
