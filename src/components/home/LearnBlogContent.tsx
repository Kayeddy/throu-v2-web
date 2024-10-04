import { useTranslations } from "next-intl";
import Link from "next/link";

const sharedTitleStyle = "text-primary font-sen text-4xl font-bold";
const sharedBaseTextStyle = "font-jakarta text-primary text-base";
const sharedContainerStyle = "flex flex-col items-start justify-start gap-6";

export const TokenizationBlogContent = () => {
  const t = useTranslations("Learn.blog.tokenizationBlog");

  return (
    <div className={sharedContainerStyle}>
      <h1 className={sharedTitleStyle}>{t("title")}</h1>
      <p className={sharedBaseTextStyle}>
        {t.rich("content", {
          p: (children) => <p className="mt-4">{children}</p>,
          b: (children) => <b>{children}</b>,
        })}
      </p>
    </div>
  );
};

export const PlatformGuideBlogContent = () => {
  const t = useTranslations("Learn.blog.platformGuideBlog");

  return (
    <div className={sharedContainerStyle}>
      <h1 className={sharedTitleStyle}>{t("title")}</h1>
      <div className={sharedBaseTextStyle}>
        {t.rich("content", {
          p: (chunks: React.ReactNode) => <p className="mt-4">{chunks}</p>,
          b: (chunks: React.ReactNode) => <b>{chunks}</b>,
          Link: (chunks: React.ReactNode) => (
            <Link
              href="https://www.throu.app"
              target="_blank"
              rel="noreferrer"
              className="underline cursor-pointer hover:font-semibold"
            >
              {chunks}
            </Link>
          ),
        })}
      </div>
    </div>
  );
};

export const InvestmentGuideContent = () => {
  const t = useTranslations("Learn.blog.investmentGuideBlog");

  return (
    <div dir={t("direction")} className={sharedContainerStyle}>
      <h1 className={sharedTitleStyle}>{t("title")}</h1>
      <div className={sharedBaseTextStyle}>
        {t.rich("content", {
          p: (chunks: React.ReactNode) => <p className="mt-4">{chunks}</p>,
          b: (chunks: React.ReactNode) => <b>{chunks}</b>,
          span: (chunks: React.ReactNode) => (
            <span className="pl-8 pb-4">{chunks}</span>
          ),
        })}
      </div>
    </div>
  );
};

export const WalletCreationGuideBlogContent = () => {
  const t = useTranslations("Learn.blog.walletCreationGuideBlog");

  return (
    <div className={sharedContainerStyle}>
      <h1 className={sharedTitleStyle}>{t("title")}</h1>
      <div className={sharedBaseTextStyle}>
        {t.rich("content", {
          p: (chunks: React.ReactNode) => <p className="mt-4">{chunks}</p>,
          b: (chunks: React.ReactNode) => <b>{chunks}</b>,
          span: (chunks: React.ReactNode) => (
            <span className="flex flex-col pl-8 pb-4">{chunks}</span>
          ),
          Link: (chunks: React.ReactNode) => (
            <Link
              href="https://metamask.io"
              target="_blank"
              rel="noreferrer"
              className="underline cursor-pointer"
            >
              {chunks}
            </Link>
          ),
        })}
      </div>

      <div className="w-full h-0.5 bg-slate-500" />
      <h1 className="text-primary text-4xl font-bold font-sen">
        {t("polygonTitle")}
      </h1>
      <div className={sharedBaseTextStyle}>
        {t.rich("polygonContent", {
          p: (chunks: React.ReactNode) => <p className="mt-4">{chunks}</p>,
          b: (chunks: React.ReactNode) => <b>{chunks}</b>,
          span: (chunks: React.ReactNode) => (
            <span className="flex flex-col pl-8 pb-4">{chunks}</span>
          ),
          Link: (chunks: React.ReactNode) => (
            <Link
              href="https://wallet.polygon.technology/bridge"
              target="_blank"
              rel="noreferrer"
              className="underline cursor-pointer"
            >
              {chunks}
            </Link>
          ),
        })}
      </div>
    </div>
  );
};

export const StableCoinBlogContent = () => {
  const t = useTranslations("Learn.blog.stablecoinBlog");
  return (
    <div className={sharedContainerStyle}>
      <h1 className={sharedTitleStyle}>{t("title")}</h1>
      <div className={sharedBaseTextStyle}>
        {t.rich("content", {
          p: (chunks: React.ReactNode) => <p className="mt-4">{chunks}</p>,
          b: (chunks: React.ReactNode) => <b>{chunks}</b>,
          span: (chunks: React.ReactNode) => (
            <span className="flex flex-col mt-6 mb-6">{chunks}</span>
          ),
        })}
      </div>
    </div>
  );
};

export const PlatformGainsWithdrawalBlogContent = () => {
  const t = useTranslations("Learn.blog.gainsWithdrawalGuideBlog");

  return (
    <div className={sharedContainerStyle}>
      <h1 className={sharedTitleStyle}>{t("title")}</h1>
      <div className={sharedBaseTextStyle}>
        {t.rich("content", {
          p: (chunks: React.ReactNode) => <p className="mt-4">{chunks}</p>,
          b: (chunks: React.ReactNode) => <b>{chunks}</b>,
          span: (chunks: React.ReactNode) => (
            <span className="flex flex-col mt-6 mb-6">{chunks}</span>
          ),
        })}
      </div>
    </div>
  );
};
