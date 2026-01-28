import React from 'react';

const ProgressBar = ({ current, total }) => {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full max-w-xl">
      <div className="flex justify-between items-center mb-2 text-white/70 text-sm font-medium">
        <span>Progreso</span>
        <span>{current} de {total}</span>
      </div>
      <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden border border-white/5">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
