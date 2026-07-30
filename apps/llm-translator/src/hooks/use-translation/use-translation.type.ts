import { RefObject } from "react";

import { Message } from "@/types/message.type";

export interface UseTranslationOptions {
  fromLang: string;
  toLang: string;
  /**
   * Set by useModel's startup/verify flow: `true` usable, `false` the active
   * model is not pulled in Ollama, `null` not (or no longer) known.
   */
  modelAvailableRef: RefObject<boolean | null>;
  /**
   * Re-runs useModel's availability check: updates `modelAvailableRef`, tells
   * the user what it found, and resolves to whether translation can go ahead.
   * Called before refusing a blocked submit.
   */
  verifyModel: () => Promise<boolean>;
  addMessage: (role: "You" | "Bot", text: string) => void;
  appendMessage: (message: Message) => void;
  updateMessage: (id: string, text: string) => void;
}
