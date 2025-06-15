"use client";

import ProjectHeader from "@/sections/marketplace/project/ProjectHeader";
import ProjectTabsHandler from "@/sections/marketplace/project/ProjectTabsHandler";
import { useGetProject } from "@/utils/hooks/smart_contracts/useGetProjects";
import { useEffect, useState } from "react";
import { Card, Divider, Skeleton } from "@heroui/react";
import { motion } from "framer-motion";
import { ProjectPageParams } from "@/app/[locale]/marketplace/projects/[project]/page";

const CardSkeletonLoader = () => {
  return (
    <Card className="relative flex h-full w-full flex-col items-start justify-start overflow-hidden rounded-md shadow-project-section-card-custom">
      <Skeleton className="rounded-lg">
        <div className="h-24 rounded-lg bg-default-300"></div>
      </Skeleton>
      <div className="space-y-3">
        <Skeleton className="w-3/5 rounded-lg">
          <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
        </Skeleton>
        <Skeleton className="w-4/5 rounded-lg">
          <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
        </Skeleton>
        <Skeleton className="w-2/5 rounded-lg">
          <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
        </Skeleton>
      </div>
    </Card>
  );
};

export const projectMedia = [
  // Render images
  "/assets/projects/prado/renders/render_1.webp",
  "/assets/projects/prado/renders/render_2.webp",
  "/assets/projects/prado/renders/render_3.webp",
  "/assets/projects/prado/renders/render_4.webp",
  "/assets/projects/prado/renders/render_5.webp",
  "/assets/projects/prado/renders/render_6.webp",
  "/assets/projects/prado/renders/render_7.webp",
  "/assets/projects/prado/renders/render_8.webp",
  "/assets/projects/prado/renders/render_9.webp",

  // Sketch images
  "/assets/projects/prado/sketches/sketch_1.webp",
  "/assets/projects/prado/sketches/sketch_2.webp",
  "/assets/projects/prado/sketches/sketch_3.webp",
  "/assets/projects/prado/sketches/sketch_4.webp",
  "/assets/projects/prado/sketches/sketch_5.webp",
];

export default function IndividualProjectDetails({
  params,
}: {
  params: ProjectPageParams;
}) {
  const [projectId, setProjectId] = useState<number | 0>(0);

  // Extract project ID from the URL params and update the state
  useEffect(() => {
    if (params.project) {
      const slugParts = params.project.split("-"); // Split slug into name and ID parts
      const extractedProjectId = Number(slugParts[slugParts.length - 1]); // Convert the ID part to a number
      if (!isNaN(extractedProjectId)) {
        // Ensure it's a valid number
        setProjectId(extractedProjectId);
      }
    }
  }, [params.project]);

  const { project, error, isPending } = useGetProject(projectId);

  return (
    <motion.div
      className="flex h-full w-full items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 1 }}
    >
      {isPending ? (
        <CardSkeletonLoader />
      ) : (
        <div className="relative w-full">
          <ProjectHeader projectDetails={project} projectMedia={projectMedia} />
          <Divider className="my-6 h-[0.5px] w-full bg-minimal dark:bg-light" />
          <ProjectTabsHandler projectDetails={project} />
        </div>
      )}
    </motion.div>
  );
}
