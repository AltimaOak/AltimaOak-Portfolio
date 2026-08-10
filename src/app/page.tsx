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

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loading />;

  return (
    <main className="min-h-screen relative bg-[#FFF9F4]">
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Timeline />
      <Contact />
      
      {/* Footer */}
      <footer className="py-10 border-t border-[#F0E3D6] text-center relative z-10 bg-[#FFFFFF]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <a href="#" className="text-xl font-black tracking-tight text-[#202124]">
            ADITYA<span className="text-[#F97316]">.</span>
          </a>
          <p className="text-[#6B7280] text-xs">
            © {new Date().getFullYear()} Aditya Yadav. All rights reserved.
          </p>
        </div>
      </footer>

      <CommandPalette />
    </main>
  );
}

