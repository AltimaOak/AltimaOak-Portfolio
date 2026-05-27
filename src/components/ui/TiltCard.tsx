"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number; // Maximum tilt angle in degrees
  perspective?: number;
  scale?: number;
}

export default function TiltCard({
  children,
  className = "",
  maxTilt = 5,
  perspective = 1000,
  scale = 1.012,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for x/y mouse percentage relative to center of the card
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  // Smooth out the motion values using springs
  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  // Map progress (0 to 1) to rotation angles (e.g. -maxTilt to maxTilt)
  // Note: Y mouse position dictates X-axis rotation, and X mouse position dictates Y-axis rotation
  const rotateX = useTransform(ySpring, [0, 1], [maxTilt, -maxTilt]);
  const rotateY = useTransform(xSpring, [0, 1], [-maxTilt, maxTilt]);
  const cardScale = useTransform(xSpring, [0, 0.5, 1], [scale, 1, scale]); // Subtle scale transition

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Mouse coordinates relative to card top-left
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Express as percentages from 0 to 1
    const xPct = mouseX / width;
    const yPct = mouseY / height;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Reset back to center
    x.set(0.5);
    y.set(0.5);
  };

  // Glare / Shine position based on current x & y motion values
  const glareX = useTransform(xSpring, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(ySpring, [0, 1], ["0%", "100%"]);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        perspective: `${perspective}px`,
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
        scale: isHovered ? scale : 1,
      }}
      className={`relative transition-all duration-200 ease-out select-none ${className}`}
    >
      <div 
        style={{ transform: "translateZ(0px)" }} 
        className="w-full h-full relative overflow-hidden"
      >
        {children}

        {/* Dynamic Specular Glare/Shine Effect */}
        <motion.div
          style={{
            background: `radial-gradient(circle 200px at ${glareX} ${glareY}, rgba(250, 204, 21, 0.05) 0%, transparent 80%)`,
            transform: "translateZ(10px)",
            opacity: isHovered ? 1 : 0,
          }}
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-50"
        />
      </div>
    </motion.div>
  );
}
