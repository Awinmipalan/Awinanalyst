import React from 'react';
import { motion } from 'motion/react';

export default function AIPulse() {
  return (
    <div className="relative flex items-center justify-center w-16 h-16">
       <motion.div 
         className="absolute inset-0 rounded-full border border-accent"
         animate={{ scale: [1, 2.5], opacity: [0.8, 0] }}
         transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
       />
       <motion.div 
         className="absolute inset-0 rounded-full border border-primary"
         animate={{ scale: [1, 2.5], opacity: [0.8, 0] }}
         transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 1 }}
       />
       <div className="w-5 h-5 bg-gradient-to-tr from-primary to-accent rounded-full shadow-[0_0_20px_rgba(34,211,238,1)] animate-pulse" />
    </div>
  );
}
