"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMouseMove } from "@/lib/hooks";

const STORAGE_KEY = "portfolio_intro_shown_v2";
type Phase = "walk-in" | "text-reveal" | "fade-out" | "done";

const NAME_CHARS = "Aditya Yadav".split("");
const ROLE = "Backend Developer  ·  Java  ·  AI Enthusiast";

export default function IntroAnimation() {
  const { x, y } = useMouseMove();
  const [phase, setPhase] = useState<Phase>("walk-in");
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
    timerRef.current = setTimeout(() => {
      setPhase("text-reveal");
      timerRef.current = setTimeout(() => {
        setPhase("fade-out");
        timerRef.current = setTimeout(() => {
          markShown(); setPhase("done");
        }, 1200);
      }, 1500); // reduced text duration
    }, 2000); // character walk duration
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [visible]);

  const markShown = () => {
    try { localStorage.setItem(STORAGE_KEY, "1"); } catch { /* noop */ }
  };

  const dismiss = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    markShown(); setPhase("done");
  }, []);

  if (phase === "done") return null;

  const charX =
    phase === "walk-in"  ? { initial: "-40vw", animate: "-5vw" } : // keep slightly off center
    phase === "fade-out" ? { initial: "-5vw",   animate: "-5vw" } :
                           { initial: "-5vw",   animate: "-5vw"  };

  const charDuration = phase === "walk-in" ? 2.0 : 0;

  return (
    <motion.div
      key="intro-overlay"
      initial={{ opacity: 1, filter: "blur(0px)" }}
      animate={{ 
        opacity: phase === "fade-out" ? 0 : 1,
        filter: phase === "fade-out" ? "blur(10px)" : "blur(0px)" 
      }}
      transition={{ duration: phase === "fade-out" ? 1.2 : 0, ease: "easeInOut" }}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        overflow: "hidden",
        background: "var(--background)",
        fontFamily: "var(--font-outfit, sans-serif)",
      }}
    >
      {/* Subtle Grid overlay */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
        backgroundImage:
          "linear-gradient(var(--border) 1px, transparent 1px)," +
          "linear-gradient(90deg, var(--border) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
        opacity: 0.1,
        maskImage: "radial-gradient(ellipse 90% 80% at 50% 50%, black 30%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 90% 80% at 50% 50%, black 30%, transparent 100%)",
      }} />

      {/* 3D DOM Elements (Background) */}
      <motion.div 
        className="absolute inset-0 overflow-hidden pointer-events-none" 
        style={{ 
          perspective: "1200px",
          rotateX: -y / 100,
          rotateY: x / 100,
        }}
      >
        <FloatingCubes />
      </motion.div>

      {/* Stage line */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
        style={{
          position: "absolute", bottom: "22%", left: "10%", right: "10%", height: 1,
          background: "var(--border)",
          opacity: 0.5,
          transformOrigin: "center", zIndex: 2,
        }}
      />

      {/* Character + text */}
      <div style={{
        position: "relative", zIndex: 5,
        display: "flex", flexDirection: "column",
        alignItems: "center", marginBottom: "9%",
      }}>
        <motion.div
          key={phase}
          initial={{ x: charX.initial }}
          animate={{ x: charX.animate }}
          transition={{
            duration: charDuration,
            ease: phase === "walk-in" ? [0.4, 0.0, 0.2, 1] : "easeInOut",
          }}
          style={{ position: "relative", width: 150 }}
        >
          <WalkingHuman walking={phase === "walk-in"} />

          {/* Ground glow */}
          <motion.div
            animate={{ scaleX: [0.95, 0.72, 0.95], opacity: [0.2, 0.1, 0.2] }}
            transition={{ duration: 0.54, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute", bottom: -4, left: "50%",
              transform: "translateX(-50%)",
              width: 80, height: 12, borderRadius: "50%",
              background: "radial-gradient(ellipse, rgba(0,0,0,0.5) 0%, transparent 70%)",
              filter: "blur(4px)",
            }}
          />
        </motion.div>

        {/* Text reveal */}
        <AnimatePresence>
          {phase === "text-reveal" && (
            <motion.div
              key="text"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              style={{ textAlign: "center", marginTop: 20 }}
            >
              <div style={{ display: "flex", justifyContent: "center", gap: 1, flexWrap: "wrap" }}>
                {NAME_CHARS.map((ch, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.5, delay: i * 0.055, ease: "easeOut" }}
                    style={{
                      fontSize: "clamp(2rem, 5.5vw, 4rem)",
                      fontWeight: 700,
                      letterSpacing: ch === " " ? "0.25em" : "-0.01em",
                      lineHeight: 1,
                      color: "var(--foreground)",
                      display: "inline-block",
                    }}
                  >
                    {ch === " " ? "\u00a0" : ch}
                  </motion.span>
                ))}
              </div>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.75, ease: "easeOut" }}
                style={{
                  marginTop: 10, fontSize: "clamp(0.8rem, 1.2vw, 1rem)",
                  color: "var(--muted-foreground)",
                  fontWeight: 400,
                }}
              >
                {ROLE}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Skip button */}
      <motion.button
        onClick={dismiss}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 0.65, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        whileHover={{ opacity: 1, scale: 1.06 }}
        whileTap={{ scale: 0.93 }}
        style={{
          position: "absolute", top: 40, right: 32, zIndex: 20,
          background: "transparent",
          border: "1px solid var(--border)",
          color: "var(--muted-foreground)",
          padding: "6px 16px", borderRadius: 999,
          fontSize: "0.85rem",
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        Skip
      </motion.button>

      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 0.28 }}
        transition={{ delay: 1 }}
        style={{
          position: "absolute", bottom: 60, zIndex: 20,
          fontSize: "0.58rem", letterSpacing: "0.28em",
          textTransform: "uppercase", color: "rgba(255,255,255,0.5)",
        }}
      >
        Portfolio · 2025
      </motion.p>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WALKING HUMAN — correct pivot pattern:
