"use client";

import { Chip, Image } from "@heroui/react";
import { SlLocationPin as LocationIcon } from "react-icons/sl";
import { useTranslations } from "next-intl";
import { ProjectAttribute } from "@/utils/types/shared/project";
import {
  XTREMO_PROJECT_DESCRIPTION_IMAGES,
  XTREMO_PROJECT_NAME,
} from "@/hardcoded-projects/xtremo";

interface ProjectDescriptionTabProps {
  projectLocation: ProjectAttribute | undefined;
}

export default function XtremoDescription({
  projectLocation,
}: ProjectDescriptionTabProps) {
  const t = useTranslations(
    "Marketplace.project.projectDetails.projectDescriptionTab"
  );

  return (
    <div className="flex w-full min-w-[50vw] flex-col items-start justify-start gap-6 text-primary dark:text-light lg:w-[50vw]">
      <h1 className="font-sen text-4xl font-bold">{XTREMO_PROJECT_NAME}</h1>

      {/* Category Chips for Mobile */}
      <span className="flex flex-row items-center justify-start gap-2 lg:hidden">
        <Chip
          radius="sm"
          size="lg"
          className="bg-quaternary/90 font-jakarta text-sm text-light"
        >
          {t("category")}
        </Chip>
        <Chip
          radius="sm"
          size="lg"
          className="bg-tertiary/70 font-jakarta text-sm text-light"
        >
          {t("investmentType")}
        </Chip>
        <Chip
          radius="sm"
          size="lg"
          color="secondary"
          className="font-jakarta text-light"
        >
          {t("returnOnInvestment")}
        </Chip>
      </span>

      {/* Location for Mobile */}
      <span className="flex flex-row items-center justify-start gap-2 text-base text-primary dark:text-white lg:hidden">
        <LocationIcon />
        <p className="font-jakarta text-base">
          {projectLocation && projectLocation.value}
        </p>
      </span>

      {/* First Description Paragraph */}
      <p className="font-jakarta text-base">
        Eco-Parque Xtremo Colombia es un proyecto de desarrollo ecoturístico de
        alto impacto ubicado en El Retiro, Antioquia, Colombia. Construido sobre
        una base de sostenibilidad, innovación y conexión con la naturaleza, el
        proyecto abarca 157 hectáreas de bosque protegido en una de las zonas
        ecológicas más valiosas del país.
      </p>

      {/* Category for Desktop */}
      <span className="hidden flex-row items-center justify-start gap-2 lg:flex">
        <p className="font-jakarta text-base text-minimal dark:text-light">
          {t("categoryLabel")}:
        </p>
        <Chip
          radius="sm"
          size="lg"
          className="bg-quaternary/90 font-jakarta text-light"
        >
          {t("category")}
        </Chip>
      </span>

      {/* Investment type for Desktop */}
      <span className="hidden flex-row items-center justify-start gap-2 lg:flex">
        <p className="font-jakarta text-base text-minimal dark:text-light">
          {t("investmentTypeLabel")}:
        </p>
        <Chip
          radius="sm"
          size="lg"
          className="bg-tertiary/70 font-jakarta text-light"
        >
          {t("investmentType")}
        </Chip>
        <Chip
          radius="sm"
          size="lg"
          color="secondary"
          className="font-jakarta text-light"
        >
          {t("returnOnInvestment")}
        </Chip>
      </span>

      {/* Location for Desktop */}
      <span className="hidden flex-row items-center justify-start gap-2 text-base text-primary dark:text-white lg:flex">
        <LocationIcon />
        <p className="font-jakarta text-base">
          {projectLocation && projectLocation.value}
        </p>
      </span>

      {/* First Project Image */}
      <Image
        src={XTREMO_PROJECT_DESCRIPTION_IMAGES[0]}
        alt="Eco-Parque Xtremo Overview"
        className="h-[400px] min-w-[50vw] object-cover dark:bg-light"
      />

      {/* Second Description Paragraph */}
      <p className="font-jakarta text-base">
        Este parque busca convertirse en un ícono de turismo ecológico en
        Latinoamérica, combinando atracciones de aventura, experiencias
        culturales, hospedaje en cabañas tipo ecohotel, y un modelo de negocio
        basado en tokenización inmobiliaria que permite a cualquier persona
        invertir, obtener rendimientos por operación y participar de la
        valorización del terreno.
      </p>

      {/* Project Details */}
      <div className="w-full font-jakarta text-base">
        <p>
          <strong>Nombre del proyecto:</strong> Eco-Parque Xtremo
        </p>
        <p>
          <strong>Ubicación:</strong> El Retiro, Antioquia, Colombia
        </p>
        <p>
          <strong>Área total del terreno:</strong> 157 hectáreas
        </p>
      </div>

      {/* Second Project Image */}
      <Image
        src={XTREMO_PROJECT_DESCRIPTION_IMAGES[1]}
        alt="Zonificación del Parque"
        className="h-[400px] min-w-[50vw] object-cover dark:bg-light"
      />

      {/* Zonification Details */}
      <div className="w-full font-jakarta text-base">
        <p>
          <strong>Zonificación ambiental:</strong>
        </p>
        <ul className="ml-6 list-disc space-y-1">
          <li>Zona de Preservación: 122,74 ha (78%)</li>
          <li>Zona de Uso Sostenible: 33,2 ha (21%)</li>
          <li>Resto: Restauración y uso público</li>
        </ul>
      </div>

      {/* Third Project Image */}
      <Image
        src={XTREMO_PROJECT_DESCRIPTION_IMAGES[6]}
        alt="Zonas del Parque"
        className="h-[400px] min-w-[50vw] object-cover dark:bg-light"
      />

      {/* Featured Zones */}
      <div className="w-full font-jakarta text-base">
        <p>
          <strong>Zonas destacadas:</strong>
        </p>
        <ul className="ml-6 list-disc space-y-1">
          <li>Zona gastronómica y comercial</li>
          <li>Parque indígena y zona cultural</li>
          <li>Pabellón de eventos y museos</li>
          <li>Pistas de ciclismo, downhill, modelismo y motocross</li>
          <li>Paintball, airsoft, tiro deportivo</li>
          <li>Mountain Coaster (montaña rusa por gravedad)</li>
          <li>Eco-Hotel y cabañas palafíticas</li>
          <li>Senderos ecológicos y recorridos guiados</li>
          <li>Helipuerto y sobrevuelo en globo aerostático</li>
        </ul>
      </div>

      {/* Fourth Project Image */}
      <Image
        src={XTREMO_PROJECT_DESCRIPTION_IMAGES[3]}
        alt="Atracciones del Parque"
        className="h-[400px] min-w-[50vw] object-cover dark:bg-light"
      />

      {/* Purpose Section */}
      <div className="w-full font-jakarta text-base">
        <h3 className="font-sen text-2xl font-bold text-primary dark:text-light mb-4">
          Propósito
        </h3>
        <p className="mb-4">
          El propósito del Eco-Parque Xtremo es desarrollar un parque ecológico,
          sostenible y de aventura, que combine experiencias de conexión con la
          naturaleza, atracciones de alto impacto y educación ambiental que:
        </p>
        <ul className="ml-6 list-disc space-y-2">
          <li>Ofrezca experiencias únicas de aventura en la naturaleza</li>
          <li>
            Promueva el desarrollo económico local y el turismo en Antioquia
          </li>
          <li>
            Genere rentabilidad sostenible para sus inversionistas a través de:
            <ul className="ml-6 list-disc space-y-1 mt-2">
              <li>Operación de atracciones mecánicas y temáticas</li>
              <li>Hospedaje en cabañas y ecohotel</li>
              <li>Ingreso al parque (boletaje)</li>
              <li>Valorización del terreno</li>
            </ul>
          </li>
        </ul>
      </div>

      {/* Fifth Project Image */}
      <Image
        src={XTREMO_PROJECT_DESCRIPTION_IMAGES[4]}
        alt="Sostenibilidad del Proyecto"
        className="h-[400px] min-w-[50vw] object-cover dark:bg-light"
      />

      {/* Final Description */}
      <p className="font-jakarta text-base">
        Comprometido con la conservación y la educación ambiental, cada
        visitante contribuirá a la reforestación mediante la siembra de árboles
        nativos. Parque Xtremo es más que un destino turístico: es un modelo de
        desarrollo regenerativo, con visión de convertirse en un referente de
        autosostenibilidad para Latinoamérica.
      </p>
    </div>
  );
}
