import { DecideResult } from "@/services/ollama";

// One-line request summary. Output tokens are shown only when non-zero:
// decision models such as d3 read probabilities instead of generating, so
// they report 0.
export const formatStats = ({ response, elapsedMs }: DecideResult): string => {
  const parts = [`${Math.round(elapsedMs)} ms`];
  if (response.usage) {
    const { input_tokens: input, output_tokens: output } = response.usage;
    parts.push(
      output > 0 ? `${input} in / ${output} out tokens` : `${input} tokens`,
    );
  }
  return parts.join(" · ");
};
