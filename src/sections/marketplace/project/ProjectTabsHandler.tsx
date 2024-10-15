import { Divider, Tab, Tabs } from "@nextui-org/react";
import ProjectDescriptionTab from "./ProjectDescriptionTab";
import ProjectGalleryTab from "./ProjectGalleryTab";
import ProjectDocumentsTab from "./projectDocumentsTab";
import ProjectUpdatesTab from "./ProjectUpdatesTab";
import ProjectFaqsTab from "./ProjectFaqsTab";
import { motion } from "framer-motion";

const fadeInAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: 20, transition: { duration: 0.3 } },
};

export default function ProjectTabsHandler({
  projectDetails,
}: {
  projectDetails: ProjectDetails | null;
}) {
  const projectDetailsTabs = [
    {
      id: 1,
      name: "Description",
      key: "Description",
      content: (
        <ProjectDescriptionTab
          projectLocation={projectDetails?.projectURI?.attributes[0]}
        />
      ),
    },
    {
      id: 2,
      name: "Gallery",
      key: "Gallery",
      content: <ProjectGalleryTab />,
    },
    {
      id: 3,
      name: "Documents",
      key: "Documents",
      content: <ProjectDocumentsTab />,
    },
    {
      id: 4,
      name: "Updates",
      key: "Updates",
      content: <ProjectUpdatesTab />,
    },
    {
      id: 5,
      name: "FAQs",
      key: "FAQs",
      content: <ProjectFaqsTab />,
    },
  ];
  return (
    <div className="relative w-full">
      <div className="flex w-full flex-col-reverse items-center justify-center gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-0">
        <div className="flex w-full flex-col">
          <Tabs
            aria-label="Options"
            radius="md"
            color="primary"
            classNames={{
              tabList:
                "lg:gap-[100px] gap-10 relative rounded-none border-divider px-4 bg-transparent mx-0 -translate-x-4",
              cursor: "bg-secondary h-1",
              tab: "max-w-fit px-0 h-12",
              tabContent:
                "group-data-[selected=true]:text-secondary dark:group-data-[selected=true]:text-secondary group-data-[selected=true]:font-semibold font-jakarta text-primary dark:text-light text-base",
            }}
          >
            {projectDetailsTabs.map((tab) => (
              <Tab key={tab.key} title={tab.name} className="w-full">
                <motion.div
                  key={tab.key}
                  variants={fadeInAnimation}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  {tab.content}
                </motion.div>
              </Tab>
            ))}
          </Tabs>
        </div>
        <Divider className="h-[0.5px] w-full bg-minimal lg:hidden" />
        <div className="flex w-full items-center justify-center">
          Investment CTA
        </div>
      </div>
    </div>
  );
}
