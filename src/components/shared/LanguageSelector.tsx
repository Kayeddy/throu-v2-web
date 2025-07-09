"use client";

import { useState, useMemo, useCallback } from "react";
import { Popover, PopoverTrigger, PopoverContent, Button } from "@heroui/react";
import clsx from "clsx";
import { useTranslations, useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import useLoadingStore from "@/stores/useLoadingStore";
import { AnimatePresence, motion } from "framer-motion";
import { useReownTheme } from "@/contexts/reown-theme-context";

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
  const { updateReownLanguage } = useReownTheme();
  const t = useTranslations("Languages");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

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
        return parts[1];
      }
      return "en";
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
        setLoading("language-change");
        try {
          // Update Reown language immediately
          updateReownLanguage(localization);

          const newPathname = pathname.replace(
            `/${currentLocaleFromPathname}`,
            `/${localization}`
          );
          router.replace(newPathname);
          setSelectedLanguage(newLanguage);
          setIsOpen(false);
        } finally {
          removeLoading("language-change");
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
      updateReownLanguage,
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
          className="my-auto h-8 w-8 bg-transparent px-0 focus:border-transparent focus:outline-none lg:h-7 lg:w-7"
          aria-label={`Select language, current: ${selectedLanguage?.name}`}
        >
          <LanguageIconIdentifier
            localization={selectedLanguage.localization}
            gradient={selectedLanguage.gradient}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent className="bg-transparent p-0">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex h-full w-full flex-col gap-2 overflow-hidden rounded-lg bg-light/50 p-1 backdrop-blur-xl transition-all ease-in-out dark:bg-dark/50"
          >
            {languages.map((language, index) => (
              <motion.div
                key={language.localization}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <Button
                  onClick={() => handleLanguageChange(language.localization)}
                  className="flex w-full items-center justify-start gap-2 rounded-md bg-transparent px-3 py-2"
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
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </PopoverContent>
    </Popover>
  );
}
