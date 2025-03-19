"use client";

import { useFetchAllProjects } from "@/utils/hooks/smart_contracts/useFetchAllProjects";
import { useGetProject } from "@/utils/hooks/smart_contracts/useGetProjects";
import { calculateBarPercentage } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Card, CardBody, CardFooter, Button, Spinner } from "@nextui-org/react";

/**
 * A component that displays all projects from the smart contract
 * This is useful for debugging and viewing the raw data
 */
export default function ProjectsListing() {
  const { totalProjectCount, isLoading, error } = useFetchAllProjects();
  const [projectIds, setProjectIds] = useState<number[]>([]);
  
  // When total project count is fetched, create an array of project IDs
  useEffect(() => {
    if (totalProjectCount > 0) {
      // Projects are indexed from 0 to totalProjectCount - 1
      const ids = Array.from({ length: totalProjectCount }, (_, i) => i);
      setProjectIds(ids);
      
      console.log("Project IDs to fetch:", ids);
    }
  }, [totalProjectCount]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-10">
        <Spinner size="lg" label="Loading project data..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-bold text-red-500">Error loading projects</h2>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Projects from Smart Contract</h1>
      
      <div className="mb-4">
        <p className="font-semibold">Total Projects: {totalProjectCount}</p>
        <p className="text-sm text-gray-600">
          Check the browser console to see the raw project data from the smart contract
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projectIds.map((id) => (
          <ProjectCard key={id} projectId={id} />
        ))}
      </div>
    </div>
  );
}

/**
 * Card component for a single project
 */
function ProjectCard({ projectId }: { projectId: number }) {
  const { project, error, isPending } = useGetProject(projectId);
  
  // Calculate completion percentage
  const getCompletionPercentage = () => {
    if (project?.projectRemainingTokens !== undefined && project?.projectTotalSupply) {
      return calculateBarPercentage(
        project.projectTotalSupply,
        project.projectRemainingTokens
      );
    }
    return 0;
  };
  
  if (isPending) {
    return (
      <Card className="min-h-[200px] flex items-center justify-center">
        <Spinner size="sm" />
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card className="min-h-[200px] flex items-center justify-center bg-red-50">
        <p className="text-red-500">Error: {error.message}</p>
      </Card>
    );
  }
  
  // Calculate completion percentage
  const completionPercentage = getCompletionPercentage();
  
  return (
    <Card className="min-h-[200px]">
      <CardBody>
        <h3 className="text-lg font-bold">Project #{projectId}</h3>
        {project && project.projectURI && (
          <>
            <p className="font-medium">{project.projectURI.name}</p>
            <p className="text-sm truncate">{project.projectURI.description}</p>
          </>
        )}
        <p className="text-sm">
          Price: {project?.projectPrice || 'N/A'} USDT
        </p>
        <p className="text-sm">
          Total Supply: {project?.projectTotalSupply || 'N/A'} tokens
        </p>
        <p className="text-sm">
          Remaining Tokens: {project?.projectRemainingTokens?.toString() || 'N/A'}
        </p>
        <p className="text-sm font-bold mt-2">
          Completion: {completionPercentage}%
        </p>
        
        {/* Progress bar */}
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </CardBody>
      <CardFooter>
        <Button size="sm" color="primary">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
} 