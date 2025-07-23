"use client";

import { Carousel } from "@/components/ui/cards-carousel";
import { ProjectAttributeBox } from "@/components/ui/project-attributes-boxes-container";
import UserProjectDashboardCard from "@/components/ui/user-projects-dashboard-card";
import { useGetProject, useGetSolanaProject, useGetInvestorInfo, useSolanaInvestorInfo, useWalletConnection } from "@/hooks/blockchain";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { ProjectDetails, SupportedChain } from "@/utils/types/shared/project";

export default function Portfolio() {
  const t = useTranslations("Dashboard");

  // Get wallet connection info
  const { isConnected, isSolana, isEVM } = useWalletConnection();

  // Fetch project data (always fetch both since they don't depend on wallet)
  const { project: polygonProject, isPending: polygonProjectLoading } = useGetProject(0);
  const { data: solanaProject, isPending: solanaProjectLoading } = useGetSolanaProject("0");

  // Always call hooks but with conditional parameters to prevent violations
  // EVM investor info - pass -1 when not needed to prevent fetching
  const { data: polygonInvestorInfo, isPending: polygonPending } = useGetInvestorInfo(isEVM && isConnected ? 0 : -1);
  // Solana investor info - pass empty string when not needed
  const { data: solanaInvestorInfo, isPending: solanaPending } = useSolanaInvestorInfo(isSolana && isConnected ? "0" : "");

  // Debug: Uncomment to troubleshoot wallet/investor info issues
  // console.log("🔍 [PORTFOLIO DEBUG] State Info:", {
  //   isConnected,
  //   isSolana,
  //   isEVM,
  //   address,
  //   isLoading,
  //   projectsStillLoading: polygonProjectLoading || solanaProjectLoading,
  //   investorDataLoading: (isEVM && polygonPending) || (isSolana && solanaPending),
  //   polygonProject: !!polygonProject,
  //   solanaProject: !!solanaProject,
  //   polygonInvestorInfo,
  //   solanaInvestorInfo,
  //   projectsWithInvestments: projectsWithInvestments.length
  // });

  // Combine projects showing both, but only with investment data for connected chain
  const projectsWithInvestments = useMemo(() => {
    const projects: Array<{
      project: ProjectDetails;
      investorInfo: any;
      chain: SupportedChain;
    }> = [];

    // Always show Polygon project if it exists, but only with investment data if EVM wallet connected
    if (polygonProject) {
      const hasInvestmentData = isEVM && polygonInvestorInfo;
      const hasInvestment = hasInvestmentData && (polygonInvestorInfo.hasInvestment || polygonInvestorInfo.tokenCount > 0);
      
      // Only add to portfolio if there's actual investment data and investment
      if (hasInvestment) {
        projects.push({
          project: polygonProject,
          investorInfo: polygonInvestorInfo,
          chain: "polygon",
        });
      }
    }

    // Always show Solana project if it exists, but only with investment data if Solana wallet connected
    if (solanaProject) {
      const hasInvestmentData = isSolana && solanaInvestorInfo;
      const hasInvestment = hasInvestmentData && (solanaInvestorInfo.hasInvestment || solanaInvestorInfo.tokenCount > 0);
      
      // Only add to portfolio if there's actual investment data and investment
      if (hasInvestment) {
        projects.push({
          project: solanaProject,
          investorInfo: solanaInvestorInfo,
          chain: "solana",
        });
      }
    }
    return projects;
  }, [isConnected, isEVM, isSolana, polygonProject, solanaProject, polygonInvestorInfo, solanaInvestorInfo]);

  // Calculate total portfolio metrics across all chains (only when connected)
  const portfolioMetrics = useMemo(() => {
    if (!isConnected) {
      return {
        projectsCount: 0,
        totalTokens: 0,
        totalFiatValue: 0,
        totalProfits: 0,
      };
    }

    let totalTokens = 0;
    let totalFiatValue = 0;
    let totalProfits = 0;
    const projectsCount = projectsWithInvestments.length;

    projectsWithInvestments.forEach(({ investorInfo }) => {
      totalTokens += investorInfo.tokenCount || 0;
      totalFiatValue += investorInfo.investmentAmount || 0;
      totalProfits += investorInfo.profitAmount || 0;
    });

    return {
      projectsCount,
      totalTokens,
      totalFiatValue,
      totalProfits,
    };
  }, [isConnected, projectsWithInvestments]);

  // Comprehensive loading state - wait for all necessary data to be ready
  const isLoading = useMemo(() => {
    if (!isConnected) return false; // Not connected, so no loading needed
    
    // Check if project data is still loading
    const projectsStillLoading = polygonProjectLoading || solanaProjectLoading;
    
    // Check if investor data is still loading for the connected chain
    const investorDataLoading = (isEVM && polygonPending) || (isSolana && solanaPending);
    
    return projectsStillLoading || investorDataLoading;
  }, [isConnected, polygonProjectLoading, solanaProjectLoading, polygonPending, solanaPending, isEVM, isSolana]);

  // Define investor portfolio attributes
  const investorPortFolioAttributes = {
    projectCount: {
      label: t("attributes.projectsCount"),
      value: portfolioMetrics.projectsCount,
    },
    tokensCount: {
      label: t("attributes.tokensCount"),
      value: portfolioMetrics.totalTokens,
    },
    fiatInvestmentAmount: {
      label: t("attributes.fiatInvestmentAmount"),
      value: portfolioMetrics.totalFiatValue,
    },
    returnOnInvestment: {
      label: t("attributes.returnOnInvestment"),
      value: portfolioMetrics.totalProfits,
    },
  };

  // Create dashboard cards for each project with investment
  const projectCards = useMemo(() => {
    return projectsWithInvestments.map(({ project, investorInfo, chain }) => {
      // Calculate ownership percentage using investor shares and total shares sold
      // Formula: (investor shares / total shares sold) * 100
      const calculateOwnershipPercentage = () => {
        const investorShares = investorInfo.tokenCount || 0;
        const totalSharesSold = project.projectSales || 0;
        
        // Debug: Uncomment to troubleshoot ownership calculation
        // console.log(`🔍 [OWNERSHIP CALC] ${chain} Project ${project.projectId}:`, {
        //   investorShares,
        //   totalSharesSold,
        //   projectTotalSupply: project.projectTotalSupply,
        //   calculated: investorShares > 0 && totalSharesSold > 0 ? (investorShares / totalSharesSold) * 100 : 0
        // });
        
        if (totalSharesSold === 0 || investorShares === 0) {
          return "0";
        }
        
        const percentage = (investorShares / totalSharesSold) * 100;
        
        // Cap at 100% to prevent display issues with edge cases
        const cappedPercentage = Math.min(percentage, 100);
        
        return cappedPercentage.toFixed(1);
      };
      
      const ownershipPercentage = calculateOwnershipPercentage();

      return (
        <UserProjectDashboardCard
          key={`${chain}-${project.projectId}`}
          project={project}
          investorInfo={investorInfo}
          userTokenCount={investorInfo.tokenCount}
          userOwnershipPercentage={ownershipPercentage}
          projectTokenPrice={project.projectPrice ?? 0}
        />
      );
    });
  }, [projectsWithInvestments]);

  // If wallet is not connected, show connect wallet message
  if (!isConnected) {
    return (
      <div className="mt-6 w-full">
        <div className="flex flex-col items-start justify-start gap-6">
          <h1 className="font-sen text-2xl font-bold text-primary dark:text-light">
            {t("tabs.portfolio.desktopTitle")}
          </h1>
          <div className="flex items-center justify-center py-16 w-full">
            <div className="text-center">
              <p className="text-lg text-minimal mb-4">{t("connectWalletMessage")}</p>
              <w3m-button />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state while fetching all necessary data
  if (isLoading) {
    return (
      <div className="mt-6 w-full">
        <div className="flex flex-col items-start justify-start gap-6">
          <h1 className="font-sen text-2xl font-bold text-primary dark:text-light">
            {t("tabs.portfolio.desktopTitle")}
          </h1>
          <div className="flex items-center justify-center py-16 w-full">
            <div className="text-center">
              {/* Enhanced loader with multiple spinning elements */}
              <div className="relative flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <div className="absolute animate-spin rounded-full h-8 w-8 border-t-2 border-secondary" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                <div className="absolute animate-pulse rounded-full h-4 w-4 bg-primary/20"></div>
              </div>
              <div className="mt-4">
                <p className="text-minimal font-medium">{t("tabs.portfolio.loading")}</p>
                <p className="text-xs text-minimal/60 mt-1">
                  {polygonProjectLoading || solanaProjectLoading 
                    ? t("tabs.portfolio.loadingProjects") 
                    : t("tabs.portfolio.loadingInvestments")
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render Portfolio content when wallet is connected
  return (
    <div className="mt-6 w-full">
      <div className="flex flex-col items-start justify-start gap-6">
        <h1 className="font-sen text-2xl font-bold text-primary dark:text-light">
          {t("tabs.portfolio.desktopTitle")}
        </h1>
        <div className="mx-auto grid grid-cols-2 items-center justify-center gap-6 lg:mx-0 lg:flex lg:flex-row lg:flex-wrap lg:justify-start">
          {Object.entries(investorPortFolioAttributes).map(
            ([key, attribute]) => (
              <div
                key={key}
                className="flex h-fit w-fit items-center justify-center"
              >
                <ProjectAttributeBox
                  name={attribute.label}
                  value={attribute.value}
                  isTranslucent
                  size="xl"
                  internationalized
                />
              </div>
            )
          )}
        </div>
        {projectCards.length > 0 ? (
          <Carousel
            showPagination={false}
            removePaddings
            items={projectCards}
          />
        ) : (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="mb-4">
                <div className="mx-auto w-16 h-16 bg-minimal/10 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-minimal/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <p className="text-minimal font-medium mb-1">{t("tabs.portfolio.noInvestmentMessage")}</p>
              <p className="text-xs text-minimal/60">
                {isSolana ? "No Solana investments found" : "No EVM investments found"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
