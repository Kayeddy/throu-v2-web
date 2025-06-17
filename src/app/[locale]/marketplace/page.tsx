import MarketplaceHomepage from "@/sections/marketplace/root/MarketplaceHomepage";
// import { WalletDetectionDebug } from "@/components/ui/wallet-detection-debug";

export default function Marketplace() {
  return (
    <div className="h-full w-full bg-transparent p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16">
      {/* Debug component available for future use:
      <div className="mb-8">
        <WalletDetectionDebug />
      </div>
      */}

      <MarketplaceHomepage />
    </div>
  );
}
