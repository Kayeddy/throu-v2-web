"use client";

import { BlurImage } from "@/components/ui/blur-image";
import { Image } from "@nextui-org/react";
import { useTranslations } from "next-intl";

type UpdateFormat = {
  title: string;
  description: string;
  date: string;
};

const ProjectUpdateContainer = ({
  updateDetails,
}: {
  updateDetails: UpdateFormat;
}) => {
  const t = useTranslations(
    "Marketplace.project.projectDetails.projectUpdatesTab"
  );

  return (
    <div className="flex w-full flex-col items-start justify-start gap-4 rounded-lg bg-transparent lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-row items-center gap-4">
        <BlurImage
          alt="Throu-logo-sm"
          width={50}
          height={50}
          src="/assets/shared/logo_sm.png"
          className="object-cover"
        />
        <div className="flex flex-col items-start justify-start">
          <h2 className="font-sen text-lg font-bold text-secondary">
            {t(`updates.${updateDetails.title}`)}
          </h2>
          <p className="font-jakarta text-base text-primary dark:text-light">
            {t(`updates.${updateDetails.description}`)}
          </p>
        </div>
      </div>
      <span className="ml-auto">
        <p className="text-right font-jakarta text-sm font-semibold text-primary dark:text-light">
          {t(`updates.${updateDetails.date}`)}
        </p>
      </span>
    </div>
  );
};

export default function ProjectUpdatesTab() {
  const projectUpdates = [
    {
      title: "salonPradoReadyForInvestment",
      description: "participateAndBecomePartner",
      date: "June 21 - 2021",
    },
  ];

  return (
    <div className="flex w-full flex-col items-start justify-start gap-2">
      {projectUpdates.map((update, index) => (
        <div key={`project-update-${index}`} className="w-full">
          <ProjectUpdateContainer updateDetails={update} />
        </div>
      ))}
    </div>
  );
}
