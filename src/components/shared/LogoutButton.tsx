import { SignOutButton } from "@clerk/nextjs";
import { Button } from "@nextui-org/button";
import { useTranslations } from "next-intl";
import { TbLogout2 as LogoutButtonIcon } from "react-icons/tb";

export default function LogoutButton() {
  const t = useTranslations("Shared.userButtonMenu");
  return (
    <SignOutButton>
      <Button className="flex flex-row items-center justify-center gap-1 bg-transparent text-danger-400">
        <LogoutButtonIcon className="text-base" />
        {t("logout")}
      </Button>
    </SignOutButton>
  );
}
