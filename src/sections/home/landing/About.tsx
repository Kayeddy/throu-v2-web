import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { sponsors } from "@/utils/constants";
import { Button, Divider } from "@heroui/react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";

export default function About() {
  const t = useTranslations("HomePage.About");
  const locale = useLocale();

  // Memoize the items to avoid recalculating them on each render
  const keyAboutItems = useMemo(
    () => [
      {
        title: t("promote_title"),
        description: t("promote_description"),
        link: `/${locale}/learn`,
      },
      {
        title: t("create_title"),
        description: t("create_description"),
        link: `/${locale}/learn`,
      },
      {
        title: t("link_title"),
        description: t("link_description"),
        link: `/${locale}/learn`,
      },
      {
        title: t("manage_title"),
        description: t("manage_description"),
        link: `/${locale}/learn`,
      },
      {
        title: t("distribute_title"),
        description: t("distribute_description"),
        link: `/${locale}/learn`,
      },
    ],
    [t]
  );

  return (
    <section className="flex h-fit min-h-screen w-screen flex-col items-start justify-start gap-10 overflow-x-hidden p-4 sm:p-6 md:p-8 lg:gap-20 lg:p-12 xl:p-16">
      <article className="flex flex-col items-start justify-start lg:gap-10">
        <p className="font-sen text-xl text-minimal lg:text-2xl">
          {t("trusted_by")}
        </p>
        {/* Lazy load the InfiniteMovingCards component for performance */}
        <InfiniteMovingCards items={sponsors} direction="left" speed="slow" />
      </article>

      <article className="mx-auto flex max-w-xl flex-col items-center justify-center gap-8">
        <h1 className="text-center text-4xl font-bold text-primary lg:text-5xl">
          {t("be_part_of_evolution")}
        </h1>
        <p className="max-w-xl text-center font-jakarta text-base font-normal text-primary">
          {t("experience_transparency")}
        </p>
      </article>

      <article className="flex w-full flex-col items-center justify-center gap-10">
        <h2 className="font-sen text-3xl font-bold text-primary">
          {t("we_are_here_for")}
        </h2>

        <div className="flex w-full flex-col items-center justify-between lg:flex-row">
          {keyAboutItems.map((item, index) => (
            <div
              key={index}
              className="flex h-[200px] w-full flex-col items-center justify-around lg:flex-row"
            >
              <div className="flex flex-col items-center justify-center gap-4 px-2 text-center">
                <h3 className="font-sen text-xl font-semibold text-primary">
                  {item.title}
                </h3>
                <p className="font-jakarta text-sm font-extralight text-primary">
                  {item.description}
                </p>
                <Button
                  href={item.link}
                  as={Link}
                  className="bg-transparent font-sen text-base font-extralight text-secondary underline hover:font-semibold"
                  aria-label={`${item.title} - ${t("learn_more")}`}
                >
                  {t("learn_more")}
                </Button>
              </div>

              {/* Only show the divider if it's not the last item */}
              {index !== keyAboutItems.length - 1 && (
                <Divider className="h-[0.5px] w-[20%] bg-primary lg:h-[70%] lg:w-[0.5px]" />
              )}
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
