"use client";

import Blog from "@/sections/home/Learn/Blog";
import Home from "@/sections/home/Learn/Home";
import Faqs from "@/sections/home/Learn/Faqs";
import { Tabs, Tab } from "@heroui/react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useIsMobile } from "@/hooks/ui/useIsMobile";

import { motion } from "framer-motion";

export default function LearnTabsManager() {
  const t = useTranslations("Learn.tabs"); // Using translations for the tabs
  const isMobile = useIsMobile(); // Using the isMobile hook to check if the user is on a mobile device

  const [selected, setSelected] = useState<string>("Home");

  const handleSectionChange = (key: string) => {
    setSelected(key);
  };

  const tabs = [
    {
      id: 1,
      name: t("default"), // Translated tab name
      key: "Home",
      content: <Home handleSectionChange={handleSectionChange} />,
    },
    {
      id: 2,
      name: t("blog"), // Translated tab name
      key: "Blog",
      content: <Blog />,
    },
    {
      id: 3,
      name: t("faqs"), // Translated tab name
      key: "FAQs",
      content: <Faqs />,
    },
  ];

  return (
    <motion.div
      className="mt-20 flex h-full w-full flex-col px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1, duration: 1 }}
    >
      <div className="flex h-full w-full flex-col">
        <Tabs
          aria-label="Options"
          isVertical={isMobile ? false : true}
          radius="md"
          color="primary"
          selectedKey={selected}
          onSelectionChange={(key) => setSelected(key as string)}
          classNames={{
            tabList: "bg-transparent",
          }}
        >
          {tabs.map((tab) => (
            <Tab key={tab.key} title={tab.name} className="w-full">
              <div className="ml-4 w-full">{tab.content}</div>
            </Tab>
          ))}
        </Tabs>
      </div>
    </motion.div>
  );
}
