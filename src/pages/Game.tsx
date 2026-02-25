import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QuestionCard from '../components/QuestionCard';
import Timer from '../components/Timer';
import ProgressBar from '../components/ProgressBar';
import { Question } from '../types';

interface GameProps {
  questions: Question[];
  currentIndex: number;
  onAnswer: (option: string) => void;
  selectedAnswer: string | null;
  isAnswered: boolean;
  timeLeft: number;
  score: number;
}

const Game: React.FC<GameProps> = ({
  questions,
  currentIndex,
  onAnswer,
  selectedAnswer,
  isAnswered,
  timeLeft,
  score,
}) => {
  const currentQuestion = questions[currentIndex];

  if (!currentQuestion) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen py-10 md:py-16 px-6 flex flex-col items-center relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-5xl flex flex-col md:flex-row justify-between items-center gap-8 mb-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col items-center md:items-start"
        >
          <span className="text-secondary font-black uppercase tracking-[0.3em] text-[10px] md:text-xs mb-2">
            Categoría Actual
          </span>
          <div className="px-4 py-2 glass rounded-full border-white/5">
            <h3 className="text-white font-black text-sm md:text-lg italic">
              {currentQuestion.category.toUpperCase()}
            </h3>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <Timer timeLeft={timeLeft} isAnswered={isAnswered} />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col items-center md:items-end"
        >
          <span className="text-primary font-black uppercase tracking-[0.3em] text-[10px] md:text-xs mb-2">
            Puntuación
          </span>
          <div className="px-6 py-2 bg-primary/10 rounded-full border border-primary/20">
            <h3 className="text-primary font-black text-2xl md:text-3xl drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]">
              {score.toString().padStart(4, '0')}
            </h3>
          </div>
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        <QuestionCard
          key={currentIndex}
          question={currentQuestion.question}
          options={currentQuestion.options}
          onAnswer={onAnswer}
          selectedAnswer={selectedAnswer}
          isAnswered={isAnswered}
          correctAnswer={currentQuestion.correct_answer}
        />
      </AnimatePresence>

      <div className="mt-20 w-full max-w-3xl flex flex-col items-center relative z-10">
        <ProgressBar current={currentIndex + 1} total={questions.length} />

        <div className="mt-8 flex items-center space-x-4">
          <div className={`w-2 h-2 rounded-full animate-pulse ${isAnswered ? 'bg-accent' : 'bg-primary'}`} />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-white/40 font-bold uppercase tracking-widest text-[10px]"
          >
            {isAnswered 
              ? (currentIndex < questions.length - 1 ? 'Preparando siguiente pregunta' : 'Finalizando examen')
              : `Pregunta ${currentIndex + 1} de ${questions.length}`
            }
          </motion.p>
        </div>
      </div>
    </div>
  );
};

export default Game;
