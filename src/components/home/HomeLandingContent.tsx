"use client";

import About from "@/sections/home/landing/About";
import Hero from "@/sections/home/landing/Hero";
import Perks from "@/sections/home/landing/Perks";
import Showcase from "@/sections/home/landing/Showcase";
import Steps from "@/sections/home/landing/Steps";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect } from "react";

export default function HomeLandingContent() {
  return (
    <div className="relative flex w-screen flex-col items-center justify-center gap-10 overflow-x-hidden">
      <motion.div
        className="relative z-[2]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 1 }}
      >
        <Hero />
        <About />
        <Showcase />
        <Steps />
        <Perks />
      </motion.div>
    </div>
  );
}
