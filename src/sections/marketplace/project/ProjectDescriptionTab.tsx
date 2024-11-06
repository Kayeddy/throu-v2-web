"use client";

import { Chip, Image } from "@nextui-org/react";
import { SlLocationPin as LocationIcon } from "react-icons/sl";
import { useTranslations } from "next-intl";

interface ProjectDescriptionTabProps {
  projectLocation: ProjectAttribute | undefined;
}

export default function ProjectDescriptionTab({
  projectLocation,
}: ProjectDescriptionTabProps) {
  const t = useTranslations(
    "Marketplace.project.projectDetails.projectDescriptionTab"
  );

  return (
    <div className="flex w-full min-w-[50vw] flex-col items-start justify-start gap-6 text-primary dark:text-light lg:w-[50vw]">
      <h1 className="font-sen text-4xl font-bold">{t("title")}</h1>

      {/* Category Chips for Mobile */}
      <span className="flex flex-row items-center justify-start gap-2 lg:hidden">
        <Chip
          radius="sm"
          size="lg"
          className="bg-quaternary/90 font-jakarta text-sm text-light"
        >
          {t("category")}
        </Chip>
        <Chip
          radius="sm"
          size="lg"
          className="bg-tertiary/70 font-jakarta text-sm text-light"
        >
          {t("investmentType")}
        </Chip>
      </span>

      {/* Location for Mobile */}
      <span className="flex flex-row items-center justify-start gap-2 text-base text-primary dark:text-white lg:hidden">
        <LocationIcon />
        <p className="font-jakarta text-base">
          {projectLocation && projectLocation.value}
        </p>
      </span>

      {/* Description Paragraphs */}
      <p className="font-jakarta text-base">{t("description.paragraph1")}</p>

      {/* Category for Desktop */}
      <span className="hidden flex-row items-center justify-start gap-2 lg:flex">
        <p className="font-jakarta text-base text-minimal dark:text-light">
          {t("categoryLabel")}:
        </p>
        <Chip
          radius="sm"
          size="lg"
          className="bg-quaternary font-jakarta text-light"
        >
          {t("category")}
        </Chip>
      </span>

      {/* Location for Desktop */}
      <span className="hidden flex-row items-center justify-start gap-2 text-base text-primary dark:text-white lg:flex">
        <LocationIcon />
        <p className="font-jakarta text-base">
          {projectLocation && projectLocation.value}
        </p>
      </span>

      {/* Images and Additional Description Paragraphs */}
      <Image
        src="/assets/projects/prado/other/desc_1.png"
        alt="Project Description Image 1"
        className="h-[400px] min-w-[50vw] object-contain dark:bg-light lg:w-[50vw] lg:object-contain"
      />

      <p className="font-jakarta text-base">{t("description.paragraph2")}</p>

      <Image
        src="/assets/projects/prado/other/desc_2.png"
        alt="Project Description Image 2"
        className="h-[400px] min-w-[50vw] object-contain dark:bg-light"
      />
      <Image
        src="/assets/projects/prado/other/desc_3.png"
        alt="Project Description Image 3"
        className="h-[400px] min-w-[50vw] object-contain dark:bg-light"
      />

      <p className="font-jakarta text-base">{t("description.paragraph3")}</p>

      <Image
        src="/assets/projects/prado/other/desc_4.png"
        alt="Project Description Image 4"
        className="h-[400px] min-w-[50vw] object-fill dark:bg-light lg:w-[50vw] lg:object-cover"
      />

      <p className="font-jakarta text-base">{t("description.paragraph4")}</p>

      <Image
        src="/assets/projects/prado/wireframes/wireframe_1.png"
        alt="Project Wireframe Image"
        className="h-[400px] min-w-[50vw] object-contain dark:bg-light"
      />
    </div>
  );
}
