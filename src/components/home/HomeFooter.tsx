"use client";

import { useConnectModal } from "@rainbow-me/rainbowkit";
import { FooterCard } from "../ui/footer-card";
import Image from "next/image";
import { footerLinks, socialMediaItems } from "@/utils/constants";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import ScrollTopIndicator from "./ScrollTopIndicator";

export default function Footer() {
  const { openConnectModal } = useConnectModal();
  const footerCardsData = [
    {
      title: "crea una cuenta",
      subtitle: "Conoce Throu y",
      icon: {
        src: "/assets/shared/user_footer_icon.png",
        width: 40,
        height: 40,
      },
      link: {
        url: "/",
        text: "Conocer Throu",
      },
    },
    {
      title: "crea una",
      subtitle: "Conoce wallets y",
      icon: {
        src: "/assets/shared/wallet_footer_icon.png",
        width: 60,
        height: 60,
      },
      link: {
        customRedirectFunction: openConnectModal,
        text: "Crea una wallet",
      },
    },
  ];

  return (
    <div className="bg-primary w-full h-fit p-6 sm:p-6 md:p-8 lg:p-12 pb-32 lg:pb-8 flex flex-col items-center justify-between mt-32 gap-24 z-10 relative">
      <div className="flex lg:flex-row flex-col items-center justify-start w-full gap-16">
        <div className="flex flex-col gap-4">
          <h1 className="font-bold font-sen text-3xl lg:text-[2.50rem] text-light lg:max-w-[28rem] leading-relaxed">
            <span className="lg:text-secondary">Conoce</span> el universo de
            posibilidades de <span className="lg:text-secondary">Throu</span>.
          </h1>
          <p className="text-light text-base font-normal font-jakarta max-w-[23rem]">
            Vulputate at commodo mi cursus amet. Eget porta sed egestas sociis
            pellentesque pellentesque. Ultricies ac phasellus dapibus.
          </p>
        </div>
        <div className="flex flex-row lg:gap-10 gap-4">
          {footerCardsData.map((cardData, index) => (
            <div key={index}>
              <FooterCard data={cardData} />
            </div>
          ))}
        </div>
      </div>
      <div className="flex lg:flex-row flex-col items-center lg:justify-between justify-center w-full gap-10 lg:gap-0">
        <div className="flex flex-col gap-10 lg:items-start items-start lg:justify-start justify-center">
          <Image
            alt="Throu_desktop_logo"
            height={0}
            width={190}
            src="/assets/shared/logo_lg_footer.png"
            className="object-contain w-auto h-auto"
          />
          <div className="flex lg:flex-row flex-col items-center lg:justify-start justify-center gap-6 lg:flex-wrap mx-auto lg:mx-0">
            {footerLinks.map((item) => (
              <Link
                key={`${item.name}-footer-link`}
                href={item.link}
                target="_blank"
                rel="noreferrer"
                className="text-base hover:text-secondary hover:underline bg-transparent text-light transition-all duration-300 ease-in-out"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-10 items-center justify-center">
          <div className="flex flex-row gap-4 items-center justify-around w-full max-w-sm">
            {socialMediaItems.map((item) => (
              <Link
                key={`${item.name}-social-media-link`}
                className="text-center text-xl text-light"
                href={item.link}
                rel="noreferrer"
              >
                <item.icon />
              </Link>
            ))}
          </div>
          <p className="lg:text-xs text-sm text-light max-w-sm text-center">
            © 2023 Throu Investment. Todos los derechos reservados.
          </p>
        </div>
      </div>
      <ScrollTopIndicator />
    </div>
  );
}
