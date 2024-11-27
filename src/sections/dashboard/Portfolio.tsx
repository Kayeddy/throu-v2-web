"use client";

import { Carousel } from "@/components/ui/cards-carousel";
import { ProjectAttributeBox } from "@/components/ui/project-attributes-boxes-container";
import UserProjectDashboardCard from "@/components/ui/user-projects-dashboard-card";
import useGetInvestorInfo from "@/utils/hooks/smart_contracts/useGetInvestorInfo";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

export default function Portfolio({
  project,
  userInvestmentData,
}: {
  project?: ProjectDetails | null;
  userInvestmentData: any;
}) {
  const t = useTranslations("Dashboard");

  const tokensCountValue =
    userInvestmentData && typeof userInvestmentData[0] === "bigint"
      ? Number(userInvestmentData[0])
      : 0;

  const projectsCount = project && tokensCountValue > 0 ? 1 : 0;

  const ownershipPercentage = project?.projectTotalSupply
    ? ((tokensCountValue / Number(project?.projectTotalSupply)) * 100).toFixed(
        1
      )
    : "0";

  // Define investor portfolio attributes
  const investorPortFolioAttributes = {
    projectCount: {
      label: t("attributes.projectsCount"),
      value: projectsCount, //TODO: Update this to reflect real amount of projects user has invested in
    },
    tokensCount: {
      label: t("attributes.tokensCount"),
      value: tokensCountValue,
    },
    fiatInvestmentAmount: {
      label: t("attributes.fiatInvestmentAmount"),
      value: tokensCountValue * Number(project?.projectPrice),
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
        <div className="mx-auto grid grid-cols-2 items-center justify-center gap-6 lg:mx-0 lg:flex lg:flex-row lg:flex-wrap lg:justify-start">
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
                  internationalized
                />
              </div>
            )
          )}
        </div>
        <Carousel
          showPagination={false}
          removePaddings
          items={[
            <UserProjectDashboardCard
              projectName={project?.projectURI?.name ?? ""}
              userTokenCount={tokensCountValue}
              userOwnershipPercentage={ownershipPercentage}
              projectTokenPrice={project?.projectPrice ?? 0}
            />,
          ]}
        />
      </div>
    </div>
  );
}
