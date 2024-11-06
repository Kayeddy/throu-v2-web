"use client";

import { calculateBarPercentage, slugify } from "@/lib/utils";
import { Button, Chip } from "@nextui-org/react";
import { motion } from "framer-motion";
import { BlurImage } from "./blur-image";
import ProjectAttributesContainer from "./project-attributes-boxes-container";
import { SlLocationPin as LocationIcon } from "react-icons/sl";
import { FaRegBookmark as BookmarkIcon } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export default function MarketplaceHomeCard({
  data,
}: {
  data: ProjectDetails;
}) {
  const t = useTranslations("HomePage.Showcase");
  const router = useRouter();

  const projectAttributes = {
    supply: data?.projectTotalSupply,
    min: `$${data?.projectPrice}`,
    total: `$${
      data?.projectPrice && data?.projectTotalSupply
        ? data?.projectTotalSupply * data?.projectPrice
        : 0
    }`,
    APY: "23%",
  };

  const projectCompletionPercentage = () => {
    if (data?.projectRemainingTokens && data?.projectTotalSupply) {
      return calculateBarPercentage(
        data?.projectTotalSupply,
        data?.projectRemainingTokens
      );
    }
    return 0;
  };

  // Handle redirection to the project page using both the name and ID in the URL
  const handleInvestClick = () => {
    const projectNameSlug = slugify(data.projectURI?.name ?? "project");
    const projectId = 0;
    router.push(`/marketplace/projects/${projectNameSlug}-${projectId}`);
  };

  return (
    data && (
      <motion.div className="relative flex h-[70vh] max-h-[500px] w-[90vw] flex-col items-start justify-start overflow-hidden rounded-md bg-light/5 shadow-project-section-card-custom dark:bg-dark/10 lg:h-[70vh] lg:max-h-[600px] lg:min-h-[500px] lg:w-80">
        <div className="relative h-[50%] min-h-[40%] w-full">
          <div className="absolute top-3 z-10 flex w-full flex-row items-center justify-between px-3">
            <Chip
              radius="sm"
              size="sm"
              className="bg-quaternary font-jakarta text-light"
            >
              Gastronómico
            </Chip>
            <Chip
              radius="sm"
              size="md"
              className="cursor-pointer bg-black/30 text-white backdrop-blur-sm transition-all duration-300 ease-in-out hover:scale-105"
            >
              <BookmarkIcon />
            </Chip>
          </div>
          <BlurImage
            src="/assets/projects/prado/renders/render_1.jpg"
            alt={data.projectURI?.name ?? "Project-card-image"}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="h-auto w-auto object-cover"
          />
        </div>

        <div className="relative flex h-full w-full flex-col items-start justify-between p-3">
          <h1 className="font-sen text-xl font-semibold text-primary dark:text-white">
            {/* {data.projectURI?.name ?? "Salón Prado"} */}
            Salón Prado
          </h1>

          <div className="flex w-full flex-col items-start justify-start gap-1">
            <p className="font-jakarta text-sm font-semibold text-secondary">
              {t("project_complete", {
                percentage: projectCompletionPercentage(),
              })}
            </p>
            <span
              className="h-1.5 rounded-[10px] bg-secondary"
              style={{
                width: `${projectCompletionPercentage()}%`,
                maxWidth: "100%",
              }}
            ></span>
          </div>

          <ProjectAttributesContainer
            items={projectAttributes}
            layout="horizontal"
            isTranslucent
          />

          <p className="w-[95%] truncate font-jakarta text-base font-extralight text-primary dark:text-white">
            {data.projectURI?.description}
          </p>

          <span className="text-jakarta flex flex-row items-center justify-start gap-2 text-base text-primary dark:text-white">
            <LocationIcon />
            {data.projectURI?.attributes[0].value
              ? data.projectURI.attributes[0].value
              : t("no_location_available")}
          </span>

          <Button
            onClick={handleInvestClick} // Update the click handler to redirect
            variant="bordered"
            size="lg"
            className="w-full rounded-none border-secondary bg-secondary font-sen text-lg font-bold text-white hover:bg-transparent hover:text-secondary lg:text-base"
          >
            {t("invest_button")}
          </Button>
        </div>
      </motion.div>
    )
  );
}
