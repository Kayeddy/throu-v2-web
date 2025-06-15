"use client";

import { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
} from "@heroui/react";
import Image from "next/image";
import { useClerk, useUser } from "@clerk/nextjs";
import { FaRegUser } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { ImProfile } from "react-icons/im";
import { FaBookmark } from "react-icons/fa";
import { useLocale, useTranslations } from "next-intl";
import ThemeChanger from "./ThemeChanger";
import Link from "next/link";
import LogoutButton from "./LogoutButton";
import { AnimatePresence, motion } from "framer-motion";

export default function UserButtonMenu() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { user } = useUser();
  const t = useTranslations("Shared.userButtonMenu");
  const locale = useLocale();
  const { openUserProfile } = useClerk();

  const userMenuItems = [
    {
      name: t("profile"),
      icon: <ImProfile />,
      callback: openUserProfile,
    },
    {
      name: t("dashboard"),
      icon: <MdDashboard />,
      link: `/${locale}/dashboard`,
    },
    {
      name: t("saved"),
      icon: <FaBookmark />,
      link: `/${locale}/dashboard?saved=true`,
    },
  ];

  return (
    <Popover
      showArrow
      placement="bottom"
      offset={10}
      isOpen={isOpen}
      onOpenChange={setIsOpen}
    >
      <PopoverTrigger>
        {user?.hasImage ? (
          <button
            type="button"
            className="relative h-8 w-8 justify-center rounded-full focus:border-transparent focus:outline-none lg:h-7 lg:w-7"
          >
            <Image
              src={user.imageUrl}
              alt={t("userImageAlt")}
              fill
              className="h-auto w-auto rounded-full object-contain"
              sizes="100%"
            />
          </button>
        ) : (
          <button className="flex h-8 w-8 items-center justify-center rounded-full bg-tertiary/50 text-lg focus:border-transparent focus:outline-none lg:h-7 lg:w-7">
            <FaRegUser />
          </button>
        )}
      </PopoverTrigger>
      <AnimatePresence>
        {isOpen && (
          <PopoverContent className="bg-transparent p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex h-full w-full flex-col gap-2 overflow-hidden rounded-lg bg-light/50 p-1 backdrop-blur-xl transition-all ease-in-out dark:bg-dark/50"
            >
              <ThemeChanger />
              <AnimatePresence mode="wait">
                {userMenuItems.map((menuItem, index) => (
                  <motion.div
                    key={menuItem.name}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    {menuItem.link ? (
                      <Button
                        className="flex flex-row items-center justify-start bg-transparent font-sen text-primary dark:text-light"
                        role="option"
                        as={Link}
                        href={menuItem.link}
                        startContent={menuItem.icon}
                      >
                        {menuItem.name}
                      </Button>
                    ) : (
                      <Button
                        className="flex flex-row items-center justify-start bg-transparent font-sen text-primary dark:text-light"
                        role="option"
                        onClick={() => {
                          if (menuItem.callback) menuItem.callback();
                        }}
                        startContent={menuItem.icon}
                      >
                        {menuItem.name}
                      </Button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              <LogoutButton />
            </motion.div>
          </PopoverContent>
        )}
      </AnimatePresence>
    </Popover>
  );
}
