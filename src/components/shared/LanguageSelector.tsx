"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
} from "@nextui-org/react";
import clsx from "clsx";
import { useTranslations, useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import useLoadingStore from "@/stores/useLoadingStore";

interface Language {
  name: string;
  localization: string;
  gradient: string;
}

interface LanguageIconIdentifierProps {
  localization: string;
  gradient: string;
}

// LanguageIconIdentifier component to display the selected language's icon
const LanguageIconIdentifier: React.FC<LanguageIconIdentifierProps> = ({
  localization,
  gradient,
}) => (
  <div
    className={clsx(
      "lg:w-7 lg:h-7 w-8 h-8 flex items-center justify-center rounded-full text-white text-xs font-medium font-sen",
      gradient
    )}
    aria-label={`Current language: ${localization.toUpperCase()}`}
  >
    {localization.toUpperCase()}
  </div>
);

export default function LanguageSelector() {
  const setLoading = useLoadingStore((state) => state.setLoading);
  const removeLoading = useLoadingStore((state) => state.removeLoading);
  const t = useTranslations("Languages");
  const locale = useLocale(); // Get the current locale using useLocale
  const router = useRouter();
  const pathname = usePathname();

  // Memoize the language options to avoid recalculating them unnecessarily
  const languages: Language[] = useMemo(
    () => [
      {
        name: t("english"),
        localization: "en",
        gradient: "bg-gradient-to-r from-[#07305E] to-[#4176A6]",
      },
      {
        name: t("spanish"),
        localization: "es",
        gradient: "bg-gradient-to-r from-[#37BBF8] to-[#18A5FF]",
      },
      {
        name: t("french"),
        localization: "fr",
        gradient: "bg-gradient-to-r from-[#A561C6] to-[#8C06B1]",
      },
      {
        name: t("arabic"),
        localization: "ar",
        gradient: "bg-gradient-to-r from-[#A3A3A3] to-[#B5B5B5]",
      },
    ],
    [t]
  );

  const currentLanguage = useMemo<Language>(() => {
    return (
      languages.find((lang) => lang.localization === locale) || languages[0]
    );
  }, [locale, languages]);

  const [selectedLanguage, setSelectedLanguage] =
    useState<Language>(currentLanguage);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const extractLocaleFromPathname = useCallback(
    (pathname: string): string => {
      const parts = pathname.split("/");
      if (
        parts.length > 1 &&
        languages.some((lang) => lang.localization === parts[1])
      ) {
        return parts[1]; // Return the locale part of the pathname
      }
      return "en"; // Fallback to English if no locale is found
    },
    [languages]
  );

  const handleLanguageChange = useCallback(
    (localization: string) => {
      const newLanguage = languages.find(
        (lang) => lang.localization === localization
      );
      const currentLocaleFromPathname = extractLocaleFromPathname(pathname);

      if (newLanguage && localization !== currentLocaleFromPathname) {
        setLoading("language-change"); // Set loading state for language change
        try {
          const newPathname = pathname.replace(
            `/${currentLocaleFromPathname}`,
            `/${localization}`
          );
          router.replace(newPathname); // Await for the route to complete
          setSelectedLanguage(newLanguage); // Update selected language
          setIsOpen(false); // Close popover
        } finally {
          removeLoading("language-change"); // Ensure loading state is removed
        }
      }
    },
    [
      pathname,
      router,
      languages,
      extractLocaleFromPathname,
      setLoading,
      removeLoading,
    ]
  );

  return (
    <Popover
      showArrow
      placement="bottom"
      offset={10}
      isOpen={isOpen}
      onOpenChange={setIsOpen}
    >
      <PopoverTrigger>
        <button
          type="button"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          className="lg:w-7 lg:h-7 w-8 h-8 px-0 bg-transparent my-auto focus:outline-none focus:border-transparent"
          aria-label={`Select language, current: ${selectedLanguage?.name}`}
        >
          <LanguageIconIdentifier
            localization={selectedLanguage.localization}
            gradient={selectedLanguage.gradient}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent className="p-1">
        <div className="flex flex-col gap-2">
          {languages.map((language) => (
            <Button
              key={language.localization}
              onClick={() => handleLanguageChange(language.localization)}
              className="flex items-center justify-start gap-2 px-3 py-2 rounded-md hover:bg-gray-100 bg-transparent"
              role="option"
              aria-selected={
                selectedLanguage.localization === language.localization
              }
            >
              <LanguageIconIdentifier
                localization={language.localization}
                gradient={language.gradient}
              />
              <span>{language.name}</span>
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
