"use client";

import Section from "./Section";
import profileData from "@/data/profile.json";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const About3DVisual = dynamic(() => import("./About3DVisual"), { ssr: false });

export default function About() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <Section id="about" className="py-20">
      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
      >
        {/* Left Column: Heading & Summary */}
        <div className="lg:col-span-6 flex flex-col justify-center">
          <motion.div variants={item} className="mb-6">
            <span className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-3 block">
              — ABOUT ME
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#202124] leading-[1.15]">
              Passionate about building clean &amp; impact-driven software.
            </h2>
          </motion.div>
          
          <motion.p variants={item} className="text-base sm:text-lg text-[#6B7280] leading-relaxed mb-8">
            {profileData.about.summary}
          </motion.p>

          <motion.div variants={item} className="p-6 rounded-xl bg-[#FFF0E4] border border-[#F0E3D6]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-2">Career Objective</h3>
            <p className="text-sm text-[#202124] leading-relaxed font-medium">
              {profileData.about.objective}
            </p>
          </motion.div>
        </div>

        {/* Right Column: Information Cards */}
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <motion.div variants={item} className="p-6 rounded-xl bg-[#FFFFFF] border border-[#F0E3D6] shadow-xs flex flex-col justify-between hover:border-primary/40 transition-colors min-h-[160px]">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">Degree</span>
              <h4 className="text-3xl font-extrabold text-[#202124] mt-2 tracking-tight">B.Tech</h4>
              <p className="text-xs text-primary font-semibold mt-1">Computer Engineering</p>
            </div>
            <p className="text-[11px] text-[#6B7280]">Lokmanya Tilak College of Engineering</p>
          </motion.div>

          <motion.div variants={item} className="p-6 rounded-xl bg-[#FFFFFF] border border-[#F0E3D6] shadow-xs flex flex-col justify-between hover:border-primary/40 transition-colors min-h-[160px]">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">Location</span>
              <h4 className="text-3xl font-extrabold text-[#202124] mt-2 tracking-tight">Thane</h4>
              <p className="text-xs text-primary font-semibold mt-1">Maharashtra, India</p>
            </div>
            <p className="text-[11px] text-[#6B7280]">Open for Global / Remote</p>
          </motion.div>

          <motion.div variants={item} className="p-6 rounded-xl bg-[#FFFFFF] border border-[#F0E3D6] shadow-xs flex flex-col justify-between hover:border-primary/40 transition-colors sm:col-span-2 min-h-[140px]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">Focus &amp; Specialization</span>
              <span className="text-xs font-bold text-primary bg-[#FFF0E4] px-2.5 py-1 rounded-md">Core Stack</span>
            </div>
            <h4 className="text-xl font-bold text-[#202124] mt-2 tracking-tight">
              Java, Spring Boot, Python, React &amp; Next.js
            </h4>
            <p className="text-xs text-[#6B7280] mt-1">Building high-performance backend systems &amp; modern UI web platforms.</p>
          </motion.div>
        </div>
      </motion.div>
    </Section>
  );
}

