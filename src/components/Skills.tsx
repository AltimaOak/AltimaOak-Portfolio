"use client";

import Section from "./Section";
import profileData from "@/data/profile.json";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

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
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-10"
      >
        <span className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-4 block">
          — Expertise
        </span>
        <h2 className="text-5xl md:text-6xl font-extrabold tracking-tighter text-foreground leading-[1.1]">
          Technical Arsenal.
        </h2>
      </motion.div>
      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
      >
        {categories.map((category, idx) => (
          <motion.div
            key={String(category)}
            variants={item}
            className="p-8 rounded-none bg-card hover:bg-muted transition-colors duration-300 group"
          >
            <h3 className="text-2xl font-extrabold mb-6 text-foreground group-hover:text-primary transition-colors tracking-tight">{String(category)}</h3>
            <div className="flex flex-wrap gap-2">
              {(profileData.skills[category] as string[]).map((skill: string, sIdx: number) => (
                <motion.div
                  key={skill}
                  animate={{
                    y: [0, -5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: sIdx * 0.2,
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
    </Section>
  );
}
