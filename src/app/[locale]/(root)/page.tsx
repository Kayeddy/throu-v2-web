import BackgroundImage from "@/components/ui/background-image";
import About from "@/sections/home/landing/About";
import Hero from "@/sections/home/landing/Hero";
import Perks from "@/sections/home/landing/Perks";
import Showcase from "@/sections/home/landing/Showcase";
import Steps from "@/sections/home/landing/Steps";

export default function Home() {
  return (
    <>
      <main className="flex flex-col items-center justify-center relative gap-10 w-screen overflow-x-hidden">
        <div className="relative z-[2]">
          <Hero />
          <About />
          <Showcase />
          <Steps />
          <Perks />
        </div>
      </main>

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