//   <g transform="translate(jointX, jointY)">   ← positions the joint
//     <motion.g style={{ transformOrigin:"0px 0px" }}>  ← rotates around it
//
// Each limb is defined in local coords with the pivot point at (0,0).
// ─────────────────────────────────────────────────────────────────────────────
function WalkingHuman({ walking }: { walking: boolean }) {
  const gait  = { duration: 0.7, repeat: Infinity, ease: "easeInOut" as const };
  const still = { duration: 0.5 };

  // Opposite-phase helpers: fwd=true → right arm / right leg lead
  const leg   = (fwd: boolean) => walking ? { rotate: fwd ? [-36,  36, -36] : [ 36, -36,  36] } : { rotate: 0 };
  const knee  = (fwd: boolean) => walking ? { rotate: fwd ? [  6,  32,   6] : [ 32,   6,  32] } : { rotate: 0 };
  const arm   = (fwd: boolean) => walking ? { rotate: fwd ? [-36,  36, -36] : [ 36, -36,  36] } : { rotate: 0 };
  const elbow = (fwd: boolean) => walking ? { rotate: fwd ? [ 10, -10,  10] : [-10,  10, -10] } : { rotate: 0 };

  const skin = "#ff8ca1";
  const clothes = "#d9f08b";
  const outline = "#111";
  const strk = 2.5;

  return (
    <svg viewBox="0 0 120 250" width={150} style={{ overflow: "visible", display: "block" }}>
      {/* Ground shadow */}
      <ellipse cx="60" cy="244" rx="30" ry="4" fill="rgba(0,0,0,0.15)" />

      {/* ─── LEFT LEG  (back / trailing) ─── */}
      <g transform="translate(46,138)">
        <motion.g animate={leg(false)} transition={walking ? gait : still} style={{ transformOrigin: "0px 0px" }}>
          {/* Upper leg (skin) */}
          <rect x="-8" y="0" width="16" height="50" rx="4" fill={skin} stroke={outline} strokeWidth={strk} />
          {/* Shorts (overlap) */}
          <rect x="-9" y="-5" width="18" height="35" rx="4" fill={clothes} stroke={outline} strokeWidth={strk} />
          
          <g transform="translate(0,50)">
            <motion.g animate={knee(false)} transition={walking ? { ...gait, delay: 0.06 } : still} style={{ transformOrigin: "0px 0px" }}>
              <rect x="-6" y="0" width="12" height="44" rx="6" fill={skin} stroke={outline} strokeWidth={strk} />
              {/* Sock */}
              <rect x="-7" y="20" width="14" height="24" rx="2" fill="#fff" stroke={outline} strokeWidth={strk} />
              {/* Shoe */}
              <path d="M-10 38 Q 0 35 15 38 L 15 48 L -10 48 Z" fill="#e5e7eb" stroke={outline} strokeWidth={strk} strokeLinejoin="round" />
              <rect x="-10" y="46" width="25" height="5" rx="2" fill="#b45309" stroke={outline} strokeWidth={strk} />
            </motion.g>
          </g>
        </motion.g>
      </g>

      {/* ─── RIGHT LEG (front / leading) ─── */}
      <g transform="translate(74,138)">
        <motion.g animate={leg(true)} transition={walking ? gait : still} style={{ transformOrigin: "0px 0px" }}>
          <rect x="-8" y="0" width="16" height="50" rx="4" fill={skin} stroke={outline} strokeWidth={strk} />
          <rect x="-9" y="-5" width="18" height="35" rx="4" fill={clothes} stroke={outline} strokeWidth={strk} />
          <g transform="translate(0,50)">
            <motion.g animate={knee(true)} transition={walking ? { ...gait, delay: 0.06 } : still} style={{ transformOrigin: "0px 0px" }}>
              <rect x="-6" y="0" width="12" height="44" rx="6" fill={skin} stroke={outline} strokeWidth={strk} />
              <rect x="-7" y="20" width="14" height="24" rx="2" fill="#fff" stroke={outline} strokeWidth={strk} />
              <path d="M-10 38 Q 0 35 15 38 L 15 48 L -10 48 Z" fill="#e5e7eb" stroke={outline} strokeWidth={strk} strokeLinejoin="round" />
              <rect x="-10" y="46" width="25" height="5" rx="2" fill="#b45309" stroke={outline} strokeWidth={strk} />
            </motion.g>
          </g>
        </motion.g>
      </g>

      {/* ─── TORSO + UPPER BODY ─── */}
      <motion.g animate={walking ? { y: [0, -3, 0, -3, 0] } : { y: 0 }} transition={walking ? { ...gait, duration: gait.duration * 0.5 } : still}>
        
        {/* ─── LEFT ARM (back) ─── */}
        <g transform="translate(38,88)">
          <motion.g animate={arm(false)} transition={walking ? gait : still} style={{ transformOrigin: "0px 0px" }}>
            <rect x="-7" y="0" width="14" height="42" rx="6" fill={clothes} stroke={outline} strokeWidth={strk} />
            <g transform="translate(0,42)">
              <motion.g animate={elbow(false)} transition={walking ? { ...gait, delay: 0.06 } : still} style={{ transformOrigin: "0px 0px" }}>
                <rect x="-6" y="0" width="12" height="30" rx="5" fill={clothes} stroke={outline} strokeWidth={strk} />
                <circle cx="0" cy="33" r="9" fill={skin} stroke={outline} strokeWidth={strk} />
                <path d="M-4 34 Q0 30 4 34" fill="none" stroke={outline} strokeWidth={strk} strokeLinecap="round" />
              </motion.g>
            </g>
          </motion.g>
        </g>

        {/* Neck */}
        <rect x="54" y="68" width="12" height="15" fill={skin} stroke={outline} strokeWidth={strk} />

        {/* Shirt */}
        <rect x="34" y="78" width="52" height="66" rx="16" fill={clothes} stroke={outline} strokeWidth={strk} />

        {/* ─── RIGHT ARM (front) ─── */}
        <g transform="translate(82,88)">
          <motion.g animate={arm(true)} transition={walking ? gait : still} style={{ transformOrigin: "0px 0px" }}>
            <rect x="-7" y="0" width="14" height="42" rx="6" fill={clothes} stroke={outline} strokeWidth={strk} />
            <g transform="translate(0,42)">
              <motion.g animate={elbow(true)} transition={walking ? { ...gait, delay: 0.06 } : still} style={{ transformOrigin: "0px 0px" }}>
                <rect x="-6" y="0" width="12" height="30" rx="5" fill={clothes} stroke={outline} strokeWidth={strk} />
                <circle cx="0" cy="33" r="9" fill={skin} stroke={outline} strokeWidth={strk} />
                <path d="M-4 34 Q0 30 4 34" fill="none" stroke={outline} strokeWidth={strk} strokeLinecap="round" />
              </motion.g>
            </g>
          </motion.g>
        </g>

        {/* ─── HEAD ─── */}
        <g transform="translate(0, -6)">
          {/* Ear (Back/Left side) */}
          <circle cx="38" cy="50" r="6" fill={skin} stroke={outline} strokeWidth={strk} />
          
          {/* Face */}
          <circle cx="60" cy="46" r="24" fill={skin} stroke={outline} strokeWidth={strk} />
          
          {/* Hair block under beanie (front/right side) */}
          <path d="M68 36 Q 84 42 76 50 Q 70 46 64 48 Q 50 40 38 42 L 36 36 Z" fill="#111" />
          
          {/* Beanie Top */}
          <path d="M38 38 C 38 12, 82 12, 82 38 Z" fill={clothes} stroke={outline} strokeWidth={strk} />
          {/* Beanie Rim */}
          <rect x="34" y="36" width="52" height="10" rx="3" fill={clothes} stroke={outline} strokeWidth={strk} />
          
          {/* Eyes (shifted right) */}
          <circle cx="64" cy="50" r="2.5" fill="#111" />
          <circle cx="76" cy="50" r="2.5" fill="#111" />
          
          {/* Smile (shifted right) */}
          <path d="M68 56 Q72 60 76 56" stroke="#111" strokeWidth={strk} fill="none" strokeLinecap="round" />
        </g>

      </motion.g>
    </svg>
  );
}

