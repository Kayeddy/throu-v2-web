"use client";

import { Modal, ModalContent, Image, useDisclosure } from "@nextui-org/react";
import { IoClose as CloseModalIcon } from "react-icons/io5";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProjectImageViewerModal({
  triggerImage,
  imageUrl,
  images,
  initialIndex,
}: {
  triggerImage: React.ReactElement;
  imageUrl: string;
  images: string[];
  initialIndex: number;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const imageAnimation = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.3 } },
  };

  return (
    <>
      {/* Render the trigger image with onClick handler to open the modal */}
      {React.cloneElement(triggerImage, {
        onClick: onOpen,
        className:
          "cursor-pointer h-[100px] w-[100px] min-w-[100px] object-cover lg:h-[120px] lg:w-[120px] lg:min-w-[120px]",
      })}

      <Modal
        backdrop="blur"
        size="full"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        closeButton={
          <span className="h-20 w-20">
            <CloseModalIcon className="z-50 text-3xl text-primary dark:text-light" />
          </span>
        }
      >
        <ModalContent className="relative flex h-full w-full flex-col items-center justify-center gap-4 bg-transparent">
          <div className="relative flex w-[90%] items-center justify-center lg:h-[90%]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                variants={imageAnimation}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex h-full w-full items-center justify-center"
              >
                <Image
                  src={images[currentIndex]}
                  alt={`Project Image ${currentIndex + 1}`}
                  className="mx-auto h-full w-full object-contain lg:w-[90%]"
                />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="z-10 flex gap-4 lg:absolute lg:left-4 lg:right-4 lg:top-1/2 lg:-translate-y-1/2 lg:flex-row">
            <button
              className="text-3xl text-primary dark:text-light lg:absolute lg:left-4 lg:top-1/2 lg:-translate-y-1/2"
              onClick={handlePrev}
            >
              <FaArrowLeft />
            </button>
            <button
              className="text-3xl text-primary dark:text-light lg:absolute lg:right-4 lg:top-1/2 lg:-translate-y-1/2"
              onClick={handleNext}
            >
              <FaArrowRight />
            </button>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
}
