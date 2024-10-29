"use client";

import Community from "@/sections/home/about-us/Community";
import Intro from "@/sections/home/about-us/Intro";
import Roadmap from "@/sections/home/about-us/Roadmap";
import Team from "@/sections/home/about-us/Team";
import TeamMetrics from "@/sections/home/about-us/TeamMetrics";
import Values from "@/sections/home/about-us/Values";

import { motion } from "framer-motion";

export default function HomeAboutUsContent() {
  return (
    <motion.div
      className="relative w-screen gap-10 overflow-x-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1, duration: 1 }}
    >
      <div className="relative z-[2] mt-20 flex h-full w-full flex-col items-start justify-start gap-24 p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16">
        {/* Textually informative section */}
        <Intro />

        {/* General team showcase section */}
        <Team />

        {/* Metrics and specific team members information section */}
        <TeamMetrics />

        {/* Development roadmap section */}
        <Roadmap />
      </div>
    </motion.div>
  );
}
