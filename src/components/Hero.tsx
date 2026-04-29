"use client";

import { motion, Variants } from "framer-motion";
import profileData from "@/data/profile.json";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { ChevronDown } from "lucide-react";

const ThreeBackground = dynamic(() => import("./ThreeBackground"), { ssr: false });
const CrazyVisual = dynamic(() => import("./CrazyVisual"), { ssr: false });

import { useMouseMove } from "@/lib/hooks"; // I'll create this hook or use a simple version inline

export default function Hero() {
  const { x, y } = useMouseMove();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    },
  };

  return (
    <section className="relative min-h-screen w-full flex items-center overflow-hidden px-6 sm:px-12 md:px-24 py-20">
      <ThreeBackground />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 w-full items-center gap-12 sm:gap-20 z-10">
        <motion.div 
          style={{ x: x / 50, y: y / 50 }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-left w-full"
        >
          <motion.div variants={itemVariants} className="mb-6 sm:mb-8">
            <div className="w-10 h-10 bg-primary rounded-tr-xl rounded-bl-xl rounded-tl-sm rounded-br-sm mb-8 sm:mb-12 flex items-center justify-center shadow-lg shadow-primary/20" />
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl sm:text-7xl md:text-9xl font-extrabold tracking-tighter mb-6 text-foreground leading-[1.05]"
          >
            {profileData.name}.
          </motion.h1>

          <motion.div 
            variants={itemVariants}
            className="w-16 h-2 bg-primary mb-10 rounded-full"
          />

          <motion.div variants={itemVariants} className="mb-10 max-w-xl">
            <span className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-4 block">
              — Introduction
            </span>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
              {profileData.role}
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center gap-6"
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all px-8 py-6 text-lg rounded-none font-bold" render={<a href="#projects" />} nativeButton={false}>
                View Projects
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button size="lg" variant="ghost" className="px-8 py-6 text-lg font-bold text-foreground hover:bg-transparent hover:text-primary transition-colors underline-offset-8 hover:underline" render={<a href="#contact" />} nativeButton={false}>
                Contact Me →
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* 3D Visual Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="hidden lg:flex justify-center items-center h-[500px] relative"
        >
          <CrazyVisual />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce"
      >
        <ChevronDown className="text-muted-foreground w-6 h-6" />
      </motion.div>
    </section>
  );
}
