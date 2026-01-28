import React from 'react';
import { motion } from 'framer-motion';

const CategoryCard = ({ category, onClick }) => {
  const getIcon = (cat) => {
    switch(cat) {
      case "Señales de Tránsito": return "🛑";
      case "Normas de Tránsito": return "🛣️";
      case "Infracciones y Sanciones": return "📝";
      case "Mecánica y Seguridad": return "🔧";
      default: return "🚗";
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05, translateY: -5 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => onClick(category)}
      className="glass-card flex flex-col items-center justify-center p-8 space-y-4 hover:bg-white/20 transition-all duration-300"
    >
      <span className="text-6xl">{getIcon(category)}</span>
      <h3 className="text-xl font-bold text-white text-center">{category}</h3>
    </motion.button>
  );
};

export default CategoryCard;
