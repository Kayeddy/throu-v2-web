"use client";

import Movements from "@/sections/dashboard/Movements";
import Portfolio from "@/sections/dashboard/Portfolio";
import Saved from "@/sections/dashboard/Saved";
import { useIsMobile } from "@/utils/hooks/shared/useIsMobile";
import { Tab, Tabs } from "@nextui-org/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useAccount } from "wagmi";
import { useGetProject } from "@/utils/hooks/smart_contracts/useGetProjects";

export default function DashboardTabsManager({
  isSavedParam,
}: {
  isSavedParam: string | undefined;
}) {
  const t = useTranslations("Dashboard.tabs"); // Translations for the "Dashboard" namespace
  const projectId = 0; // Your specific project ID
  const [selected, setSelected] = useState<string>("Portfolio");
  const isMobile = useIsMobile();
  const { isConnected, address } = useAccount();

  // Conditionally fetch project data only if connected
  const { project, error, isPending } = useGetProject(projectId || 0);

  // Memoized to check if the user is a project holder
  const isHolder = useMemo(() => {
    return project?.projectHolders?.includes(address?.toString() ?? "");
  }, [project, address]);

  // Fade-in animation for tab transitions
  const fadeInAnimation = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: 20, transition: { duration: 0.3 } },
  };

  // Define the tabs with translated titles
  const tabs = [
    {
      id: 1,
      name: isMobile ? t("portfolio.mobileTitle") : t("portfolio.desktopTitle"),
      key: "Portfolio",
      content: isPending ? (
        <p>Loading...</p>
      ) : isHolder ? (
        <Portfolio project={project} />
      ) : (
        <p>No options available to show</p>
      ),
    },
    {
      id: 2,
      name: isMobile ? t("movements.mobileTitle") : t("movements.desktopTitle"),
      key: "Movements",
      content: <Movements />,
    },
    {
      id: 3,
      name: t("saved.title"),
      key: "Saved",
      content: <Saved />,
    },
  ];

  // UseEffect to set the selected tab based on the param
  useEffect(() => {
    if (isSavedParam && selected !== "Saved") {
      setSelected("Saved");
    } else if (!isSavedParam && selected !== "Portfolio") {
      setSelected("Portfolio");
    }
  }, [isSavedParam, selected]);

  return (
    <div className={`w-full p-4 lg:p-0`}>
      {isConnected ? (
        <Tabs
          selectedKey={selected}
          onSelectionChange={(key) => setSelected(String(key))}
          aria-label="options"
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
