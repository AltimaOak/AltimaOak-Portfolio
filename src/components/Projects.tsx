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
    <Section id="projects">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6"
      >
        <div className="mb-8">
          <span className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-4 block">
            — Portfolio
          </span>
          <h2 className="text-5xl md:text-6xl font-extrabold tracking-tighter text-foreground leading-[1.1]">
            All Creative Works,<br/>Selected projects.
          </h2>
          <p className="text-muted-foreground mt-4 max-w-md">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-6 text-sm font-bold uppercase tracking-wider text-[10px]">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`pb-1 transition-all border-b-2 ${
                filter === cat 
                ? "border-primary text-primary" 
                : "border-transparent text-muted-foreground hover:text-foreground"
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
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[400px]"
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
              className="col-span-full flex flex-col items-center justify-center py-20 text-muted-foreground"
            >
              <Layers className="w-12 h-12 mb-4 opacity-20" />
              <p>No projects found in this category.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const item = {
    hidden: { opacity: 0, y: 20 },
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
      transition={{ duration: 0.3 }}
    >
      <Dialog>
        <DialogTrigger render={<div />} nativeButton={false}>
          <Card className="bg-card border-none rounded-none overflow-hidden group cursor-pointer h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
            <div className="relative aspect-video overflow-hidden bg-background">
               <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-80 z-10" />
               <div className="absolute inset-0 flex items-center justify-center bg-foreground/5 group-hover:bg-foreground/10 transition-colors">
                  <Layers className="w-12 h-12 text-primary/30 group-hover:text-primary transition-all group-hover:scale-110" />
               </div>
               <Badge className="absolute top-4 right-4 z-20 bg-primary text-primary-foreground border-none rounded-none text-[10px] font-bold uppercase tracking-wider">
                  {project.category}
               </Badge>
            </div>
            
            <CardContent className="p-8 flex-1 flex flex-col bg-card">
              <h3 className="text-2xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors tracking-tight">{project.title}</h3>
              <p className="text-muted-foreground text-sm line-clamp-2 mb-6 flex-1 leading-relaxed">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.techStack.slice(0, 3).map((tech: string) => (
                  <span key={tech} className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground group-hover:text-foreground transition-colors">
                    {tech}
                  </span>
                ))}
                {project.techStack.length > 3 && (
                  <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                    +{project.techStack.length - 3}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
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
