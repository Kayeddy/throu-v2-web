"use client";

import Movements from "@/sections/dashboard/Movements";
import Portfolio from "@/sections/dashboard/Portfolio";
import Saved from "@/sections/dashboard/Saved";
import { useIsMobile } from "@/utils/hooks/shared/useIsMobile";
import { Spinner, Tab, Tabs } from "@nextui-org/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useAccount } from "wagmi";
import { useGetProject } from "@/utils/hooks/smart_contracts/useGetProjects";
import useGetInvestorInfo from "@/utils/hooks/smart_contracts/useGetInvestorInfo";

export default function DashboardTabsManager({
  isSavedParam,
}: {
  isSavedParam: string | undefined;
}) {
  const t = useTranslations("Dashboard");
  const projectId = 0;
  const [selected, setSelected] = useState<string>("Portfolio");
  const isMobile = useIsMobile();
  const { isConnected, address } = useAccount();

  // Fetch project data and investor information
  const {
    project,
    error: projectError,
    isPending: isProjectPending,
  } = useGetProject(projectId || 0);
  const {
    userInvestmentData,
    error: investorError,
    isPending: isInvestorPending,
  } = useGetInvestorInfo();

  // Memoized to check if the user is a project holder
  const isHolder = useMemo(() => {
    return project?.projectHolders?.includes(address?.toString() ?? "");
  }, [project, address]);

  const tokensCountValue =
    userInvestmentData && typeof userInvestmentData[0] === "bigint"
      ? Number(userInvestmentData[0])
      : 0;

  // Fade-in animation for tab transitions
  const fadeInAnimation = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: 20, transition: { duration: 0.3 } },
  };

  // Set the initial tab based on `isSavedParam`
  useEffect(() => {
    if (isSavedParam) {
      setSelected("Saved");
    }
  }, [isSavedParam]);

  const renderPortfolioContent = () => {
    if (isProjectPending || isInvestorPending) {
      return <Spinner color="secondary" />;
    }

    if (projectError || investorError) {
      return (
        <p className="text-danger-500">{t("tabs.portfolio.errorMessage")}</p>
      );
    }

    if (!isHolder || tokensCountValue <= 0) {
      return (
        <p className="text-warning-500">
          {t("tabs.portfolio.noInvestmentMessage")}
        </p>
      );
    }

    return (
      <Portfolio project={project} userInvestmentData={userInvestmentData} />
    );
  };

  const tabs = [
    {
      id: 1,
      name: isMobile
        ? t("tabs.portfolio.mobileTitle")
        : t("tabs.portfolio.desktopTitle"),
      key: "Portfolio",
      content: renderPortfolioContent(),
    },
    {
      id: 2,
      name: isMobile
        ? t("tabs.movements.mobileTitle")
        : t("tabs.movements.desktopTitle"),
      key: "Movements",
      content: <Movements />,
    },
    {
      id: 3,
      name: t("tabs.saved.title"),
      key: "Saved",
      content: <Saved />,
    },
  ];

  return (
    <div className="w-full p-4 lg:p-0">
      {isConnected ? (
        <Tabs
          selectedKey={selected}
          onSelectionChange={(key) => setSelected(String(key))}
          aria-label="Dashboard tabs"
          color="primary"
          variant="underlined"
          classNames={{
            tabList:
              "lg:gap-[100px] gap-10 w-full relative rounded-none p-0 border-divider",
            cursor: "w-full bg-secondary",
            tab: "max-w-fit px-0 h-12",
            tabContent:
              "group-data-[selected=true]:text-secondary dark:group-data-[selected=true]:text-secondary group-data-[selected=true]:font-semibold font-jakarta text-primary dark:text-light text-base",
          }}
        >
          {tabs.map((tab) => (
            <Tab key={tab.key} title={tab.name}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={tab.key}
                  variants={fadeInAnimation}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  {tab.content}
                </motion.div>
              </AnimatePresence>
            </Tab>
          ))}
        </Tabs>
      ) : (
        <div>
          <p className="animate-pulse font-sen text-xl text-danger-400">
            {t("connectWalletMessage")}
          </p>
        </div>
      )}
    </div>
  );
}
