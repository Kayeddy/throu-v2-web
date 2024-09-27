import { Button } from "@nextui-org/button";
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
  link: {
    url?: string;
    text: string;
    customRedirectFunction?: () => void;
  };
}
export const FooterCard = ({ data }: { data: CardItems }) => {
  return (
    <div className="flex flex-col items-center justify-between shadow-custom rounded-md p-4 lg:h-[230px] lg:w-[230px] w-44 h-56">
      <Image
        src={data.icon.src}
        alt={`${data.link.text}-footer-card-icon`}
        width={data.icon.width}
        height={data.icon.height}
        className="object-cover"
      />
      <div className="flex flex-col items-center justify-center">
        <h4 className="text-white font-jakarta text-base">{data.subtitle}</h4>
        <h3 className="text-white font-jakarta font-bold text-lg">
          {data.title}
        </h3>
      </div>

      {data.link.url ? (
        <Button
          href={data.link.url}
          target="_blank"
          rel="noreferrer"
          as={Link}
          className="font-semibold text-secondary bg-transparent hover:underline text-xl lg:text-base font-sen"
        >
          {data.link.text}
        </Button>
      ) : (
        <Button
          onClick={data.link.customRedirectFunction}
          className="font-semibold text-secondary bg-transparent hover:underline text-xl lg:text-base font-sen"
        >
          {data.link.text}
        </Button>
      )}
    </div>
  );
};
