"use client";

import { motion } from "framer-motion";
import MarketplaceHomeCard from "@/components/ui/marketplace-home-project-card";
import { useGetProject } from "@/utils/hooks/smart_contracts/useGetProjects";
import { Card, Skeleton } from "@nextui-org/react";
import { useEffect } from "react";

const CardSkeletonLoader = () => {
  return (
    <Card className="relative flex h-[70vh] max-h-[500px] w-[90vw] flex-col items-start justify-start overflow-hidden rounded-md shadow-project-section-card-custom lg:h-[55vh] lg:max-h-[600px] lg:w-80">
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

export default function MarketplaceHomepage() {
  const projectId = 0;
  const { project, error, isPending } = useGetProject(projectId);

  return (
    <motion.div
      className="flex flex-col items-start justify-start gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1, duration: 1 }}
    >
      <h1 className="font-sen text-3xl font-bold text-primary dark:text-light lg:text-4xl">
        Proyectos disponibles
      </h1>
      <div className="flex w-full items-start justify-center lg:justify-start">
        {!isPending && project ? (
          <MarketplaceHomeCard data={project} />
        ) : (
          <CardSkeletonLoader />
        )}
      </div>
    </motion.div>
  );
}
