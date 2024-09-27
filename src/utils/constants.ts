import { FaInstagram, FaTwitter, FaFacebookF, FaDiscord } from "react-icons/fa";

// Home

interface Sponsors {
  name: string;
  imageUrl: string;
  imageWidth: number;
  imageHeight: number;
  mobileWidth: number;
  mobileHeight: number;
}

interface KeyAboutItems {
  title: string;
  description: string;
  link: string;
}

interface HomeNavigationItems {
  name: string;
  link: string;
}

export const sponsors: Sponsors[] = [
  {
    name: "AyC",
    imageUrl: "/assets/home/about/a_y_c.png",
    imageWidth: 150,
    imageHeight: 150,
    mobileWidth: 80,
    mobileHeight: 80,
  },
  {
    name: "AirBnb",
    imageUrl: "/assets/home/about/air_bnb.png",
    imageWidth: 150,
    imageHeight: 150,
    mobileWidth: 80,
    mobileHeight: 80,
  },
  {
    name: "Bancolombia",
    imageUrl: "/assets/home/about/bancolombia.png",
    imageWidth: 200,
    imageHeight: 200,
    mobileWidth: 130,
    mobileHeight: 100,
  },
  {
    name: "Binance",
    imageUrl: "/assets/home/about/binance.png",
    imageWidth: 150,
    imageHeight: 150,
    mobileWidth: 80,
    mobileHeight: 80,
  },
  {
    name: "Canvas",
    imageUrl: "/assets/home/about/canvas.png",
    imageWidth: 150,
    imageHeight: 150,
    mobileWidth: 90,
    mobileHeight: 90,
  },
  {
    name: "ConstructoraCapital",
    imageUrl: "/assets/home/about/constructora_capital.png",
    imageWidth: 150,
    imageHeight: 150,
    mobileWidth: 100,
    mobileHeight: 100,
  },
  {
    name: "Forbes",
    imageUrl: "/assets/home/about/forbes.png",
    imageWidth: 150,
    imageHeight: 150,
    mobileWidth: 80,
    mobileHeight: 80,
  },
  {
    name: "Nomade",
    imageUrl: "/assets/home/about/nomade.jpeg",
    imageWidth: 120,
    imageHeight: 100,
    mobileWidth: 60,
    mobileHeight: 60,
  },
  {
    name: "SuperIntendencia",
    imageUrl: "/assets/home/about/superintendencia.png",
    imageWidth: 200,
    imageHeight: 200,
    mobileWidth: 100,
    mobileHeight: 100,
  },
  {
    name: "Vicaria",
    imageUrl: "/assets/home/about/vicaria.png",
    imageWidth: 150,
    imageHeight: 150,
    mobileWidth: 80,
    mobileHeight: 80,
  },
];

export const keyAboutItems: KeyAboutItems[] = [
  {
    title: "Promover",
    description: "Inversiones de bajo riesgo y alta rentabilidad.",
    link: "",
  },
  {
    title: "Crear",
    description: "Los tokens según el valor del proyecto.",
    link: "",
  },
  {
    title: "Vincular",
    description: "Legalmente los tokens a la propiedad.",
    link: "",
  },
  {
    title: "Administrar",
    description: "La ejecución del proyecto y su rendimiento.",
    link: "",
  },
  {
    title: "Distribuir",
    description: "La rentabilidad con contratos inteligentes.",
    link: "",
  },
];

// Navigation

interface HomeNavigationItems {
  name: string;
  link: string;
}

export const homeNavigationItems: HomeNavigationItems[] = [
  {
    name: "Proyectos",
    link: "/proyectos",
  },
  {
    name: "Nosotros",
    link: "/nosotros",
  },
  {
    name: "Aprende",
    link: "/aprende",
  },
];

// shared

interface SocialMediaItems {
  name: string;
  icon: React.ElementType;
  link: string;
  styles: string;
}

export const socialMediaItems: SocialMediaItems[] = [
  {
    name: "Instagram",
    icon: FaInstagram,
    link: "https://www.instagram.com/throu.app?igsh=MW54eGlmM3lybDY5Nw%3D%3D&utm_source=qr",
    styles: "text-2xl",
  },
  {
    name: "Twitter",
    icon: FaTwitter,
    link: "https://twitter.com/throu_app?s=21&t=MXAe728rljzcL5ZB9FNzXQ",
    styles: "text-2xl",
  },
  {
    name: "Facebook",
    icon: FaFacebookF,
    link: "https://www.facebook.com/throu.invest?mibextid=opq0tG",
    styles: "text-2xl",
  },
  {
    name: "Discord",
    icon: FaDiscord,
    link: "https://discord.com/invite/ppCUBYDD",
    styles: "text-2xl",
  },
];

export const footerLinks: HomeNavigationItems[] = [
  {
    name: "Proyectos",
    link: "/proyectos",
  },
  {
    name: "Nosotros",
    link: "/nosotros",
  },
  {
    name: "Aprende",
    link: "/aprende",
  },
  {
    name: "Términos del servicio",
    link: "/aprende",
  },
  {
    name: "Privacidad",
    link: "/aprende",
  },
];
