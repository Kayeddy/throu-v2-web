import { useEffect, useState, useMemo } from "react";
import { convertBalanceUnits } from "@/lib/utils";
import { emojiAvatarForAddress } from "@/utils/helpers/walletButtonStyleGenerator";
import useGetUserUsdtBalance from "@/utils/hooks/smart_contracts/useGetUserUsdtBalance";
import {
  Card,
  CardBody,
  CardFooter,
  Chip,
  Image,
  Skeleton,
} from "@heroui/react";
import { useAccount, useBalance } from "wagmi";
import { MdLiveHelp as HelpIcon } from "react-icons/md";
import Link from "next/link";
import { useIsMobile } from "@/utils/hooks/shared/useIsMobile";
import { useTranslations } from "next-intl";

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
  const { connector, address } = useAccount();
  const { data: balance, isLoading: isNativeTokenBalanceLoading } = useBalance({
    address,
  });
  const { isLoading: isUsdtBalanceLoading, usdtBalance } =
    useGetUserUsdtBalance();
  const [convertedUsdtBalance, setConvertedUsdtBalance] = useState("0.00");
  const isMobile = useIsMobile();

  const { color: backgroundColor, emoji } = useMemo(
    () => emojiAvatarForAddress(address ?? ""),
    [address]
  );

  const connectorIconUrl = useMemo(() => {
    if (connector?.icon) return connector.icon;
    switch (connector?.name?.toLowerCase().trim()) {
      case "metamask":
        return "/assets/wallets/metamask_logo.png";
      case "coinbaseWallet":
        return "/assets/wallets/coinbase_logo.png";
      case "walletConnect":
        return "/assets/wallets/wallet_connect_logo.png";
      case "safe":
        return "/assets/wallets/safe_logo.png";
      default:
        return "/assets/wallets/wallet_connect_logo.png";
    }
  }, [connector]);

  const isLoading =
    isNativeTokenBalanceLoading || isUsdtBalanceLoading || usdtBalance === null;
  const requiredUsdt =
    investmentAmount && projectTokenPrice
      ? (investmentAmount * projectTokenPrice).toFixed(2)
      : "0";
  const convertedNativeBalance =
    !isLoading && balance ? convertBalanceUnits(balance.value).toFixed(2) : 0;

  useEffect(() => {
    if (!isUsdtBalanceLoading && usdtBalance) {
      setConvertedUsdtBalance(convertBalanceUnits(usdtBalance, 18).toFixed(2));
    }
  }, [isUsdtBalanceLoading, usdtBalance]);

  const hasEnoughBalance = () =>
    parseFloat(convertedUsdtBalance) > parseFloat(requiredUsdt);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 pt-10 lg:flex-row lg:pt-0">
      <Card
        isFooterBlurred
        radius="lg"
        className="flex h-[20vh] w-full items-center justify-center border-none bg-light/10 p-4 dark:bg-dark/50 lg:h-[250px] lg:w-[230px]"
      >
        <Image
          src={connectorIconUrl}
          width={isMobile ? 100 : 200}
          height={isMobile ? 100 : 200}
          alt={`${connector?.name ?? t("unknownWallet")} wallet icon`}
          className="mx-auto object-contain antialiased"
          loading="lazy"
        />
        <CardFooter className="absolute inset-x-0 bottom-1 z-10 mx-auto w-[calc(100%_-_8px)] justify-center gap-1 overflow-hidden rounded-large border-1 border-white/20 py-1 shadow-small before:rounded-xl before:bg-light/50">
          <p className="font-jakarta text-tiny font-semibold text-primary dark:text-minimal">
            {t("provider")}
          </p>
          <p className="truncate rounded-md bg-black/20 p-1 text-tiny font-semibold text-tertiary dark:text-secondary">
            {connector?.name ?? t("unknownWallet")}
          </p>
        </CardFooter>
      </Card>

      <Card className="max-w-full border-none bg-light/10 dark:bg-dark/50 lg:h-[250px]">
        <Link href={`../../learn`} className="absolute right-2 top-2 z-10">
          <HelpIcon className="text-lg text-tertiary dark:text-secondary" />
        </Link>

        <CardBody className="flex flex-col items-start justify-start gap-2 p-4 font-jakarta">
          <span
            className="mx-auto flex h-[100px] w-[100px] items-center justify-center rounded-full text-center text-6xl"
            style={{ background: backgroundColor }}
          >
            {emoji}
          </span>

          <p className="max-w-full self-center truncate text-center text-sm">
            {address}
          </p>

          <div className="my-auto flex w-full flex-row items-center justify-center gap-2">
            {isLoading ? (
              <>
                <Skeleton className="my-1 h-4 w-36" />
                <Skeleton className="my-1 h-4 w-36" />
              </>
            ) : (
              <>
                <Chip color="secondary" variant="dot">
                  <p className="font-jakarta font-semibold">
                    {convertedNativeBalance} {balance?.symbol}
                  </p>
                </Chip>

                <Chip
                  color={!hasEnoughBalance() ? "danger" : "secondary"}
                  variant="dot"
                  className="font-jakarta font-semibold"
                >
                  <p className="font-jakarta font-semibold">
                    {convertedUsdtBalance} USDT
                  </p>
                </Chip>
              </>
            )}
          </div>

          {!isLoading && !hasEnoughBalance() && (
            <p className="animate-pulse text-center text-tiny text-danger-500">
              {t("notEnoughBalance", { requiredUsdt })}
            </p>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
