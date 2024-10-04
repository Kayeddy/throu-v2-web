import {
  AssetValuationFaqsContent,
  BuyTokensFaqsContent,
  DataProtectionFaqsContent,
  ExperienceRequirementFaqsContent,
  ForeignInvestmentFaqsContent,
  GainsDistributionFaqsContent,
  InvestmentCostsFaqsContent,
  InvestmentReportsFaqsContent,
  KycDefinitionFaqsContent,
  LiquidityGuaranteeFaqsContent,
  LostWalletAccessFaqsContent,
  MetamaskUsageFaqsContent,
  MinimumInvestmentFaqsContent,
  PlatformPropertiesListFaqsContent,
  PropertyTokenTypeFaqsContent,
  RealEstateTokenizationDefinitionFaqsContent,
  RealEstateTokenizationRiskFaqsContent,
  RegistrationProcessFaqsContent,
  SecurityMeasuresFaqsContent,
  SmartContractDefinitionFaqsContent,
  StablecoinDefinitionFaqsContent,
  TechnicalIssuesFaqsContent,
  ThrouDefinitionFaqsContent,
  TokenExchangeFaqsContent,
  TokenizedPropertySaleFaqsContent,
  TokenPriceDeterminationFaqsContent,
  TokenTransferFaqsContent,
  UsdtDefinitionFaqsContent,
  WithdrawGainsFaqsContent,
  WithdrawInvestmentFaqsContent,
} from "@/components/home/LearnFaqsContent";
import { Accordion, AccordionItem } from "@nextui-org/react";
import { useTranslations } from "next-intl";

export default function Faqs() {
  const t = useTranslations("Learn.faqs");

  const faqsItems = [
    {
      id: 0,
      title: t("throuDefinition.title"),
      content: <ThrouDefinitionFaqsContent />,
    },
    {
      id: 1,
      title: t("realEstateTokenizationDefinition.title"),
      content: <RealEstateTokenizationDefinitionFaqsContent />,
    },
    {
      id: 2,
      title: t("platformPropertiesList.title"),
      content: <PlatformPropertiesListFaqsContent />,
    },
    {
      id: 3,
      title: t("buyTokens.title"),
      content: <BuyTokensFaqsContent />,
    },
    {
      id: 4,
      title: t("kycDefinition.title"),
      content: <KycDefinitionFaqsContent />,
    },
    {
      id: 5,
      title: t("stablecoinDefinition.title"),
      content: <StablecoinDefinitionFaqsContent />,
    },
    {
      id: 6,
      title: t("withdrawGains.title"),
      content: <WithdrawGainsFaqsContent />,
    },
    {
      id: 7,
      title: t("smartContractDefinition.title"),
      content: <SmartContractDefinitionFaqsContent />,
    },
    {
      id: 8,
      title: t("propertyTokenType.title"),
      content: <PropertyTokenTypeFaqsContent />,
    },
    {
      id: 9,
      title: t("realEstateTokenizationRisk.title"),
      content: <RealEstateTokenizationRiskFaqsContent />,
    },
    {
      id: 10,
      title: t("assetValuation.title"),
      content: <AssetValuationFaqsContent />,
    },
    {
      id: 11,
      title: t("liquidityGuarantee.title"),
      content: <LiquidityGuaranteeFaqsContent />,
    },
    {
      id: 12,
      title: t("gainsDistribution.title"),
      content: <GainsDistributionFaqsContent />,
    },
    {
      id: 13,
      title: t("securityMeasures.title"),
      content: <SecurityMeasuresFaqsContent />,
    },
    {
      id: 14,
      title: t("technicalIssues.title"),
      content: <TechnicalIssuesFaqsContent />,
    },
    {
      id: 15,
      title: t("withdrawInvestment.title"),
      content: <WithdrawInvestmentFaqsContent />,
    },
    {
      id: 16,
      title: t("investmentCosts.title"),
      content: <InvestmentCostsFaqsContent />,
    },
    {
      id: 17,
      title: t("experienceRequirement.title"),
      content: <ExperienceRequirementFaqsContent />,
    },
    {
      id: 18,
      title: t("minimumInvestment.title"),
      content: <MinimumInvestmentFaqsContent />,
    },
    {
      id: 19,
      title: t("metamaskUsage.title"),
      content: <MetamaskUsageFaqsContent />,
    },
    {
      id: 20,
      title: t("usdtDefinition.title"),
      content: <UsdtDefinitionFaqsContent />,
    },
    {
      id: 21,
      title: t("dataProtection.title"),
      content: <DataProtectionFaqsContent />,
    },
    {
      id: 22,
      title: t("registrationProcess.title"),
      content: <RegistrationProcessFaqsContent />,
    },
    {
      id: 23,
      title: t("foreignInvestment.title"),
      content: <ForeignInvestmentFaqsContent />,
    },
    {
      id: 24,
      title: t("investmentReports.title"),
      content: <InvestmentReportsFaqsContent />,
    },
    {
      id: 25,
      title: t("lostWalletAccess.title"),
      content: <LostWalletAccessFaqsContent />,
    },
    {
      id: 26,
      title: t("tokenizedPropertySale.title"),
      content: <TokenizedPropertySaleFaqsContent />,
    },
    {
      id: 27,
      title: t("tokenExchange.title"),
      content: <TokenExchangeFaqsContent />,
    },
    {
      id: 28,
      title: t("tokenPriceDetermination.title"),
      content: <TokenPriceDeterminationFaqsContent />,
    },
    {
      id: 29,
      title: t("tokenTransfer.title"),
      content: <TokenTransferFaqsContent />,
    },
  ];

  return (
    <div className="w-full h-full">
      <Accordion className="w-full">
        {faqsItems.map((item) => (
          <AccordionItem
            key={item.id}
            aria-label={item.title}
            title={
              <h1 className="text-primary font-sen text-2xl font-medium">
                {item.title}
              </h1>
            }
            className="text-primary w-full"
          >
            {item.content}
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
