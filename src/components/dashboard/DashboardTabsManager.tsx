"use client";

import React, { useEffect, useState } from "react";
import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import { useTranslations } from "next-intl";
import { TbMessage2 } from "react-icons/tb";
import { LuWallet } from "react-icons/lu";
import { MdOutlineBookmark } from "react-icons/md";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/ui/useIsMobile";

// Component imports
import Portfolio from "@/sections/dashboard/Portfolio";
import Movements from "@/sections/dashboard/Movements";
import Saved from "@/sections/dashboard/Saved";

export default function DashboardTabsManager() {
  const t = useTranslations("Dashboard");
  const isMobile = useIsMobile();

  const [selected, setSelected] = useState<string>("portfolio");

  return (
    <div className="w-full px-4 py-6 lg:px-6">
      <Tabs
        aria-label="Dashboard tabs"
        selectedKey={selected}
        onSelectionChange={(key) => setSelected(key as string)}
        variant="underlined"
        color="primary"
        className="w-full"
        classNames={{
          tabList:
            "gap-6 w-full relative rounded-none p-0 border-b border-divider",
          cursor: "w-full bg-primary",
          tab: "max-w-fit px-0 h-12",
          tabContent: "group-data-[selected=true]:text-primary text-minimal",
        }}
      >
        <Tab
          key="portfolio"
          title={
            <div className="flex items-center space-x-2">
              <LuWallet />
              <span>{t("tabs.portfolio.desktopTitle")}</span>
            </div>
          }
        >
          <Card className="bg-transparent shadow-none">
            <CardBody className="p-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Portfolio />
              </motion.div>
            </CardBody>
          </Card>
        </Tab>

        <Tab
          key="movements"
          title={
            <div className="flex items-center space-x-2">
              <TbMessage2 />
              <span>{t("tabs.movements.desktopTitle")}</span>
            </div>
          }
        >
          <Card className="bg-transparent shadow-none">
            <CardBody className="p-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Movements />
              </motion.div>
            </CardBody>
          </Card>
        </Tab>

        <Tab
          key="saved"
          title={
            <div className="flex items-center space-x-2">
              <MdOutlineBookmark />
              <span>{t("tabs.saved.title")}</span>
            </div>
          }
        >
          <Card className="bg-transparent shadow-none">
            <CardBody className="p-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Saved />
              </motion.div>
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
}
