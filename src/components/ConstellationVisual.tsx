"use client";

import React, { useEffect, useRef, useState } from "react";

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  glowColor: string;
  layer: number; // 0 = back, 1 = mid, 2 = front
  pulsePhase: number;
  pulseSpeed: number;
}

export default function ConstellationVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 500, height: 500 });
  const mouseRef = useRef({ x: -1000, y: -1000, active: false, easeX: -1000, easeY: -1000 });

  // Monitor size changes
  useEffect(() => {
    if (!containerRef.current) return;
    
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width: width || 500, height: height || 500 });
      }
    });
    
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Animation logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Multi-layer settings: [Back, Mid, Front]
    const layerConfigs = [
      { count: 25, connDist: 70, speed: 0.12, radiusRange: [0.8, 1.3], parallax: 0.15 },
      { count: 20, connDist: 100, speed: 0.25, radiusRange: [1.4, 2.2], parallax: 0.4 },
      { count: 15, connDist: 140, speed: 0.4, radiusRange: [2.4, 3.5], parallax: 0.8 },
    ];

    const colors = [
      { base: "rgba(6, 182, 212, 1)", glow: "rgba(6, 182, 212, 0.25)" }, // Electric Cyan
      { base: "rgba(168, 85, 247, 1)", glow: "rgba(168, 85, 247, 0.25)" }, // Violet
      { base: "rgba(236, 72, 153, 1)", glow: "rgba(236, 72, 153, 0.25)" }, // Pink
    ];

    // Generate particles
    const particles: Particle[] = [];
    layerConfigs.forEach((config, layerIdx) => {
      for (let i = 0; i < config.count; i++) {
        const colorScheme = colors[Math.floor(Math.random() * colors.length)];
        const r = Math.random() * (config.radiusRange[1] - config.radiusRange[0]) + config.radiusRange[0];
        
        // Random velocities
        const angle = Math.random() * Math.PI * 2;
        const speed = (Math.random() * 0.4 + 0.8) * config.speed;
        
        particles.push({
          x: Math.random() * dimensions.width,
          y: Math.random() * dimensions.height,
          baseX: 0,
          baseY: 0,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: r,
          color: colorScheme.base,
          glowColor: colorScheme.glow,
          layer: layerIdx,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.015 + 0.01,
        });
      }
    });

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);
      
      const mouse = mouseRef.current;
      
      // Interpolate eased mouse position for buttery tracking
      if (mouse.active) {
        if (mouse.easeX === -1000) {
          mouse.easeX = mouse.x;
          mouse.easeY = mouse.y;
        } else {
          mouse.easeX += (mouse.x - mouse.easeX) * 0.08;
          mouse.easeY += (mouse.y - mouse.easeY) * 0.08;
        }
      } else {
        mouse.easeX = -1000;
        mouse.easeY = -1000;
      }

      // Draw dynamic mouse glow ring
      if (mouse.active && mouse.easeX !== -1000) {
        // Outer interactive aura ring
        ctx.beginPath();
        ctx.arc(mouse.easeX, mouse.easeY, 45, 0, Math.PI * 2);
        const mouseGlow = ctx.createRadialGradient(
          mouse.easeX, mouse.easeY, 0,
          mouse.easeX, mouse.easeY, 45
        );
        mouseGlow.addColorStop(0, "rgba(99, 102, 241, 0.15)");
        mouseGlow.addColorStop(0.5, "rgba(99, 102, 241, 0.05)");
        mouseGlow.addColorStop(1, "rgba(99, 102, 241, 0)");
        ctx.fillStyle = mouseGlow;
        ctx.fill();

        // Inner glowing core dot
        ctx.beginPath();
        ctx.arc(mouse.easeX, mouse.easeY, 3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.shadowColor = "#6366f1";
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }

      // Draw Connections (Within the same layer to preserve depth separation)
      layerConfigs.forEach((config, layerIdx) => {
        const layerParticles = particles.filter(p => p.layer === layerIdx);
        
        for (let i = 0; i < layerParticles.length; i++) {
          const pA = layerParticles[i];

          // Compute parallax displacement
          const parallaxX = mouse.easeX !== -1000 ? (mouse.easeX - dimensions.width / 2) * config.parallax * 0.05 : 0;
          const parallaxY = mouse.easeY !== -1000 ? (mouse.easeY - dimensions.height / 2) * config.parallax * 0.05 : 0;
          
          const drawAX = pA.x + parallaxX;
          const drawAY = pA.y + parallaxY;

          for (let j = i + 1; j < layerParticles.length; j++) {
            const pB = layerParticles[j];
            
            const drawBX = pB.x + parallaxX;
            const drawBY = pB.y + parallaxY;

            const dx = drawAX - drawBX;
            const dy = drawAY - drawBY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < config.connDist) {
              const alpha = (1 - dist / config.connDist) * (0.08 + layerIdx * 0.07);
              ctx.beginPath();
              ctx.moveTo(drawAX, drawAY);
              ctx.lineTo(drawBX, drawBY);
              
              // Multi-color dynamic gradients
              const grad = ctx.createLinearGradient(drawAX, drawAY, drawBX, drawBY);
              grad.addColorStop(0, pA.color.replace("1)", alpha.toString()));
              grad.addColorStop(1, pB.color.replace("1)", alpha.toString()));
              
              ctx.strokeStyle = grad;
              ctx.lineWidth = 0.5 + layerIdx * 0.4;
              ctx.stroke();
            }
          }

          // Connection to mouse
          if (mouse.active && mouse.easeX !== -1000) {
            const mDx = drawAX - mouse.easeX;
            const mDy = drawAY - mouse.easeY;
            const mDist = Math.sqrt(mDx * mDx + mDy * mDy);
            
            // Limit mouse connections to closer particles
            const activeMouseDist = config.connDist * 1.3;
            if (mDist < activeMouseDist) {
              const alpha = (1 - mDist / activeMouseDist) * (0.15 + layerIdx * 0.15);
              ctx.beginPath();
              ctx.moveTo(drawAX, drawAY);
              ctx.lineTo(mouse.easeX, mouse.easeY);
              
              const mGrad = ctx.createLinearGradient(drawAX, drawAY, mouse.easeX, mouse.easeY);
              mGrad.addColorStop(0, pA.color.replace("1)", alpha.toString()));
              mGrad.addColorStop(1, `rgba(99, 102, 241, ${alpha * 0.5})`);
              
              ctx.strokeStyle = mGrad;
              ctx.lineWidth = 0.8 + layerIdx * 0.4;
              ctx.stroke();
            }
          }
        }
      });

      // Update and Draw Particles
      particles.forEach((p) => {
        const config = layerConfigs[p.layer];
        
        // Parallax offsets
        const parallaxX = mouse.easeX !== -1000 ? (mouse.easeX - dimensions.width / 2) * config.parallax * 0.05 : 0;
        const parallaxY = mouse.easeY !== -1000 ? (mouse.easeY - dimensions.height / 2) * config.parallax * 0.05 : 0;

        // Apply constant velocity drifting
        p.x += p.vx;
        p.y += p.vy;

        // Pulse scale animation
        p.pulsePhase += p.pulseSpeed;
        const pulse = 1 + Math.sin(p.pulsePhase) * 0.18;

        // Warp borders (seamless wrapping for fluid stars/constellations)
        const margin = 10;
        if (p.x < -margin) p.x = dimensions.width + margin;
        if (p.x > dimensions.width + margin) p.x = -margin;
        if (p.y < -margin) p.y = dimensions.height + margin;
        if (p.y > dimensions.height + margin) p.y = -margin;

        // Mouse attraction physics (only for mid and front layers)
        if (mouse.active && p.layer > 0) {
          const dx = mouse.x - (p.x + parallaxX);
          const dy = mouse.y - (p.y + parallaxY);
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          const maxInfluence = 180;
          if (dist < maxInfluence) {
            const pullForce = (maxInfluence - dist) / maxInfluence;
            // Eased gravitational pull
            p.x += (dx / dist) * pullForce * (p.layer * 0.15);
            p.y += (dy / dist) * pullForce * (p.layer * 0.15);
          }
        }

        const drawX = p.x + parallaxX;
        const drawY = p.y + parallaxY;

        // Draw soft glow radial gradient
        const radiusGlow = p.radius * (4.5 + p.layer * 1.5) * pulse;
        const nodeGlow = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, radiusGlow);
        nodeGlow.addColorStop(0, p.glowColor);
        nodeGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
        
        ctx.beginPath();
        ctx.arc(drawX, drawY, radiusGlow, 0, Math.PI * 2);
        ctx.fillStyle = nodeGlow;
        ctx.fill();

        // Draw solid core
        ctx.beginPath();
        ctx.arc(drawX, drawY, p.radius * pulse, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [dimensions]);

  // Track Mouse Positions
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    mouseRef.current.x = e.clientX - rect.left;
    mouseRef.current.y = e.clientY - rect.top;
    mouseRef.current.active = true;
  };

  const handleMouseLeave = () => {
    mouseRef.current.active = false;
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="w-full h-full relative overflow-hidden rounded-[2.5rem] flex items-center justify-center border border-white/[0.08] bg-[#070913]/60 backdrop-blur-3xl shadow-[0_24px_80px_rgba(0,0,0,0.4)] transition-all duration-700 hover:border-indigo-500/20 group"
    >
      {/* Immersive Cyber-Matrix Grid overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.08] transition-opacity duration-700 group-hover:opacity-[0.14]" 
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(99, 102, 241, 0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(99, 102, 241, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(circle at center, black 40%, transparent 95%)",
          WebkitMaskImage: "radial-gradient(circle at center, black 40%, transparent 95%)"
        }}
      />

      {/* Decorative Outer Glass Rings with slow pulse */}
      <div className="absolute w-[360px] h-[360px] border border-dashed border-cyan-500/20 rounded-full animate-[spin_120s_linear_infinite] opacity-60 pointer-events-none" />
      <div className="absolute w-[260px] h-[260px] border border-double border-indigo-500/10 rounded-full animate-[spin_60s_linear_infinite_reverse] opacity-50 pointer-events-none" />
      <div className="absolute w-[180px] h-[180px] border border-dashed border-pink-500/5 rounded-full animate-[spin_90s_linear_infinite] opacity-35 pointer-events-none" />

      {/* Center glowing focal point */}
      <div className="absolute w-[300px] h-[300px] bg-gradient-radial from-indigo-500/5 via-transparent to-transparent pointer-events-none" />

      {/* Hardware Accelerated Canvas */}
      <canvas 
        ref={canvasRef} 
        width={dimensions.width} 
        height={dimensions.height}
        className="absolute inset-0 block w-full h-full transform translate-z-0"
      />
    </div>
  );
}
