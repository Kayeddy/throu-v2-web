import { useState, useEffect } from "react";
import { useReadContract } from "wagmi";
import projectAdminAbi from "@/utils/abis/projectAdmin.json";
import { useGetProject } from "./useGetProjects";

/**
 * Custom hook to fetch all projects from the smart contract
 * This hook first gets the total number of projects, then fetches each project in sequence.
 */
export const useFetchAllProjects = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalProjectCount, setTotalProjectCount] = useState<number>(0);

  // First, get the total number of projects from the contract
  const { 
    data: totalProjectsData,
    isError: isTotalProjectsError,
    isLoading: isTotalProjectsLoading
  } = useReadContract({
    address: process.env.NEXT_PUBLIC_PROJECT_ADMIN_SMART_CONTRACT_ADDRESS as `0x${string}`,
    abi: projectAdminAbi,
    functionName: "totalProjects",
  });

  useEffect(() => {
    // Don't proceed if we're still loading the total project count
    if (isTotalProjectsLoading) return;

    if (isTotalProjectsError) {
      setError(new Error("Failed to fetch total projects count"));
      setIsLoading(false);
      return;
    }

    if (totalProjectsData !== undefined) {
      // Convert BigInt to number
      const count = Number(totalProjectsData);
      setTotalProjectCount(count);
      console.log("Total Projects Count:", count);
    }
  }, [totalProjectsData, isTotalProjectsError, isTotalProjectsLoading]);

  return {
    projects,
    isLoading,
    error,
    totalProjectCount
  };
}; 