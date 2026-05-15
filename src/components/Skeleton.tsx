import React from 'react';
import { motion } from 'motion/react';

export function Skeleton({ className }: { className?: string }) {
  return (
    <motion.div
      className={`bg-white/5 rounded-xl overflow-hidden relative ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
        animate={{ translateX: ['-100%', '200%'] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      />
    </motion.div>
  );
}
