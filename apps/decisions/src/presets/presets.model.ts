import modelRouter from "./model-router.json";
import supportTicket from "./support-ticket.json";

// Starting points for the form. Each file is a /v1/systemone body without
// `model`; adding one here is all it takes to list it in the picker.
export const PRESETS = [
  { id: "support-ticket", label: "Support ticket triage", body: supportTicket },
  { id: "model-router", label: "Model router", body: modelRouter },
  {
    id: "blank",
    label: "Blank",
    body: {
      state: "",
      questions: { question_1: { type: "noul", instructions: "" } },
    },
  },
] as const;

// The form opens on the first preset; reordering PRESETS changes it.
export const DEFAULT_PRESET = PRESETS[0];
