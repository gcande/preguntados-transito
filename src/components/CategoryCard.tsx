import React from 'react';
import { motion } from 'framer-motion';

interface CategoryCardProps {
  category: string;
  onClick: (category: string) => void;
  index: number;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onClick, index }) => {
  const getStyle = (cat: string) => {
    switch(cat) {
      case "Señales de Tránsito": 
        return { icon: "🛑", color: "from-red-500/20 to-red-600/10", border: "border-red-500/30", text: "text-red-400" };
      case "Normas de Tránsito": 
        return { icon: "🛣️", color: "from-blue-500/20 to-blue-600/10", border: "border-blue-500/30", text: "text-blue-400" };
      case "Infracciones y Sanciones": 
        return { icon: "📝", color: "from-amber-500/20 to-amber-600/10", border: "border-amber-500/30", text: "text-amber-400" };
      case "Mecánica y Seguridad": 
        return { icon: "🔧", color: "from-emerald-500/20 to-emerald-600/10", border: "border-emerald-500/30", text: "text-emerald-400" };
      default: 
        return { icon: "🚗", color: "from-slate-500/20 to-slate-600/10", border: "border-slate-500/30", text: "text-slate-400" };
    }
  };

  const style = getStyle(category);

  return (
    <motion.button
      whileHover={{ 
        scale: 1.05, 
        translateY: -8,
        boxShadow: "0 20px 40px -20px rgba(0,0,0,0.5)" 
      }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      onClick={() => onClick(category)}
      className={`glass-card relative overflow-hidden flex flex-col items-center justify-center p-8 space-y-5 border-t ${style.border} group transition-all duration-500`}
    >
      {/* Background Glow */}
      <div className={`absolute inset-0 bg-gradient-to-br ${style.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      
      <div className="relative z-10 text-6xl md:text-7xl transform group-hover:scale-110 transition-transform duration-500 ease-out">
        {style.icon}
      </div>
      
      <h3 className={`relative z-10 text-xl md:text-2xl font-black text-white text-center leading-tight tracking-tight`}>
        {category}
      </h3>
      
      <div className={`w-12 h-1 rounded-full bg-white/10 group-hover:w-20 group-hover:bg-white/40 transition-all duration-500`} />
    </motion.button>
  );
};

export default CategoryCard;
