"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Command, Sun, Moon } from "lucide-react";
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
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-background/80 backdrop-blur-md border-b border-border shadow-sm py-4" : "py-6"}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <a href="#" className="text-xl md:text-2xl font-bold tracking-tight text-foreground transition-colors hover:text-primary">
          ADITYA<span className="text-primary">.</span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground hover:underline underline-offset-4 decoration-primary/50 transition-all py-1"
            >
              {link.name}
            </a>
          ))}
          <div className="h-4 w-[1px] bg-foreground/10 mx-2" />
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-xs font-bold text-muted-foreground bg-foreground/5 px-3 py-1.5 rounded-lg border border-foreground/5"
          >
             <Command className="w-3 h-3" /> K
          </motion.button>
          <button 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full hover:bg-foreground/5 transition-colors text-muted-foreground hover:text-foreground"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-foreground" onClick={() => setMobileMenu(!mobileMenu)}>
          {mobileMenu ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[100] bg-background md:hidden flex flex-col p-8 pt-24"
          >
            {/* Close button inside full screen */}
            <button 
              className="absolute top-8 right-8 text-foreground p-2 bg-foreground/5 rounded-full"
              onClick={() => setMobileMenu(false)}
            >
              <X size={28} />
            </button>

            <div className="flex flex-col gap-8 items-start">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-2">Navigation</span>
              {navLinks.map((link, i) => (
                <motion.a 
                  key={link.name} 
                  href={link.href} 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  onClick={() => setMobileMenu(false)}
                  className="text-5xl font-extrabold text-foreground hover:text-primary transition-colors tracking-tighter"
                >
                  {link.name}.
                </motion.a>
              ))}
            </div>

            <div className="mt-auto pt-8 border-t border-border flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Theme Mode</span>
                <button 
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="flex items-center gap-3 px-4 py-2 bg-foreground/5 rounded-none font-bold text-sm"
                >
                  {theme === "dark" ? (
                    <><Sun className="w-4 h-4" /> Light</>
                  ) : (
                    <><Moon className="w-4 h-4" /> Dark</>
                  )}
                </button>
              </div>
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
