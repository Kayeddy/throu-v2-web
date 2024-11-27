import { projectMedia } from "@/components/marketplace/IndividualProjectDetails";
import { Image } from "@nextui-org/react";
import "@/utils/styles/marketplace/project/projectGallery.module.css";
import ProjectImageViewerModal from "@/components/modals/ProjectImageViewerModal";
import { useTranslations } from "next-intl";

export default function ProjectGalleryTab() {
  const t = useTranslations(
    "Marketplace.project.projectDetails.projectGalleryTab"
  );

  const renderProjectMedia = () => {
    if (projectMedia?.length) {
      return projectMedia.map((media, index) => (
        <div key={index} className="media-item">
          <ProjectImageViewerModal
            imageUrl={media}
            images={projectMedia}
            initialIndex={index}
            triggerImage={
              <Image src={media} alt={`${t("imageAlt")}-${index + 1}`} />
            }
          />
        </div>
      ));
    } else {
      return (
        <p className="text-center font-jakarta text-base lg:text-left">
          {t("noMedia")}
        </p>
      );
    }
  };

  return (
    <div className="carousel grid h-full w-full grid-flow-col grid-rows-3 flex-row gap-4 overflow-y-hidden overflow-x-scroll pr-8">
      {renderProjectMedia()}
    </div>
  );
}
