"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  ButtonProps,
  Card,
  CardBody,
  Chip,
  Spinner,
} from "@heroui/react";
import React, {
  ReactElement,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  useApprovalTransaction,
  useInvestTransaction,
} from "@/hooks/blockchain/transactions";
import { useSolanaInvestment } from "@/hooks/blockchain/solana";
import { useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { convertUsdToSolanaTokenUnits } from "@/lib/utils";

interface ProjectInvestmentModalProps extends ButtonProps {
  projectTitle: string;
  projectId: number;
  projectPrice: number;
  projectChain: "solana" | "polygon";
  children: ReactElement;
}

/**
 * Fully functional Project Investment Modal
 * Handles both EVM (Polygon) and Solana investment transactions
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
  const t = useTranslations("Common");
  const { address, isConnected } = useAppKitAccount();
  const { caipNetwork } = useAppKitNetwork();

  // State management
  const [tokenAmount, setTokenAmount] = useState<string>("");
  const [usdValue, setUsdValue] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<
    "idle" | "approving" | "investing" | "completed" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Transaction hooks
  const approvalTx = useApprovalTransaction();
  const investTx = useInvestTransaction();
  const solanaTx = useSolanaInvestment();

  // Check if we're on the correct chain - robust and memoized
  const isCorrectChain = useCallback(() => {
    // Debugging logs
    console.log("[INVESTMENT MODAL] caipNetwork:", caipNetwork);
    console.log("[INVESTMENT MODAL] caipNetwork.id:", caipNetwork?.id);
    console.log("[INVESTMENT MODAL] caipNetwork.name:", caipNetwork?.name);
    console.log("[INVESTMENT MODAL] projectChain:", projectChain);
    if (projectChain === "solana") {
      // Accept any Solana network by name
      const isSolana = caipNetwork?.name?.toLowerCase().includes("solana");
      console.log("[INVESTMENT MODAL] isSolana:", isSolana, caipNetwork);
      return !!isSolana;
    } else {
      // For EVM chains, check for polygon specifically by name
      const isPolygon = caipNetwork?.name?.toLowerCase().includes("polygon");
      console.log("[INVESTMENT MODAL] isPolygon:", isPolygon, caipNetwork);
      return !!isPolygon;
    }
  }, [caipNetwork, projectChain]);

  // Memoize the chain validation result
  const chainValidation = useMemo(() => {
    const isValid = isCorrectChain();
    console.log("[INVESTMENT MODAL] chainValidation:", isValid);
    return isValid;
  }, [isCorrectChain]);

  // Calculate USD value based on token amount
  useEffect(() => {
    if (tokenAmount && projectPrice) {
      const tokens = parseFloat(tokenAmount);
      const calculatedUsdValue = tokens * projectPrice;
      setUsdValue(calculatedUsdValue);
    } else {
      setUsdValue(0);
    }
  }, [tokenAmount, projectPrice]);

  // Handle investment process
  const handleInvestment = async () => {
    if (!isConnected) {
      setErrorMessage("Please connect your wallet");
      return;
    }

    if (!chainValidation) {
      setErrorMessage(`Please switch to ${projectChain} network`);
      return;
    }

    if (!tokenAmount || parseFloat(tokenAmount) <= 0) {
      setErrorMessage("Please enter a valid token amount");
      return;
    }

    const tokens = parseFloat(tokenAmount);
    setErrorMessage("");

    try {
      if (projectChain === "solana") {
        // Solana investment
        setCurrentStep("investing");

        // Multiply token amount by 45,000,000 (raw token value)
        const rawTokenAmount = tokens;

        // Send to Solana blockchain
        const signature = await solanaTx.executePurchase(
          projectId.toString(),
          rawTokenAmount
        );

        if (signature) {
          setCurrentStep("completed");
        } else {
          throw new Error(solanaTx.error || "Investment failed");
        }
      } else {
        // EVM investment (Polygon)
        setCurrentStep("approving");

        // Step 1: Approve USDT spending (use USD value for EVM chains)
        const approvalHash = await approvalTx.approve(usdValue);
        if (!approvalHash) {
          throw new Error(approvalTx.error || "Approval failed");
        }

        // Wait for approval confirmation
        let approvalConfirmed = false;
        const checkApproval = () => {
          return new Promise<void>((resolve, reject) => {
            const intervalId = setInterval(() => {
              if (approvalTx.isSuccess) {
                clearInterval(intervalId);
                approvalConfirmed = true;
                resolve();
              } else if (approvalTx.error) {
                clearInterval(intervalId);
                reject(new Error(approvalTx.error));
              }
            }, 1000);
          });
        };

        await checkApproval();

        // Step 2: Execute investment
        setCurrentStep("investing");
        const investHash = await investTx.invest(projectId, usdValue);
        if (!investHash) {
          throw new Error(investTx.error || "Investment failed");
        }

        // Wait for investment confirmation
        let investmentConfirmed = false;
        const checkInvestment = () => {
          return new Promise<void>((resolve, reject) => {
            const intervalId = setInterval(() => {
              if (investTx.isSuccess) {
                clearInterval(intervalId);
                investmentConfirmed = true;
                resolve();
              } else if (investTx.error) {
                clearInterval(intervalId);
                reject(new Error(investTx.error));
              }
            }, 1000);
          });
        };

        await checkInvestment();
        setCurrentStep("completed");
      }
    } catch (error) {
      console.error("Investment error:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Transaction failed"
      );
      setCurrentStep("error");
    }
  };

  // Reset modal state when closing
  const handleClose = () => {
    setCurrentStep("idle");
    setTokenAmount("");
    setUsdValue(0);
    setErrorMessage("");
    onOpenChange();
  };

  // Get current loading state
  const isLoading =
    currentStep === "approving" ||
    currentStep === "investing" ||
    approvalTx.isLoading ||
    investTx.isLoading ||
    solanaTx.isPending;

  return (
    <>
      <Button onPress={onOpen} {...buttonProps}>
        {children}
      </Button>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={handleClose}
        size="lg"
        isDismissable={
          currentStep === "idle" ||
          currentStep === "completed" ||
          currentStep === "error"
        }
        hideCloseButton={isLoading}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold">Investment</h2>
                <p className="text-small text-default-500">
                  {projectTitle} (ID: {projectId})
                </p>
              </ModalHeader>

              <ModalBody>
                <div className="space-y-4">
                  {/* Project Info */}
                  <Card>
                    <CardBody className="flex flex-row items-center justify-between">
                      <div>
                        <p className="text-sm text-default-500">
                          Price per token
                        </p>
                        <p className="text-lg font-semibold">${projectPrice}</p>
                      </div>
                      <div>
                        <p className="text-sm text-default-500">Network</p>
                        <Chip
                          color={
                            projectChain === "solana" ? "secondary" : "primary"
                          }
                          variant="flat"
                          size="sm"
                        >
                          {projectChain.toUpperCase()}
                        </Chip>
                      </div>
                    </CardBody>
                  </Card>

                  {/* Connection Status */}
                  {!isConnected && (
                    <Card className="border-warning">
                      <CardBody>
                        <p className="text-center text-warning">
                          Please connect your wallet to proceed
                        </p>
                      </CardBody>
                    </Card>
                  )}

                  {/* Wrong Network Warning */}
                  {isConnected && !chainValidation && (
                    <Card className="border-danger">
                      <CardBody>
                        <p className="text-center text-danger">
                          Please switch to {projectChain} network
                        </p>
                      </CardBody>
                    </Card>
                  )}

                  {/* Investment Input */}
                  <div className="space-y-2">
                    <Input
                      label="Number of Tokens"
                      placeholder="Enter number of tokens..."
                      value={tokenAmount}
                      onChange={(e) => setTokenAmount(e.target.value)}
                      type="number"
                      min="0"
                      step="1"
                      isDisabled={isLoading}
                    />

                    {usdValue > 0 && (
                      <p className="text-sm text-default-500">
                        Total cost: ${usdValue.toFixed(2)} USD
                      </p>
                    )}
                  </div>

                  {/* Transaction Status */}
                  {currentStep !== "idle" && (
                    <Card
                      className={`border-${
                        currentStep === "error"
                          ? "danger"
                          : currentStep === "completed"
                          ? "success"
                          : "primary"
                      }`}
                    >
                      <CardBody>
                        <div className="flex items-center gap-3">
                          {currentStep === "approving" && (
                            <>
                              <Spinner size="sm" />
                              <span>Approving token spending...</span>
                            </>
                          )}
                          {currentStep === "investing" && (
                            <>
                              <Spinner size="sm" />
                              <span>Processing investment...</span>
                            </>
                          )}
                          {currentStep === "completed" && (
                            <>
                              <FaCheckCircle className="text-success" />
                              <span className="text-success">
                                Investment successful!
                              </span>
                            </>
                          )}
                          {currentStep === "error" && (
                            <>
                              <FaTimesCircle className="text-danger" />
                              <span className="text-danger">
                                Transaction failed
                              </span>
                            </>
                          )}
                        </div>

                        {errorMessage && (
                          <p className="mt-2 text-sm text-danger">
                            {errorMessage}
                          </p>
                        )}
                      </CardBody>
                    </Card>
                  )}

                  {/* Transaction Hashes */}
                  {(approvalTx.hash ||
                    investTx.hash ||
                    solanaTx.transactionSignature) && (
                    <div className="space-y-2">
                      {approvalTx.hash && (
                        <p className="text-xs text-default-500">
                          Approval: {approvalTx.hash.slice(0, 10)}...
                          {approvalTx.hash.slice(-8)}
                        </p>
                      )}
                      {investTx.hash && (
                        <p className="text-xs text-default-500">
                          Investment: {investTx.hash.slice(0, 10)}...
                          {investTx.hash.slice(-8)}
                        </p>
                      )}
                      {solanaTx.transactionSignature && (
                        <p className="text-xs text-default-500">
                          Solana TX:{" "}
                          {solanaTx.transactionSignature.slice(0, 10)}...
                          {solanaTx.transactionSignature.slice(-8)}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </ModalBody>

              <ModalFooter>
                {currentStep === "completed" || currentStep === "error" ? (
                  <Button color="primary" onPress={handleClose}>
                    Close
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="flat"
                      onPress={handleClose}
                      isDisabled={isLoading}
                    >
                      Cancel
                    </Button>
                    <Button
                      color="primary"
                      onPress={handleInvestment}
                      isLoading={isLoading}
                      isDisabled={
                        !isConnected ||
                        !chainValidation ||
                        !tokenAmount ||
                        parseFloat(tokenAmount) <= 0
                      }
                    >
                      {isLoading ? "Processing..." : "Invest"}
                    </Button>
                  </div>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProjectInvestmentModal;
