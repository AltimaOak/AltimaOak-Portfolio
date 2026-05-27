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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <Section id="skills">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column - Heading & 3D Interactive Word Cloud */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <span className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-4 block">
              — Expertise
            </span>
            <h2 className="text-5xl md:text-6xl font-extrabold tracking-tighter text-foreground leading-[1.1]">
              Technical<br/>Arsenal.
            </h2>
            <p className="text-muted-foreground mt-4 leading-relaxed max-w-sm">
              An interactive 3D representation of my core technologies. Drag the cloud to spin and explore my dynamic technical stack.
            </p>
          </motion.div>
          <div className="w-full aspect-square rounded-none bg-card/45 border border-white/5 backdrop-blur-md overflow-hidden relative">
            <Skills3DVisual />
          </div>
        </div>

        {/* Right Column - Categorized Skills Cards */}
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full"
        >
          {categories.map((category, idx) => (
            <motion.div
              key={String(category)}
              variants={item}
              className="p-8 rounded-none bg-card/45 border border-white/5 backdrop-blur-md hover:bg-muted/30 hover:border-primary/20 transition-all duration-300 group"
            >
              <h3 className="text-2xl font-extrabold mb-6 text-foreground group-hover:text-primary transition-colors tracking-tight">
                {String(category)}
              </h3>
              <div className="flex flex-wrap gap-2">
                {(profileData.skills[category] as string[]).map((skill: string, sIdx: number) => (
                  <motion.div
                    key={skill}
                    animate={{
                      y: [0, -4, 0],
                    }}
                    transition={{
                      duration: 3.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: sIdx * 0.15,
                    }}
                  >
                    <Badge 
                      variant="secondary" 
                      className="bg-background hover:bg-primary hover:text-primary-foreground text-muted-foreground transition-colors px-4 py-2 rounded-none border-none cursor-default font-bold uppercase tracking-wider text-[10px]"
                    >
                      {skill}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}

