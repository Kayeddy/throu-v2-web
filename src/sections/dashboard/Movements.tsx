"use client";

import { useTranslations } from "next-intl";
import { useWalletConnection } from "@/hooks/blockchain";

export default function Movements() {
  const t = useTranslations("Dashboard.tabs.movements");
  const tDashboard = useTranslations("Dashboard");
  const { isConnected } = useWalletConnection();

  // If wallet is not connected, show connect wallet message
  if (!isConnected) {
    return (
      <div className="mt-6 w-full">
        <div className="flex flex-col items-start justify-start gap-6">
          <h1 className="font-sen text-2xl font-bold text-primary dark:text-light">
            {t("desktopTitle")}
          </h1>
          <div className="flex items-center justify-center py-16 w-full">
            <div className="text-center">
              <p className="text-lg text-minimal mb-4">{tDashboard("connectWalletMessage")}</p>
              <w3m-button />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 w-full">
      <div className="flex flex-col items-start justify-start gap-6">
        <h1 className="font-sen text-2xl font-bold text-primary dark:text-light">
          {t("desktopTitle")}
        </h1>
        <p>{t("noDataMessage")}</p>
      </div>
    </div>
  );
}
