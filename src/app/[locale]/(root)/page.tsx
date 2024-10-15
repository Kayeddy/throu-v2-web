import HomeLandingContent from "@/components/home/HomeLandingContent";
import BackgroundImage from "@/components/ui/background-image";

export default function Home() {
  return (
    <>
      <HomeLandingContent />
      <BackgroundImage
        src="/assets/shared/logo_purple_left.png"
        containerStyles="absolute hidden lg:flex top-[63%] z-[1] right-0 pointer-events-none"
        imageStyles="w-fit h-fit max-w-[200px] object-contain"
      />
      <BackgroundImage
        src="/assets/shared/logo_blue_right.png"
        containerStyles="absolute hidden lg:flex left-0 top-[83%] z-[1] right-0 pointer-events-none"
        imageStyles="w-fit h-fit max-w-[200px] object-contain"
      />
    </>
  );
}
