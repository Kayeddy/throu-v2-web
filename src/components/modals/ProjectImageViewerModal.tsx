"use client";
import { Modal, ModalContent, Image, useDisclosure } from "@nextui-org/react";
import { IoClose as CloseModalIcon } from "react-icons/io5";
import React from "react";

export default function ProjectImageViewerModal({
  triggerImage,
  imageUrl,
}: {
  triggerImage: React.ReactElement;
  imageUrl: string;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
        <ModalContent className="flex items-center justify-center bg-transparent">
          <div className="relative flex h-[90%] w-[90%] items-center justify-center">
            <Image
              src={imageUrl}
              alt="Project Image"
              className="h-full w-full object-contain"
            />
          </div>
        </ModalContent>
      </Modal>
    </>
  );
}
