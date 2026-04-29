"use client";

import Section from "./Section";
import profileData from "@/data/profile.json";
import { motion } from "framer-motion";

export default function About() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <Section id="about" className="flex flex-col md:flex-row gap-12 items-center">
      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="flex-1"
      >
        <motion.div variants={item} className="mb-8">
          <span className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-4 block">
            — Introduction
          </span>
          <h2 className="text-5xl md:text-6xl font-extrabold tracking-tighter text-foreground leading-[1.1]">
            About Me.
          </h2>
        </motion.div>
        <motion.p variants={item} className="text-lg text-muted-foreground leading-relaxed mb-6">
          {profileData.about.summary}
        </motion.p>
        <div className="grid grid-cols-2 gap-6 mt-10">
          <motion.div variants={item} className="p-8 rounded-none bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex flex-col justify-between min-h-[160px]">
            <h4 className="text-4xl md:text-5xl font-extrabold mb-2 tracking-tighter">B.Tech</h4>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Education</p>
          </motion.div>
          <motion.div variants={item} className="p-8 rounded-none bg-card hover:bg-muted transition-colors flex flex-col justify-between min-h-[160px]">
            <h4 className="text-4xl md:text-5xl font-extrabold text-foreground mb-2 tracking-tighter">Thane</h4>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Location</p>
          </motion.div>
        </div>
      </motion.div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="flex-1 relative"
      >
         <motion.div 
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="w-full aspect-square rounded-none overflow-hidden bg-card relative p-12 group flex flex-col justify-between"
         >
            <div className="text-3xl font-extrabold text-foreground tracking-tighter">Developer<br/><span className="text-muted-foreground">Journey.</span></div>
            <div className="text-8xl md:text-[120px] group-hover:scale-105 transition-transform duration-500 origin-bottom-left grayscale opacity-50">
               👨‍💻
            </div>
         </motion.div>
      </motion.div>
    </Section>
  );
}
