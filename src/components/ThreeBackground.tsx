"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { Float, Stars, Sphere, MeshDistortMaterial } from "@react-three/drei";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

function FloatingShape({ position, color, size }: { position: [number, number, number], color: string, size: number }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const timeRef = useRef(0);
  
  useFrame((state, delta) => {
    timeRef.current += delta;
    const time = timeRef.current;
    meshRef.current.rotation.x = Math.sin(time / 4);
    meshRef.current.rotation.y = Math.cos(time / 2);
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[size, 32, 32]} />
        <MeshDistortMaterial
          color={color}
          speed={3}
          distort={0.4}
          radius={1}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
    </Float>
  );
}

export default function ThreeBackground() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <div className="absolute inset-0 -z-10 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={isDark ? 0.5 : 0.8} />
        <pointLight position={[10, 10, 10]} intensity={isDark ? 1 : 0.5} />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} />
        
        {isDark && (
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        )}
        
        <FloatingShape position={[2, 1, 0]} color={isDark ? "#00f2ff" : "#0066cc"} size={0.6} />
        <FloatingShape position={[-2, -1, -1]} color={isDark ? "#bc13fe" : "#9900cc"} size={0.4} />
        <FloatingShape position={[0, -2, 1]} color={isDark ? "#444" : "#ccc"} size={0.3} />
        
        {/* Particle field */}
        <Particles count={200} color={isDark ? "#ffffff" : "#000000"} />
      </Canvas>
    </div>
  );
}

function Particles({ count, color }: { count: number, color: string }) {
  const mesh = useRef<THREE.Points>(null!);
  const timeRef = useRef(0);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = THREE.MathUtils.randFloatSpread(15);
      const y = THREE.MathUtils.randFloatSpread(15);
      const z = THREE.MathUtils.randFloatSpread(15);
      temp.push(x, y, z);
    }
    return new Float32Array(temp);
  }, [count]);

  useFrame((state, delta) => {
    timeRef.current += delta;
    const time = timeRef.current;
    mesh.current.rotation.y = time * 0.05;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.02} color={color} transparent opacity={0.3} />
    </points>
  );
}
