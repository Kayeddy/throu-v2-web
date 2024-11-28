"use client";

import { slugify } from "@/lib/utils";
import { Chip } from "@nextui-org/react";
import { motion } from "framer-motion";
import { BlurImage } from "./blur-image";
import { FaRegBookmark as BookmarkIcon } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { projectMedia } from "../marketplace/IndividualProjectDetails";

interface UserDashboardProjectDetails {
  projectName: string;
  userTokenCount: number;
  userOwnershipPercentage: number | string;
  projectTokenPrice: number;
}

export default function UserProjectDashboardCard({
  projectName,
  userTokenCount,
  projectTokenPrice,
  userOwnershipPercentage,
}: UserDashboardProjectDetails) {
  const getProjectPageRedirectionUrl = () => {
    const projectNameSlug = slugify(projectName ?? "project");
    const projectId = 0;
    return `/marketplace/projects/${projectNameSlug}-${projectId}`;
  };

  const t = useTranslations("Dashboard.tabs.portfolio");
  const t1 = useTranslations(
    "Marketplace.project.projectDetails.projectDescriptionTab"
  );
  const t3 = useTranslations("Shared.projectBaseAttributes");

  return (
    <motion.div>
      <Link
        href={getProjectPageRedirectionUrl()}
        className="relative flex h-[40vh] min-h-[400px] w-[20vw] min-w-[300px] items-center justify-center overflow-hidden rounded-md"
      >
        <>
          <div className="relative h-full w-full rounded-md">
            <div className="absolute top-3 z-10 flex w-full flex-row items-center justify-between px-3">
              <Chip
                radius="sm"
                size="sm"
                className="bg-quaternary font-jakarta text-light"
              >
                {/**TODO: Correctly translate tags in this card and other project cards */}
                {t1("category")}
              </Chip>
            </div>
            <BlurImage
              src={projectMedia[0]}
              alt={projectName}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="h-auto w-auto rounded-md object-cover"
            />
          </div>

          <div className="absolute bottom-0 flex h-28 w-full flex-col items-center justify-center bg-light/90 p-3 backdrop-blur-sm dark:bg-dark/80">
            <h1 className="font-sen text-xl font-bold text-primary dark:text-white">
              {/* {data.projectURI?.name ?? "Salón Prado"} */}
              Salón Prado
            </h1>

            <div className="flex flex-row items-center justify-center gap-2 font-jakarta">
              <p className="text-lg font-bold text-primary dark:text-light">{`${userTokenCount} ${t3(
                "tokens"
              )}`}</p>
              <p className="text-tiny text-minimal">
                =${userTokenCount * projectTokenPrice} USDT
              </p>
            </div>

            <div className="flex flex-row items-center justify-center gap-2 font-jakarta text-lg font-bold text-secondary">
              <p className="text">{t("partnerMessage")}</p>
              <p>({userOwnershipPercentage}%)</p>
            </div>
          </div>
        </>
      </Link>
    </motion.div>
  );
}
