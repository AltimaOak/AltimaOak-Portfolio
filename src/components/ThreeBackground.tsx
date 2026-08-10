"use client";

import React, { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Stars } from "@react-three/drei";
import { useTheme } from "next-themes";

// ---------------------------------------------------------
// Types & Config
// ---------------------------------------------------------
interface ThreeBackgroundProps {
  activeSection: string;
}

// Subtle Camera offsets mapping
const CAMERA_CONFIGS: Record<string, { pos: [number, number, number]; lookAt: [number, number, number] }> = {
  hero: { pos: [0, 0, 7.5], lookAt: [0, 0, 0] },
  about: { pos: [-1.5, 0, 7.0], lookAt: [0.5, 0, 0] },
  skills: { pos: [0, 0.8, 6.8], lookAt: [0, 0, 0] },
  projects: { pos: [1.8, -0.2, 7.5], lookAt: [-0.4, 0, 0] },
  experience: { pos: [0, -2.5, 7.8], lookAt: [0, -2.5, 0] },
  contact: { pos: [0, 0, 6.5], lookAt: [0, 0, 0] },
};

// Cohesive Curated Theme Colors (Muted Amber & Golden Accents)
const AMBER_GOLD = "#d97706";
const MIDNIGHT_BLUE = "#0f172a";

const SECTION_COLORS: Record<string, string> = {
  hero: AMBER_GOLD,
  about: "#b45309",      // Soft Burnt Orange
  skills: "#7c3aed",     // Soft Violet
  projects: "#059669",   // Muted Emerald
  experience: "#be185d", // Muted Rose
  contact: AMBER_GOLD,
};

// ---------------------------------------------------------
// Smooth Camera Controller
// ---------------------------------------------------------
function SceneController({ activeSection }: { activeSection: string }) {
  const { camera } = useThree();
  const currentConfig = CAMERA_CONFIGS[activeSection] || CAMERA_CONFIGS.hero;
  
  const targetPos = useMemo(() => new THREE.Vector3(...currentConfig.pos), [currentConfig]);
  const targetLook = useMemo(() => new THREE.Vector3(...currentConfig.lookAt), [currentConfig]);
  const currentLook = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state) => {
    camera.position.lerp(targetPos, 0.025); // Butter-smooth camera transitions
    currentLook.current.lerp(targetLook, 0.025);
    camera.lookAt(currentLook.current);
  });

  return null;
}

