"use client";

import { useTranslations } from "next-intl";

export default function Movements() {
  const t = useTranslations("Dashboard.tabs.movements"); // Use the movements namespace for translations

  return (
    <div className="mt-6 w-full">
      <div className="flex flex-col items-start justify-start">
        <h1 className="font-sen text-2xl font-bold text-primary dark:text-light">
          {t("desktopTitle")} {/* Display the translated title */}
        </h1>
      </div>
    </div>
  );
}
