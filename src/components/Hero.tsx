"use client";

import { motion, Variants, useScroll, useTransform } from "framer-motion";
import profileData from "@/data/profile.json";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { ChevronDown, Download, Mail, ArrowRight, Package } from "lucide-react";
import { GitHub, LinkedIn, Instagram } from "@/components/Icons";

const WorkspaceVisual = dynamic(() => import("./WorkspaceVisual"), { ssr: false });

export default function Hero() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    },
  };

  return (
    <section 
      id="hero" 
      className="relative min-h-[75vh] lg:min-h-[85vh] w-full flex items-center overflow-hidden px-6 sm:px-12 md:px-20 pt-28 pb-14 sm:pb-16 bg-[#FFF9F4]"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 w-full items-center gap-12 lg:gap-8 z-10">
        
        {/* Left Content Column */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-left w-full lg:col-span-6 flex flex-col justify-center pr-0 lg:pr-4"
        >
          {/* Greeting Badge */}
          <motion.div variants={itemVariants} className="mb-4">
            <span className="inline-block px-3.5 py-1.5 rounded-full bg-[#FFF0E4] border border-[#F0E3D6] text-[#F97316] text-xs font-bold uppercase tracking-wider">
              HELLO, I&apos;M
            </span>
          </motion.div>

          {/* Name Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-3 text-[#202124] leading-[1.05]"
          >
            Aditya <span className="text-[#F97316]">Yadav.</span>
          </motion.h1>

          {/* Subtitle / Role */}
          <motion.h2 
            variants={itemVariants}
            className="text-xl sm:text-2xl font-bold text-[#202124] mb-4 tracking-tight"
          >
            Java Developer | Computer Engineering Student
          </motion.h2>

          {/* Bio Description */}
          <motion.p 
            variants={itemVariants}
            className="text-base sm:text-lg text-[#6B7280] font-normal leading-relaxed mb-8 max-w-lg"
          >
            I build clean, efficient and user-friendly web applications and love turning ideas into real-world solutions.
          </motion.p>

          {/* CTA Buttons Row */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center gap-4 mb-10"
          >
            <a
              href="#projects"
              className="bg-[#F97316] text-white hover:bg-[#EA580C] px-6 py-3.5 rounded-xl font-bold text-sm shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              View Projects
            </a>
            
            <a
              href="/resume.pdf"
              download="Aditya_Yadav_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border border-[#F0E3D6] text-[#202124] hover:border-[#F97316]/50 hover:bg-[#FFF0E4]/40 px-6 py-3.5 rounded-xl font-bold text-sm shadow-xs flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Download className="w-4 h-4 text-[#F97316]" /> Resume
            </a>

            <a
              href="#contact"
              className="bg-white border border-[#F0E3D6] text-[#202124] hover:border-[#F97316]/50 hover:bg-[#FFF0E4]/40 px-6 py-3.5 rounded-xl font-bold text-sm shadow-xs flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Mail className="w-4 h-4 text-[#F97316]" /> Contact Me →
            </a>
          </motion.div>

          {/* Social Icon Cards */}
          <motion.div 
            variants={itemVariants}
            className="flex items-center gap-3.5"
          >
            <a 
              href={profileData.contact.github} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-11 h-11 rounded-xl bg-white border border-[#F0E3D6] flex items-center justify-center text-[#202124] hover:text-[#F97316] hover:border-[#F97316]/40 shadow-xs transition-all hover:scale-105"
              aria-label="GitHub"
            >
              <GitHub className="w-4.5 h-4.5" />
            </a>
            <a 
              href={profileData.contact.linkedin} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-11 h-11 rounded-xl bg-white border border-[#F0E3D6] flex items-center justify-center text-[#202124] hover:text-[#F97316] hover:border-[#F97316]/40 shadow-xs transition-all hover:scale-105"
              aria-label="LinkedIn"
            >
              <LinkedIn className="w-4.5 h-4.5" />
            </a>
            <a 
              href={`mailto:${profileData.contact.email}`}
              className="w-11 h-11 rounded-xl bg-white border border-[#F0E3D6] flex items-center justify-center text-[#202124] hover:text-[#F97316] hover:border-[#F97316]/40 shadow-xs transition-all hover:scale-105"
              aria-label="Email"
            >
              <Mail className="w-4.5 h-4.5" />
            </a>
          </motion.div>

        </motion.div>

        {/* Right Visual Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full lg:col-span-6 flex justify-center items-center relative"
        >
          <WorkspaceVisual />
        </motion.div>
      </div>
    </section>
  );
}
