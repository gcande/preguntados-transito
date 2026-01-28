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
    <div className="min-h-screen py-8 px-4 flex flex-col items-center">
      {/* Header Info */}
      <div className="w-full max-w-4xl flex justify-between items-end mb-12">
        <div className="flex flex-col">
          <span className="text-blue-400 font-bold uppercase tracking-wider text-xs mb-1">Categoría</span>
          <h3 className="text-white font-bold text-xl">{currentQuestion.category}</h3>
        </div>
        
        <Timer timeLeft={timeLeft} />

        <div className="flex flex-col items-end">
          <span className="text-blue-400 font-bold uppercase tracking-wider text-xs mb-1">Puntos</span>
          <h3 className="text-white font-bold text-2xl">{score}</h3>
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
