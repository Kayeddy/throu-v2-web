"use client";
import Header from "@/sections/dashboard/Header";
import DashboardTabsManager from "./DashboardTabsManager";
import { useSearchParams } from "next/navigation";

export default function DashboardContent() {
  // Use useSearchParams hook to get the search params
  const searchParams = useSearchParams();

  // Get the 'saved' parameter value if it exists
  const isSavedParam = searchParams.get("saved");

  return (
    <div className="flex flex-col items-center justify-center">
      <Header />
      <DashboardTabsManager isSavedParam={isSavedParam?.toString()} />
    </div>
  );
}
