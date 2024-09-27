import { PerksCard } from "@/components/ui/perks-card";

const perks = [
  {
    name: "security",
    title: "Seguridad",
    description:
      "Utilizamos tecnología de vanguardia y protocolos rigurosos para proteger su información y activos.",
  },
  {
    name: "invest",
    title: "Invierte desde $50 USD",
    description:
      "Da tus primeros pasos en el mundo de la inversión y comienza a construir tu cartera desde bajos montos.",
  },
  {
    name: "innovation",
    title: "Innovación",
    description:
      "Buscamos nuevas formas de hacer las cosas para ayudarte con tus objetivos de inversión",
  },
  {
    name: "freedom",
    title: "Libertad financiera",
    description:
      "Te ayudamos a lograr la independencia económica mediante proyectos sólidos.",
  },
  {
    name: "accesabiility",
    title: "Accesibilidad",
    description:
      "Ofrecemos una plataforma donde puedes invertir de manera fácil y rápida, desde cualquier lugar del mundo.",
  },
  {
    name: "decentralization",
    title: "Descentralización",
    description:
      "Tienes el control de tus activos y tus decisiones de inversión gracias a la Organización Autónoma Descentralizada (DAO).",
  },
];

export default function Perks() {
  return (
    <div className="w-screen h-fit min-h-screen overflow-x-hidden p-3 lg:p-4 flex flex-col items-start justify-start gap-24">
      <h1 className="text-4xl font-bold text-center text-primary font-sen mx-auto">
        ¿Cómo lo Hacemos Posible?
      </h1>
      <div
        className="grid 
          grid-cols-2 
          lg:gap-10 
          gap-4
          lg:grid-cols-3 lg:grid-rows-2
         mx-auto h-full overflow-hidden"
      >
        {perks.map((perk, index) => (
          <div key={`Perk-${index}-${perk.name}`} className="w-fit h-fit">
            <PerksCard perk={perk} />
          </div>
        ))}
      </div>
    </div>
  );
}
