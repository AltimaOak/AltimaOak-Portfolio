"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Command, Sun, Moon, Download } from "lucide-react";
import { useTheme } from "next-themes";
import profileData from "@/data/profile.json";

const navLinks = [
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Experience", href: "#experience" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!mounted) return null;

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-[#FFF9F4]/90 backdrop-blur-md border-b border-[#F0E3D6] shadow-xs py-3.5" : "bg-transparent py-5"}`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-12 flex items-center justify-between">
        <a href="#" className="text-2xl font-black tracking-tight text-[#202124] transition-colors hover:text-primary">
          ADITYA<span className="text-primary">.</span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              className="text-sm font-semibold text-[#6B7280] hover:text-[#202124] transition-all py-1"
            >
              {link.name}
            </a>
          ))}

          <div className="flex items-center gap-3 ml-2">
            <a 
              href="/resume.pdf" 
              download="Aditya_Yadav_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Download className="w-4 h-4" /> Resume
            </a>

            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2.5 rounded-xl bg-card border border-[#F0E3D6] text-[#202124] hover:bg-[#FFF0E4] transition-all shadow-xs flex items-center justify-center"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun className="w-4.5 h-4.5 text-amber-500" /> : <Sun className="w-4.5 h-4.5 text-amber-500" />}
            </button>
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2.5 rounded-xl bg-card border border-[#F0E3D6] text-[#202124]"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-amber-500" /> : <Sun className="w-4 h-4 text-amber-500" />}
          </button>
          <button className="text-[#202124] p-2" onClick={() => setMobileMenu(!mobileMenu)}>
            {mobileMenu ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 right-0 w-full sm:w-[360px] z-[100] bg-background/95 backdrop-blur-xl border-l border-white/5 md:hidden flex flex-col p-8 pt-24 shadow-2xl"
          >
            {/* Close button inside full screen */}
            <button 
              className="absolute top-8 right-8 text-foreground p-2 bg-foreground/5 rounded-full hover:bg-foreground/10 transition-colors"
              onClick={() => setMobileMenu(false)}
            >
              <X size={24} />
            </button>

            <div className="flex flex-col gap-6 sm:gap-8 items-start">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-2">Navigation</span>
              {navLinks.map((link, i) => (
                <motion.a 
                  key={link.name} 
                  href={link.href} 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  onClick={() => setMobileMenu(false)}
                  className="text-4xl sm:text-5xl font-extrabold text-foreground hover:text-primary transition-colors tracking-tighter"
                >
                  {link.name}.
                </motion.a>
              ))}
            </div>

            <div className="mt-auto pt-8 border-t border-border flex flex-col gap-6">
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest opacity-50">
                © {new Date().getFullYear()} Aditya Yadav. Portfolio.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
