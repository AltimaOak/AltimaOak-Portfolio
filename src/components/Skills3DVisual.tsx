"use client";

import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, TrackballControls } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "next-themes";

// Flattened technical tags
const SKILL_TAGS = [
  "C", "C++", "Java", "Python", "JavaScript", "TypeScript",
  "React", "Next.js", "HTML", "CSS", "Spring Boot", "Flask",
  "FastAPI", "OpenCV", "NLP", "Firebase", "MySQL", "PostgreSQL",
  "Git", "Postman", "VS Code", "Vercel"
];

function SkillBadge({ word, position }: { word: string; position: THREE.Vector3 }) {
  const [hovered, setHovered] = useState(false);
  const { theme } = useTheme();
  const isDark = theme !== "light";

  return (
    <Html 
      position={position} 
      center 
      distanceFactor={6.2} // Scales font sizes naturally with 3D camera depth
    >
      <div 
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        className={`px-4 py-2 rounded-full border text-[10px] md:text-[11px] font-bold uppercase tracking-wider whitespace-nowrap shadow-xl backdrop-blur-md select-none transition-all duration-300 transform cursor-pointer ${
          hovered 
            ? "bg-primary text-primary-foreground border-primary scale-110 shadow-primary/20" 
            : isDark 
              ? "bg-[#1e293b]/70 border-white/5 text-muted-foreground hover:text-foreground" 
              : "bg-white/80 border-black/5 text-muted-foreground hover:text-foreground"
        }`}
      >
        {word}
      </div>
    </Html>
  );
}

function SkillSphere() {
  const groupRef = useRef<THREE.Group>(null!);

  // Distribute tags symmetrically over a sphere using Fibonacci spiral
  const tagsWithPositions = useMemo(() => {
    const list: { word: string; pos: THREE.Vector3 }[] = [];
    const count = SKILL_TAGS.length;
    const radius = 2.5;

    for (let i = 0; i < count; i++) {
      const k = i + 0.5;
      const phi = Math.acos(1 - (2 * k) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * k;

      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);

      list.push({
        word: SKILL_TAGS[i],
        pos: new THREE.Vector3(x, y, z),
      });
    }
    return list;
  }, []);

  // Elegant automatic sphere spin
  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime();
      groupRef.current.rotation.y = time * 0.06;
      groupRef.current.rotation.x = time * 0.03;
    }
  });

  return (
    <group ref={groupRef}>
      {tagsWithPositions.map((item, idx) => (
        <SkillBadge key={idx} word={item.word} position={item.pos} />
      ))}
    </group>
  );
}

export default function Skills3DVisual() {
  const { theme } = useTheme();
  const isDark = theme !== "light";

  return (
    <div className="w-full h-full min-h-[400px] relative select-none">
      <Canvas 
        camera={{ position: [0, 0, 5.5], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={isDark ? 0.35 : 0.8} />
        
        {/* Colorful spotlights matching our premium golden theme */}
        <pointLight position={[5, 5, 5]} intensity={1.2} color="#facc15" />
        <pointLight position={[-5, -5, 5]} intensity={0.8} color="#7c3aed" />

        <SkillSphere />
        
        {/* Draggable inert controls for user interactions */}
        <TrackballControls 
          noZoom={true} 
          noPan={true}
          rotateSpeed={1.8}
          dynamicDampingFactor={0.06}
        />
      </Canvas>

      {/* Modern instructions overlay */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-card/75 border border-white/5 px-4 py-2 rounded-full backdrop-blur-md z-10 pointer-events-none text-center">
        <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-bold font-mono">
          Drag to spin technical cloud • Hover to inspect
        </p>
      </div>
    </div>
  );
}
