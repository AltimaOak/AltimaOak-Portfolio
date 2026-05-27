"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMouseMove } from "@/lib/hooks";

const STORAGE_KEY = "portfolio_intro_shown_v3";
type Phase = "text-reveal" | "fade-out" | "done";

const NAME_CHARS = "Aditya Yadav".split("");
const ROLE = "Backend Developer  ·  Java  ·  AI Enthusiast";

export default function IntroAnimation() {
  const { x, y } = useMouseMove();
  const [phase, setPhase] = useState<Phase>("text-reveal");
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const isDev = process.env.NODE_ENV !== "production";
    const forceShow =
      typeof window !== "undefined" && window.location.search.includes("intro");
    if (!isDev && !forceShow) {
      try {
        if (localStorage.getItem(STORAGE_KEY)) { setPhase("done"); return; }
      } catch { setPhase("done"); return; }
    }
    setVisible(true);
  }, []);

  useEffect(() => {
    if (!visible) return;

    // Immediately start text reveal and trigger fade-out after 2.8s
    setPhase("text-reveal");
    timerRef.current = setTimeout(() => {
      setPhase("fade-out");
      timerRef.current = setTimeout(() => {
        markShown(); 
        setPhase("done");
      }, 1000);
    }, 2800);

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [visible]);

  const markShown = () => {
    try { localStorage.setItem(STORAGE_KEY, "1"); } catch { /* noop */ }
  };

  const dismiss = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    markShown(); 
    setPhase("done");
  }, []);

  if (phase === "done") return null;

  return (
    <motion.div
      key="intro-overlay"
      initial={{ opacity: 1, filter: "blur(0px)" }}
      animate={{ 
        opacity: phase === "fade-out" ? 0 : 1,
        filter: phase === "fade-out" ? "blur(10px)" : "blur(0px)" 
      }}
      transition={{ duration: phase === "fade-out" ? 1.0 : 0, ease: "easeInOut" }}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        overflow: "hidden",
        background: "#060810", // Obsidian-black matching theme
        fontFamily: "var(--font-outfit, sans-serif)",
      }}
    >
      {/* Subtle digital grid lines overlay */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
        backgroundImage:
          "linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px)," +
          "linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)",
        backgroundSize: "56px 56px",
        opacity: 0.1,
        maskImage: "radial-gradient(ellipse 90% 80% at 50% 50%, black 30%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 90% 80% at 50% 50%, black 30%, transparent 100%)",
      }} />

      {/* Floating 3D Geometric Nodes in Background */}
      <motion.div 
        className="absolute inset-0 overflow-hidden pointer-events-none" 
        style={{ 
          perspective: "1200px",
          rotateX: -y / 120,
          rotateY: x / 120,
        }}
      >
        <FloatingCubes />
        <ParticleField />
      </motion.div>

      {/* Center Layout for Typography */}
      <div style={{
        position: "relative", zIndex: 5,
        display: "flex", flexDirection: "column",
        alignItems: "center",
      }}>
        {/* Name Letter by Letter Reveal */}
        <AnimatePresence>
          {phase === "text-reveal" && (
            <motion.div
              key="text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              style={{ textAlign: "center" }}
            >
              {/* Flex wrapper for letter rendering */}
              <div style={{ display: "flex", justifyContent: "center", gap: 1, flexWrap: "wrap" }}>
                {NAME_CHARS.map((ch, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 30, filter: "blur(12px)", scale: 0.85 }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 140,
                      damping: 14,
                      delay: i * 0.075 
                    }}
                    style={{
                      fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
                      fontWeight: 800,
                      letterSpacing: ch === " " ? "0.3em" : "-0.02em",
                      lineHeight: 1.1,
                      color: ch === " " ? "transparent" : "#facc15", // Glow Gold
                      textShadow: ch === " " ? "none" : "0 0 30px rgba(250, 204, 21, 0.25)",
                      display: "inline-block",
                    }}
                  >
                    {ch === " " ? "\u00a0" : ch}
                  </motion.span>
                ))}
              </div>

              {/* Staggered Role Subtitle Reveal */}
              <motion.p
                initial={{ opacity: 0, y: 15, filter: "blur(6px)" }}
                animate={{ opacity: 0.75, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.8, delay: NAME_CHARS.length * 0.075 + 0.1, ease: "easeOut" }}
                style={{
                  marginTop: 22, 
                  fontSize: "clamp(0.8rem, 1.4vw, 1.1rem)",
                  color: "var(--muted-foreground)",
                  fontWeight: 500,
                  letterSpacing: "0.1em",
                }}
              >
                {ROLE}
              </motion.p>

              {/* Elegant Loading bar indicator */}
              <div style={{ width: 180, height: 2, background: "rgba(255,255,255,0.05)", margin: "32px auto 0", overflow: "hidden", position: "relative" }}>
                <motion.div
                  initial={{ left: "-100%" }}
                  animate={{ left: "100%" }}
                  transition={{ duration: 2.2, ease: "easeInOut", repeat: Infinity }}
                  style={{
                    position: "absolute",
                    top: 0, bottom: 0, width: "50%",
                    background: "linear-gradient(90deg, transparent, #facc15, transparent)"
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Skip Button */}
      <motion.button
        onClick={dismiss}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 0.65, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        whileHover={{ opacity: 1, scale: 1.05, borderColor: "#facc15", color: "#facc15" }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: "absolute", top: 40, right: 32, zIndex: 20,
          background: "transparent",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          color: "var(--muted-foreground)",
          padding: "8px 20px", borderRadius: 999,
          fontSize: "0.8rem",
          fontWeight: 600,
          cursor: "pointer",
          fontFamily: "inherit",
          transition: "border-color 0.2s, color 0.2s",
        }}
      >
        Skip Intro
      </motion.button>

      <motion.p
        initial={{ opacity: 0 }} 
        animate={{ opacity: 0.3 }}
        transition={{ delay: 1 }}
        style={{
          position: "absolute", bottom: 40, zIndex: 20,
          fontSize: "0.6rem", letterSpacing: "0.3em",
          textTransform: "uppercase", color: "rgba(255,255,255,0.4)",
        }}
      >
        Aditya Yadav • Portfolio
      </motion.p>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3D FLOATING BACKDROP CUBES
