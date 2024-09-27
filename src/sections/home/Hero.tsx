import HomeScrollIndicator from "@/components/ui/home-scroll-indicator";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/react";

export default function Hero() {
  return (
    <div
      className=" bg-[url('/assets/home/hero/landing_bg.jpg')] 
      bg-cover 
      bg-[left_210vw_bottom_-50px]  
      md:bg-[center]               
      w-screen 
      h-screen 
      min-h-screen 
      overflow-x-hidden 
      p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16 
      relative"
    >
      <div className="flex flex-col items-start justify-between gap-8 lg:mt-28 mt-20 w-full h-[calc(100%-5rem)] lg:h-auto">
        <section className="w-full flex flex-col items-start justify-start gap-6">
          <h1 className="lg:text-4xl text-[2rem] text-primary max-w-2xl leading-normal font-sen">
            Invierte en propiedad raíz a través de la tecnología blockchain
          </h1>
          <p className="lg:max-w-[22rem] max-w-[16rem] text-base text-primary font-[100] font-jakarta">
            Vive el futuro de la inversión inmobiliaria con THROU, maximiza tu
            portafolio y obtén mejores rendimientos.
          </p>
        </section>
        <section className="flex lg:flex-row flex-col gap-4 items-center justify-center w-full lg:w-fit">
          <Button
            size="lg"
            radius="none"
            className="bg-primary text-white lg:text-sm text-lg font-bold px-10 w-full lg:w-fit hover:bg-secondary font-sen"
          >
            Explorar
          </Button>
          <Button
            href="/"
            target="_blank"
            rel="noreferrer"
            as={Link}
            className="lg:font-medium text-primary bg-transparent hover:underline hover:text-secondary hover:bg-transparent text-xl lg:text-base font-sen"
          >
            Conocer más
          </Button>
        </section>
      </div>
      <HomeScrollIndicator />
    </div>
  );
}
