"use client";

import { useState, useEffect } from "react";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Timeline from "@/components/Timeline";
import Contact from "@/components/Contact";
import Navbar from "@/components/Navbar";
import CommandPalette from "@/components/CommandPalette";
import Loading from "@/components/Loading";
import Link from "next/link";

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loading />;

  return (
    <main className="min-h-screen relative">
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Timeline />
      <Contact />
      
      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center">
        <p className="text-muted-foreground text-sm mb-4">
          © {new Date().getFullYear()} Aditya Yadav. Built with Next.js, Three.js & Framer Motion.
        </p>
        <Link href="/admin" className="text-xs text-muted-foreground hover:text-neon-blue transition-colors">
          Admin Dashboard
        </Link>
      </footer>

      <CommandPalette />
    </main>
  );
}
