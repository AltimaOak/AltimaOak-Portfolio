"use client";

import { useState, useEffect } from "react";
import Section from "./Section";
import profileData from "@/data/profile.json";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, Layers } from "lucide-react";
import { GitHub } from "@/components/Icons";
import Link from "next/link";
import TiltCard from "@/components/ui/TiltCard";

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  techStack: string[];
  duration: string;
  github?: string;
  liveDemo?: string;
}

const ensureAbsoluteUrl = (url: string) => {
  if (!url || url === "#") return "#";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://${url}`;
};

import { useMotionValue, useSpring, useTransform } from "framer-motion";

export default function Projects() {
  const [filter, setFilter] = useState("All");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const categories = ["All", "AI", "Web", "Android", "Client", "Other"];

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.projects) {
          setProjects(data.projects);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredProjects = filter === "All" 
    ? projects 
    : projects.filter((p: Project) => p.category?.toLowerCase() === filter.toLowerCase());

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <Section id="projects" className="py-10">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-6"
      >
        <div>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#202124]">
            Selected Works.
          </h2>
          <p className="text-[#6B7280] mt-2 max-w-md">
            Full-stack web systems, AI platforms, and mobile applications built with modern tools.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3 text-xs font-bold uppercase tracking-wider">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-lg transition-all ${
                filter === cat 
                ? "bg-primary text-primary-foreground shadow-xs" 
                : "bg-[#FFFFFF] text-[#6B7280] border border-[#F0E3D6] hover:text-[#202124]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[380px]"
      >
        <AnimatePresence mode="popLayout">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))
          ) : !loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full flex flex-col items-center justify-center py-20 text-[#6B7280]"
            >
              <Layers className="w-12 h-12 mb-3 opacity-30" />
              <p className="font-medium">No projects found in this category.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
  };

  return (
    <motion.div
      variants={item}
      layout
      initial="hidden"
      animate="show"
      exit="exit"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
    >
      <Dialog>
        <DialogTrigger render={<div />} nativeButton={false}>
          <TiltCard className="h-full">
            <Card className="bg-[#FFFFFF] border border-[#F0E3D6] rounded-xl overflow-hidden group cursor-pointer h-full flex flex-col shadow-xs hover:shadow-md hover:border-primary/40 transition-all duration-300">
              <div className="relative aspect-video overflow-hidden bg-[#FAF6F0] border-b border-[#F0E3D6]">
                 <div className="absolute inset-0 flex items-center justify-center bg-primary/5 group-hover:bg-primary/10 transition-colors">
                    <Layers className="w-10 h-10 text-primary/40 group-hover:text-primary transition-all group-hover:scale-110" />
                 </div>
                 <Badge className="absolute top-3.5 right-3.5 z-20 bg-[#FFF0E4] text-[#F97316] border border-[#F0E3D6] rounded-md text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 shadow-xs">
                    {project.category}
                 </Badge>
              </div>
              
              <CardContent className="p-6 flex-1 flex flex-col bg-[#FFFFFF]">
                <h3 className="text-xl font-bold mb-2 text-[#202124] group-hover:text-primary transition-colors tracking-tight">{project.title}</h3>
                <p className="text-[#6B7280] text-xs line-clamp-2 mb-5 flex-1 leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#F0E3D6]">
                  {project.techStack.slice(0, 3).map((tech: string) => (
                    <span key={tech} className="text-[10px] uppercase tracking-wider font-semibold text-[#202124] px-2 py-0.5 rounded-md bg-[#FAF6F0] border border-[#F0E3D6]">
                      {tech}
                    </span>
                  ))}
                  {project.techStack.length > 3 && (
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-[#6B7280] px-2 py-0.5 rounded-md bg-[#FAF6F0] border border-[#F0E3D6]">
                      +{project.techStack.length - 3}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </TiltCard>
        </DialogTrigger>

        
        <AnimatePresence>
          <DialogContent className="glass border-foreground/10 text-foreground max-w-2xl overflow-hidden">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
            >
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-foreground tracking-tight">{project.title}</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                 <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                   {project.description}
                 </p>
                 
                 <div className="space-y-4">
                    <div>
                       <h4 className="text-sm font-bold uppercase tracking-widest text-primary mb-3">Tech Stack</h4>
                       <div className="flex flex-wrap gap-2">
                          {project.techStack.map((tech: string) => (
                             <Badge key={tech} variant="outline" className="border-primary/20 bg-primary/5">
                                {tech}
                             </Badge>
                          ))}
                       </div>
                    </div>
                    
                    <div className="pt-6 flex gap-4">
                       <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 rounded-none shadow-none font-bold" render={<a href={ensureAbsoluteUrl(project.liveDemo || "#")} target="_blank" rel="noopener noreferrer" />} nativeButton={false}>
                          <ExternalLink className="w-4 h-4 mr-2" /> Live Demo
                       </Button>
                       <Button variant="outline" className="flex-1 bg-transparent border-border hover:bg-muted rounded-none shadow-none font-bold text-foreground" render={<a href={ensureAbsoluteUrl(project.github || "#")} target="_blank" rel="noopener noreferrer" />} nativeButton={false}>
                          <GitHub className="w-4 h-4 mr-2" /> Repository
                       </Button>
                    </div>
                 </div>
              </div>
            </motion.div>
          </DialogContent>
        </AnimatePresence>
      </Dialog>
    </motion.div>
  );
}
