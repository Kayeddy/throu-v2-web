"use client";

import { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
} from "@nextui-org/react";
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

export default function UserButtonMenu() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { user } = useUser();
  const t = useTranslations("Shared.userButtonMenu"); // Use translations
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
            />
          </button>
        ) : (
          <div className="flex h-8 w-8 items-center justify-center bg-light text-lg lg:h-7 lg:w-7">
            <FaRegUser />
          </div>
        )}
      </PopoverTrigger>
      <PopoverContent className="p-1">
        <div className="flex flex-col gap-2">
          <ThemeChanger />
          {userMenuItems.map((menuItem) =>
            menuItem.link ? (
              <Button
                key={menuItem.name + "user-button-menu-item"}
                className="flex flex-row items-center justify-start gap-2 bg-transparent font-sen text-primary dark:text-light"
                role="option"
                as={Link}
                href={menuItem.link}
              >
                {menuItem.icon}
                <p>{menuItem.name}</p>
              </Button>
            ) : (
              <Button
                key={menuItem.name + "user-button-menu-item"}
                className="flex flex-row items-center justify-start gap-2 bg-transparent font-sen text-primary dark:text-light"
                role="option"
                onClick={() => {
                  if (menuItem.callback) menuItem.callback();
                }}
              >
                {menuItem.icon}
                <p>{menuItem.name}</p>
              </Button>
            )
          )}
          <LogoutButton />
        </div>
      </PopoverContent>
    </Popover>
  );
}
