import { useTranslations } from "next-intl";

export default function Values() {
  const t = useTranslations("AboutUs.values");
  const valueIndexes = ["0", "1", "2", "3"];

  return (
    <div className="flex flex-col items-start justify-start gap-4 text-primary">
      <h2 className="font-sen text-2xl font-bold lg:text-4xl">{t("title")}</h2>
      <ul className="ml-4 list-disc space-y-4">
        {valueIndexes.map((valueIndex) => (
          <li key={t(`items.${valueIndex}.name`)}>
            <p>
              <b>{t(`items.${valueIndex}.name`)}</b>{" "}
              {t(`items.${valueIndex}.description`)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
