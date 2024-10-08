import Header from "@/sections/dashboard/Header";
import DashboardTabsManager from "./DashboardTabsManager";

export default function DashboardContent() {
  return (
    <div className="mt-20 flex flex-col items-center justify-center">
      <Header />
      <DashboardTabsManager />
    </div>
  );
}
