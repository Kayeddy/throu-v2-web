"use client";

import Movements from "@/sections/dashboard/Movements";
import Portfolio from "@/sections/dashboard/Portfolio";
import Saved from "@/sections/dashboard/Saved";
import { useIsMobile } from "@/utils/hooks/shared/useIsMobile";
import { Tab, Tabs } from "@nextui-org/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export default function DashboardTabsManager({
  isSavedParam,
}: {
  isSavedParam: string | undefined;
}) {
  const t = useTranslations("Dashboard"); // Get the translations for the "Dashboard" namespace
  const [selected, setSelected] = useState<string>("Portfolio");
  const isMobile = useIsMobile(); // Detect if the user is on mobile

  // Use fade-in animation for tab transitions
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
      content: <Portfolio />,
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

  // Update the selected tab based on the `isSavedParam` prop
  useEffect(() => {
    if (isSavedParam) {
      setSelected("Saved");
    } else {
      setSelected("Portfolio");
    }
  }, [isSavedParam]);

  return (
    <div className={`w-full lg:mt-10 ${isMobile && "p-4"}`}>
      <Tabs
        selectedKey={selected}
        onSelectionChange={(key) => setSelected(String(key))}
        aria-label={t("options")} // Translated "Options" label for accessibility
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
    </div>
  );
}
