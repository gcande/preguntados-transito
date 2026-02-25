import React from 'react';
import { motion } from 'framer-motion';

interface TimerProps {
  timeLeft: number;
  isAnswered?: boolean;
}

const Timer: React.FC<TimerProps> = ({ timeLeft, isAnswered }) => {
  const isLow = timeLeft <= 5;
  const isCritical = timeLeft <= 3;

  // Percentage for radial progress (base 15s)
  const percentage = (timeLeft / 15) * 100;

  return (
    <div className="flex flex-col items-center group">
      <div className="relative w-24 h-24 md:w-28 md:h-28 flex items-center justify-center">
        {/* SVG Progress Circle */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            className="fill-none stroke-white/5 stroke-[4]"
          />
          <motion.circle
            cx="50%"
            cy="50%"
            r="45%"
            initial={{ pathLength: 1 }}
            animate={{ pathLength: percentage / 100 }}
            transition={{ duration: 1, ease: "linear" }}
            className={`fill-none stroke-[6] stroke-linecap-round ${
              isCritical ? 'stroke-danger' : 
              isLow ? 'stroke-primary' : 'stroke-accent'
            } drop-shadow-[0_0_8px_currentColor]`}
          />
        </svg>

        <motion.div
          animate={isLow && !isAnswered ? { scale: [1, 1.1, 1] } : {}}
          transition={{ repeat: Infinity, duration: 0.5 }}
          className={`relative z-10 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-3xl md:text-4xl font-black glass
            ${isCritical ? 'text-danger' : isLow ? 'text-primary' : 'text-accent'} 
            ${isLow && !isAnswered ? 'pulse-red' : ''} transition-colors duration-500`}
        >
          {timeLeft}
        </motion.div>
      </div>
      <span className="text-white/30 text-[10px] mt-3 uppercase tracking-[0.3em] font-black group-hover:text-white/50 transition-colors">
        Segundos
      </span>
    </div>
  );
};

export default Timer;
