import { Timeline } from "@/components/ui/timeline";
import { useTranslations } from "next-intl";

export default function Roadmap() {
  const t = useTranslations("AboutUs.roadmap.phases");

  const phases = ["0", "1", "2", "3", "4"];

  const data = phases.map((phaseKey) => {
    const title = t(`${phaseKey}.title`);
    const contentTitle = t(`${phaseKey}.contentTitle`);
    const content = t(`${phaseKey}.content`);

    return {
      title,
      content: (
        <div>
          <h2 className="mb-2 font-sen text-2xl font-bold">{contentTitle}</h2>
          <p className="font-jakarta text-base">{content}</p>
        </div>
      ),
    };
  });

  return (
    <div className="w-full">
      <Timeline data={data} />
    </div>
  );
}
