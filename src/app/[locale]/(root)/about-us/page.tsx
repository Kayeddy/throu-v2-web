import BackgroundImage from "@/components/ui/background-image";
import Intro from "@/sections/home/about-us/Intro";
import Team from "@/sections/home/about-us/Team";
import TeamMetrics from "@/sections/home/about-us/TeamMetrics";

export default function About() {
  return (
    <>
      <div className="relative gap-10 w-screen overflow-x-hidden">
        <div className="flex flex-col items-start justify-start gap-24 mt-20 w-full h-full p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16 relative z-[2]">
          {/* Textually informative section */}
          <Intro />

          {/* General team showcase section */}

          <Team />

          {/* Metrics and specific team members information section */}
          <TeamMetrics />
        </div>
      </div>

      <BackgroundImage
        src="/assets/shared/logo_purple_right.png"
        containerStyles="absolute hidden lg:flex left-0 bottom-[12%] z-[1] right-0 pointer-events-none"
        imageStyles="w-fit h-fit max-w-[200px] object-contain"
      />
    </>
  );
}
