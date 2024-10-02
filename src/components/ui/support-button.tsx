import Link from "next/link";
import { encode } from "punycode";
import { BsFillPatchQuestionFill } from "react-icons/bs";
import { FaWhatsapp } from "react-icons/fa";
import { useTranslations } from "next-intl";

export const SupportButton = () => {
  const t = useTranslations("Common.supportButton");

  const supportPreFilledMessage = encode(t("whatsappMessage"));

  return (
    <div className="w-10 h-10 lg:hover:w-36 bg-primary hover:bg-secondary text-light text-lg group flex flex-row items-center justify-center hover:p-1 fixed bottom-[300px] z-10 right-12 gap-4 cursor-pointer transition-all ease-in-out duration-300 overflow-hidden">
      <Link
        target="_blank"
        rel="noreferrer"
        href={`https://wa.me/+573002087124?text=${supportPreFilledMessage}`}
        className="flex flex-row items-center justify-center gap-4 w-full h-full"
      >
        <BsFillPatchQuestionFill className="hidden lg:block group-hover:hidden" />
        <FaWhatsapp className="lg:hidden group-hover:block" />
        <p className="text-sm hidden group-hover:block truncate">
          {t("supportLabel")}
        </p>
      </Link>
    </div>
  );
};
