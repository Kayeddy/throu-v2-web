"use client";
import Header from "@/sections/dashboard/Header";
import DashboardTabsManager from "./DashboardTabsManager";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

export default function DashboardContent() {
  // Use useSearchParams hook to get the search params
  const searchParams = useSearchParams();

  // Get the 'saved' parameter value if it exists
  const isSavedParam = searchParams.get("saved");

  return (
    <motion.div
      className="flex flex-col items-start justify-start gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1, duration: 1 }}
    >
      <Header />
      <DashboardTabsManager />
    </motion.div>
  );
}
