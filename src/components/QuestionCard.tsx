import React from 'react';
import { motion } from 'framer-motion';

interface QuestionCardProps {
  question: string;
  options: string[];
  onAnswer: (option: string) => void;
  selectedAnswer: string | null;
  isAnswered: boolean;
  correctAnswer: string;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ 
  question, 
  options, 
  onAnswer, 
  selectedAnswer, 
  isAnswered, 
  correctAnswer 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-3xl relative z-10"
    >
      <div className="glass-card overflow-hidden shadow-2xl border-white/10">
        <div className="p-8 md:p-14 bg-slate-900/20">
          <h2 className="text-2xl md:text-4xl font-black text-white mb-10 text-center leading-[1.15] tracking-tight italic">
            {question}
          </h2>

          <div className="grid grid-cols-1 gap-4 md:gap-5">
            {options.map((option, index) => {
              const isCorrect = option === correctAnswer;
              const isSelected = option === selectedAnswer;
              
              let btnClass = "w-full p-5 md:p-6 rounded-[1.25rem] text-sm md:text-xl font-bold transition-all duration-500 text-left border-2 relative overflow-hidden group ";
              
              if (!isAnswered) {
                btnClass += "glass border-white/5 text-white/80 hover:text-white hover:border-primary/50 hover:bg-primary/5";
              } else {
                if (isCorrect) {
                  btnClass += "bg-accent/20 border-accent text-accent shadow-[0_0_30px_rgba(16,185,129,0.2)]";
                } else if (isSelected && !isCorrect) {
                  btnClass += "bg-danger/20 border-danger text-danger shadow-[0_0_30px_rgba(239,68,68,0.2)] animate-shake";
                } else {
                  btnClass += "bg-white/5 border-transparent text-white/20";
                }
              }

              return (
                <motion.button
                  key={index}
                  whileHover={!isAnswered ? { x: 8 } : {}}
                  whileTap={!isAnswered ? { scale: 0.98 } : {}}
                  onClick={() => onAnswer(option)}
                  disabled={isAnswered}
                  className={btnClass}
                >
                  <div className="flex items-center space-x-4 md:space-x-6 relative z-10">
                    <span className={`
                      w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-xl text-xs md:text-sm font-black shrink-0 transition-colors duration-500
                      ${!isAnswered ? 'bg-white/10 text-white/50 group-hover:bg-primary group-hover:text-black' : 
                        isCorrect ? 'bg-accent text-black' : 
                        isSelected ? 'bg-danger text-white' : 'bg-white/5 text-white/10'}
                    `}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="leading-tight">{option}</span>
                  </div>
                  
                  {/* Correct/Incorrect Overlay Glow */}
                  {isAnswered && (isCorrect || isSelected) && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`absolute inset-0 bg-gradient-to-r opacity-10 ${isCorrect ? 'from-accent/40' : 'from-danger/40'} to-transparent`}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default QuestionCard;
