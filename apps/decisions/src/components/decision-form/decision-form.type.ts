import { DecisionModel } from "@/services/ollama";
import { DecisionFormValues } from "@/types/decision-form.type";

export type DecisionFormProps = {
  models: DecisionModel[];
  busy: boolean;
  onSubmit: (values: DecisionFormValues) => void;
  onCancel: () => void;
};
