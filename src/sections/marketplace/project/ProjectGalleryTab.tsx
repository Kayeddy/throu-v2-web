import { projectMedia } from "@/components/marketplace/IndividualProjectDetails";
import "@/utils/styles/marketplace/project/projectGallery.module.css";
import ProjectImageViewerModal from "@/components/modals/ProjectImageViewerModal";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useIsMobile } from "@/utils/hooks/shared/useIsMobile";

export default function ProjectGalleryTab() {
  const t = useTranslations(
    "Marketplace.project.projectDetails.projectGalleryTab"
  );

  const isMobile = useIsMobile();

  const renderProjectMedia = () => {
    if (projectMedia?.length) {
      return projectMedia.map((media, index) => (
        <div key={index} className="media-item">
          <ProjectImageViewerModal
            images={projectMedia}
            initialIndex={index}
            triggerImage={
              <Image
                width={100}
                height={100}
                loading="lazy"
                src={media}
                alt={`${t("imageAlt")}-${index + 1}`}
                className="h-[100px] min-h-[400px] w-[100px] min-w-[100px] cursor-pointer rounded-md object-cover lg:h-[120px] lg:w-[120px] lg:min-w-[120px]"
              />
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
