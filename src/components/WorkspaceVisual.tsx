"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Code2, Terminal, Cpu, Sparkles } from "lucide-react";

export default function WorkspaceVisual() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full max-w-xl mx-auto relative select-none flex items-center justify-center">
      {/* Background Circular Warm Glow */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] bg-[#FFEAD8] rounded-full blur-xl opacity-70 -z-10" />

      {/* Geometric Dot Grid (Top Right) */}
      <div 
        className="absolute top-0 right-2 w-32 h-32 opacity-25 pointer-events-none z-0"
        style={{
          backgroundImage: `radial-gradient(#F97316 2px, transparent 2px)`,
          backgroundSize: "14px 14px"
        }}
      />

      {/* Main Developer Image Visual */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full rounded-3xl overflow-hidden shadow-2xl shadow-orange-950/5 border border-[#F0E3D6] bg-[#FFFFFF]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="/hero_developer.png" 
          alt="Aditya Yadav Developer Workspace"
          className="w-full h-auto object-cover object-center rounded-3xl transform transition-transform duration-700 hover:scale-[1.01]"
        />
      </motion.div>
    </div>
  );
}

