import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { keyAboutItems, sponsors } from "@/utils/constants";
import { Button, Divider } from "@nextui-org/react";
import Link from "next/link";

export default function About() {
  return (
    <div className="w-screen h-fit min-h-screen overflow-x-hidden p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16 flex flex-col items-start justify-start gap-10 lg:gap-20">
      <div className="flex flex-col items-start justify-start lg:gap-10">
        <p className="lg:text-2xl text-xl text-minimal font-sen">
          Confían en nosotros
        </p>
        <InfiniteMovingCards items={sponsors} direction="left" speed="slow" />
      </div>
      <div className="flex flex-col items-center justify-center mx-auto gap-8 max-w-xl">
        <h1 className="lg:text-5xl text-4xl text-center font-bold text-primary">
          Sé parte de la evolución
        </h1>
        <p className="text-base max-w-xl font-jakarta font-normal text-center text-primary">
          Experimenta la <b>transparencia y la seguridad</b> de la tecnología
          blockchain mientras maximiza el rendimiento de sus inversiones
          inmobiliarias.
        </p>
      </div>
      <div className="flex flex-col items-center justify-center gap-10 w-full">
        <h2 className="text-primary font-bold text-3xl font-sen">
          Estamos aquí para
        </h2>
        <div className="flex flex-col lg:flex-row items-center justify-between w-full">
          {keyAboutItems.map((item, index) => (
            <div
              key={index}
              className="flex flex-col lg:flex-row items-center justify-around h-[200px] w-full"
            >
              <div className="flex flex-col items-center justify-center text-center gap-4 px-2">
                <h3 className="font-sen text-xl font-semibold text-primary">
                  {item.title}
                </h3>
                <p className="text-primary text-sm font-jakarta font-extralight">
                  {item.description}
                </p>
                <Button
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  as={Link}
                  className="bg-transparent hover:font-semibold font-sen text-secondary text-base font-extralight underline"
                >
                  Conocer más
                </Button>
              </div>

              {index !== keyAboutItems.length - 1 && (
                <Divider className="lg:h-[70%] lg:w-[0.5px] w-[20%] h-[0.5px] bg-primary" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
