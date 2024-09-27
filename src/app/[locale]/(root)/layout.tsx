import Footer from "@/components/home/HomeFooter";
import Navigation from "@/components/home/HomeNavigation";
import BackgroundImage from "@/components/ui/background-image";
import { SupportButton } from "@/components/ui/support-button";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="overflow-x-hidden bg-[#F7FAFF] relative">
      <BackgroundImage
        src="/assets/shared/logo_purple_left.png"
        containerStyles="absolute hidden lg:flex top-[64%] z-[1] right-0"
        imageStyles="lg:w-[15vw] lg:h-[60vh] w-[8vh] h-[25vh]"
      />
      <BackgroundImage
        src="/assets/shared/logo_blue_right.png"
        containerStyles="absolute hidden lg:flex left-0 top-[80.8%] z-[1] right-0"
        imageStyles="lg:w-[15vw] lg:h-[63vh] w-[8vh] h-[25vh]"
      />
      <Navigation />
      <div className="relative z-[2]">{children}</div>
      <div className="relative z-[2] mt-10">
        <Footer />
      </div>
      <SupportButton />
    </main>
  );
}
