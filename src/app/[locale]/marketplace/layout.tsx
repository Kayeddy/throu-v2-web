import Footer from "@/components/marketplace/MarketplaceFooter";
import Navigation from "@/components/marketplace/MarketplaceNavigation";
import BackgroundImage from "@/components/ui/background-image";
import BlurOverlay from "@/components/ui/blur-overlay";
import { SupportButton } from "@/components/ui/support-button";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="dark:bg-dark relative h-fit min-h-screen w-full overflow-hidden bg-light">
      <BackgroundImage
        src="/assets/shared/logo_blue_left.png"
        containerStyles="fixed top-[-300px] left-[-350px] z-0 pointer-events-none select-none"
        imageStyles="w-[800px] rotate-12 brightness-200 dark:brightness-110 blur-[40px]"
      />

      <BackgroundImage
        src="/assets/shared/logo_purple_left.png"
        containerStyles="fixed bottom-[-400px] left-0 z-0 pointer-events-none select-none"
        imageStyles="w-[350px] brightness-200 dark:brightness-100 blur-[50px]"
      />

      <BackgroundImage
        src="/assets/shared/logo_blue_left.png"
        containerStyles="fixed top-[-700px] right-[-250px] z-0 pointer-events-none select-none"
        imageStyles="w-[700px] rotate-[-28deg] brightness-200 dark:brightness-100 blur-[10px]"
      />

      <BackgroundImage
        src="/assets/shared/logo_purple_left.png"
        containerStyles="fixed bottom-[-900px] right-0 z-0 pointer-events-none select-none"
        imageStyles="w-[600px] rotate-12 brightness-200 dark:brightness-100 blur-[10px]"
      />
      <Navigation />

      <BlurOverlay>
        {children}
        <Footer />
      </BlurOverlay>
    </main>
  );
}
