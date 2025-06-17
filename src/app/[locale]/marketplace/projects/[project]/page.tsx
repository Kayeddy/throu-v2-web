import IndividualProjectDetails from "@/components/marketplace/IndividualProjectDetails";

export interface ProjectPageParams {
  project: string;
  locale: string;
}

// Next.js 15 - params is now a Promise
export default async function Project({
  params,
}: {
  params: Promise<ProjectPageParams>;
}) {
  const resolvedParams = await params;

  return (
    <div className="h-full min-h-screen w-full bg-transparent p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16">
      <IndividualProjectDetails params={resolvedParams} />
    </div>
  );
}
