import {
  InvestmentGuideContent,
  PlatformGainsWithdrawalBlogContent,
  PlatformGuideBlogContent,
  StableCoinBlogContent,
  TokenizationBlogContent,
  WalletCreationGuideBlogContent,
} from "@/components/home/LearnBlogContent";
import { Accordion, AccordionItem } from "@nextui-org/react";
import { useTranslations } from "next-intl";

export default function Blog() {
  const t = useTranslations("Learn.blog");

  const blogItems = [
    {
      id: 0,
      title: t("tokenizationBlog.title"),
      content: <TokenizationBlogContent />,
    },
    {
      id: 1,
      title: t("platformGuideBlog.title"),
      content: <PlatformGuideBlogContent />,
    },
    {
      id: 2,
      title: t("investmentGuideBlog.title"),
      content: <InvestmentGuideContent />,
    },
    {
      id: 3,
      title: t("walletCreationGuideBlog.title"),
      content: <WalletCreationGuideBlogContent />,
    },
    {
      id: 4,
      title: t("stablecoinBlog.title"),
      content: <StableCoinBlogContent />,
    },
    {
      id: 5,
      title: t("gainsWithdrawalGuideBlog.title"),
      content: <PlatformGainsWithdrawalBlogContent />,
    },
  ];
  return (
    <div className="w-full h-full">
      <Accordion className="w-full">
        {blogItems.map((item) => (
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
