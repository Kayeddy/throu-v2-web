import { useTranslations } from "next-intl";

export default function Home({
  handleSectionChange,
}: {
  handleSectionChange: (key: string) => void;
}) {
  const t = useTranslations("Learn.home"); // Accessing the 'Learn' translations

  const handleInlineBlogClick = () => {
    handleSectionChange("Blog");
  };

  const handleInlineFaqsClick = () => {
    handleSectionChange("FAQs");
  };

  return (
    <div className="flex flex-col gap-6 items-start justify-start">
      {/* Title translation */}
      <h1 className="text-primary text-4xl font-bold font-sen">
        {t("welcomeTitle")}
      </h1>

      {/* Rich content translation */}
      <div className="text-primary text-base font-jakarta font-normal">
        {t.rich("welcomeContent", {
          // Blog and FAQs click handlers
          Blog: (chunks) => (
            <b
              onClick={handleInlineBlogClick}
              className="cursor-pointer hover:underline"
            >
              {chunks}
            </b>
          ),
          FAQs: (chunks) => (
            <b
              onClick={handleInlineFaqsClick}
              className="cursor-pointer hover:underline"
            >
              {chunks}
            </b>
          ),
          p: (chunks) => <p className="mt-4">{chunks}</p>, // Correctly render paragraphs
        })}
      </div>
    </div>
  );
}
