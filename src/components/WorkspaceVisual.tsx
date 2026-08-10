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
    <div className="w-full max-w-md lg:max-w-lg mx-auto relative select-none flex items-center justify-center">
      {/* Clean User Portrait Photo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full flex items-center justify-center rounded-2xl overflow-hidden shadow-lg border border-[#F0E3D6] bg-white"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="/aditya_photo.png" 
          alt="Aditya Yadav"
          className="w-full h-auto max-h-[500px] object-cover object-top rounded-2xl"
        />
      </motion.div>
    </div>
  );
}

