"use client";

import Section from "./Section";
import profileData from "@/data/profile.json";
import { motion } from "framer-motion";
import { Briefcase, GraduationCap } from "lucide-react";

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
    <Section id="experience">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Experience */}
        <div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <span className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-4 block">
              — Career
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-foreground leading-[1.1] flex items-center gap-4">
              <Briefcase className="w-10 h-10 text-primary" />
              Experience.
            </h2>
          </motion.div>
          <div className="space-y-8 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-[2px] before:bg-foreground/5">
            {(profileData.experience as Experience[]).map((exp, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2, duration: 0.8, ease: "easeOut" }}
                className="relative pl-12 group"
              >
                <motion.div 
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2 + 0.5, type: "spring", stiffness: 200 }}
                  className="absolute left-[3px] top-4 w-4 h-4 rounded-full bg-primary z-10 group-hover:scale-125 transition-transform" 
                />
                <div className="p-8 rounded-none bg-card hover:bg-muted transition-all duration-300">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 block">{exp.duration}</span>
                  <h3 className="text-2xl font-bold mb-1 tracking-tight text-foreground">{exp.role}</h3>
                  <p className="text-primary font-bold mb-4">{exp.company}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div id="education">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <span className="text-accent text-xs font-bold uppercase tracking-[0.2em] mb-4 block">
              — Academic
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-foreground leading-[1.1] flex items-center gap-4">
              <GraduationCap className="w-10 h-10 text-accent" />
              Education.
            </h2>
          </motion.div>
          <div className="space-y-8 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-[2px] before:bg-foreground/5">
            {(profileData.education as Education[]).map((edu, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2, duration: 0.8, ease: "easeOut" }}
                className="relative pl-12 group"
              >
                <motion.div 
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2 + 0.5, type: "spring", stiffness: 200 }}
                  className="absolute left-[3px] top-4 w-4 h-4 rounded-full bg-accent z-10 group-hover:scale-125 transition-transform" 
                />
                <div className="p-8 rounded-none bg-card hover:bg-muted transition-all duration-300">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 block">{edu.duration}</span>
                  <h3 className="text-2xl font-bold mb-1 tracking-tight text-foreground">{edu.degree}</h3>
                  <p className="text-accent font-bold mb-4">{edu.institution}</p>
                  {edu.details && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {edu.details}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
