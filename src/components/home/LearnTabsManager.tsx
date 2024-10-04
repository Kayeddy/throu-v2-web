"use client";

import Blog from "@/sections/home/Learn/Blog";
import Home from "@/sections/home/Learn/Home";
import Faqs from "@/sections/home/Learn/Faqs";
import { Tabs, Tab } from "@nextui-org/react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useIsMobile } from "@/utils/hooks/shared/useIsMobile";

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
    <div className="flex flex-col px-4 mt-20 w-full h-full">
      <div className="flex w-full flex-col h-full">
        <Tabs
          aria-label="Options"
          isVertical={isMobile ? false : true}
          radius="md"
          color="primary"
          selectedKey={selected}
          onSelectionChange={(key) => setSelected(key as string)}
        >
          {tabs.map((tab) => (
            <Tab key={tab.key} title={tab.name} className="w-full">
              <div className="ml-4 w-full">{tab.content}</div>
            </Tab>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
