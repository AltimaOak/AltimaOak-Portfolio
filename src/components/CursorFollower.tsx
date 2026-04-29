"use client";

import { motion } from "framer-motion";
import { useMouseMove } from "@/lib/hooks";
import { useEffect, useState } from "react";

export function CursorFollower() {
  const { x, y } = useMouseMove();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none z-0 hidden lg:block"
      animate={{
        x: x + window.innerWidth / 2 - 200,
        y: y + window.innerHeight / 2 - 200,
      }}
      transition={{
        type: "spring",
        damping: 30,
        stiffness: 200,
        mass: 0.5,
      }}
    />
  );
}
