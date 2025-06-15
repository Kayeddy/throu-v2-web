import { Button } from "@heroui/button";
import Image from "next/image";
import Link from "next/link";

interface CardItems {
  title: string;
  subtitle: string;
  icon: {
    src: string;
    width: number;
    height: number;
  };
  link?: {
    url?: string;
    text: string;
  };
  callback?: () => void; // Optional callback function
}

export const FooterCard = ({ data }: { data: CardItems }) => {
  return (
    <div className="flex h-56 w-44 flex-col items-center justify-between rounded-md bg-primary p-4 shadow-custom lg:h-[250px] lg:w-[250px]">
      <Image
        src={data.icon.src}
        alt={`${data.link?.text || "callback"}-footer-card-icon`}
        width={data.icon.width}
        height={data.icon.height}
        className="h-12 w-auto object-cover"
      />
      <div className="flex flex-col items-center justify-center">
        <h3 className="text-center font-jakarta text-base text-white">
          {data.subtitle}
        </h3>
        <p className="text-center font-jakarta text-lg font-bold text-white">
          {data.title}
        </p>
      </div>

      {data.link?.url ? (
        <Button
          href={data.link.url}
          as={Link}
          className="bg-transparent font-sen text-xl font-semibold text-secondary hover:underline lg:text-base"
        >
          {data.link.text}
        </Button>
      ) : data.callback ? (
        <Button
          onClick={data.callback}
          className="bg-transparent font-sen text-xl font-semibold text-secondary hover:underline lg:text-base"
        >
          {data.link?.text || "Click Me"}
        </Button>
      ) : null}
    </div>
  );
};
