import IndividualProjectDetails from "@/components/marketplace/IndividualProjectDetails";

export default function Project({ params }: { params: { project: string } }) {
  return (
    <div className="h-full min-h-screen w-full bg-transparent p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16">
      <IndividualProjectDetails params={params} />
    </div>
  );
}