// ── 3D DOM Elements ─────────────────────────────────────────────────────────
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
          animate={{ opacity: 0.15, scale: 1 }}
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
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
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
                  border: "1px solid var(--primary)",
                  background: "var(--primary)",
                  opacity: 0.1,
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

// ── Ambient orb ──────────────────────────────────────────────────────────────
function Orb({ color, size, top, left, delay, dur }: {
  color: string; size: string; top: string; left: string; delay: number; dur: number;
}) {
  return (
    <motion.div
      animate={{ scale: [1, 1.18, 1], opacity: [0.8, 1, 0.8] }}
      transition={{ duration: dur, delay, repeat: Infinity, ease: "easeInOut" }}
      style={{
        position: "absolute", width: size, height: size, borderRadius: "50%",
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        top, left, transform: "translate(-50%,-50%)",
        pointerEvents: "none", zIndex: 0,
      }}
    />
  );
}

// ── Stable particles (no Math.random at render time) ─────────────────────────
const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  x: `${4 + ((i * 4.3) % 92)}%`,
  y: `${8 + ((i * 7.1) % 84)}%`,
  size: 1.2 + (i % 4) * 0.6,
  delay: (i * 0.37) % 3.5,
  dur: 3.5 + (i % 5) * 0.8,
  cyan: i % 3 !== 0,
}));

function ParticleField() {
  return (
    <>
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          animate={{ opacity: [0, 0.85, 0], y: [0, -28, -52], scale: [0.4, 1, 0.2] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeOut" }}
          style={{
            position: "absolute", left: p.x, top: p.y,
            width: p.size, height: p.size, borderRadius: "50%",
            background: p.cyan ? "#00f2ff" : "#bc13fe",
            boxShadow: p.cyan ? "0 0 5px #00f2ff" : "0 0 5px #bc13fe",
            pointerEvents: "none", zIndex: 0,
          }}
        />
      ))}
    </>
  );
}
