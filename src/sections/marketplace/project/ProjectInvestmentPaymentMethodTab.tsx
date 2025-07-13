import { useEffect, useState, useMemo } from "react";
import { convertBalanceUnits } from "@/lib/utils";
// import { emojiAvatarForAddress } from "@/utils/helpers/walletButtonStyleGenerator"; // DISABLED: Deleted file
import { useUserBalance } from "@/hooks/blockchain/wallet";
import {
  Card,
  CardBody,
  CardFooter,
  Chip,
  Image,
  Skeleton,
} from "@heroui/react";
// import { useAccount, useBalance } from "wagmi"; // DISABLED: Will be re-implemented with 2025 standards
import { MdLiveHelp as HelpIcon } from "react-icons/md";
import Link from "next/link";
import { useIsMobile } from "@/hooks/ui/useIsMobile";
import { useTranslations } from "next-intl";

// Temporary wallet style generator to replace deleted utility
const emojiAvatarForAddress = (address: string) => {
  return {
    color: "#6366f1",
    emoji: "🔗",
  };
};

// Mock types for temporarily disabled wagmi functionality
type MockConnector = {
  name?: string;
  icon?: string;
} | null;

type MockBalance = {
  value: bigint;
  symbol: string;
} | null;

interface ProjectPaymentTabProps {
  investmentAmount: number | null;
  projectTokenPrice: number | null;
}

export default function ProjectInvestmentPaymentMethodTab({
  investmentAmount = 0,
  projectTokenPrice = 0,
}: ProjectPaymentTabProps) {
  const t = useTranslations(
    "Marketplace.project.projectInvestmentModal.paymentMethodTab"
  );

  // TODO: Re-implement with 2025 wallet standards - All wallet functionality temporarily disabled
  const { isLoading: isUsdtBalanceLoading, wallet } = useUserBalance();
  const usdtBalance = wallet?.usdt?.formatted || "0";
  const [convertedUsdtBalance, setConvertedUsdtBalance] = useState("0.00");
  const isMobile = useIsMobile();

  const requiredUsdt =
    investmentAmount && projectTokenPrice
      ? (investmentAmount * projectTokenPrice).toFixed(2)
      : "0";

  useEffect(() => {
    if (
      !isUsdtBalanceLoading &&
      usdtBalance &&
      typeof usdtBalance === "bigint"
    ) {
      setConvertedUsdtBalance(convertBalanceUnits(usdtBalance, 6).toFixed(2));
    }
  }, [isUsdtBalanceLoading, usdtBalance]);

  const hasEnoughBalance = () =>
    parseFloat(convertedUsdtBalance) > parseFloat(requiredUsdt);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 pt-10 lg:pt-0">
      <Card className="w-full max-w-md border-none bg-light/10 dark:bg-dark/50 p-6">
        <CardBody className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="text-6xl">🔗</div>

          <h3 className="text-lg font-semibold text-primary dark:text-light">
            {t("provider")} - Coming Soon
          </h3>

          <p className="text-sm text-minimal">
            Wallet connection will be re-implemented with 2025 standards
          </p>

          <div className="flex flex-col gap-2 w-full">
            <Chip color="secondary" variant="flat" className="w-full">
              <p className="font-jakarta font-semibold">
                {convertedUsdtBalance} USDT Available
              </p>
            </Chip>

            <Chip
              color={!hasEnoughBalance() ? "danger" : "success"}
              variant="flat"
              className="w-full"
            >
              <p className="font-jakarta font-semibold">
                {requiredUsdt} USDT Required
              </p>
            </Chip>
          </div>

          {!hasEnoughBalance() && (
            <p className="text-center text-tiny text-danger-500">
              {t("notEnoughBalance", { requiredUsdt })}
            </p>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
