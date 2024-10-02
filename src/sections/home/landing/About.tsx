import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { sponsors } from "@/utils/constants";
import { Button, Divider } from "@nextui-org/react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

export default function About() {
  const t = useTranslations("HomePage.About");

  // Memoize the items to avoid recalculating them on each render
  const keyAboutItems = useMemo(
    () => [
      {
        title: t("promote_title"),
        description: t("promote_description"),
        link: "",
      },
      {
        title: t("create_title"),
        description: t("create_description"),
        link: "",
      },
      {
        title: t("link_title"),
        description: t("link_description"),
        link: "",
      },
      {
        title: t("manage_title"),
        description: t("manage_description"),
        link: "",
      },
      {
        title: t("distribute_title"),
        description: t("distribute_description"),
        link: "",
      },
    ],
    [t]
  );

  return (
    <section className="w-screen h-fit min-h-screen overflow-x-hidden p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16 flex flex-col items-start justify-start gap-10 lg:gap-20">
      <article className="flex flex-col items-start justify-start lg:gap-10">
        <p className="lg:text-2xl text-xl text-minimal font-sen">
          {t("trusted_by")}
        </p>
        {/* Lazy load the InfiniteMovingCards component for performance */}
        <InfiniteMovingCards items={sponsors} direction="left" speed="slow" />
      </article>

      <article className="flex flex-col items-center justify-center mx-auto gap-8 max-w-xl">
        <h1 className="lg:text-5xl text-4xl text-center font-bold text-primary">
          {t("be_part_of_evolution")}
        </h1>
        <p className="text-base max-w-xl font-jakarta font-normal text-center text-primary">
          {t("experience_transparency")}
        </p>
      </article>

      <article className="flex flex-col items-center justify-center gap-10 w-full">
        <h2 className="text-primary font-bold text-3xl font-sen">
          {t("we_are_here_for")}
        </h2>

        <div className="flex flex-col lg:flex-row items-center justify-between w-full">
          {keyAboutItems.map((item, index) => (
            <div
              key={index}
              className="flex flex-col lg:flex-row items-center justify-around h-[200px] w-full"
            >
              <div className="flex flex-col items-center justify-center text-center gap-4 px-2">
                <h3 className="font-sen text-xl font-semibold text-primary">
                  {item.title}
                </h3>
                <p className="text-primary text-sm font-jakarta font-extralight">
                  {item.description}
                </p>
                <Button
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  as={Link}
                  className="bg-transparent hover:font-semibold font-sen text-secondary text-base font-extralight underline"
                  aria-label={`${item.title} - ${t("learn_more")}`}
                >
                  {t("learn_more")}
                </Button>
              </div>

              {/* Only show the divider if it's not the last item */}
              {index !== keyAboutItems.length - 1 && (
                <Divider className="lg:h-[70%] lg:w-[0.5px] w-[20%] h-[0.5px] bg-primary" />
              )}
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
