"use client";
import React from "react";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { SignIn } from "@clerk/nextjs";

export default function AuthModal({
  triggerElement,
}: {
  triggerElement: React.ReactElement;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      {React.cloneElement(triggerElement, { onClick: onOpen })}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="blur"
        size="3xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
                <div className="flex flex-row items-center justify-around">
                  <SignIn routing="hash" signUpForceRedirectUrl="/" />
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
