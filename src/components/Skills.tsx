"use client";

import Section from "./Section";
import profileData from "@/data/profile.json";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import dynamic from "next/dynamic";

const Skills3DVisual = dynamic(() => import("./Skills3DVisual"), { ssr: false });

export default function Skills() {
  const categories = Object.keys(profileData.skills) as Array<keyof typeof profileData.skills>;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <Section id="skills" className="py-20">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12"
      >
        <span className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-3 block">
          — SKILLS &amp; EXPERTISE
        </span>
        <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#202124]">
          Technical Capabilities.
        </h2>
        <p className="text-[#6B7280] mt-3 leading-relaxed max-w-xl">
          Structured view of core programming languages, frameworks, AI libraries, and developer tools.
        </p>
      </motion.div>

      {/* Categorized Skills Grid */}
      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
      >
        {categories.map((category) => (
          <motion.div
            key={String(category)}
            variants={item}
            className="p-6 rounded-xl bg-[#FFFFFF] border border-[#F0E3D6] shadow-xs hover:border-primary/40 transition-all duration-300 group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-bold text-[#202124] group-hover:text-primary transition-colors tracking-tight">
                  {String(category)}
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] bg-[#FFF0E4] px-2.5 py-0.5 rounded-md">
                  {(profileData.skills[category] as string[]).length} Skills
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {(profileData.skills[category] as string[]).map((skill: string) => (
                  <span
                    key={skill}
                    className="bg-[#FAF6F0] text-[#202124] border border-[#F0E3D6] hover:bg-[#FFF0E4] hover:text-[#F97316] hover:border-primary/40 transition-colors px-3 py-1.5 rounded-lg font-semibold text-xs inline-flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F97316]" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}

