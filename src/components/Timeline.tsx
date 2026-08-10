"use client";

import Section from "./Section";
import profileData from "@/data/profile.json";
import { motion } from "framer-motion";
import { Briefcase, GraduationCap } from "lucide-react";
import TiltCard from "@/components/ui/TiltCard";

interface Experience {
  role: string;
  company: string;
  duration: string;
  description: string;
}

interface Education {
  degree: string;
  institution: string;
  duration: string;
  details: string;
}

export default function Timeline() {
  return (
    <Section id="experience" className="py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Experience Column */}
        <div>
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <span className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-3 block">
              — CAREER TIMELINE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#202124] flex items-center gap-3">
              <Briefcase className="w-8 h-8 text-primary" />
              Experience.
            </h2>
          </motion.div>

          <div className="space-y-6 relative before:absolute before:left-[17px] before:top-3 before:bottom-3 before:w-[2px] before:bg-[#F0E3D6]">
            {(profileData.experience as Experience[]).map((exp, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15, duration: 0.5 }}
                className="relative pl-10 group"
              >
                <div className="absolute left-[11px] top-5 w-3 h-3 rounded-full bg-[#F97316] ring-4 ring-[#FFF9F4] z-10" />
                <TiltCard>
                  <div className="p-6 rounded-xl bg-[#FFFFFF] border border-[#F0E3D6] shadow-xs hover:border-primary/40 transition-all duration-300">
                    <span className="text-[11px] font-bold text-[#6B7280] bg-[#FAF6F0] px-2.5 py-1 rounded-md border border-[#F0E3D6] uppercase tracking-wider mb-3 inline-block">
                      {exp.duration}
                    </span>
                    <h3 className="text-xl font-bold mb-1 tracking-tight text-[#202124]">{exp.role}</h3>
                    <p className="text-primary font-bold text-sm mb-3">{exp.company}</p>
                    <p className="text-xs text-[#6B7280] leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Education Column */}
        <div id="education">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <span className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-3 block">
              — ACADEMIC JOURNEY
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#202124] flex items-center gap-3">
              <GraduationCap className="w-8 h-8 text-primary" />
              Education.
            </h2>
          </motion.div>

          <div className="space-y-6 relative before:absolute before:left-[17px] before:top-3 before:bottom-3 before:w-[2px] before:bg-[#F0E3D6]">
            {(profileData.education as Education[]).map((edu, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15, duration: 0.5 }}
                className="relative pl-10 group"
              >
                <div className="absolute left-[11px] top-5 w-3 h-3 rounded-full bg-[#F97316] ring-4 ring-[#FFF9F4] z-10" />
                <TiltCard>
                  <div className="p-6 rounded-xl bg-[#FFFFFF] border border-[#F0E3D6] shadow-xs hover:border-primary/40 transition-all duration-300">
                    <span className="text-[11px] font-bold text-[#6B7280] bg-[#FAF6F0] px-2.5 py-1 rounded-md border border-[#F0E3D6] uppercase tracking-wider mb-3 inline-block">
                      {edu.duration}
                    </span>
                    <h3 className="text-xl font-bold mb-1 tracking-tight text-[#202124]">{edu.degree}</h3>
                    <p className="text-primary font-bold text-sm mb-3">{edu.institution}</p>
                    {edu.details && (
                      <p className="text-xs text-[#6B7280] leading-relaxed">
                        {edu.details}
                      </p>
                    )}
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
