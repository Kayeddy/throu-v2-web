"use client";

import { Button, Image } from "@nextui-org/react";
import Link from "next/link";
import { useTranslations } from "next-intl";

type DocumentDetails = {
  name: string;
  url: string;
  downloadUrl: string;
};

const DocumentContainer = ({ docDetails }: { docDetails: DocumentDetails }) => {
  const t = useTranslations(
    "Marketplace.project.projectDetails.projectDocumentsTab"
  );

  return (
    <div className="relative flex h-48 w-72 items-start justify-center rounded-lg bg-light/50 p-4 dark:bg-dark/50">
      <Image
        src="/assets/shared/logo_sm.webp"
        className="h-20 w-20 object-cover"
      />
      <div className="absolute bottom-0 flex h-20 w-full flex-col items-center justify-center gap-2 bg-light p-2 backdrop-blur-lg dark:bg-dark/50">
        <h2 className="font-sen text-lg font-semibold text-primary dark:text-light">
          {t(`documents.${docDetails.name}`)}
        </h2>
        <div className="flex w-full flex-row items-center justify-between">
          <Button
            as={Link}
            href={docDetails.url}
            rel="noreferrer"
            target="_blank"
            variant="light"
            className="font-jakarta font-semibold text-secondary"
          >
            {t("open")}
          </Button>
          <Button
            variant="light"
            className="font-jakarta font-semibold text-secondary"
          >
            <a href={docDetails.downloadUrl} download>
              {t("download")}
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function ProjectDocumentsTab() {
  const projectDocuments = [
    {
      name: "ProjectPresentation",
      url: "https://drive.google.com/file/d/1x6990T9mm8GCKVbsxDXS3TPIBxW9D_vf/view?usp=drive_link",
      downloadUrl:
        "https://drive.google.com/uc?export=download&id=1x6990T9mm8GCKVbsxDXS3TPIBxW9D_vf",
    },
    {
      name: "ExistenceCertificate",
      url: "https://drive.google.com/file/d/1KI_5jmP33GkUQHzK8tZ5wI0w52kGI9eS/view?usp=sharing",
      downloadUrl:
        "https://drive.google.com/uc?export=download&id=1KI_5jmP33GkUQHzK8tZ5wI0w52kGI9eS",
    },
    {
      name: "FacadeCertification",
      url: "https://docs.google.com/presentation/d/1w_ZgOoG3p9F0JnQkH-sDjtt-30Kti9mM/edit?usp=drive_link&ouid=111915044603619068548&rtpof=true&sd=true",
      downloadUrl:
        "https://drive.google.com/uc?export=download&id=1w_ZgOoG3p9F0JnQkH-sDjtt-30Kti9mM",
    },
  ];

  return (
    <div className="carousel grid h-full w-full grid-flow-col grid-rows-2 flex-row gap-4 overflow-y-hidden overflow-x-scroll pr-8">
      {projectDocuments.map((doc, index) => (
        <div key={`project-document-${index}-${doc.name}`}>
          <DocumentContainer docDetails={doc} />
        </div>
      ))}
    </div>
  );
}
