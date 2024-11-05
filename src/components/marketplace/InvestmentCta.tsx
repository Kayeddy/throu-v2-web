"use client";

import { useEffect, useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { MdCurrencyExchange as ConversionIcon } from "react-icons/md";
import { MdGeneratingTokens as TokenIcon } from "react-icons/md";
import { CiDollar as UsdtIcon } from "react-icons/ci";
import ProjectInvestmentModal from "../modals/ProjectInvestmentModal";
import { useAccount } from "wagmi";
import { useTranslations } from "next-intl";

const CtaHeader = ({
  projectName = "Salón Prado",
}: {
  projectName?: string;
}) => {
  const t = useTranslations("Marketplace.project.investmentCta.header");
  return (
    <div className="flex flex-col items-center justify-center gap-4 text-primary dark:text-light">
      <h3 className="font-sen text-xl font-bold">
        {t("title", { projectName })}
      </h3>
      <p className="font-jakarta text-sm">{t("subtitle")}</p>
    </div>
  );
};

const CtaBody = ({
  investmentAmount,
  setInvestmentAmount,
  projectTokenPrice,
}: {
  investmentAmount: number;
  setInvestmentAmount: (amount: number) => void;
  projectTokenPrice: number | null;
}) => {
  const t = useTranslations("Marketplace.project.investmentCta.body");

  const [inputValue, setInputValue] = useState<string>("");
  const [convertedUsdt, setConvertedUsdt] = useState<string>(""); // State for converted USDT value

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === "") {
      setInputValue("");
      setInvestmentAmount(0);
      setConvertedUsdt(""); // Reset converted value
      return;
    }

    const numericValue = parseInt(value, 10);

    if (!isNaN(numericValue) && numericValue >= 1) {
      setInputValue(value);
      setInvestmentAmount(numericValue);
      setConvertedUsdt(""); // Clear converted USDT value until conversion button is pressed
    }
  };

  const handleInputBlur = () => {
    if (inputValue === "" || parseInt(inputValue, 10) < 1) {
      setInputValue("");
      setInvestmentAmount(0);
      setConvertedUsdt("");
    }
  };

  const handleConversion = async () => {
    if (investmentAmount > 0 && projectTokenPrice) {
      const usdtValue = (investmentAmount * projectTokenPrice).toFixed(2);
      setConvertedUsdt(usdtValue);
    }
  };

  return (
    <div className="flex flex-row items-center justify-center gap-4 text-primary dark:text-light">
      <div className="flex flex-col items-start justify-start gap-6">
        <Input
          startContent={
            <div className="flex flex-row items-center justify-center gap-1 text-minimal group-data-[focus=true]:text-primary dark:group-data-[focus=true]:text-light">
              <TokenIcon />
              <p className="font-jakarta text-sm">{t("tokensLabel")}</p>
            </div>
          }
          type="number"
          isRequired
          size="sm"
          color="secondary"
          variant="underlined"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          className="text-minimal group-data-[focus=false]:text-minimal group-data-[focus=true]:text-primary dark:group-data-[focus=true]:text-light"
          classNames={{
            input: [
              "dark:group-data-[focus=true]:text-light",
              "group-data-[focus=true]:text-primary",
              "group-data-[focus=false]:text-slate-200",
              "font-bold",
            ],
          }}
          onWheel={(e) => e.currentTarget.blur()}
          min={1}
        />
        <Input
          startContent={
            <div className="flex flex-row items-center justify-center gap-1 text-minimal">
              <UsdtIcon />
              <p className="font-jakarta text-sm">{t("usdtLabel")}</p>
            </div>
          }
          type="text"
          color="secondary"
          size="sm"
          variant="underlined"
          disabled
          isReadOnly
          value={convertedUsdt}
          classNames={{
            input: [
              "font-bold text-minimal",
              "group-data-[focus=true]:text-slate-200",
            ],
          }}
          className="text-minimal"
        />
      </div>
      <div className="mt-4">
        <Button
          size="sm"
          variant="shadow"
          className="bg-light/50 backdrop-blur-md dark:bg-dark/50"
          onClick={handleConversion} // Trigger conversion on button press
        >
          <ConversionIcon className="text-lg text-primary dark:text-light" />
        </Button>
      </div>
    </div>
  );
};

const CtaFooter = ({
  projectTokenPrice,
  investmentAmount,
}: {
  projectTokenPrice: number | null;
  investmentAmount: number;
}) => {
  const t = useTranslations("Marketplace.project.investmentCta.footer");
  const [showError, setShowError] = useState(false);
  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => setShowError(false), 1000); // Reset error after 2 seconds
      return () => clearTimeout(timer);
    }
  }, [showError]);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <p className="font-jakarta text-sm text-minimal">
        {t("acquirePercentage")}
      </p>
      <ProjectInvestmentModal
        projectTokenPrice={projectTokenPrice}
        investmentAmount={investmentAmount}
        triggerButton={
          <Button
            onClick={() => {
              if (isConnected && address && investmentAmount < 1)
                setShowError(true);
            }}
            variant="bordered"
            size="lg"
            className="w-full rounded-none border-secondary bg-secondary font-sen text-lg font-bold text-white hover:bg-transparent hover:text-secondary lg:text-base"
          >
            {showError ? t("error") : t("investButton")}
          </Button>
        }
      />
    </div>
  );
};

export default function InvestmentCta({
  projectInfo,
}: {
  projectInfo: ProjectDetails | null;
}) {
  const [investmentAmount, setInvestmentAmount] = useState<number>(0);

  return (
    <div className="flex h-fit w-80 flex-col items-center justify-center gap-6 rounded-md bg-light/30 p-6 dark:bg-dark/50">
      <CtaHeader />
      <CtaBody
        investmentAmount={investmentAmount}
        projectTokenPrice={projectInfo?.projectPrice ?? 0}
        setInvestmentAmount={setInvestmentAmount}
      />
      <CtaFooter
        projectTokenPrice={projectInfo?.projectPrice ?? 0}
        investmentAmount={investmentAmount}
      />
    </div>
  );
}
