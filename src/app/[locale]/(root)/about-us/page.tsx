import HomeAboutUsContent from "@/components/home/HomeAboutUsContent";
import BackgroundImage from "@/components/ui/background-image";

export default function About() {
  return (
    <>
      <HomeAboutUsContent />
      <BackgroundImage
        src="/assets/shared/logo_purple_right.png"
        containerStyles="absolute hidden lg:flex left-0 bottom-[12%] z-[1] right-0 pointer-events-none"
        imageStyles="w-fit h-fit max-w-[200px] object-contain"
      />
    </>
  );
}
