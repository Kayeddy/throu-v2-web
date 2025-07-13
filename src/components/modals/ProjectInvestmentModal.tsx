// TODO: MAJOR REFACTORING NEEDED
// This modal uses the old complex transaction API patterns that were refactored.
// It needs to be updated to use the new simplified hooks:
// - useApprovalTransaction() returns: { approve, isLoading, isSuccess, error, hash }
// - usePurchaseTransaction() returns: { purchase, isLoading, isSuccess, currentStep, error, approvalHash, investmentHash }

"use client";

import {
  Modal,
  ModalContent,
  ModalBody,
  Button,
  useDisclosure,
  ButtonProps,
} from "@heroui/react";
import React, { ReactElement } from "react";
import { useLocale, useTranslations } from "next-intl";

interface ProjectInvestmentModalProps extends ButtonProps {
  projectTitle: string;
  projectId: number;
  projectPrice: number;
  projectChain: "solana" | "polygon";
  children: ReactElement;
}

/**
 * Simplified Project Investment Modal
 *
 * TODO: This is a placeholder component that needs to be fully implemented
 * using the new simplified transaction hooks. The original complex implementation
 * was temporarily replaced to allow the build to pass during refactoring.
 */
const ProjectInvestmentModal = ({
  projectTitle,
  projectId,
  projectPrice,
  projectChain,
  children,
  ...buttonProps
}: ProjectInvestmentModalProps) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const locale = useLocale();
  const t = useTranslations("investment_modal");

  return (
    <>
      <Button onPress={onOpen} {...buttonProps}>
        {children}
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody className="p-6">
                <div className="text-center space-y-4">
                  <h2 className="text-2xl font-bold">Investment Modal</h2>
                  <div className="space-y-2">
                    <p>
                      <strong>Project:</strong> {projectTitle}
                    </p>
                    <p>
                      <strong>Project ID:</strong> {projectId}
                    </p>
                    <p>
                      <strong>Price:</strong> ${projectPrice}
                    </p>
                    <p>
                      <strong>Chain:</strong> {projectChain}
                    </p>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="font-semibold text-yellow-800 mb-2">
                      ⚠️ Under Development
                    </h3>
                    <p className="text-yellow-700 text-sm">
                      This investment modal is currently being refactored to use
                      the new simplified transaction hooks. The functionality
                      will be restored in the next development iteration.
                    </p>
                  </div>

                  <Button color="primary" onPress={onClose}>
                    Close
                  </Button>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProjectInvestmentModal;
