import React from 'react';
import { motion } from 'framer-motion';
import CategoryCard from '../components/CategoryCard';

interface CategoriesProps {
  onSelect: (category: string) => void;
}

const Categories: React.FC<CategoriesProps> = ({ onSelect }) => {
  const categories = [
    "Señales de Tránsito",
    "Normas de Tránsito",
    "Infracciones y Sanciones",
    "Mecánica y Seguridad"
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-12 md:mb-16 text-center md:text-left relative"
      >
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-secondary/10 rounded-full blur-3xl" />
        <h2 className="text-4xl md:text-7xl font-black text-white mb-6 tracking-tighter italic">
          ELIGE TU <span className="text-secondary">RETO</span>
        </h2>
        <p className="text-white/40 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
          Cada entrenamiento consta de <span className="text-white font-bold">10 preguntas</span> seleccionadas aleatoriamente. ¿Estás preparado?
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {categories.map((cat, index) => (
          <CategoryCard 
            key={cat} 
            category={cat} 
            index={index}
            onClick={onSelect} 
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-20 p-8 glass rounded-3xl border-white/5 text-center"
      >
        <p className="text-white/30 text-sm font-bold uppercase tracking-widest">
          Banco de preguntas oficial • Actualizado 2026
        </p>
      </motion.div>
    </div>
  );
};

export default Categories;
