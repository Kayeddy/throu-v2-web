"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  FiChevronLeft as LeftButtonIcon,
  FiChevronRight as RightButtonIcon,
} from "react-icons/fi";
import { Carousel } from "@/components/ui/cards-carousel";
import ProjectAttributesContainer from "@/components/ui/project-attributes-boxes-container";
import { Button } from "@nextui-org/react";
import React, { useState, useMemo, useCallback } from "react";
import Image from "next/image";

const ImageSliderNavigationButton = React.memo(
  function ImageSliderNavigationButton({
    position,
    callback,
  }: {
    position: "left" | "right";
    callback: () => void;
  }) {
    return (
      <Button
        size="sm"
        radius="md"
        className={`h-10 w-10 bg-dark/40 backdrop-blur-lg absolute top-1/2 transform -translate-y-1/2 z-20 ${
          position === "left" ? "left-2" : "right-4 lg:right-2"
        }`}
        onClick={callback}
        aria-label={`Swipe ${position}`}
      >
        {position === "left" ? (
          <LeftButtonIcon className="text-xl text-light" />
        ) : (
          <RightButtonIcon className="text-xl text-light" />
        )}
      </Button>
    );
  }
);

const ProjectImageSlider = ({
  projectMedia,
  projectDetails,
}: {
  projectMedia: string[];
  projectDetails: ProjectDetails | null;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const projectAttributes = useMemo(
    () => ({
      tokens: projectDetails?.projectTotalSupply,
      value: `$${projectDetails?.projectPrice}`,
      total: `$${
        projectDetails?.projectPrice && projectDetails?.projectTotalSupply
          ? projectDetails?.projectTotalSupply * projectDetails?.projectPrice
          : 0
      }`,
      APY: "23%",
    }),
    [projectDetails]
  );

  // Memoized swipe functions to avoid re-creating them on every render
  const swipeLeft = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? projectMedia.length - 1 : prevIndex - 1
    );
  }, [projectMedia.length]);

  const swipeRight = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === projectMedia.length - 1 ? 0 : prevIndex + 1
    );
  }, [projectMedia.length]);

  return (
    <div className="flex h-auto min-h-fit w-full flex-col items-start justify-center gap-4 lg:flex-row lg:justify-between">
      <div className="relative flex h-[20rem] w-full flex-col items-start justify-start gap-6 lg:h-[27rem]">
        <ImageSliderNavigationButton position="left" callback={swipeLeft} />
        <ImageSliderNavigationButton position="right" callback={swipeRight} />

        {/* Main image container with relative positioning */}
        <div className="relative h-[20rem] w-full lg:h-[27rem]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative h-full w-full"
            >
              <Image
                fill
                sizes="(max-width: 768px) 90vw, (max-width: 1200px) 50vw, 33vw"
                loading="lazy"
                src={projectMedia[currentIndex]}
                alt={`Image of project ${projectDetails?.projectURI?.name}`}
                className="h-[20rem] w-[90vw] rounded-md object-cover object-center lg:h-[27rem]"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel for small images */}
        <div className="absolute bottom-[-90px] z-10 flex h-16 w-full items-center justify-start gap-3 bg-transparent pl-0 lg:bottom-0 lg:bg-dark/30 lg:pl-4 lg:backdrop-blur-xl">
          <AnimatePresence mode="wait">
            <Carousel
              showPagination={false}
              removePaddings
              items={projectMedia.map((media, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0.8, opacity: 0.6 }}
                  animate={{
                    scale: media === projectMedia[currentIndex] ? 0.9 : 0.8,
                    opacity: media === projectMedia[currentIndex] ? 1 : 0.6,
                  }}
                  transition={{ duration: 0.2 }}
                  className={`flex h-20 w-20 cursor-pointer items-start justify-start rounded-md transition-all duration-300 ease-in-out lg:h-14 lg:w-14`}
                  onClick={() => setCurrentIndex(index)}
                >
                  {/* Thumbnail container with relative positioning */}
                  <span className="relative h-full w-full">
                    <Image
                      fill
                      sizes="(max-width: 768px) 80px, 56px"
                      loading="lazy"
                      src={media}
                      alt={`Thumbnail for project ${projectDetails?.projectURI?.name}`}
                      className="max-h-20 max-w-20 rounded-md object-cover"
                    />
                  </span>
                </motion.div>
              ))}
            />
          </AnimatePresence>
        </div>
      </div>

      <div className="relative hidden lg:block">
        <ProjectAttributesContainer
          items={projectAttributes}
          size="xl"
          layout="vertical"
          isTranslucent
        />
      </div>
    </div>
  );
};

export default ProjectImageSlider;