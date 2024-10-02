"use client";
import { useScrollPosition } from "@/utils/hooks/shared/useScrollPosition";
import { AiOutlineArrowDown as DownArrow } from "react-icons/ai";
import { useTranslations } from "next-intl";

export default function HomeScrollIndicator() {
  const scrollPosition = useScrollPosition();
  const t = useTranslations("Common");

  return (
    <>
      {scrollPosition < 100 && (
        <div className="lg:flex hidden flex-col gap-4 items-center justify-center text-center absolute bottom-0 left-0 right-0 animate-[bounce_1.5s_ease-in-out_infinite]">
          <p className="text-[18px] leading-[20px] text-[#062147] font-normal">
            {t("scrollToLearnMore")}
          </p>
          <span className="text-[#062147] font-semibold text-[20px] flex justify-center items-center">
            <DownArrow />
          </span>
        </div>
      )}

      <div className="bg-gradient-to-t from-[#F7FAFF] to-transparent h-[100px] absolute bottom-0 w-full md:block hidden" />
    </>
  );
}
