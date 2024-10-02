"use client";
import React, { useState } from "react";
import { SlLocationPin as LocationIcon } from "react-icons/sl";
import { AiOutlinePlus as PlusIcon } from "react-icons/ai";
import { calculateBarPercentage, cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { BlurImage } from "./blur-image";
import ProjectAttributesContainer from "./project-attributes-boxes-container";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import { useTranslations } from "next-intl";

export const ShowcaseCard = ({
  data,
  layout = false,
}: {
  data?: ProjectDetails;
  layout?: boolean;
}) => {
  const t = useTranslations("HomePage.Showcase");

  const projectAttributes = {
    supply: data?.projectTotalSupply,
    min: data?.projectPrice,
    total:
      data?.projectPrice && data?.projectTotalSupply
        ? data?.projectTotalSupply * data?.projectPrice
        : 0,
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

  return (
    <>
      {data ? (
        <motion.div
          layoutId={layout ? `card-${data.projectURI?.name}` : undefined}
          className="rounded-md bg-light shadow-project-section-card-custom h-[60vh] lg:h-[70vh] w-[80vw] max-w-[450px] lg:w-[40vw] overflow-hidden flex flex-col items-start justify-start relative"
        >
          <div className="h-[50%] min-h-[45%] relative w-full">
            <BlurImage
              src="/assets/projects/prado/renders/render_1.jpg"
              alt={data.projectURI?.name ?? "Project-card-image"}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover w-auto h-auto"
            />
          </div>
          <div className="flex flex-col items-start justify-between h-full w-full relative p-3">
            <h1 className="font-sen text-xl font-semibold text-primary">
              {/* {data.projectURI?.name ?? "Salón Prado"} */}
              Salón Prado
            </h1>

            <ProjectAttributesContainer
              items={projectAttributes}
              layout="horizontal"
            />

            <p className="text-base font-jakarta font-extralight truncate text-primary w-[95%]">
              {data.projectURI?.description}
            </p>

            <span className="text-primary text-base text-jakarta flex flex-row items-center justify-start gap-2">
              <LocationIcon />
              {data.projectURI?.attributes[0].value
                ? data.projectURI.attributes[0].value
                : t("no_location_available")}
            </span>

            <div className="flex flex-col items-start justify-start gap-1 w-full">
              <p className="font-jakarta font-semibold text-secondary text-sm">
                {t("project_complete", {
                  percentage: projectCompletionPercentage(),
                })}
              </p>
              <span
                className="h-1.5 bg-secondary rounded-[10px]"
                style={{
                  width: `${projectCompletionPercentage()}%`,
                  maxWidth: "100%",
                }}
              ></span>
            </div>

            <Button
              href="/"
              target="_blank"
              rel="noreferrer"
              as={Link}
              size="lg"
              className="font-bold text-white bg-primary hover:bg-secondary text-lg lg:text-base font-sen w-full rounded-none"
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
          className="rounded-md bg-primary shadow-project-section-card-custom h-[60vh] lg:h-[70vh] w-[80vw] max-w-[450px] lg:w-[40vw] overflow-hidden flex flex-col items-start justify-start relative"
        >
          <div className="h-full w-full flex flex-col items-center justify-center gap-12 py-6 px-4">
            <span className="p-4 border-3 border-secondary rounded-md">
              <PlusIcon className="text-secondary text-5xl" />
            </span>
            <h1 className="font-sen text-secondary text-3xl font-semibold text-center">
              {t("explore_all_projects")}
            </h1>
            <Button
              href="/"
              target="_blank"
              rel="noreferrer"
              as={Link}
              size="lg"
              className="bg-transparent text-sm border hover:border-secondary border-light hover:text-white text-light hover:bg-secondary font-sen rounded-none"
            >
              {t("go_to_marketplace")}
            </Button>
          </div>
        </motion.div>
      )}
    </>
  );
};
