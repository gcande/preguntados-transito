import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const QuestionCard = ({ question, options, onAnswer, selectedAnswer, isAnswered, correctAnswer }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="w-full max-w-2xl"
    >
      <div className="glass-card p-5 md:p-10">
        <h2 className="text-xl md:text-3xl font-bold text-white mb-6 md:mb-8 text-center leading-tight">
          {question}
        </h2>

        <div className="grid grid-cols-1 gap-3 md:gap-4">
          {options.map((option, index) => {
            const isCorrect = option === correctAnswer;
            const isSelected = option === selectedAnswer;
            
            let btnClass = "w-full p-3 md:p-4 rounded-xl text-sm md:text-lg font-semibold transition-all duration-300 text-left border-2 ";
            
            if (!isAnswered) {
              btnClass += "bg-white/10 border-transparent text-white hover:bg-white/20 hover:border-white/30";
            } else {
              if (isCorrect) {
                btnClass += "bg-green-500/80 border-green-300 text-white shadow-[0_0_15px_rgba(34,197,94,0.4)]";
              } else if (isSelected && !isCorrect) {
                btnClass += "bg-red-500/80 border-red-300 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]";
              } else {
                btnClass += "bg-white/5 border-transparent text-white/40";
              }
            }

            return (
              <motion.button
                key={index}
                whileHover={!isAnswered ? { scale: 1.01 } : {}}
                whileTap={!isAnswered ? { scale: 0.99 } : {}}
                onClick={() => onAnswer(option)}
                disabled={isAnswered}
                className={btnClass}
              >
                <div className="flex items-center space-x-3 md:space-x-4">
                  <span className="bg-white/20 w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full text-xs md:text-sm shrink-0">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="leading-snug">{option}</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default QuestionCard;
