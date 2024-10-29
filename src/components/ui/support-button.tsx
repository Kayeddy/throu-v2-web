import Link from "next/link";
import { encode } from "punycode";
import { BsFillPatchQuestionFill } from "react-icons/bs";
import { FaWhatsapp } from "react-icons/fa";
import { useTranslations } from "next-intl";

export const SupportButton = () => {
  const t = useTranslations("Common.supportButton");

  const supportPreFilledMessage = encode(t("whatsappMessage"));

  return (
    <div className="group fixed bottom-20 right-4 z-10 flex h-10 w-10 cursor-pointer flex-row items-center justify-center gap-4 overflow-hidden bg-primary/60 text-lg text-light transition-all duration-300 ease-in-out hover:bg-secondary hover:p-1 lg:bottom-[300px] lg:right-12 lg:bg-primary lg:hover:w-36">
      <Link
        target="_blank"
        rel="noreferrer"
        href={`https://wa.me/+573002087124?text=${supportPreFilledMessage}`}
        className="flex h-full w-full flex-row items-center justify-center gap-4"
      >
        <BsFillPatchQuestionFill className="hidden group-hover:hidden lg:block" />
        <FaWhatsapp className="group-hover:block lg:hidden" />
        <p className="hidden truncate text-sm group-hover:block">
          {t("supportLabel")}
        </p>
      </Link>
    </div>
  );
};
