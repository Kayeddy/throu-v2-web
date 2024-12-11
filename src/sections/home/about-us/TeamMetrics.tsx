"use client";

import Image from "next/image";
import Link from "next/link";
import { FaLinkedin, FaTwitter } from "react-icons/fa";
import { useTranslations } from "next-intl";

const teamMembers = [
  {
    name: "Miguel Morales",
    role: "coFounder", // Use translation key
    socials: { linkedIn: "", twitter: "" },
    imageSrc: "/assets/about_us/member_1.png",
    alt: "Photo of Team Member 1",
    alignSelf: "start",
    translateY: "",
  },
  {
    name: "Simón Atehortua",
    role: "coFounder", // Use translation key
    socials: { linkedIn: "", twitter: "" },
    imageSrc: "/assets/about_us/vp_team.jpg",
    alt: "Photo of Team Member 2",
    alignSelf: "end",
    translateY: "lg:-translate-y-[150px]",
  },
  {
    name: "Edward Bowie",
    role: "cto", // Use translation key
    socials: { linkedIn: "", twitter: "" },
    imageSrc: "/assets/about_us/cto_team.png",
    alt: "Photo of Team Member 3",
    alignSelf: "start",
    translateY: "lg:-translate-y-[300px]",
  },
  {
    name: "Diego Villanueva",
    role: "blockchainDev", // Use translation key
    socials: { linkedIn: "", twitter: "" },
    imageSrc: "/assets/about_us/blockchain_team.jpg",
    alt: "Photo of Team Member 4",
    alignSelf: "end",
    translateY: "lg:-translate-y-[450px]",
  },
];

const TeamMetricsBox = ({ name, amount }: { name: string; amount: number }) => {
  const t = useTranslations("AboutUs.teamMetrics");
  return (
    <span className="flex flex-col items-center justify-center gap-6">
      <h3 className="font-sen text-4xl font-bold">{`+${amount.toLocaleString()}`}</h3>
      <p className="pl-2 text-center font-jakarta text-sm">{t(name)}</p>
    </span>
  );
};

const TeamMember = ({
  name,
  role,
  socials,
  imageSrc,
  alt,
  alignSelf,
  translateY,
}: {
  name: string;
  role: string;
  socials: { linkedIn: string; twitter: string };
  imageSrc: string;
  alt: string;
  alignSelf?: string;
  translateY?: string;
}) => {
  const t = useTranslations("AboutUs.teamMetrics.roles"); // Fetch roles translations
  return (
    <div
      className={`flex flex-col items-center justify-center ${
        alignSelf === "end" ? "self-end" : ""
      } ${translateY}`}
    >
      <Image
        src={imageSrc}
        alt={alt}
        width={200}
        height={200}
        className="h-[200px] max-h-[200px] object-cover"
        loading="lazy"
      />

      <span className="mt-2 flex flex-col items-center justify-center">
        <p className="font-sen text-lg font-bold">{name}</p>
        <p className="font-jakarta text-sm">{t(role)}</p>
      </span>

      {/* <span className="mt-2 flex flex-row items-center justify-center gap-4 text-base text-primary">
        <Link href={socials.linkedIn} target="_blank" rel="noreferrer">
          <FaLinkedin />
        </Link>
        <Link href={socials.twitter} target="_blank" rel="noreferrer">
          <FaTwitter />
        </Link>
      </span> */}
    </div>
  );
};

export default function TeamMetrics() {
  const t = useTranslations("AboutUs.teamMetrics");

  const teamMetrics = [
    { name: "professionals", amount: 15 },
    { name: "areas", amount: 5 },
    { name: "users", amount: 150 },
  ];

  return (
    <div className="gap flex w-full flex-col items-center justify-center gap-10 text-primary lg:flex-row lg:items-start lg:justify-between">
      <h2 className="font-sen text-4xl font-bold lg:hidden">
        {t("headline.mobile")}
      </h2>
      <div className="grid w-full grid-cols-1 items-start justify-start gap-4 sm:grid-cols-2 lg:flex lg:h-[850px] lg:min-w-[450px] lg:max-w-[40%] lg:flex-col">
        {teamMembers.map((member, index) => (
          <TeamMember key={index} {...member} />
        ))}
      </div>
      <div className="flex flex-col items-start justify-start gap-10 lg:max-w-[50%]">
        <h2 className="hidden font-sen text-4xl font-bold lg:block">
          {t("headline.desktop")}
        </h2>

        <div className="flex flex-col-reverse items-start justify-start gap-10 lg:flex-col">
          <p className="text-base">{t("description")}</p>

          <div className="flex w-full flex-row items-center justify-around gap-4 lg:justify-start lg:gap-24">
            {teamMetrics.map((metric) => (
              <TeamMetricsBox
                key={metric.name}
                name={metric.name}
                amount={metric.amount}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
