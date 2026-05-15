import React, { useMemo } from 'react';
import { motion } from 'motion/react';

export default function AnimatedBackground() {
  // Neural network nodes
  const nodes = useMemo(() => Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: 15 + Math.random() * 20,
    delay: Math.random() * 5
  })), []);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[#020617]">
      {/* Radial Gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-900/50 to-[#020617]" />

      {/* Animated SVG Grid */}
      <div className="absolute inset-0 opacity-[0.12]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,1)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Pulse Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 hidden md:block">
        {[1, 2, 3, 4, 5].map((i) => (
          <motion.div
            key={`ring-${i}`}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-accent rounded-full"
            style={{ width: i * 300, height: i * 300 }}
            animate={{ scale: [1, 1.05, 1], opacity: [0.05, 0.25, 0.05] }}
            transition={{ duration: 8 + i * 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
          />
        ))}
      </div>

      {/* Neural Network Nodes (Floating particles) */}
      {nodes.map((p) => (
         <motion.div
           key={p.id}
           className="absolute w-1 h-1 bg-accent rounded-full shadow-[0_0_10px_2px_rgba(34,211,238,0.8)]"
           initial={{ left: `${p.x}%`, top: `${p.y}%`, opacity: 0.1 }}
           animate={{ 
             left: [`${p.x}%`, `${(p.x + 5) % 100}%`, `${(p.x - 5) % 100}%`, `${p.x}%`],
             top: [`${p.y}%`, `${(p.y - 10) % 100}%`, `${(p.y + 10) % 100}%`, `${p.y}%`],
             opacity: [0.1, 0.6, 0.1]
           }}
           transition={{ duration: p.duration, repeat: Infinity, ease: "linear", delay: p.delay }}
         />
      ))}

      {/* Abstract Dynamic Line Graph at bottom */}
      <svg className="absolute bottom-0 left-0 w-full h-[40vh] opacity-25" preserveAspectRatio="none" viewBox="0 0 1000 300">
         <motion.path 
           d="M0,300 C150,250 250,150 400,200 C550,250 650,100 800,180 C950,260 1000,150 1000,150 L1000,300 Z"
           fill="url(#area-gradient)"
           initial={{ y: 50, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ duration: 2, ease: "easeOut" }}
         />
         <motion.path 
           d="M0,300 C150,250 250,150 400,200 C550,250 650,100 800,180 C950,260 1000,150 1000,150"
           fill="none"
           stroke="var(--color-primary)"
           strokeWidth="3"
           initial={{ pathLength: 0 }}
           animate={{ pathLength: 1 }}
           transition={{ duration: 10, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
         />
         <defs>
           <linearGradient id="area-gradient" x1="0" y1="0" x2="0" y2="1">
             <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.5" />
             <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
           </linearGradient>
         </defs>
      </svg>

      {/* Soft ambient lighting Orbs */}
      <motion.div
        className="absolute top-[-10%] right-[-5%] w-[45vw] h-[45vw] bg-primary/20 rounded-full blur-[150px]"
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-accent/15 rounded-full blur-[150px]"
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 5 }}
      />
    </div>
  );
}
