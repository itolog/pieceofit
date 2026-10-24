import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LANGUAGE_NAMES, LANGUAGES } from "@/models/language.model";
import { parseLanguage } from "@/utils/parse-language";

import { FLAG_CLASS, LANGUAGE_FLAGS } from "./language-toggle.model";

// Interface language. i18next caches the pick, so it survives reloads.
export const LanguageToggle = () => {
  const { t, i18n } = useTranslation();
  const current = parseLanguage(i18n.resolvedLanguage);
  const CurrentFlag = LANGUAGE_FLAGS[current];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon-sm"
          aria-label={t("language.label")}>
          <CurrentFlag aria-hidden className={FLAG_CLASS} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        <DropdownMenuRadioGroup
          value={current}
          onValueChange={(value) =>
            void i18n.changeLanguage(parseLanguage(value))
          }>
          {LANGUAGES.map((language) => {
            const Flag = LANGUAGE_FLAGS[language];
            return (
              <DropdownMenuRadioItem
                key={language}
                value={language}
                lang={language}>
                <Flag aria-hidden className={FLAG_CLASS} />
                {LANGUAGE_NAMES[language]}
              </DropdownMenuRadioItem>
            );
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
