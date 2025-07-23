import { useIsMobile } from "@/hooks/ui/useIsMobile";
import { Divider } from "@heroui/react";
import { useTranslations } from "next-intl";
import { PRADO_PROJECT_NAME } from "@/hardcoded-projects/prado";

interface ProjectInvestmentConfirmationTabProps {
  investmentAmount: number | null;
  projectTokenPrice: number | null;
  projectName?: string | null;
}

export default function ProjectInvestmentConfirmationTab({
  investmentAmount = 0,
  projectTokenPrice = 0,
  projectName = PRADO_PROJECT_NAME,
}: ProjectInvestmentConfirmationTabProps) {
  const isMobile = useIsMobile();
  const t = useTranslations(
    "Marketplace.project.projectInvestmentModal.projectInvestmentConfirmationTab"
  );

  // Calculate values
  const totalInvestment =
    investmentAmount && projectTokenPrice
      ? investmentAmount * projectTokenPrice
      : 0;
  const transactionFee = totalInvestment * 0.011;
  const totalAmount = totalInvestment + transactionFee;

  // Modularize values into an array
  const investmentDetails = [
    {
      label: t("investmentDetails.investmentValue"),
      value: totalInvestment.toFixed(2),
      ariaLabel: "Investment Value",
    },
    {
      label: t("investmentDetails.totalTokens"),
      value: investmentAmount,
      ariaLabel: "Total Tokens",
    },
    {
      label: t("investmentDetails.transactionFee"),
      value: transactionFee.toFixed(2),
      ariaLabel: "Transaction Fee",
    },
  ];

  return (
    <section className="flex h-full w-full flex-col items-center justify-between gap-6 text-primary dark:text-light">
      <header>
        <h2 className="font-sen text-2xl font-bold">
          {isMobile
            ? t("header.mobile", { investmentAmount, projectName })
            : t("header.desktop")}
        </h2>
      </header>

      <article className="flex w-full flex-col items-start justify-start gap-4">
        {investmentDetails.map((detail, index) => (
          <div
            key={index}
            className="flex w-full flex-row items-center justify-between"
          >
            <p className="font-jakarta text-lg">{detail.label}</p>
            <p className="font-jakarta text-lg" aria-label={detail.ariaLabel}>
              {detail.value}
            </p>
          </div>
        ))}

        <Divider
          className="h-0.5 bg-minimal"
          role="separator"
          aria-hidden="true"
        />

        <div className="flex w-full flex-row items-center justify-between">
          <p className="font-jakarta text-lg text-tertiary">
            {t("totalAmount")}
          </p>
          <p
            className="font-jakarta text-lg font-bold"
            aria-label="Total Amount"
          >
            {totalAmount.toFixed(2)}
          </p>
        </div>
      </article>
    </section>
  );
}
