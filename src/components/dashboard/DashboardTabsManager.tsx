"use client";

import Movements from "@/sections/dashboard/Movements";
import Portfolio from "@/sections/dashboard/Portfolio";
import Saved from "@/sections/dashboard/Saved";
import { useIsMobile } from "@/utils/hooks/shared/useIsMobile";
import { Tab, Tabs } from "@nextui-org/react";
import { AnimatePresence, motion } from "framer-motion";

export default function DashboardTabsManager() {
  const fadeInAnimation = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: 20, transition: { duration: 0.3 } },
  };

  const isMobile = useIsMobile();
  const tabs = [
    {
      id: 1,
      name: isMobile ? "Proyectos" : "Mis proyectos",
      key: "Portfolio",
      content: <Portfolio />,
    },
    {
      id: 2,
      name: isMobile ? "Balance" : "Balances y movimientos",
      key: "Balance",
      content: <Movements />,
    },
    {
      id: 3,
      name: "Guardados",
      key: "Saved",
      content: <Saved />,
    },
  ];
  return (
    <div className={`w-full lg:mt-10 ${isMobile && "p-4"}`}>
      <Tabs
        aria-label="Options"
        color="primary"
        variant="underlined"
        classNames={{
          tabList:
            "lg:gap-[100px] gap-10 w-full relative rounded-none p-0  border-divider",
          cursor: "w-full bg-secondary",
          tab: "max-w-fit px-0 h-12",
          tabContent:
            "group-data-[selected=true]:text-secondary group-data-[selected=true]:font-semibold font-jakarta text-primary text-base",
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
