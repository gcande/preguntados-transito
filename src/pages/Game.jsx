import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QuestionCard from '../components/QuestionCard';
import Timer from '../components/Timer';
import ProgressBar from '../components/ProgressBar';

const Game = ({ 
  questions, 
  currentIndex, 
  onAnswer, 
  selectedAnswer, 
  isAnswered, 
  timeLeft, 
  score 
}) => {
  const currentQuestion = questions[currentIndex];

  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen py-6 md:py-8 px-4 flex flex-col items-center">
      {/* Header Info */}
      <div className="w-full max-w-4xl flex flex-wrap justify-between items-center md:items-end gap-y-4 mb-8 md:mb-12">
        <div className="flex flex-col order-1 md:order-none">
          <span className="text-blue-400 font-bold uppercase tracking-wider text-[10px] md:text-xs mb-1 text-left">Categoría</span>
          <h3 className="text-white font-bold text-base md:text-xl truncate max-w-[150px] md:max-w-none">{currentQuestion.category}</h3>
        </div>
        
        <div className="order-3 md:order-none w-full md:w-auto flex justify-center">
          <Timer timeLeft={timeLeft} />
        </div>

        <div className="flex flex-col items-end order-2 md:order-none">
          <span className="text-blue-400 font-bold uppercase tracking-wider text-[10px] md:text-xs mb-1">Puntos</span>
          <h3 className="text-white font-bold text-xl md:text-2xl">{score}</h3>
        </div>
      </div>

      {/* Main Question Area */}
      <AnimatePresence mode="wait">
        <QuestionCard
          key={currentIndex}
          question={currentQuestion.question}
          options={currentQuestion.options}
          onAnswer={onAnswer}
          selectedAnswer={selectedAnswer}
          isAnswered={isAnswered}
          correctAnswer={currentQuestion.correctAnswer}
        />
      </AnimatePresence>

      {/* Bottom Progress */}
      <div className="mt-16 w-full max-w-2xl flex flex-col items-center">
        <ProgressBar current={currentIndex + 1} total={questions.length} />
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: isAnswered ? 1 : 0 }}
          className="mt-6 text-white/50 font-medium italic"
        >
          {currentIndex < questions.length - 1 ? 'Preparando siguiente pregunta...' : 'Calculando resultados finales...'}
        </motion.p>
      </div>
    </div>
  );
};

export default Game;
