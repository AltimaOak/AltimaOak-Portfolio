"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Save, ArrowLeft, Loader2, Layers, ExternalLink } from "lucide-react";
import { GitHub } from "@/components/Icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

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

export default function AdminPage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setLoading(false);
      });
  }, []);

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: "New Innovative Project",
      category: "Web",
      description: "A short and compelling description of your project.",
      techStack: ["Next.js", "Tailwind"],
      duration: "2024",
      github: "",
      liveDemo: "",
    };
    setProfile({
      ...profile,
      projects: [newProject, ...profile.projects],
    });
  };

  const deleteProject = (id: string) => {
    setProfile({
      ...profile,
      projects: profile.projects.filter((p: any) => p.id !== id),
    });
  };

  const updateProject = (id: string, field: string, value: any) => {
    setProfile({
      ...profile,
      projects: profile.projects.map((p: any) => 
        p.id === id ? { ...p, [field]: value } : p
      ),
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (res.ok) {
        router.refresh();
        alert("Changes saved successfully!");
      }
    } catch (error) {
      alert("Failed to save changes.");
    }
    setSaving(false);
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center gap-4 bg-background">
      <Loader2 className="animate-spin text-neon-blue w-12 h-12" />
      <p className="text-muted-foreground animate-pulse">Loading Dashboard...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 max-w-6xl mx-auto pb-24">
      {/* Header */}
      <div className="sticky top-0 z-50 py-4 bg-background/80 backdrop-blur-xl border-b border-white/5 mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="rounded-full glass border-white/10 hover:border-neon-blue/50" render={<Link href="/" />} nativeButton={false}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gradient">Project Manager</h1>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Admin Dashboard</p>
          </div>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <Button onClick={addProject} className="flex-1 md:flex-none bg-neon-blue/10 text-neon-blue border border-neon-blue/20 hover:bg-neon-blue/20 gap-2 rounded-xl">
            <Plus className="w-4 h-4" /> Add New
          </Button>
          <Button onClick={handleSave} disabled={saving} className="flex-1 md:flex-none bg-gradient-premium gap-2 px-8 rounded-xl shadow-[0_0_20px_rgba(0,242,255,0.2)]">
            {saving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving..." : "Save All Changes"}
          </Button>
        </div>
      </div>

      {/* Projects Grid/List */}
      <div className="grid grid-cols-1 gap-8">
        <AnimatePresence>
          {profile.projects.map((project: Project, idx: number) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="glass border-white/5 overflow-hidden hover:border-white/10 transition-colors group">
                <div className="grid grid-cols-1 lg:grid-cols-12">
                  {/* Left: Preview/Icon */}
                  <div className="lg:col-span-3 bg-white/5 p-8 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-white/5">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-premium p-4 mb-4 shadow-[0_0_20px_rgba(0,242,255,0.3)]">
                      <Layers className="w-full h-full text-white" />
                    </div>
                    <Badge variant="outline" className="bg-background/50 border-white/10">
                      {project.category}
                    </Badge>
                  </div>

                  {/* Middle: Form */}
                  <div className="lg:col-span-9 p-8">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex-1 mr-4">
                        <Input 
                          value={project.title} 
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateProject(project.id, "title", e.target.value)}
                          className="text-2xl font-bold bg-transparent border-none p-0 focus-visible:ring-0 h-auto placeholder:opacity-30"
                          placeholder="Project Title"
                        />
                      </div>
                      <Button 
                        variant="destructive" 
                        size="icon" 
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this project?")) {
                            deleteProject(project.id);
                          }
                        }}
                        className="rounded-full h-10 w-10 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Category</label>
                        <select 
                          value={project.category}
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateProject(project.id, "category", e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:border-neon-blue/50 outline-none transition-colors"
                        >
                          <option value="AI">AI / Machine Learning</option>
                          <option value="Web">Web Development</option>
                          <option value="Android">Android / Mobile</option>
                          <option value="Other">Other Category</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Duration / Date</label>
                        <Input 
                          value={project.duration} 
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateProject(project.id, "duration", e.target.value)}
                          className="bg-white/5 border-white/10 rounded-xl p-3 focus:border-neon-blue/50"
                          placeholder="e.g. Jan 2024 - Mar 2024"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-6">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Description</label>
                      <Textarea 
                        value={project.description} 
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateProject(project.id, "description", e.target.value)}
                        className="bg-white/5 border-white/10 rounded-xl p-3 min-h-[100px] focus:border-neon-blue/50"
                        placeholder="Tell the story of your project..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest flex items-center gap-2">
                          <GitHub className="w-3 h-3" /> GitHub Link
                        </label>
                        <Input 
                          value={project.github || ""} 
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateProject(project.id, "github", e.target.value)}
                          className="bg-white/5 border-white/10 rounded-xl p-3 focus:border-neon-blue/50"
                          placeholder="https://github.com/..."
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest flex items-center gap-2">
                          <ExternalLink className="w-3 h-3" /> Live Demo Link
                        </label>
                        <Input 
                          value={project.liveDemo || ""} 
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateProject(project.id, "liveDemo", e.target.value)}
                          className="bg-white/5 border-white/10 rounded-xl p-3 focus:border-neon-blue/50"
                          placeholder="https://..."
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Tech Stack (comma separated)</label>
                      <Input 
                        value={project.techStack.join(", ")} 
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateProject(project.id, "techStack", e.target.value.split(",").map((s: string) => s.trim()))}
                        className="bg-white/5 border-white/10 rounded-xl p-3 focus:border-neon-blue/50"
                        placeholder="React, Tailwind, Node.js..."
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {profile.projects.length === 0 && (
        <div className="text-center py-20 bg-white/5 rounded-3xl border-2 border-dashed border-white/10">
          <p className="text-muted-foreground mb-4">No projects found. Start building your portfolio!</p>
          <Button onClick={addProject} className="bg-neon-blue/20 text-neon-blue border-neon-blue/30">
            <Plus className="w-4 h-4 mr-2" /> Add Your First Project
          </Button>
        </div>
      )}
    </div>
  );
}
