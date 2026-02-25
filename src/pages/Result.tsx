import React from 'react';
import ResultModal from '../components/ResultModal';

interface ResultProps {
  score: number;
  correctCount: number;
  wrongCount: number;
  onRestart: () => void;
}

const Result: React.FC<ResultProps> = ({ score, correctCount, wrongCount, onRestart }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Lights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-secondary/5 rounded-full blur-[150px] pointer-events-none" />
      
      <ResultModal 
        score={score} 
        correct={correctCount} 
        wrong={wrongCount} 
        onRestart={onRestart} 
      />
    </div>
  );
};

export default Result;
