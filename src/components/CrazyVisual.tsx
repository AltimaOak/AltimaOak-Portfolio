"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo, useState } from "react";
import * as THREE from "three";
import { MeshDistortMaterial, Float, MeshWobbleMaterial, TorusKnot, Stars, Sparkles } from "@react-three/drei";

function InteractiveCrystal() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHover] = useState(false);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    meshRef.current.rotation.x = time * 0.5;
    meshRef.current.rotation.y = time * 0.3;
    
    // Pulse scale based on time
    const s = 1 + Math.sin(time * 2) * 0.1;
    meshRef.current.scale.set(s, s, s);
  });

  return (
    <Float speed={hovered ? 10 : 3} rotationIntensity={2} floatIntensity={hovered ? 5 : 2}>
      <mesh 
        ref={meshRef}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        <torusKnotGeometry args={[1, 0.4, 128, 32]} />
        <MeshDistortMaterial
          color={hovered ? "#ffffff" : "#facc15"}
          speed={hovered ? 10 : 4}
          distort={hovered ? 0.8 : 0.4}
          radius={1}
          metalness={1}
          roughness={0}
          emissive="#facc15"
          emissiveIntensity={hovered ? 2 : 0.5}
        />
      </mesh>
    </Float>
  );
}

function ParticleSwarm({ count = 500 }) {
  const points = useRef<THREE.Points>(null!);
  const { mouse, viewport } = useThree();
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * Math.PI * 2;
      const u = Math.random() * Math.PI * 2;
      const r = 2 + Math.random() * 2;
      temp.push(
        r * Math.sin(t) * Math.cos(u),
        r * Math.sin(t) * Math.sin(u),
        r * Math.cos(t)
      );
    }
    return new Float32Array(temp);
  }, [count]);

  const dummy = new THREE.Vector3();
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Target mouse position in 3D
    const targetX = (mouse.x * viewport.width) / 2;
    const targetY = (mouse.y * viewport.height) / 2;
    
    const positions = points.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Add some noise and mouse attraction
      positions[i3] += Math.sin(time + i) * 0.01 + (targetX - positions[i3]) * 0.02;
      positions[i3 + 1] += Math.cos(time + i) * 0.01 + (targetY - positions[i3 + 1]) * 0.02;
      positions[i3 + 2] += Math.sin(time * 0.5 + i) * 0.01;
    }
    
    points.current.geometry.attributes.position.needsUpdate = true;
    points.current.rotation.z += 0.001;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#facc15"
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

function EnergyRings() {
  const group = useRef<THREE.Group>(null!);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    group.current.children.forEach((child, i) => {
      child.rotation.x = time * (i + 1) * 0.2;
      child.rotation.y = time * (i + 1) * 0.1;
    });
  });

  return (
    <group ref={group}>
      {[2, 2.5, 3].map((r, i) => (
        <mesh key={i}>
          <torusGeometry args={[r, 0.01, 16, 100]} />
          <meshBasicMaterial color="#facc15" transparent opacity={0.2} />
        </mesh>
      ))}
    </group>
  );
}

export default function CrazyVisual() {
  return (
    <div className="w-full h-full cursor-pointer">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#facc15" />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} />
        
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <Sparkles count={100} scale={5} size={2} speed={0.4} color="#facc15" />
        
        <InteractiveCrystal />
        <ParticleSwarm count={800} />
        <EnergyRings />
        
      </Canvas>
    </div>
  );
}
