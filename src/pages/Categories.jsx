import React from 'react';
import { motion } from 'framer-motion';
import CategoryCard from '../components/CategoryCard';

const Categories = ({ onSelect }) => {
  const categories = [
    "Señales de Tránsito",
    "Normas de Tránsito",
    "Infracciones y Sanciones",
    "Mecánica y Seguridad"
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-12 text-center md:text-left"
      >
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
          Selecciona una Categoría
        </h2>
        <p className="text-white/60 text-lg">
          Cada examen consta de 10 preguntas aleatorias de la categoría elegida.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat, index) => (
          <CategoryCard 
            key={index} 
            category={cat} 
            onClick={onSelect} 
          />
        ))}
      </div>
    </div>
  );
};

export default Categories;
