import { useState, useEffect } from "react";
import { useReadContracts } from "wagmi";
import projectAdminAbi from "@/utils/abis/projectAdmin.json";
import projectTokenizationAdmin from "@/utils/abis/projectTokenizationAdmin.json";
import { fetchMetadataFromUri } from "@/actions/project.action";
import { convertContractUnits } from "@/lib/utils";

/**
 * React hook that fetches detailed information about a specific project from the blockchain.
 * This hook interacts with multiple smart contracts, retrieves metadata from an external URI, and processes BigInt values.
 *
 * @function useGetProject
 * @param {number} projectId - The ID of the project to fetch data for.
 * @returns {object} - Returns an object with the project's details, any encountered errors, and a pending state:
 *  - `project`: {ProjectDetails | null} The project data, including metadata and formatted BigInt values.
 *  - `error`: {Error | null} Any error that occurs during the fetching process.
 *  - `isPending`: {boolean} Whether the data is currently being fetched.
 *
 * @example
 * const { project, error, isPending } = useGetProject(1);
 * if (isPending) return <LoadingSpinner />;
 * if (error) return <div>Error: {error.message}</div>;
 * return <ProjectDetails project={project} />;
 */
export const useGetProject = (projectId: number) => {
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isPending, setIsPending] = useState(true);

  // Fetch data from both project and tokenization contracts
  const {
    data,
    error: contractError,
    isPending: contractPending,
  } = useReadContracts({
    contracts: [
      {
        /* "0x277824657168F0876B147843140dA287963D1B79" */
        address: process.env
          .NEXT_PUBLIC_PROJECT_ADMIN_SMART_CONTRACT_ADDRESS as `0x${string}`,
        abi: projectAdminAbi,
        functionName: "returnProject",
        args: [projectId],
      },
      {
        address: process.env
          .NEXT_PUBLIC_PROJECT_TOKENIZATION_ADMIN_SMART_CONTRACT_ADDRESS as `0x${string}`,
        abi: projectTokenizationAdmin,
        functionName: "uri",
        args: [projectId],
      },
      {
        address: process.env
          .NEXT_PUBLIC_PROJECT_TOKENIZATION_ADMIN_SMART_CONTRACT_ADDRESS as `0x${string}`,
        abi: projectTokenizationAdmin,
        functionName: "balanceOf",
        args: [
          process.env
            .NEXT_PUBLIC_PROJECT_ADMIN_SMART_CONTRACT_ADDRESS as `0x${string}`,
          projectId,
        ],
      },
    ],
  });

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        if (contractPending) {
          setIsPending(true);
          return;
        }

        if (contractError) {
          setError(contractError);
          setIsPending(false);
          return;
        }

        if (data) {
          const [projectData, uriData, remainingTokens] = data;
          
          // Print the raw data from the smart contract
          console.log('======== PROJECT DATA FROM SMART CONTRACT ========');
          console.log('Project ID:', projectId);
          console.log('Project Data:', projectData.result);
          console.log('Project URI:', uriData.result);
          console.log('Remaining Tokens:', remainingTokens.result);
          console.log('================================================');

          if (typeof uriData.result === "string") {
            const metadata: ProjectURI = await fetchMetadataFromUri(
              uriData.result
            );

            // Combine project data with fetched metadata and remaining tokens
            const completeProject: ProjectDetails = {
              ...(typeof projectData.result === "object" && projectData.result),
              projectURI: metadata, // Replace the projectURI with fetched metadata
              projectRemainingTokens: remainingTokens.result as bigint,
            };

            // Recursively convert BigInt properties in the project object
            const finalProject = recursivelyConvertBigInt(completeProject);

            setProject(finalProject);
          } else {
            setError(new Error("Invalid URI returned from contract"));
          }
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsPending(false);
      }
    };

    fetchProjectData();
  }, [data, contractError, contractPending, projectId]);

  return { project, error, isPending };
};

/**
 * Function that recursively converts BigInt values in the object to regular numbers.
 * This function is used to process and format values retrieved from the blockchain.
 *
 * @param {any} obj - The object that contains BigInt values.
 * @returns {any} The object with BigInt values converted to regular numbers.
 */
const recursivelyConvertBigInt = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map((item) => recursivelyConvertBigInt(item));
  } else if (typeof obj === "object" && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key,
        recursivelyConvertBigIntForField(key, value),
      ])
    );
  } else {
    return obj;
  }
};

/**
 * Helper function that checks if a field relates to Ethereum units and converts it if necessary.
 *
 * @param {string} key - The key (field name) in the object.
 * @param {any} value - The value associated with the key (which could be a BigInt).
 * @returns {any} The converted value, if applicable, or the original value if no conversion is needed.
 */
const recursivelyConvertBigIntForField = (key: string, value: any): any => {
  if (typeof value === "bigint") {
    // Check if the field relates to Ethereum units (adjust based on your schema)
    const isEthereumField = [
      "projectPrice",
      "projectSales",
      "FeeDevelopmentB2B",
      "FeeRecipientOfSale",
    ].includes(key);
    return convertContractUnits(value, isEthereumField);
  }
  return value; // Return other values as-is
};
