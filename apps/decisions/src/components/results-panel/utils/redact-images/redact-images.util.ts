import { DecisionRequest } from "@/types/decision.type";

// Base64 images would flood the raw-JSON view; show their size instead.
export const redactImages = (request: DecisionRequest): DecisionRequest =>
  request.images
    ? {
        ...request,
        images: request.images.map(
          (data) => `<base64, ${Math.round((data.length * 3) / 4 / 1024)} KB>`,
        ),
      }
    : request;
