"use client";
import { useUser } from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { BsPlus as PlusIcon } from "react-icons/bs";
import { useUserBalance } from "@/hooks/blockchain";
import { useEffect, useState } from "react";
import { convertBalanceUnits } from "@/lib/utils";
import { Spinner } from "@heroui/react";

export default function Header() {
  const [convertedUsdtBalance, setConvertedUsdtBalance] = useState("0.00");

  const { isLoading: isUsdtBalanceLoading, wallet } = useUserBalance();

  const { user, isLoaded } = useUser();

  const t = useTranslations("Dashboard.header");

  const usdtBalance = wallet?.usdt?.formatted || "0";
  const isLoading = isUsdtBalanceLoading || !isLoaded;

  useEffect(() => {
    if (
      !isUsdtBalanceLoading &&
      usdtBalance &&
      typeof usdtBalance === "bigint"
    ) {
      setConvertedUsdtBalance(convertBalanceUnits(usdtBalance, 6).toFixed(2));
    }
  }, [isUsdtBalanceLoading, usdtBalance]);

  return (
    <div className="relative flex min-h-fit w-full flex-col items-center justify-center bg-[url('https://wallpaperaccess.com/full/38582.jpg')] bg-cover bg-center p-6">
      <div className="flex w-full flex-col items-center justify-center gap-6">
        <Image
          alt="profile-image"
          width={50}
          height={50}
          src={user?.imageUrl ?? ""}
          className="z-10 h-24 w-24 rounded-full object-cover"
        />
        {isLoading ? (
          <Spinner color="secondary" size="lg" />
        ) : (
          <div className="z-10 flex w-[90vw] flex-col items-center justify-center gap-2 rounded-md bg-black/50 py-2 font-sen text-light lg:w-[30vw]">
            <p className="text-xl font-bold">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-lg font-normal">
              {user?.primaryEmailAddress?.emailAddress}
            </p>
            <div className="mt-6 flex flex-col items-center justify-center">
              <p className="font-jakarta text-sm">{t("balance")}</p>
              <span className="flex flex-row items-center justify-center gap-2">
                <PlusIcon className="border border-light" />
                <p className="text-medium font-bold">
                  {convertedUsdtBalance} USDT
                </p>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
