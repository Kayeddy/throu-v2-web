"use client";
import React from "react";
import { SlLocationPin as LocationIcon } from "react-icons/sl";
import { AiOutlinePlus as PlusIcon } from "react-icons/ai";
import { calculateBarPercentage } from "@/lib/utils";
import { motion } from "framer-motion";
import { BlurImage } from "./blur-image";
import ProjectAttributesContainer from "./project-attributes-boxes-container";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Chip } from "@nextui-org/react";
import { projectMedia } from "../marketplace/IndividualProjectDetails";

interface CardData extends ProjectDetails {
  redirectionLink: string;
}

export const ShowcaseCard = ({
  data,
  layout = false,
}: {
  data?: CardData;
  layout?: boolean;
}) => {
  const t = useTranslations("HomePage.Showcase");
  const t1 = useTranslations(
    "Marketplace.project.projectDetails.projectDescriptionTab"
  );
  const t3 = useTranslations("Common");

  const locale = useLocale();

  const projectAttributes = {
    tokens: data?.projectTotalSupply,
    value: `$${data?.projectPrice}`,
    total: `$${
      data?.projectPrice && data?.projectTotalSupply
        ? data?.projectTotalSupply * data?.projectPrice
        : 0
    }`,
    APY: "23%",
  };

  const projectCompletionPercentage = () => {
    if (data?.projectRemainingTokens !== undefined && data?.projectTotalSupply) {
      return calculateBarPercentage(
        data.projectTotalSupply,
        data.projectRemainingTokens
      );
    }
    return 0;
  };

  return (
    <>
      {data ? (
        <motion.div
          layoutId={layout ? `card-${data.projectURI?.name}` : undefined}
          className="relative flex h-[70vh] max-h-[600px] w-[80vw] max-w-[450px] flex-col items-start justify-start overflow-hidden rounded-md bg-light shadow-project-section-card-custom lg:max-h-[700px] lg:w-[40vw]"
        >
          <div className="relative h-[50%] min-h-[45%] w-full">
            <div className="absolute top-3 z-10 flex w-full flex-row items-center justify-between px-3">
              <Chip
                radius="sm"
                size="md"
                className="bg-quaternary font-jakarta text-light"
              >
                {t1("category")}
              </Chip>
              <Chip
                radius="sm"
                size="md"
                className="bg-black/30 font-jakarta text-light backdrop-blur-sm"
              >
                {t3("trendLabel")}
              </Chip>
            </div>
            <BlurImage
              src={projectMedia[0]}
              alt={data.projectURI?.name ?? "Project-card-image"}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="h-auto w-auto object-cover"
            />
          </div>
          <div className="relative flex h-full w-full flex-col items-start justify-between p-3">
            <h1 className="font-sen text-xl font-semibold text-primary">
              {/* {data.projectURI?.name ?? "Salón Prado"} */}
              Salón Prado
            </h1>

            <ProjectAttributesContainer
              items={projectAttributes}
              layout="horizontal"
              ignoreTheme
            />

            <p className="w-[95%] truncate font-jakarta text-base font-extralight text-primary">
              {/** TODO: The project description goes here */}
              {t1("description.paragraph1")}
            </p>

            <span className="text-jakarta flex flex-row items-center justify-start gap-2 text-base text-primary">
              <LocationIcon />
              {data.projectURI?.attributes[0].value
                ? data.projectURI.attributes[0].value
                : t("no_location_available")}
            </span>

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

            <Button
              href={data.redirectionLink}
              as={Link}
              size="lg"
              className="w-full rounded-none bg-primary font-sen text-lg font-bold text-white hover:bg-secondary lg:text-base"
            >
              {t("invest_button")}
            </Button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          layoutId={
            layout ? "go-tomarketplace-showcase-card" : "see-more-showcase-card"
          }
          className="relative flex h-[70vh] max-h-[600px] w-[80vw] max-w-[450px] flex-col items-start justify-start overflow-hidden rounded-md bg-primary shadow-project-section-card-custom lg:max-h-[700px] lg:w-[40vw]"
        >
          <div className="flex h-full w-full flex-col items-center justify-center gap-12 px-4 py-6">
            <span className="rounded-md border-3 border-secondary p-4">
              <PlusIcon className="text-5xl text-secondary" />
            </span>
            <h1 className="text-center font-sen text-3xl font-semibold text-secondary">
              {t("explore_all_projects")}
            </h1>
            <Button
              href={`/${locale}/marketplace`}
              as={Link}
              size="lg"
              className="rounded-none border border-light bg-transparent font-sen text-sm text-light hover:border-secondary hover:bg-secondary hover:text-white"
            >
              {t("go_to_marketplace")}
            </Button>
          </div>
        </motion.div>
      )}
    </>
  );
};
