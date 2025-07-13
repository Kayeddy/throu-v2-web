"use client";

import {
  Modal,
  ModalContent,
  ModalBody,
  Button,
  useDisclosure,
  ButtonProps,
  Divider,
} from "@heroui/react";
import React, {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ProjectInvestmentConfirmationTab from "@/sections/marketplace/project/ProjectInvestmentConfirmationTab";
import ProjectInvestmentPaymentMethodTab from "@/sections/marketplace/project/ProjectInvestmentPaymentMethodTab";
import { MdOutlineArrowBackIos as BackArrowIcon } from "react-icons/md";
import { MdCheck } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import BackgroundImage from "../ui/background-image";
// import { useUnifiedWalletConnection } from "@/hooks/useUnifiedWalletConnection";
import { useIsMobile } from "@/hooks/ui/useIsMobile";
import { ProjectInvestmentTransactionLoader } from "../ui/project-investment-transaction-loader";
import useApprovalTransaction from "@/hooks/blockchain/evm/investments/useApprovalTransaction";
import { usePurchaseTransaction as useEVMPurchaseTransaction } from "@/hooks/blockchain/evm/investments/usePurchaseTransaction";
import { usePurchaseTransaction as useSolanaPurchaseTransaction } from "@/hooks/blockchain/solana/investments/usePurchaseTransaction";
import { isError } from "ethers";
import { useLocale, useTranslations } from "next-intl";
import { useUser } from "@clerk/nextjs";
import { SupportedChain } from "@/utils/types/shared/project";
import { useAppKitAccount } from "@reown/appkit/react";

interface ProjectInvestmentModalProps {
  triggerButton?: ReactElement<ButtonProps>;
  projectTokenPrice: number | null;
  investmentAmount: number;
  projectChain: SupportedChain; // Add chain identifier
  projectId: string | number; // Add project ID for transaction
}

type TabKey = "invest" | "paymentMethod" | "investmentConfirmation";

const TabHeader = ({
  activeTab,
  tabs,
}: {
  activeTab: TabKey;
  tabs: { key: TabKey; label: string }[];
}) => {
  const activeIndex = tabs.findIndex((tab) => tab.key === activeTab);

  return (
    <div className="flex w-full translate-y-[50px] flex-row items-center justify-around lg:translate-y-0">
      {tabs.map((tab, index) => (
        <React.Fragment key={tab.key}>
          <span className="px-2">
            <motion.p
              className={`flex flex-col items-center gap-1 whitespace-nowrap font-jakarta text-sm font-light transition-all ease-in-out duration-300 ${
                index < activeIndex ? "text-secondary" : "text-minimal"
              }`}
              initial={false}
              transition={{ duration: 0.6 }}
            >
              <AnimatePresence mode="wait">
                {index < activeIndex ? (
                  <motion.span
                    key="check"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <MdCheck className="text-2xl text-secondary lg:text-lg" />
                  </motion.span>
                ) : (
                  <motion.span
                    key={`number-${index}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {index + 1}
                  </motion.span>
                )}
              </AnimatePresence>
              <motion.span
                key={`label-${tab.key}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="hidden lg:block"
              >
                {tab.label}
              </motion.span>
            </motion.p>
          </span>
          {index < tabs.length - 1 && (
            <motion.span
              className="flex w-[90%] items-center justify-center"
              initial={false}
              animate={{
                backgroundColor: index < activeIndex ? "#18a5ff" : "#b5b5b5",
              }}
              transition={{ duration: 0.6 }}
            >
              <Divider className="h-0.5" />
            </motion.span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const InvestmentHandler = ({
  investmentAmount,
  projectTokenPrice,
  projectChain,
  projectId,
  onExit,
  onReturn,
}: {
  investmentAmount: number;
  projectTokenPrice: number;
  projectChain: SupportedChain;
  projectId: string | number;
  onExit: () => void;
  onReturn: () => void;
}) => {
  const t = useTranslations("Marketplace.project.projectInvestmentModal");
  const [loadingState, setLoadingState] = useState(0);
  const [error, setError] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [approvalCompleted, setApprovalCompleted] = useState(false);
  const { caipAddress } = useAppKitAccount();

  // Chain-specific loading states
  const evmLoadingStates = [
    { text: t("loadingStates.0") }, // Approving investment amount
    { text: t("loadingStates.1") }, // Waiting for approval confirmation
    { text: t("loadingStates.2") }, // Executing purchase
    { text: t("loadingStates.3") }, // Finalizing investment
  ];

  const solanaLoadingStates = [
    { text: t("solanaLoadingStates.0") || "Preparing transaction" },
    { text: t("solanaLoadingStates.1") || "Signing transaction" },
    { text: t("solanaLoadingStates.2") || "Broadcasting transaction" },
    { text: t("solanaLoadingStates.3") || "Confirming investment" },
  ];

  const loadingStates =
    projectChain === "polygon" ? evmLoadingStates : solanaLoadingStates;

  const totalInvestment = investmentAmount * projectTokenPrice;
  const transactionFee = totalInvestment * 0.011;
  const totalAmount = totalInvestment + transactionFee;

  // Initialize chain-specific hooks
  const evmApproval = useApprovalTransaction(totalAmount);
  const evmPurchase = useEVMPurchaseTransaction(totalInvestment);
  const solanaPurchase = useSolanaPurchaseTransaction(investmentAmount);

  // EVM transaction flow
  useEffect(() => {
    if (projectChain !== "polygon") return;

    if (evmApproval.transactionHash && !approvalCompleted) {
      setLoadingState(1); // Waiting for approval confirmation
    }

    if (evmApproval.transactionReceipt && !approvalCompleted) {
      setApprovalCompleted(true);
      setLoadingState(2); // Proceed to purchase execution
    }

    if (evmApproval.error) {
      console.error("EVM approval transaction failed", evmApproval.error);
      setError(true);
    }
  }, [
    projectChain,
    evmApproval.transactionHash,
    evmApproval.transactionReceipt,
    evmApproval.error,
    approvalCompleted,
  ]);

  useEffect(() => {
    if (projectChain !== "polygon") return;

    if (evmPurchase.transactionHash && approvalCompleted) {
      setLoadingState(3); // Finalizing investment
    }

    if (evmPurchase.transactionReceipt) {
      setIsConfirmed(true); // Show confirmation component
    }

    if (evmPurchase.error) {
      console.error("EVM purchase transaction failed", evmPurchase.error);
      setError(true);
    }
  }, [
    projectChain,
    evmPurchase.transactionHash,
    evmPurchase.transactionReceipt,
    evmPurchase.error,
    approvalCompleted,
  ]);

  // Solana transaction flow (single transaction, no approval needed)
  useEffect(() => {
    if (projectChain !== "solana") return;

    if (solanaPurchase.isPending) {
      setLoadingState(1); // Signing transaction
    }

    if (solanaPurchase.transactionSignature) {
      setLoadingState(2); // Broadcasting transaction
      // Wait a moment then move to confirmation
      setTimeout(() => {
        setLoadingState(3); // Confirming investment
      }, 1000);
    }

    if (solanaPurchase.transactionSignature && !solanaPurchase.isPending) {
      setIsConfirmed(true); // Show confirmation component
    }

    if (solanaPurchase.error) {
      console.error("Solana purchase transaction failed", solanaPurchase.error);
      setError(true);
    }
  }, [
    projectChain,
    solanaPurchase.isPending,
    solanaPurchase.transactionSignature,
    solanaPurchase.error,
  ]);

  // Auto-start transaction on mount
  useEffect(() => {
    if (error || isConfirmed) return;

    if (projectChain === "polygon") {
      // EVM: Start with approval
      if (!evmApproval.transactionHash && !evmApproval.isPending) {
        setLoadingState(0); // Approving the investment amount
        evmApproval.executeApproval();
      }
    } else if (projectChain === "solana") {
      // Solana: Direct purchase (no approval needed)
      if (!solanaPurchase.transactionSignature && !solanaPurchase.isPending) {
        setLoadingState(0); // Preparing transaction
        solanaPurchase.executePurchase(String(projectId));
      }
    }
  }, [projectChain, projectId, error, isConfirmed]);

  // Auto-start purchase transaction when EVM approval is completed
  useEffect(() => {
    if (
      projectChain === "polygon" &&
      approvalCompleted &&
      !evmPurchase.transactionHash &&
      !evmPurchase.isPending
    ) {
      evmPurchase.executePurchase();
    }
  }, [
    projectChain,
    approvalCompleted,
    evmPurchase.transactionHash,
    evmPurchase.isPending,
  ]);

  // Render chain-specific transaction info
  const renderTransactionInfo = () => {
    if (projectChain === "polygon") {
      return (
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <span>Network:</span>
            <span className="font-medium">Polygon</span>
          </div>
          <div className="flex justify-between">
            <span>Transaction Fee:</span>
            <span className="font-medium">
              {transactionFee.toFixed(4)} MATIC
            </span>
          </div>
          <div className="flex justify-between">
            <span>Total:</span>
            <span className="font-medium">{totalAmount.toFixed(4)} MATIC</span>
          </div>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <span>Network:</span>
            <span className="font-medium">Solana</span>
          </div>
          <div className="flex justify-between">
            <span>Investment Amount:</span>
            <span className="font-medium">
              {investmentAmount.toFixed(4)} SOL
            </span>
          </div>
          <div className="flex justify-between">
            <span>Network Fee:</span>
            <span className="font-medium">~0.00025 SOL</span>
          </div>
        </div>
      );
    }
  };

  if (isConfirmed) {
    return (
      <ProjectInvestmentConfirmationTab
        investmentAmount={investmentAmount}
        projectTokenPrice={projectTokenPrice}
      />
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-8 p-8">
      <ProjectInvestmentTransactionLoader
        loadingStates={loadingStates}
        loading={loadingState < loadingStates.length}
        currentStep={loadingState}
        error={error}
        isConfirmed={isConfirmed}
        onExit={onExit}
        onReturn={onReturn}
      />

      <div className="w-full max-w-sm">{renderTransactionInfo()}</div>
    </div>
  );
};

const ProjectInvestmentModal = ({
  triggerButton,
  projectTokenPrice,
  investmentAmount,
  projectChain,
  projectId,
}: ProjectInvestmentModalProps) => {
  const t = useTranslations("Marketplace.project.projectInvestmentModal");
  const locale = useLocale();
  const isMobile = useIsMobile();
  const { user } = useUser();
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  const [activeTab, setActiveTab] = useState<TabKey>("invest");
  const [step, setStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isInvestmentCompleted, setIsInvestmentCompleted] = useState(false);

  const tabs = [
    { key: "invest" as TabKey, label: t("tabs.invest") },
    { key: "paymentMethod" as TabKey, label: t("tabs.paymentMethod") },
    {
      key: "investmentConfirmation" as TabKey,
      label: t("tabs.investmentConfirmation"),
    },
  ];

  const handleBackClick = () => {
    if (step > 1) {
      setStep(step - 1);
      setActiveTab(tabs[step - 2].key);
    }
  };

  const handleNextClick = () => {
    if (step < tabs.length) {
      setStep(step + 1);
      setActiveTab(tabs[step].key);
    }
  };

  const handleTriggerButtonClick = () => {
    if (!user) {
      // Handle authentication requirement
      return;
    }

    onOpen();
  };

  const handleModalClose = () => {
    setStep(1);
    setActiveTab("invest");
    setErrorMessage(null);
    setIsInvestmentCompleted(false);
    onClose();
  };

  const renderContent = () => {
    switch (activeTab) {
      case "invest":
        return (
          <ProjectInvestmentPaymentMethodTab
            investmentAmount={investmentAmount}
            projectTokenPrice={projectTokenPrice}
          />
        );
      case "paymentMethod":
        return (
          <div className="p-6">
            <p className="text-center text-lg font-medium mb-4">
              {t("paymentMethod.title")}
            </p>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">
                  {projectChain === "polygon"
                    ? "MetaMask (Polygon)"
                    : "Phantom (Solana)"}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {projectChain === "polygon"
                    ? t("paymentMethod.polygon.description")
                    : t("paymentMethod.solana.description")}
                </p>
                <Button
                  color="primary"
                  onClick={handleNextClick}
                  className="w-full"
                >
                  {t("paymentMethod.continue")}
                </Button>
              </div>
            </div>
          </div>
        );
      case "investmentConfirmation":
        if (!projectTokenPrice) {
          return <div>Error: Project token price not available</div>;
        }
        return (
          <InvestmentHandler
            investmentAmount={investmentAmount}
            projectTokenPrice={projectTokenPrice}
            projectChain={projectChain}
            projectId={projectId}
            onExit={handleModalClose}
            onReturn={handleBackClick}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {triggerButton &&
        React.cloneElement(triggerButton, {
          onClick: handleTriggerButtonClick,
        })}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="2xl"
        placement="center"
        classNames={{
          base: "bg-white dark:bg-gray-900",
          header: "border-b border-gray-200 dark:border-gray-700",
          body: "p-0",
        }}
        isDismissable={false}
        hideCloseButton={activeTab === "investmentConfirmation"}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody className="relative">
                <BackgroundImage
                  src="/images/background-pattern.svg"
                  containerStyles="absolute inset-0 pointer-events-none"
                  imageStyles="w-full h-full object-cover opacity-5"
                />

                <div className="relative z-10">
                  <div className="p-6">
                    <TabHeader activeTab={activeTab} tabs={tabs} />
                  </div>

                  <div className="px-6 pb-6">
                    {step > 1 && activeTab !== "investmentConfirmation" && (
                      <Button
                        isIconOnly
                        variant="light"
                        onClick={handleBackClick}
                        className="mb-4"
                      >
                        <BackArrowIcon className="text-lg" />
                      </Button>
                    )}

                    {renderContent()}
                  </div>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default React.memo(ProjectInvestmentModal);
