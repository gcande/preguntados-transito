import React from 'react';
import { useGame } from './hooks/useGame';
import Home from './pages/Home';
import Categories from './pages/Categories';
import Game from './pages/Game';
import Result from './pages/Result';
import { AnimatePresence, motion } from 'framer-motion';

function App() {
  const {
    gameState,
    currentQuestions,
    currentIndex,
    score,
    correctCount,
    wrongCount,
    timeLeft,
    selectedAnswer,
    isAnswered,
    startGame,
    selectCategory,
    handleAnswer,
    restartGame
  } = useGame();

  const renderPage = () => {
    switch(gameState) {
      case 'HOME':
        return <Home onStart={startGame} />;
      case 'CATEGORIES':
        return <Categories onSelect={selectCategory} />;
      case 'PLAYING':
        return (
          <Game 
            questions={currentQuestions}
            currentIndex={currentIndex}
            onAnswer={handleAnswer}
            selectedAnswer={selectedAnswer}
            isAnswered={isAnswered}
            timeLeft={timeLeft}
            score={score}
          />
        );
      case 'RESULT':
        return (
          <Result 
            score={score}
            correct={correctCount}
            wrong={wrongCount}
            onRestart={restartGame}
          />
        );
      default:
        return <Home onStart={startGame} />;
    }
  };

  return (
    <div className="min-h-screen w-full relative">
      {/* Dynamic Background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full" />
      </div>

      <main className="relative z-10 container mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={gameState}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer Branding */}
      <footer className="fixed bottom-4 left-0 w-full text-center text-white/20 text-xs pointer-events-none">
        &copy; 2026 TRÁNSITO QUIZ COLOMBIA • DESARROLLADO PARA MVP
      </footer>
    </div>
  );
}

export default App;
