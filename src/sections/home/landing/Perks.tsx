import { PerksCard } from "@/components/ui/perks-card";
import { useTranslations } from "next-intl";

const perksData = [
  { name: "security", key: "perks.security" },
  { name: "invest", key: "perks.invest" },
  { name: "innovation", key: "perks.innovation" },
  { name: "freedom", key: "perks.freedom" },
  { name: "accesabiility", key: "perks.accessibility" },
  { name: "decentralization", key: "perks.decentralization" },
];

export default function Perks() {
  const t = useTranslations("HomePage.Perks"); // Translations for the Perks component

  return (
    <div className="w-screen h-fit min-h-screen overflow-x-hidden p-3 lg:p-4 flex flex-col items-start justify-start gap-24">
      <h1 className="text-4xl font-bold text-center text-primary font-sen mx-auto">
        {t("title")}
      </h1>
      <div
        className="grid 
          grid-cols-2 
          lg:gap-10 
          gap-4
          lg:grid-cols-3 lg:grid-rows-2
         mx-auto h-full overflow-hidden"
      >
        {perksData.map((perk, index) => (
          <div key={`Perk-${index}-${perk.name}`} className="w-fit h-fit">
            <PerksCard
              perk={{
                name: perk.name,
                title: t(`${perk.key}.title`),
                description: t(`${perk.key}.description`),
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
