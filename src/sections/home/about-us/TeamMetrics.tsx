"use client";

import Image from "next/image";
import Link from "next/link";
import { FaLinkedin, FaTwitter } from "react-icons/fa";
import { useTranslations } from "next-intl";

const teamMembers = [
  {
    name: "Clifford Wisoky",
    role: "ceoCoFounder", // Use translation key
    socials: { linkedIn: "", twitter: "" },
    imageSrc: "/assets/about_us/member_1.png",
    alt: "Photo of Team Member 1",
    alignSelf: "start",
    translateY: "",
  },
  {
    name: "Lillian Mueller",
    role: "humanWebEngineer", // Use translation key
    socials: { linkedIn: "", twitter: "" },
    imageSrc: "/assets/about_us/member_2.png",
    alt: "Photo of Team Member 2",
    alignSelf: "end",
    translateY: "lg:-translate-y-[150px]",
  },
  {
    name: "Cora Bernier",
    role: "ctoCoFounder", // Use translation key
    socials: { linkedIn: "", twitter: "" },
    imageSrc: "/assets/about_us/member_3.png",
    alt: "Photo of Team Member 3",
    alignSelf: "start",
    translateY: "lg:-translate-y-[300px]",
  },
  {
    name: "Drew Simons",
    role: "directResearchAnalyst", // Use translation key
    socials: { linkedIn: "", twitter: "" },
    imageSrc: "/assets/about_us/member_4.png",
    alt: "Photo of Team Member 4",
    alignSelf: "end",
    translateY: "lg:-translate-y-[450px]",
  },
];

const TeamMetricsBox = ({ name, amount }: { name: string; amount: number }) => {
  const t = useTranslations("AboutUs.teamMetrics");
  return (
    <span className="flex flex-col gap-6 items-center justify-center">
      <h3 className="text-4xl font-sen font-bold">{`+${amount.toLocaleString()}`}</h3>
      <p className="font-jakarta text-sm text-center pl-2">{t(name)}</p>
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
        className="object-contain"
        loading="lazy"
      />

      <span className="flex flex-col items-center justify-center mt-2">
        <p className="font-sen text-lg font-bold">{name}</p>
        <p className="text-sm font-jakarta">{t(role)}</p>
      </span>

      <span className="flex flex-row items-center justify-center gap-4 text-primary text-base mt-2">
        <Link href={socials.linkedIn} target="_blank" rel="noreferrer">
          <FaLinkedin />
        </Link>
        <Link href={socials.twitter} target="_blank" rel="noreferrer">
          <FaTwitter />
        </Link>
      </span>
    </div>
  );
};

export default function TeamMetrics() {
  const t = useTranslations("AboutUs.teamMetrics");

  const teamMetrics = [
    { name: "professionals", amount: 15 },
    { name: "areas", amount: 5 },
    { name: "users", amount: 1.2 },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap lg:items-start items-center lg:justify-between justify-center w-full gap-10 text-primary">
      <h2 className="lg:hidden font-sen text-4xl font-bold">
        {t("headline.mobile")}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start justify-start w-full lg:min-w-[450px] lg:max-w-[40%] lg:flex lg:flex-col lg:h-[850px]">
        {teamMembers.map((member, index) => (
          <TeamMember key={index} {...member} />
        ))}
      </div>
      <div className="flex flex-col gap-10 items-start justify-start lg:max-w-[50%]">
        <h2 className="hidden lg:block font-sen text-4xl font-bold">
          {t("headline.desktop")}
        </h2>

        <div className="flex flex-col-reverse lg:flex-col items-start justify-start gap-10">
          <p className="text-base">{t("description")}</p>

          <div className="flex flex-row gap-4 lg:gap-24 w-full items-center lg:justify-start justify-around">
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
