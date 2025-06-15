import { AnimatePresence, motion } from "framer-motion";
import { Button, Spinner } from "@heroui/react";
import { IoWarningOutline as TransactionErrorIcon } from "react-icons/io5";
import { FaCheck as TransactionConfirmationIcon } from "react-icons/fa";
import { cn } from "@/lib/utils";

const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={cn("w-6 h-6", className)}
  >
    <path d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

const ErrorIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={cn("w-6 h-6", className)}
  >
    <path
      fillRule="evenodd"
      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75-4.365-9.75-9.75-9.75ZM9.97 8.47a.75.75 0 0 1 1.06 0L12 9.44l.97-.97a.75.75 0 0 1 1.06 1.06l-.97.97.97.97a.75.75 0 0 1-1.06 1.06L12 11.56l-.97.97a.75.75 0 1 1-1.06-1.06l.97-.97-.97-.97a.75.75 0 0 1 0-1.06Z"
      clipRule="evenodd"
    />
  </svg>
);

const ConfirmationMessage = ({
  onExit,
  onReturn,
}: {
  onExit: () => void;
  onReturn: () => void;
}) => (
  <div className="items-cneter flex flex-col justify-center gap-6 p-6 text-center">
    <div className="flex flex-col items-center justify-center text-danger-400">
      <TransactionConfirmationIcon className="text-4xl" />
      <h2 className="font-sen text-2xl font-bold">Purchased confirmed!</h2>
    </div>
    <p className="max-w-md font-jakarta text-lg text-primary dark:text-light">
      Your investment has been succesfully processed.
    </p>
    <div className="mt-4 flex justify-center gap-4">
      <Button
        variant="bordered"
        size="lg"
        className="z-50 rounded-none border-secondary bg-secondary font-sen text-lg font-bold text-white hover:bg-transparent hover:text-secondary lg:text-base"
        onClick={onReturn}
      >
        Return
      </Button>
      <Button
        variant="bordered"
        size="lg"
        className="z-50 rounded-none border-secondary bg-secondary font-sen text-lg font-bold text-white hover:bg-transparent hover:text-secondary lg:text-base"
        onClick={onExit}
      >
        Exit
      </Button>
    </div>
  </div>
);

const ErrorMessage = ({
  onExit,
  onReturn,
}: {
  onExit: () => void;
  onReturn: () => void;
}) => (
  <div className="items-cneter flex flex-col justify-center gap-6 p-6 text-center">
    <div className="flex flex-col items-center justify-center text-danger-400">
      <TransactionErrorIcon className="text-4xl" />
      <h2 className="font-sen text-2xl font-bold">Transaction Failed</h2>
    </div>
    <p className="max-w-md font-jakarta text-lg text-primary dark:text-light">
      There was an issue processing your investment. Please try again.
    </p>
    <div className="mt-4 flex justify-center gap-4">
      <Button
        variant="bordered"
        size="lg"
        className="z-50 rounded-none border-secondary bg-secondary font-sen text-lg font-bold text-white hover:bg-transparent hover:text-secondary lg:text-base"
        onClick={onReturn}
      >
        Return
      </Button>
      <Button
        variant="bordered"
        size="lg"
        className="z-50 rounded-none border-secondary bg-secondary font-sen text-lg font-bold text-white hover:bg-transparent hover:text-secondary lg:text-base"
        onClick={onExit}
      >
        Exit
      </Button>
    </div>
  </div>
);

const LoaderCore = ({
  loadingStates,
  currentStep = 0,
  error = false,
}: {
  loadingStates: { text: string }[];
  currentStep: number;
  error?: boolean;
}) => (
  <div className="relative mx-auto mt-40 flex max-w-xl flex-col justify-start">
    {loadingStates.map((loadingState, index) => {
      const isActive = index === currentStep;
      const isCompleted = index < currentStep;
      const isErrored = error && index >= currentStep;

      return (
        <motion.div
          key={index}
          className="mb-4 flex gap-2 text-left"
          initial={{ opacity: 0, y: -20 }}
          animate={{
            opacity: isActive || isErrored ? 1 : 0.5,
            y: -currentStep * 40,
          }}
          transition={{ duration: 0.5 }}
        >
          <div>
            {isErrored ? (
              <ErrorIcon className="text-red-500" />
            ) : isCompleted ? (
              <CheckIcon className="text-lime-500" />
            ) : isActive ? (
              <Spinner
                color="primary"
                size="sm"
                classNames={{
                  circle1: ["border-primary border-1"],
                  circle2: ["border-secondary"],
                }}
              />
            ) : (
              <CheckIcon className="text-black opacity-50 dark:text-white" />
            )}
          </div>
          <span
            className={cn(
              "text-black dark:text-white",
              isErrored && "text-red-500 font-bold",
              isActive && !isErrored && "text-lime-500 font-bold"
            )}
          >
            {loadingState.text}
          </span>
        </motion.div>
      );
    })}
  </div>
);

export const ProjectInvestmentTransactionLoader = ({
  loadingStates,
  loading,
  currentStep,
  error,
  isConfirmed,
  onExit,
  onReturn,
}: {
  loadingStates: { text: string }[];
  loading?: boolean;
  currentStep: number;
  error?: boolean;
  isConfirmed?: boolean;
  onExit: () => void;
  onReturn: () => void;
}) => (
  <AnimatePresence>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex h-full w-full items-center justify-center backdrop-blur-2xl"
    >
      <div className="relative h-96">
        {loading && !error && !isConfirmed && (
          <LoaderCore
            loadingStates={loadingStates}
            currentStep={currentStep}
            error={error}
          />
        )}

        {isConfirmed && (
          <ConfirmationMessage onExit={onExit} onReturn={onReturn} />
        )}
        {error && <ErrorMessage onExit={onExit} onReturn={onReturn} />}
      </div>
      <div className="absolute inset-x-0 bottom-0 z-20 h-full bg-white bg-gradient-to-t [mask-image:radial-gradient(900px_at_center,transparent_30%,white)] dark:bg-black" />
    </motion.div>
  </AnimatePresence>
);
