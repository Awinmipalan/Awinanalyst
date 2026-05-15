import { Variants } from 'motion/react';

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    },
  },
};

export const cardReveal: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 20 }
  },
};

export const floatAnimation: Variants = {
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export const pulseGlow: Variants = {
  animate: {
    boxShadow: [
      "0px 0px 0px 0px rgba(34,211,238,0)",
      "0px 0px 20px 2px rgba(34,211,238,0.3)",
      "0px 0px 0px 0px rgba(34,211,238,0)"
    ],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
  }
};

export const hoverGlow = {
  hover: {
    boxShadow: "0 0 25px rgba(139,92,246,0.6)",
    scale: 1.02,
    transition: { type: "spring", stiffness: 300, damping: 10 }
  }
};

export const baseVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};
