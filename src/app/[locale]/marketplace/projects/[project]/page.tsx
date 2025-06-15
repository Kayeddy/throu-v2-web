import IndividualProjectDetails from "@/components/marketplace/IndividualProjectDetails";

export interface ProjectPageParams {
  project: string;
  locale: string;
}

// This is a workaround for Next.js 15 type changes
// @ts-ignore - Next.js 15 changed page props structure
export default function Project({ params }: { params: ProjectPageParams }) {
  return (
    <div className="h-full min-h-screen w-full bg-transparent p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16">
      <IndividualProjectDetails params={params} />
    </div>
  );
}
