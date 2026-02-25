import React from 'react';
import { motion } from 'framer-motion';

interface HomeProps {
  onStart: () => void;
}

const Home: React.FC<HomeProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] text-center px-4 relative overflow-hidden">
      {/* Decorative gradients */}
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-secondary/20 rounded-full blur-[100px] animate-pulse delay-700" />

      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-12 relative z-10"
      >
        <span className="inline-block px-4 py-1.5 mb-6 rounded-full glass text-xs font-bold tracking-widest text-primary uppercase border border-primary/20 animate-fade-in">
          🚀 Simulador Profesional
        </span>
        <h1 className="text-5xl md:text-9xl font-black text-white mb-4 tracking-tighter italic leading-none">
          TRÁNSITO<span className="text-primary drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">QUIZ</span>
        </h1>
        <p className="text-sm md:text-base text-white/50 font-medium uppercase tracking-[0.4em]">
          Colombia Edition • 2026
        </p>
      </motion.div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="glass-card p-1 md:p-1 max-w-lg w-full relative z-10 overflow-hidden"
      >
        <div className="p-8 md:p-12 bg-slate-900/40 rounded-[1.8rem]">
          <div className="text-6xl md:text-7xl mb-8 transform transition-transform hover:scale-110 duration-500 cursor-default">
            🚦
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-6 leading-tight">
            ¿Dominas las vías de <br/><span className="text-secondary">Colombia?</span>
          </h2>
          <p className="text-white/60 mb-10 leading-relaxed text-sm md:text-base font-medium">
            Entrena para tu examen de licencia con el simulador más moderno. 
            60 preguntas actualizadas del Código Nacional de Tránsito.
          </p>
          
          <motion.button
            whileHover={{ 
              scale: 1.02, 
              backgroundColor: "var(--primary)",
              boxShadow: "0 20px 40px -10px rgba(245, 158, 11, 0.4)" 
            }}
            whileTap={{ scale: 0.98 }}
            onClick={onStart}
            className="w-full py-5 bg-primary/90 text-slate-950 rounded-2xl text-xl md:text-2xl font-black transition-all shadow-xl hover:text-black uppercase tracking-tight"
          >
            Comenzar Entrenamiento
          </motion.button>
        </div>
      </motion.div>
      
      <motion.div 
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        className="mt-16 text-white/30 text-xs font-bold tracking-[0.2em] uppercase"
      >
        Desliza para ver estadísticas ↓
      </motion.div>
    </div>
  );
};

export default Home;
