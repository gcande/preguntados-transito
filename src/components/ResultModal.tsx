import React from 'react';
import { motion } from 'framer-motion';

interface ResultModalProps {
  score: number;
  correct: number;
  wrong: number;
  onRestart: () => void;
}

const ResultModal: React.FC<ResultModalProps> = ({ score, correct, wrong, onRestart }) => {
  const total = correct + wrong;
  const efficiency = total > 0 ? Math.round((correct / total) * 100) : 0;
  
  const isWinner = efficiency >= 80;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="glass-card relative overflow-hidden p-10 md:p-14 max-w-xl w-full text-center border-white/10"
    >
      {/* Background Decorative Result Color */}
      <div className={`absolute top-0 left-0 w-full h-2 ${isWinner ? 'bg-accent' : 'bg-danger'}`} />
      
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <span className="text-6xl md:text-8xl mb-6 block drop-shadow-lg">
          {isWinner ? '🏆' : '📚'}
        </span>
        <h2 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter italic">
          {isWinner ? '¡FELICITACIONES!' : 'SIGUE ESTUDIANDO'}
        </h2>
        <p className={`uppercase tracking-[0.4em] font-black text-xs mb-10 ${isWinner ? 'text-accent' : 'text-primary'}`}>
          {isWinner ? 'Has aprobado el simulacro' : 'Necesitas mejorar tus conocimientos'}
        </p>
      </motion.div>

      <div className="grid grid-cols-2 gap-6 mb-10">
        <div className="glass p-6 rounded-3xl border-white/5 relative group">
          <p className="text-white/30 text-[10px] uppercase font-black tracking-widest mb-1">Puntos Totales</p>
          <p className="text-4xl font-black text-white group-hover:text-primary transition-colors">{score}</p>
        </div>
        <div className="glass p-6 rounded-3xl border-white/5 relative group">
          <p className="text-white/30 text-[10px] uppercase font-black tracking-widest mb-1">Efectividad</p>
          <p className="text-4xl font-black text-white group-hover:text-secondary transition-colors">{efficiency}%</p>
        </div>
      </div>

      <div className="space-y-4 mb-12">
        <div className="flex justify-between items-center px-6 py-4 glass border-white/5 rounded-2xl">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full bg-accent shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            <span className="text-white/60 font-bold text-sm uppercase">Respuestas Correctas</span>
          </div>
          <span className="text-2xl text-white font-black">{correct}</span>
        </div>
        <div className="flex justify-between items-center px-6 py-4 glass border-white/5 rounded-2xl">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full bg-danger shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
            <span className="text-white/60 font-bold text-sm uppercase">Respuestas Incorrectas</span>
          </div>
          <span className="text-2xl text-white font-black">{wrong}</span>
        </div>
      </div>

      <motion.button
        whileHover={{ 
          scale: 1.02, 
          boxShadow: "0 20px 40px -10px rgba(59, 130, 246, 0.4)" 
        }}
        whileTap={{ scale: 0.98 }}
        onClick={onRestart}
        className="w-full py-6 bg-secondary text-white rounded-[1.5rem] text-xl font-black shadow-2xl transition-all uppercase tracking-tight"
      >
        Reiniciar Entrenamiento
      </motion.button>
      
      <p className="mt-8 text-white/20 text-[10px] font-black uppercase tracking-[0.2em]">
        TránsitoQuiz Colombia • Licencia de Conducción
      </p>
    </motion.div>
  );
};

export default ResultModal;
