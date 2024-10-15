"use client";

import ProjectHeader from "@/sections/marketplace/project/ProjectHeader";
import ProjectTabsHandler from "@/sections/marketplace/project/ProjectTabsHandler";
import { useGetProject } from "@/utils/hooks/smart_contracts/useGetProjects";
import { useEffect, useState } from "react";
import { Card, Divider, Skeleton } from "@nextui-org/react";
import { motion } from "framer-motion";

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

const projectMedia = [
  // Render images
  "/assets/projects/prado/renders/render_1.jpg",
  "/assets/projects/prado/renders/render_2.jpg",
  "/assets/projects/prado/renders/render_3.jpg",
  "/assets/projects/prado/renders/render_4.jpg",
  "/assets/projects/prado/renders/render_5.jpg",
  "/assets/projects/prado/renders/render_6.jpg",
  "/assets/projects/prado/renders/render_7.jpg",
  "/assets/projects/prado/renders/render_8.jpg",
  "/assets/projects/prado/renders/render_9.jpg",

  // Sketch images
  "/assets/projects/prado/sketches/sketch_1.png",
  "/assets/projects/prado/sketches/sketch_2.png",
  "/assets/projects/prado/sketches/sketch_3.png",
  "/assets/projects/prado/sketches/sketch_4.png",
];

export default function IndividualProjectDetails({
  params,
}: {
  params: { project: string };
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
