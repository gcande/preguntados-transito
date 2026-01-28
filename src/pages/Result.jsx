import React from 'react';
import ResultModal from '../components/ResultModal';

const Result = ({ score, correct, wrong, onRestart }) => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <ResultModal 
        score={score} 
        correct={correct} 
        wrong={wrong} 
        onRestart={onRestart} 
      />
    </div>
  );
};

export default Result;
