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
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useIsMobile } from "@/utils/hooks/shared/useIsMobile";
import { ProjectInvestmentTransactionLoader } from "../ui/project-investment-transaction-loader";
import useApproveInvestmentAmount from "@/utils/hooks/smart_contracts/useApproveInvestmentAmount";
import { useBuyInvestmentAmount } from "@/utils/hooks/smart_contracts/useBuyInvestmentAmount";
import { isError } from "ethers";
import { useLocale, useTranslations } from "next-intl";
import { useUser } from "@clerk/nextjs";

interface ProjectInvestmentModalProps {
  triggerButton?: ReactElement<ButtonProps>;
  projectTokenPrice: number | null;
  investmentAmount: number;
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
  onExit,
  onReturn,
}: {
  investmentAmount: number;
  projectTokenPrice: number;
  onExit: () => void;
  onReturn: () => void;
}) => {
  const t = useTranslations("Marketplace.project.projectInvestmentModal");
  const [loadingState, setLoadingState] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const processStartedRef = useRef(false);

  const loadingStates = [
    { text: t("loadingStates.0") },
    { text: t("loadingStates.1") },
    { text: t("loadingStates.2") },
    { text: t("loadingStates.3") },
  ];

  const totalInvestment = investmentAmount * projectTokenPrice;
  const transactionFee = totalInvestment * 0.011;
  const totalAmount = totalInvestment + transactionFee;

  const handleInvestmentProcess = async () => {
    if (processStartedRef.current) return;
    processStartedRef.current = true;

    try {
      // Step 1: Approving the investment amount
      setLoadingState(0);
      const {
        paymentApprovalTransactionHash,
        paymentApprovalTransactionReceipt,
      } = await useApproveInvestmentAmount(totalAmount);

      if (paymentApprovalTransactionHash) {
        setLoadingState(1); // Step 2: Waiting for approval confirmation
      }

      // Monitor approval receipt
      await new Promise<void>((resolve) => {
        const checkApprovalReceipt = setInterval(() => {
          if (paymentApprovalTransactionReceipt) {
            clearInterval(checkApprovalReceipt);
            setLoadingState(2); // Proceed to purchase execution
            resolve();
          }
        }, 1000);
      });

      // Step 3: Execute purchase transaction
      const { investmentTransactionHash, investmentTransactionReceipt } =
        await useBuyInvestmentAmount(totalInvestment);

      if (investmentTransactionHash) {
        setLoadingState(3); // Finalizing investment
      }

      // Monitor purchase receipt
      await new Promise<void>((resolve) => {
        const checkPurchaseReceipt = setInterval(() => {
          if (investmentTransactionReceipt) {
            clearInterval(checkPurchaseReceipt);
            setIsConfirmed(true); // Show confirmation component
            resolve();
          }
        }, 1000);
      });
    } catch (err) {
      console.error("Transaction failed", err);
      setError(true);
    }
  };

  useEffect(() => {
    handleInvestmentProcess();
  }, []);

  return (
    <div className="relative">
      <ProjectInvestmentTransactionLoader
        loadingStates={loadingStates}
        loading={isLoading}
        currentStep={loadingState}
        error={error}
        isConfirmed={isConfirmed}
        onExit={onExit}
        onReturn={onReturn}
      />
    </div>
  );
};

