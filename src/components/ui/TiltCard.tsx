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
}: TiltCardProps) {
  return (
    <div className={`w-full h-full ${className}`}>
      {children}
    </div>
  );
}
