import commentModerationEn from "./en/comment-moderation.json";
import messageToneEn from "./en/message-tone.json";
import modelRouterEn from "./en/model-router.json";
import phishingEmailEn from "./en/phishing-email.json";
import productReviewEn from "./en/product-review.json";
import supportTicketEn from "./en/support-ticket.json";
import commentModerationUk from "./uk/comment-moderation.json";
import messageToneUk from "./uk/message-tone.json";
import modelRouterUk from "./uk/model-router.json";
import phishingEmailUk from "./uk/phishing-email.json";
import productReviewUk from "./uk/product-review.json";
import supportTicketUk from "./uk/support-ticket.json";

// Nothing to translate: one body serves every language.
const BLANK_BODY = {
  state: "",
  questions: { question_1: { type: "noul", instructions: "" } },
};

// Starting points for the form, one body per interface language. A body is
// a /v1/systemone request without `model`. Translations change the text
// (state, instructions, descriptions, levels) but never the structure:
// question keys, types and option names are identifiers the API returns,
// and a unit test holds every language to the English shape.
export const PRESETS = [
  {
    id: "support-ticket",
    labelKey: "presets.supportTicket",
    bodies: { en: supportTicketEn, uk: supportTicketUk },
  },
  {
    id: "message-tone",
    labelKey: "presets.messageTone",
    bodies: { en: messageToneEn, uk: messageToneUk },
  },
  {
    id: "comment-moderation",
    labelKey: "presets.commentModeration",
    bodies: { en: commentModerationEn, uk: commentModerationUk },
  },
  {
    id: "product-review",
    labelKey: "presets.productReview",
    bodies: { en: productReviewEn, uk: productReviewUk },
  },
  {
    id: "phishing-email",
    labelKey: "presets.phishingEmail",
    bodies: { en: phishingEmailEn, uk: phishingEmailUk },
  },
  {
    id: "model-router",
    labelKey: "presets.modelRouter",
    bodies: { en: modelRouterEn, uk: modelRouterUk },
  },
  {
    id: "blank",
    labelKey: "presets.blank",
    bodies: { en: BLANK_BODY, uk: BLANK_BODY },
  },
] as const;

// The form opens on the first preset; reordering PRESETS changes it.
export const DEFAULT_PRESET = PRESETS[0];
