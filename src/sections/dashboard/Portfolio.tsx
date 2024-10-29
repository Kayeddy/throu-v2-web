"use client";

import { ProjectAttributeBox } from "@/components/ui/project-attributes-boxes-container";
import useGetInvestorInfo from "@/utils/hooks/smart_contracts/useGetInvestorInfo";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

export default function Portfolio({
  project,
}: {
  project?: ProjectDetails | null;
}) {
  const t = useTranslations("Dashboard");

  // Fetch investor information
  const { userInvestmentData, error, isPending } = useGetInvestorInfo();

  // Ensure project and user investment data exist before rendering any content
  if (!project || !userInvestmentData || isPending || error) {
    return (
      <div className="flex h-full items-center justify-center">
        {isPending ? (
          <p>Loading...</p>
        ) : (
          <p className="text-danger">{error && "Error loading data"}</p>
        )}
      </div>
    );
  }

  const tokensCountValue =
    userInvestmentData && typeof userInvestmentData[0] === "bigint"
      ? Number(userInvestmentData[0])
      : 0;

  // Define investor portfolio attributes
  const investorPortFolioAttributes = {
    projectCount: {
      label: t("attributes.projectsCount"),
      value: project ? 1 : 0,
    },
    tokensCount: {
      label: t("attributes.tokensCount"),
      value: tokensCountValue,
    },
    fiatInvestmentAmount: {
      label: t("attributes.fiatInvestmentAmount"),
      value: 0,
    },
    returnOnInvestment: {
      label: t("attributes.returnOnInvestment"),
      value: 0,
    },
  };

  // Render Portfolio content
  return (
    <div className="mt-6 w-full">
      <div className="flex flex-col items-start justify-start gap-6">
        <h1 className="font-sen text-2xl font-bold text-primary dark:text-light">
          {t("tabs.portfolio.desktopTitle")}
        </h1>
        <div className="flex flex-row items-center justify-start gap-6">
          {Object.entries(investorPortFolioAttributes).map(
            ([key, attribute]) => (
              <div
                key={key}
                className="flex h-fit w-fit items-center justify-center"
              >
                <ProjectAttributeBox
                  name={attribute.label}
                  value={attribute.value}
                  isTranslucent
                  size="xl"
                />
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}