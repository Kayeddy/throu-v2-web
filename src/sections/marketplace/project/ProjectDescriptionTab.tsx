import { Chip, Image } from "@nextui-org/react";
import { SlLocationPin as LocationIcon } from "react-icons/sl";

export default function ProjectDescriptionTab({
  projectLocation,
}: {
  projectLocation: ProjectAttribute | undefined;
}) {
  return (
    <div className="flex w-full min-w-[50vw] flex-col items-start justify-start gap-6 text-primary dark:text-light lg:w-[50vw]">
      <h1 className="font-sen text-4xl font-bold">Salón Prado</h1>
      <span className="flex flex-row items-center justify-start gap-2 lg:hidden">
        <Chip
          radius="sm"
          size="lg"
          className="bg-quaternary/90 font-jakarta text-sm text-light"
        >
          Gastronómico
        </Chip>
        <Chip
          radius="sm"
          size="lg"
          className="bg-tertiary/70 font-jakarta text-sm text-light"
        >
          Retorno a largo plazo
        </Chip>
      </span>
      <span className="flex flex-row items-center justify-start gap-2 text-base text-primary dark:text-white lg:hidden">
        <LocationIcon />
        <p className="font-jakarta text-base">
          {projectLocation && projectLocation.value}
        </p>
      </span>
      <p className="font-jakarta text-base">
        {/* {campaign.projectURI.description} */}
        El proyecto Salón Prado, situado en el emblemático barrio Prado de
        Medellín, se presenta como una oportunidad de inversión única que
        combina la riqueza cultural y el dinamismo económico mediante la
        tokenización de activos inmobiliarios. Esta iniciativa busca no solo
        revitalizar un espacio con valor histórico, sino también crear un centro
        de arte, gastronomía y entretenimiento que atraiga tanto a locales como
        a turistas.
      </p>

      <span className="hidden flex-row items-center justify-start gap-2 lg:flex">
        <p className="font-jakarta text-base text-minimal dark:text-light">
          Categoria:{" "}
        </p>
        <Chip
          radius="sm"
          size="lg"
          className="bg-quaternary font-jakarta text-light"
        >
          Gastronómico
        </Chip>
      </span>
      <span className="hidden flex-row items-center justify-start gap-2 text-base text-primary dark:text-white lg:flex">
        <LocationIcon />
        <p className="font-jakarta text-base">
          {projectLocation && projectLocation.value}
        </p>
      </span>

      <Image
        src="/assets/projects/prado/other/desc_1.png"
        alt=""
        className="h-[400px] min-w-[50vw] object-contain dark:bg-light lg:w-[50vw] lg:object-contain"
      />

      <p className="font-jakarta text-base">
        La rentabilidad del proyecto se articula a través de un modelo detallado
        que proyecta una recuperación de la inversión en un plazo definido, con
        un rendimiento anual (TIR) 23% altamente competitivo. Este modelo no
        solo refleja el potencial de crecimiento económico del proyecto, sino
        que también asegura una transparencia y seguridad incomparables gracias
        al uso de la tecnología blockchain. Esto significa que los inversores
        pueden monitorear el progreso y la gestión de sus inversiones con una
        claridad sin precedentes.
      </p>
      <Image
        src="/assets/projects/prado/other/desc_2.png"
        alt=""
        className="h-[400px] min-w-[50vw] object-contain dark:bg-light"
      />
      <Image
        src="/assets/projects/prado/other/desc_3.png"
        alt=""
        className="h-[400px] min-w-[50vw] object-contain dark:bg-light"
      />
      <p className="font-jakarta text-base">
        Además, Salón Prado se distingue por su enfoque sostenible y de impacto
        social. La inversión va más allá del retorno económico, contribuyendo a
        la revitalización urbana, la conservación del patrimonio y el fomento de
        la cultura local. Los inversores, por lo tanto, no solo se benefician
        financieramente, sino que también participan en el enriquecimiento del
        tejido social y cultural de Medellín.
      </p>
      <Image
        src="/assets/projects/prado/other/desc_4.png"
        alt=""
        className="h-[400px] min-w-[50vw] object-fill dark:bg-light lg:w-[50vw] lg:object-cover"
      />
      <p className="font-jakarta text-base">
        Finalmente, la estructura de inversión tokenizada del proyecto ofrece
        flexibilidad y liquidez, permitiendo a los inversores comprar, vender o
        intercambiar tokens de manera eficiente en el mercado secundario
      </p>
      <Image
        src="/assets/projects/prado/wireframes/wireframe_1.png"
        alt=""
        className="h-[400px] min-w-[50vw] object-contain dark:bg-light"
      />
    </div>
  );
}
