import React from 'react';
import { motion } from 'framer-motion';

const Timer = ({ timeLeft }) => {
  const isLow = timeLeft <= 5;

  return (
    <div className="flex flex-col items-center">
      <motion.div
        animate={isLow ? { scale: [1, 1.1, 1] } : {}}
        transition={{ repeat: Infinity, duration: 0.5 }}
        className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold glass-card
          ${isLow ? 'text-red-500 border-red-500 pulse-red' : 'text-blue-400 border-blue-400'}`}
      >
        {timeLeft}
      </motion.div>
      <span className="text-white/60 text-xs mt-2 uppercase tracking-widest font-bold">Tiempo</span>
    </div>
  );
};

export default Timer;
