import commentModeration from "./comment-moderation.json";
import messageTone from "./message-tone.json";
import modelRouter from "./model-router.json";
import phishingEmail from "./phishing-email.json";
import productReview from "./product-review.json";
import supportTicket from "./support-ticket.json";

// Starting points for the form. Each file is a /v1/systemone body without
// `model`; adding one here is all it takes to list it in the picker.
export const PRESETS = [
  {
    id: "support-ticket",
    labelKey: "presets.supportTicket",
    body: supportTicket,
  },
  { id: "message-tone", labelKey: "presets.messageTone", body: messageTone },
  {
    id: "comment-moderation",
    labelKey: "presets.commentModeration",
    body: commentModeration,
  },
  {
    id: "product-review",
    labelKey: "presets.productReview",
    body: productReview,
  },
  {
    id: "phishing-email",
    labelKey: "presets.phishingEmail",
    body: phishingEmail,
  },
  { id: "model-router", labelKey: "presets.modelRouter", body: modelRouter },
  {
    id: "blank",
    labelKey: "presets.blank",
    body: {
      state: "",
      questions: { question_1: { type: "noul", instructions: "" } },
    },
  },
] as const;

// The form opens on the first preset; reordering PRESETS changes it.
export const DEFAULT_PRESET = PRESETS[0];
