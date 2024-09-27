import { SignIn } from "@clerk/nextjs";
import { useLocale } from "next-intl";

export default function Page() {
  const locale = useLocale();
  return (
    <div className="w-screen h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16">
      <SignIn />
    </div>
  );
}
