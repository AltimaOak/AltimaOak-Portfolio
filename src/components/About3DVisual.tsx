"use client";

import React, { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "next-themes";

function CyberNetwork() {
  const groupRef = useRef<THREE.Group>(null!);
  const linesRef = useRef<THREE.LineSegments>(null!);
  const [hovered, setHovered] = useState(false);

  const nodeCount = 18;
  const connectionThreshold = 1.6;

  // Initialize static/random offset speeds for each node to drift
  const nodeSeeds = useMemo(() => {
    const seeds = [];
    for (let i = 0; i < nodeCount; i++) {
      // Coordinate, offset, and phase speed
      seeds.push({
        xOffset: THREE.MathUtils.randFloatSpread(2.2),
        yOffset: THREE.MathUtils.randFloatSpread(2.2),
        zOffset: THREE.MathUtils.randFloatSpread(2.2),
        speedX: 0.15 + Math.random() * 0.25,
        speedY: 0.15 + Math.random() * 0.25,
        speedZ: 0.15 + Math.random() * 0.25,
        phase: Math.random() * Math.PI,
      });
    }
    return seeds;
  }, []);

  // Pre-allocate buffer for maximum possible lines to prevent GC overhead
  const maxLinePoints = (nodeCount * (nodeCount - 1)) / 2 * 2 * 3;
  const linePositions = useMemo(() => new Float32Array(maxLinePoints), [maxLinePoints]);

  // Keep track of current node coordinates to render node spheres
  const nodePositions = useMemo(() => {
    return Array.from({ length: nodeCount }, () => new THREE.Vector3());
  }, [nodeCount]);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const groupSpeed = hovered ? 0.35 : 0.08;

    // Slow global group orbit
    groupRef.current.rotation.y = time * groupSpeed;
    groupRef.current.rotation.x = time * (groupSpeed * 0.5);

    // 1. Calculate active coordinates of each drifting node
    nodeSeeds.forEach((seed, i) => {
      // Subtle organic float
      const dx = Math.sin(time * seed.speedX + seed.phase) * 0.35;
      const dy = Math.cos(time * seed.speedY + seed.phase) * 0.35;
      const dz = Math.sin(time * seed.speedZ + seed.phase * 2) * 0.35;

      nodePositions[i].set(
        seed.xOffset + dx,
        seed.yOffset + dy,
        seed.zOffset + dz
      );
    });

    // 2. Compute connection vertices
    let lineIdx = 0;
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dist = nodePositions[i].distanceTo(nodePositions[j]);

        // If nodes are within range, connect them with a vector line segment
        if (dist < connectionThreshold) {
          // Point A
          linePositions[lineIdx++] = nodePositions[i].x;
          linePositions[lineIdx++] = nodePositions[i].y;
          linePositions[lineIdx++] = nodePositions[i].z;

          // Point B
          linePositions[lineIdx++] = nodePositions[j].x;
          linePositions[lineIdx++] = nodePositions[j].y;
          linePositions[lineIdx++] = nodePositions[j].z;
        }
      }
    }

    // Set remaining elements to zero so they don't render
    while (lineIdx < maxLinePoints) {
      linePositions[lineIdx++] = 0;
    }

    // Trigger WebGL update
    linesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group 
      ref={groupRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* 1. Glowing Node Spheres */}
      {nodePositions.map((pos, idx) => (
        <group key={idx} position={pos}>
          <mesh>
            <sphereGeometry args={[0.07, 8, 8]} />
            <meshBasicMaterial 
              color={hovered ? "#facc15" : "#00f2ff"} 
              transparent 
              opacity={0.8}
            />
          </mesh>
          <mesh scale={1.8}>
            <sphereGeometry args={[0.07, 8, 8]} />
            <meshBasicMaterial 
              color={hovered ? "#facc15" : "#00f2ff"} 
              transparent 
              opacity={0.2}
            />
          </mesh>
        </group>
      ))}

      {/* 2. Intricate Constellation Connecting Lines */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial 
          color={hovered ? "#facc15" : "#00f2ff"} 
          transparent 
          opacity={hovered ? 0.35 : 0.16} 
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* 3. Orbiting Data Outer Ring */}
      <mesh rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[2.5, 0.015, 6, 80]} />
        <meshBasicMaterial color="#00f2ff" transparent opacity={0.15} wireframe />
      </mesh>
    </group>
  );
}

export default function About3DVisual() {
  const { theme } = useTheme();
  const isDark = theme !== "light";

  return (
    <div className="w-full h-full min-h-[360px] relative select-none">
      
      {/* Cybernetic Neural Constellation Net */}
      <Canvas camera={{ position: [0, 0, 4.5], fov: 60 }}>
        <ambientLight intensity={isDark ? 0.3 : 0.8} />
        
        {/* Soft neon golden-blue split lighting */}
        <pointLight position={[5, 5, 5]} intensity={1.2} color="#00f2ff" />
        <pointLight position={[-5, -5, 5]} intensity={0.8} color="#facc15" />
        
        {/* Intricate digital floating particles */}
        <Sparkles count={40} scale={4} size={2} speed={0.4} color="#00f2ff" />
        <Sparkles count={20} scale={4} size={1.5} speed={0.3} color="#facc15" />
        
        <CyberNetwork />
        
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.3} />
      </Canvas>

      {/* Futuristic Telemetry HUD overlays */}
      <div className="absolute top-4 left-4 bg-[#0a0e17]/85 border border-white/5 p-3 font-mono text-[9px] uppercase tracking-widest text-muted-foreground flex flex-col gap-1 z-10 pointer-events-none rounded-none shadow-md">
        <span className="text-primary font-bold">SYSTEM // NEURAL_NET</span>
        <span>LAT: 19.2183° N</span>
        <span>LNG: 72.9781° E</span>
        <span>LOC: THANE, INDIA</span>
      </div>

      <div className="absolute bottom-4 right-4 bg-[#0a0e17]/85 border border-white/5 p-3 font-mono text-[9px] uppercase tracking-widest text-muted-foreground flex flex-col gap-1 text-right z-10 pointer-events-none rounded-none shadow-md">
        <span className="text-cyan-400 font-bold">ACTV_NODES // 18</span>
        <span>B.TECH // CE // LTCOE</span>
        <span>INDEX: ef1e1922-db88</span>
      </div>
    </div>
  );
}
