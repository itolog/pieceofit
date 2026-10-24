import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LANGUAGE_NAMES, LANGUAGES, parseLanguage } from "@/services/i18n";

// Interface language. i18next caches the pick, so it survives reloads.
export const LanguageToggle = () => {
  const { t, i18n } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon-sm"
          aria-label={t("language.label")}>
          <Languages />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={parseLanguage(i18n.resolvedLanguage)}
          onValueChange={(value) =>
            void i18n.changeLanguage(parseLanguage(value))
          }>
          {LANGUAGES.map((language) => (
            <DropdownMenuRadioItem
              key={language}
              value={language}
              lang={language}>
              {LANGUAGE_NAMES[language]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
