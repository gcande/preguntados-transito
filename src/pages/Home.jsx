import React from 'react';
import { motion } from 'framer-motion';

const Home = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="mb-12"
      >
        <h1 className="text-6xl md:text-8xl font-black text-white mb-4 tracking-tighter italic">
          TRÁNSITO<span className="text-blue-500">QUIZ</span>
        </h1>
        <p className="text-xl text-blue-300/80 font-medium uppercase tracking-[0.2em]">
          Colombia Edition • MVP
        </p>
      </motion.div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6 md:p-12 max-w-lg w-full"
      >
        <div className="text-5xl md:text-6xl mb-6 md:mb-8">🚦</div>
        <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">
          ¿Estás listo para obtener tu licencia?
        </h2>
        <p className="text-white/60 mb-8 md:mb-10 leading-relaxed text-sm md:text-base">
          Pon a prueba tus conocimientos sobre el Código Nacional de Tránsito. 
          Preguntas oficiales sobre señales, multas y normas viales.
        </p>
        
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(59, 130, 246, 0.5)" }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="w-full py-4 md:py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xl md:text-2xl font-black transition-all shadow-xl shadow-blue-900/40"
        >
          ¡COMENZAR AHORA!
        </motion.button>
      </motion.div>
      
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="mt-12 text-white/40 text-sm font-medium"
      >
        Desliza para ver más información ↓
      </motion.div>
    </div>
  );
};

export default Home;
