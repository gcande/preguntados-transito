import React from 'react';
import { motion } from 'framer-motion';

const ResultModal = ({ score, correct, wrong, onRestart }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-6 md:p-10 max-w-md w-full text-center"
    >
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">¡Juego Terminado!</h2>
      <p className="text-blue-400 text-base md:text-lg mb-6 md:mb-8 uppercase tracking-widest font-bold">Resumen de tu examen</p>

      <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
        <div className="bg-white/5 p-3 md:p-4 rounded-2xl">
          <p className="text-white/60 text-xs md:text-sm">Puntaje</p>
          <p className="text-2xl md:text-3xl font-bold text-white">{score}</p>
        </div>
        <div className="bg-white/5 p-3 md:p-4 rounded-2xl">
          <p className="text-white/60 text-xs md:text-sm">Efectividad</p>
          <p className="text-2xl md:text-3xl font-bold text-white">{Math.round((correct / (correct + wrong)) * 100)}%</p>
        </div>
      </div>

      <div className="space-y-3 md:space-y-4 mb-8 md:mb-10">
        <div className="flex justify-between items-center px-4">
          <span className="text-green-400 font-semibold text-sm md:text-base">Correctas</span>
          <span className="text-xl md:text-2xl text-white font-bold">{correct}</span>
        </div>
        <div className="flex justify-between items-center px-4">
          <span className="text-red-400 font-semibold text-sm md:text-base">Incorrectas</span>
          <span className="text-xl md:text-2xl text-white font-bold">{wrong}</span>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onRestart}
        className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xl font-bold shadow-lg shadow-blue-900/40"
      >
        Jugar de Nuevo
      </motion.button>
    </motion.div>
  );
};

export default ResultModal;
