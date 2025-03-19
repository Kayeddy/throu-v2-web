import ProjectsListing from "@/components/ProjectsListing";

/**
 * Page to display all projects from the smart contract
 * The data is logged to the console
 */
export default function ProjectsListingPage() {
  return (
    <div className="h-full min-h-screen w-full bg-transparent p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16">
      <ProjectsListing />
    </div>
  );
} 