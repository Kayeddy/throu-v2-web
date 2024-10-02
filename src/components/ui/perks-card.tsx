"use client";

import { useState } from "react";
import PerkIconsHandler from "../home/PerkIconsHandler";
import { useIsMobile } from "@/utils/hooks/shared/useIsMobile";

interface Perk {
  name: string;
  title: string;
  description: string;
}

export const PerksCard = ({ perk }: { perk: Perk }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useIsMobile();
  return (
    <div
      className="lg:min-w-56 lg:max-w-96 lg:w-full lg:h-60 w-44 h-80 bg-transparent rounded-md bg-white lg:bg-light lg:hover:bg-primary transtion-all duration-300 ease-in-out flex flex-col items-center justify-start p-4 group lg:gap-2"
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
    >
      <PerkIconsHandler perkName={perk.name} isHovered={isHovered} />
      <h1 className="text-primary lg:group-hover:text-secondary lg:text-xl text-lg font-semibold text-center font-sen">
        {perk.title}
      </h1>
      <p className="text-sm text-primary lg:group-hover:text-light font-jakarta text-center">
        {perk.description}
      </p>
    </div>
  );
};
