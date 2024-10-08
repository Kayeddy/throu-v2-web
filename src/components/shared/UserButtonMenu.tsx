"use client";

import { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";
import Image from "next/image";
import { useClerk, useUser } from "@clerk/nextjs";
import { FaRegUser } from "react-icons/fa";
import { useLocale } from "next-intl";

export default function UserButtonMenu() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { user } = useUser();

  const locale = useLocale();
  const { openUserProfile } = useClerk();

  const handleThemeChange = () => {};

  const userMenuItems = [
    {
      name: "Profile",
      callback: openUserProfile,
    },
    {
      name: "Dashboard",
      link: `/${locale}/dashboard`,
    },
    {
      name: "Saved",
      link: `/${locale}/dashboard?save`,
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
              alt="user image popover menu trigger"
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
        <div className="flex flex-col gap-2"></div>
      </PopoverContent>
    </Popover>
  );
}
