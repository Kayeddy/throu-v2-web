"use client";

import { Alert, Button } from "@heroui/react";
import { useChainErrorHandler } from "@/hooks/dual-chain/useChainErrorHandler";
import { IoWarningOutline, IoCloseOutline } from "react-icons/io5";

export const ChainErrorDisplay = () => {
  const { currentError, hasError, clearError, getSuggestedActions } =
    useChainErrorHandler();

  if (!hasError || !currentError) return null;

  const actions = getSuggestedActions(currentError);

  const getAlertColor = () => {
    switch (currentError.type) {
      case "CONNECTION":
        return "warning";
      case "TRANSACTION":
        return "danger";
      case "NETWORK":
        return "warning";
      case "TIMEOUT":
        return "default";
      default:
        return "danger";
    }
  };

  return (
    <div className="fixed top-4 right-4 z-[1000] max-w-md animate-in slide-in-from-top-2">
      <Alert
        color={getAlertColor()}
        variant="solid"
        startContent={<IoWarningOutline className="w-5 h-5" />}
        endContent={
          <Button
            isIconOnly
            size="sm"
            variant="light"
            onPress={clearError}
            className="text-current"
          >
            <IoCloseOutline className="w-4 h-4" />
          </Button>
        }
        className="mb-2"
      >
        <div className="flex flex-col gap-2">
          <div className="font-medium">
            {currentError.chainType.toUpperCase()} Chain Error
          </div>
          <div className="text-sm opacity-90">{currentError.message}</div>

          {actions.length > 0 && (
            <div className="flex gap-2 mt-2">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  size="sm"
                  variant={action.primary ? "solid" : "bordered"}
                  color={action.primary ? "primary" : "default"}
                  onPress={action.action}
                  className="text-xs"
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </Alert>
    </div>
  );
};