// ---------------------------------------------------------
// Cosmic Dust (Highly Subtle, Drifting Particles)
// ---------------------------------------------------------
function CosmicDust({ activeSection }: { activeSection: string }) {
  const pointsRef = useRef<THREE.Points>(null!);
  const timeRef = useRef(0);
  const { theme } = useTheme();
  const isDark = theme !== "light";
  
  const particleCount = 280; // Reduced density for ultra-clean backgrounds

  // Coordinate math for subtle background structures
  const layouts = useMemo(() => {
    const heroCoords: number[] = [];
    const aboutCoords: number[] = [];
    const skillsCoords: number[] = [];
    const projectsCoords: number[] = [];
    const experienceCoords: number[] = [];
    const contactCoords: number[] = [];

    for (let i = 0; i < particleCount; i++) {
      // 1. HERO: Wide, sparse space box
      heroCoords.push(
        THREE.MathUtils.randFloatSpread(20),
        THREE.MathUtils.randFloatSpread(18),
        THREE.MathUtils.randFloatSpread(14)
      );

      // 2. ABOUT: Large, soft constellation sphere on the right
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 3.5 + Math.random() * 0.8;
      aboutCoords.push(
        2.5 + r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        -2.0 + r * Math.cos(phi)
      );

      // 3. SKILLS: Sparse orbital galaxy
      const angle = Math.random() * Math.PI * 2;
      const radius = 2.5 + Math.random() * 1.5;
      const ring = i % 3;
      if (ring === 0) {
        skillsCoords.push(radius * Math.cos(angle), radius * Math.sin(angle), THREE.MathUtils.randFloatSpread(1.0));
      } else if (ring === 1) {
        skillsCoords.push(THREE.MathUtils.randFloatSpread(1.0), radius * Math.cos(angle), radius * Math.sin(angle));
      } else {
        skillsCoords.push(radius * Math.cos(angle), THREE.MathUtils.randFloatSpread(1.0), radius * Math.sin(angle));
      }

      // 4. PROJECTS: Smooth background plane
      const px = ((i % 15) / 15) * 16 - 8;
      const py = (Math.floor(i / 15) / (particleCount / 15)) * 12 - 6;
      const pz = Math.sin(px * 0.8) * Math.cos(py * 0.8) * 0.4 - 3.0;
      projectsCoords.push(px - 1.0, py, pz);

      // 5. EXPERIENCE: Very slow helix winding
      const tY = (i / particleCount) * 18 - 11.5;
      const helixAngle = tY * 1.0;
      const helixRadius = 2.5;
      const offset = (i % 2 === 0) ? 0 : Math.PI;
      experienceCoords.push(
        helixRadius * Math.sin(helixAngle + offset),
        tY,
        helixRadius * Math.cos(helixAngle + offset)
      );

      // 6. CONTACT: Slow, elegant whirlpool
      const spiralT = (i / particleCount) * Math.PI * 12;
      const spiralR = 0.5 + (1.0 - i / particleCount) * 5.0;
      contactCoords.push(
        spiralR * Math.cos(spiralT),
        THREE.MathUtils.randFloatSpread(0.8),
        spiralR * Math.sin(spiralT)
      );
    }

    return {
      hero: new Float32Array(heroCoords),
      about: new Float32Array(aboutCoords),
      skills: new Float32Array(skillsCoords),
      projects: new Float32Array(projectsCoords),
      experience: new Float32Array(experienceCoords),
      contact: new Float32Array(contactCoords),
    };
  }, []);

  const currentPositions = useMemo(() => new Float32Array(particleCount * 3), []);
  
  useEffect(() => {
    const initial = layouts.hero;
    for (let i = 0; i < initial.length; i++) {
      currentPositions[i] = initial[i];
    }
  }, [layouts, currentPositions]);

  useFrame((state, delta) => {
    timeRef.current += delta;
    const time = timeRef.current;

    const targetLayout = layouts[activeSection as keyof typeof layouts] || layouts.hero;
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;

    // Very gentle background velocities
    let morphSpeed = 0.02; // Very slow and natural morphs
    if (activeSection === "contact") morphSpeed = 0.035;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      // Smooth path morph
      positions[i3] = THREE.MathUtils.lerp(positions[i3], targetLayout[i3], morphSpeed);
      positions[i3 + 1] = THREE.MathUtils.lerp(positions[i3 + 1], targetLayout[i3 + 1], morphSpeed);
      positions[i3 + 2] = THREE.MathUtils.lerp(positions[i3 + 2], targetLayout[i3 + 2], morphSpeed);

      // Micro drift
      positions[i3] += Math.sin(time * 0.4 + i) * 0.0006;
      positions[i3 + 1] += Math.cos(time * 0.3 + i) * 0.0006;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.rotation.y = time * 0.012; // Slow elegant cosmic rotation
  });

  const pColor = SECTION_COLORS[activeSection] || AMBER_GOLD;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[currentPositions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04} // Extremely small and crisp star points
        color={pColor}
        transparent
        opacity={activeSection === "hero" ? 0 : (isDark ? 0.35 : 0.15)} // Hide completely in Hero section
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

// ---------------------------------------------------------
// Main Canvas Component
// ---------------------------------------------------------
export default function ThreeBackground({ activeSection }: ThreeBackgroundProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Unmount WebGL Canvas completely during hero section to prevent concurrent rendering lag
  if (activeSection === "hero") {
    return <div className="fixed inset-0 -z-20 pointer-events-none w-screen h-screen bg-background" />;
  }

  const isDark = theme !== "light";
  const lightColor = SECTION_COLORS[activeSection] || AMBER_GOLD;

  return (
    <div className="fixed inset-0 -z-20 pointer-events-none w-screen h-screen bg-background">
      <Canvas 
        camera={{ position: [0, 0, 7.5], fov: 65 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      >
        {/* Soft, dark ambient base */}
        <ambientLight intensity={activeSection === "hero" ? (isDark ? 0.1 : 0.9) : (isDark ? 0.15 : 0.65)} />
        
        {/* Highly focused, low-intensity spotlights for ambient neon accenting */}
        {activeSection !== "hero" && (
          <>
            <pointLight position={[5, 5, 5]} intensity={isDark ? 0.6 : 0.4} color={lightColor} />
            <pointLight position={[-5, -5, 2]} intensity={isDark ? 0.4 : 0.2} color={MIDNIGHT_BLUE} />
          </>
        )}
        
        {/* Gentle stardust background - hidden in Hero section */}
        {isDark && activeSection !== "hero" && (
          <Stars 
            radius={110} 
            depth={30} 
            count={1200} // Sparse, premium stars
            factor={3.5} 
            saturation={0.1} 
            fade 
            speed={0.3} 
          />
        )}
        
        <SceneController activeSection={activeSection} />
        <CosmicDust activeSection={activeSection} />
      </Canvas>
    </div>
  );
}
