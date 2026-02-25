import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full max-w-2xl px-4">
      <div className="flex justify-between items-center mb-4 text-white/40 text-xs font-black uppercase tracking-widest">
        <span>Progreso del Entrenamiento</span>
        <span className="text-white bg-white/10 px-3 py-1 rounded-full border border-white/5">
          {current} <span className="text-white/30 mx-1">/</span> {total}
        </span>
      </div>
      <div className="w-full h-4 bg-white/5 rounded-full overflow-hidden border border-white/10 p-1">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "circOut" }}
          className="h-full bg-gradient-to-r from-secondary to-accent rounded-full relative"
        >
          {/* Glossy light effect */}
          <div className="absolute inset-0 bg-white/20 blur-[2px] rounded-full scale-y-50 -translate-y-1" />
          
          {/* Animated tip */}
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-white/30 animate-pulse" />
        </motion.div>
      </div>
    </div>
  );
};

export default ProgressBar;
