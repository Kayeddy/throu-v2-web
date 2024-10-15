"use client";

import { useTranslations } from "next-intl";

export default function Saved() {
  const t = useTranslations("Dashboard.saved"); // Use the saved namespace for translations

  return (
    <div className="mt-6 w-full">
      <div className="flex flex-col items-start justify-start">
        <h1 className="font-sen text-2xl font-bold text-primary dark:text-light">
          {t("title")} {/* Display the saved title */}
        </h1>
      </div>
    </div>
  );
}
