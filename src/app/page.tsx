"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Timeline from "@/components/Timeline";
import Contact from "@/components/Contact";
import Navbar from "@/components/Navbar";
import CommandPalette from "@/components/CommandPalette";
import Loading from "@/components/Loading";

const ThreeBackground = dynamic(() => import("@/components/ThreeBackground"), { ssr: false });

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Intersection Observer to track active section for 3D camera controls
  useEffect(() => {
    if (loading) return;

    const sections = ["hero", "about", "skills", "projects", "experience", "contact"];
    const observers = sections.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        {
          rootMargin: "-25% 0px -25% 0px", // Trigger when section occupies the middle 50% of viewport
          threshold: 0.1,
        }
      );
      observer.observe(el);
      return { observer, el };
    });

    return () => {
      observers.forEach((obs) => {
        if (obs) obs.observer.unobserve(obs.el);
      });
    };
  }, [loading]);

  if (loading) return <Loading />;

  return (
    <main className="min-h-screen relative">
      {/* Global immersive 3D background */}
      <ThreeBackground activeSection={activeSection} />

      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Timeline />
      <Contact />
      
      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center relative z-10 bg-background/40 backdrop-blur-md">
        <p className="text-muted-foreground text-sm">
          © {new Date().getFullYear()} Aditya Yadav.
        </p>
      </footer>

      <CommandPalette />
    </main>
  );
}

