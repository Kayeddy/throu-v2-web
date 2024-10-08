import DashboardContent from "@/components/dashboard/DashboardContent";
import { Tabs, Tab, Chip } from "@nextui-org/react";

export default function Dashboard() {
  return (
    <div className="w-screen min-h-screen h-fit sm:p-6 md:p-8 lg:p-12 xl:p-16 relative">
      <DashboardContent />
    </div>
  );
}
