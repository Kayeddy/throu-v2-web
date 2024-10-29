import { useTranslations } from "next-intl";

export default function Community() {
  const t = useTranslations("AboutUs.community");
  const communityIndexes = ["0", "1", "2", "3"];

  return (
    <div className="flex flex-col gap-4 text-primary">
      <h2 className="font-sen text-2xl font-bold lg:text-4xl">{t("title")}</h2>
      <ul className="ml-4 list-disc space-y-4">
        {communityIndexes.map((index) => (
          <li key={index}>
            <p className="font-jakarta text-base">
              {t(`items.${index}.description`)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
