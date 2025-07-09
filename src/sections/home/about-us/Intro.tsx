import { useIsMobile } from "@/hooks/ui/useIsMobile";
import { useTranslations } from "next-intl";
import Values from "./Values";
import Community from "./Community";

export default function Intro() {
  const isMobile = useIsMobile();
  const t = useTranslations("AboutUs.intro");

  return (
    <div className="flex flex-col items-start justify-start gap-10 text-primary">
      <h1 className="font-sen text-4xl font-bold lg:text-6xl">
        {isMobile ? t("headline.mobile") : t("headline.desktop")}
      </h1>

      {t.rich("description", {
        p: (children) => <p className="font-jakarta text-base">{children}</p>,
      })}

      <div className="flex flex-col gap-10 font-jakarta lg:max-w-5xl">
        {/* Mission & Vision Section */}
        <div className="flex flex-col items-start justify-start gap-4">
          <h2 className="font-sen text-2xl font-bold lg:text-4xl">
            {t("mission.title")}
          </h2>
          <ul className="ml-4 list-disc space-y-4">
            <li>
              {t.rich("mission.missionStatement", {
                p: (children) => (
                  <p className="font-jakarta text-base">{children}</p>
                ),
              })}
            </li>
            <li>
              {t.rich("mission.visionStatement", {
                p: (children) => (
                  <p className="font-jakarta text-base">{children}</p>
                ),
              })}
            </li>
          </ul>
        </div>

        {/* Purpose Section */}
        <div className="mt-6 flex flex-col items-start justify-start gap-4">
          <h2 className="font-sen text-2xl font-bold lg:text-4xl">
            {t("purpose.title")}
          </h2>
          {t.rich("purpose.description", {
            p: (children) => (
              <p className="font-jakarta text-base">{children}</p>
            ),
          })}
        </div>

        <Values />

        {/* History Section */}
        <div className="mt-6 flex flex-col items-start justify-start gap-4">
          <h2 className="font-sen text-2xl font-bold lg:text-4xl">
            {t("history.title")}
          </h2>
          {t.rich("history.story", {
            p: (children) => (
              <p className="font-jakarta text-base">{children}</p>
            ),
          })}
        </div>

        <Community />
      </div>
    </div>
  );
}
