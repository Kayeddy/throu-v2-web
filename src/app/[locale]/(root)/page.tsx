import About from "@/sections/home/About";
import Hero from "@/sections/home/Hero";
import Perks from "@/sections/home/Perks";
import Showcase from "@/sections/home/Showcase";
import Steps from "@/sections/home/Steps";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center relative gap-10 w-screen overflow-x-hidden">
      <Hero />
      <About />
      <Showcase />
      <Steps />
      <Perks />
    </main>
  );
}
