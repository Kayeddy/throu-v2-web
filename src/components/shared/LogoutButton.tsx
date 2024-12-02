import { SignOutButton } from "@clerk/nextjs";
import { Button } from "@nextui-org/button";
import { useTranslations } from "next-intl";
import { TbLogout2 as LogoutButtonIcon } from "react-icons/tb";

export default function LogoutButton() {
  const t = useTranslations("Shared.userButtonMenu");
  return (
    <SignOutButton>
      <Button
        color="danger"
        variant="shadow"
        className="flex flex-row items-center justify-center gap-1 bg-transparent hover:bg-danger max-md:text-danger-500"
      >
        <LogoutButtonIcon className="text-base" />
        {t("logout")}
      </Button>
    </SignOutButton>
  );
}