// ─────────────────────────────────────────────────────────────────────────────
function FloatingCubes() {
  const cubes = [
    { size: 40, x: "15%", y: "20%", rotate: [0, 360], delay: 0 },
    { size: 60, x: "80%", y: "15%", rotate: [45, 405], delay: 1 },
    { size: 30, x: "10%", y: "75%", rotate: [90, 450], delay: 2 },
    { size: 50, x: "85%", y: "80%", rotate: [120, 480], delay: 0.5 },
    { size: 25, x: "50%", y: "10%", rotate: [200, 560], delay: 1.5 },
  ];

  return (
    <>
      {cubes.map((cube, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 1.5, delay: cube.delay }}
          style={{
            position: "absolute",
            left: cube.x,
            top: cube.y,
            width: cube.size,
            height: cube.size,
            transformStyle: "preserve-3d",
          }}
        >
          <motion.div
            animate={{ rotateX: cube.rotate, rotateY: cube.rotate }}
            transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
            style={{
              width: "100%",
              height: "100%",
              transformStyle: "preserve-3d",
            }}
          >
            {[
              "rotateY(0deg) translateZ(calc(var(--size)/2))",
              "rotateY(90deg) translateZ(calc(var(--size)/2))",
              "rotateY(180deg) translateZ(calc(var(--size)/2))",
              "rotateY(-90deg) translateZ(calc(var(--size)/2))",
              "rotateX(90deg) translateZ(calc(var(--size)/2))",
              "rotateX(-90deg) translateZ(calc(var(--size)/2))",
            ].map((transform, faceIdx) => (
              <div
                key={faceIdx}
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  border: "1px solid #facc15",
                  background: "rgba(250, 204, 21, 0.05)",
                  opacity: 0.25,
                  transform: transform.replace("var(--size)", `${cube.size}px`),
                  backfaceVisibility: "visible",
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      ))}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STABLE FLOATING DUST PARTICLES
// ─────────────────────────────────────────────────────────────────────────────
const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  x: `${4 + ((i * 4.3) % 92)}%`,
  y: `${8 + ((i * 7.1) % 84)}%`,
  size: 1.2 + (i % 4) * 0.6,
  delay: (i * 0.37) % 3.5,
  dur: 3.5 + (i % 5) * 0.8,
  gold: i % 2 === 0,
}));

function ParticleField() {
  return (
    <>
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          animate={{ opacity: [0, 0.75, 0], y: [0, -28, -52], scale: [0.4, 1, 0.2] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeOut" }}
          style={{
            position: "absolute", left: p.x, top: p.y,
            width: p.size, height: p.size, borderRadius: "50%",
            background: p.gold ? "#facc15" : "#7c3aed",
            boxShadow: p.gold ? "0 0 5px rgba(250, 204, 21, 0.5)" : "0 0 5px rgba(124, 58, 237, 0.5)",
            pointerEvents: "none", zIndex: 0,
          }}
        />
      ))}
    </>
  );
}