const ProjectInvestmentModal = ({
  triggerButton,
  projectTokenPrice,
  investmentAmount,
}: ProjectInvestmentModalProps) => {
  const t = useTranslations("Marketplace.project.projectInvestmentModal");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  const { isLoaded, isSignedIn } = useUser();
  const isMobile = useIsMobile();
  const locale = useLocale();

  const [selected, setSelected] = useState<TabKey>("paymentMethod");
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [showError, setShowError] = useState(false);
  const [processingTransaction, setProcessingTransaction] = useState(false);

  const TABS = useMemo(
    () =>
      [
        { key: "invest" as TabKey, label: t("tabs.invest"), component: <></> },
        {
          key: "paymentMethod" as TabKey,
          label: t("tabs.paymentMethod"),
          component: (
            <ProjectInvestmentPaymentMethodTab
              investmentAmount={investmentAmount}
              projectTokenPrice={projectTokenPrice}
            />
          ),
        },
        {
          key: "investmentConfirmation" as TabKey,
          label: t("tabs.investmentConfirmation"),
          component: (
            <ProjectInvestmentConfirmationTab
              investmentAmount={investmentAmount}
              projectTokenPrice={projectTokenPrice}
            />
          ),
        },
      ] as { key: TabKey; label: string; component: React.ReactNode }[],
    [t, investmentAmount, projectTokenPrice]
  );

  const currentTabLabel = TABS.find((tab) => tab.key === selected)?.label;

  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => setShowError(false), 1000); // Reset error after 2 seconds
      return () => clearTimeout(timer);
    }
  }, [showError]);

  const handleTriggerButtonClick = () => {
    if (!isConnected || !address) {
      openConnectModal?.(); // Open connect modal if wallet not connected
    } else if (investmentAmount <= 0) {
      setShowError(true); // Show error for invalid investment amount
    } else if (!isLoaded || !isSignedIn) {
      // Redirect user to the sign-in page
      window.location.href = `/${locale}/sign-in`;
    } else {
      onOpen(); // Open modal if all conditions are met
    }
  };

  const TriggerButton = useMemo(() => {
    return triggerButton ? (
      React.cloneElement(triggerButton, {
        onPress: handleTriggerButtonClick,
        children: showError
          ? t("triggerButton.error")
          : t("triggerButton.default"),
      })
    ) : (
      <Button onPress={handleTriggerButtonClick}>
        {showError ? t("triggerButton.error") : t("triggerButton.default")}
      </Button>
    );
  }, [triggerButton, handleTriggerButtonClick, showError, t]);

  const handleNext = useCallback(() => {
    const currentIndex = TABS.findIndex((tab) => tab.key === selected);
    if (currentIndex < TABS.length - 1) {
      setDirection("forward");
      setSelected(TABS[currentIndex + 1].key as TabKey); // Cast to TabKey
    } else {
      setProcessingTransaction(true);
    }
  }, [selected, TABS]);

  const handleBack = useCallback(() => {
    const currentIndex = TABS.findIndex((tab) => tab.key === selected);
    if (currentIndex > 1) {
      setDirection("backward");
      setSelected(TABS[currentIndex - 1].key as TabKey); // Cast to TabKey
    } else {
      onClose();
    }
  }, [selected, onClose, TABS]);

  const ActiveTabComponent = TABS.find(
    (tab) => tab.key === selected
  )?.component;

  return (
    <>
      {TriggerButton}

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={`${isMobile ? "full" : "3xl"}`}
        hideCloseButton
        className="overflow-hidden"
        backdrop="blur"
        isDismissable={false}
        isKeyboardDismissDisabled={false}
      >
        {processingTransaction ? (
          <InvestmentHandler
            investmentAmount={investmentAmount}
            projectTokenPrice={projectTokenPrice ?? 0}
            onReturn={() => setProcessingTransaction(false)}
            onExit={() => {
              setProcessingTransaction(false);
              setSelected("paymentMethod");
              onClose();
            }}
          />
        ) : (
          <ModalContent className="relative bg-light dark:bg-dark lg:w-[70vw] xl:h-[70vh] 2xl:h-[60vh]">
            <BackgroundImage
              src="/assets/shared/logo_purple_right.webp"
              containerStyles="absolute hidden lg:flex top-[63%] z-[1] left-0 pointer-events-none"
              imageStyles="w-fit h-fit max-w-[200px] object-contain brightness-200"
            />
            <BackgroundImage
              src="/assets/shared/logo_blue_left.webp"
              containerStyles="absolute hidden lg:flex right-0 top-[-100px] z-[1] right-0 pointer-events-none"
              imageStyles="w-fit h-fit max-w-[200px] object-contain rotate-[-45deg] brightness-200"
            />
            <div className="z-[2] flex h-full w-full flex-col items-start justify-center p-4 backdrop-blur-md lg:flex-row lg:p-8">
              <button
                className="mt-6 flex flex-row items-center justify-center gap-2 lg:mt-2 lg:-translate-x-2"
                onClick={handleBack}
              >
                <BackArrowIcon className="text-xl text-minimal" />
                <span className="mb-0.5 font-sen text-2xl font-bold text-primary dark:text-light lg:hidden">
                  {currentTabLabel}
                </span>
              </button>
              <div className="flex h-full w-full flex-col items-center justify-center">
                <TabHeader activeTab={selected} tabs={TABS} />
                <ModalBody className="w-full">
                  <AnimatePresence
                    mode="wait"
                    initial={false}
                    custom={direction}
                  >
                    <motion.div
                      key={selected}
                      initial={{
                        opacity: 0,
                        x: direction === "forward" ? 50 : -50,
                      }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{
                        opacity: 0,
                        x: direction === "forward" ? 50 : -50,
                      }}
                      transition={{ duration: 0.3 }}
                      className="my-auto"
                    >
                      {ActiveTabComponent}
                    </motion.div>
                  </AnimatePresence>
                </ModalBody>
                <div className="w-full">
                  <Button
                    variant="bordered"
                    size="lg"
                    className="mx-auto w-full rounded-none border-secondary bg-secondary font-sen text-lg font-bold text-white hover:bg-transparent hover:text-secondary lg:text-base"
                    onPress={handleNext}
                  >
                    {selected === "investmentConfirmation"
                      ? t("finishButton")
                      : t("continueButton")}
                  </Button>
                </div>
              </div>
            </div>
          </ModalContent>
        )}
      </Modal>
    </>
  );
};

export default React.memo(ProjectInvestmentModal);
