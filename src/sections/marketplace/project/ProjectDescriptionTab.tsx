"use client";

import { ProjectAttribute } from "@/utils/types/shared/project";
import { useProjectDataByChain } from "@/hooks/blockchain/useProjectDataByChain";

interface ProjectDescriptionTabProps {
  projectLocation: ProjectAttribute | undefined;
}

export default function ProjectDescriptionTab({
  projectLocation,
}: ProjectDescriptionTabProps) {
  const { DescriptionComponent } = useProjectDataByChain();
  
  return <DescriptionComponent projectLocation={projectLocation} />;
}
