import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
}

interface SidebarProps {
  items: SidebarItem[];
  activeItem: string;
  onSelect: (key: string) => void;
  userEmail: string;
  role: string;
  onLogout: () => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  items, 
  activeItem, 
  onSelect, 
  userEmail, 
  role, 
  onLogout,
  isCollapsed,
  onToggle
}) => {

  const getIcon = (key: string) => {
    const props = { className: "w-5 h-5" };
    switch(key) {
      case 'dashboard': return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      );
      case 'questions': return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
      case 'users': return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      );
      case 'game': return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
      default: return null;
    }
  };

  return (
    <>
      {/* Overlay Mobile */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[45] md:hidden"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      <motion.aside 
        initial={false}
        animate={{ 
          width: isCollapsed ? 88 : 320,
          x: 0 
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`fixed md:sticky top-0 left-0 h-screen glass border-r border-white/10 flex flex-col justify-between z-[50] overflow-hidden shadow-2xl ${
          isCollapsed ? 'p-4 items-center' : 'p-8'
        }`}
      >
        {/* Toggle Button Container */}
        <div className={`flex items-center mb-10 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="overflow-hidden"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-primary shadow-lg shadow-primary/20 flex items-center justify-center">
                    <span className="text-black font-black text-xs">TQ</span>
                  </div>
                  <h1 className="text-xl font-black text-white italic tracking-tighter whitespace-nowrap">
                    TRÁNSITO<span className="text-primary">QUIZ</span>
                  </h1>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggle}
            className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 transition-colors z-[60] text-white ${isCollapsed ? '' : 'ml-4'}`}
          >
            <svg className={`w-5 h-5 transition-transform duration-500 ${isCollapsed ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>

        <div className="flex-1 flex flex-col gap-2 mt-4">
          {items.map((item) => {
            const isActive = activeItem === item.key;
            return (
              <motion.button
                key={item.key}
                whileHover={{ scale: 1.02, backgroundColor: isActive ? "" : "rgba(255,255,255,0.08)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect(item.key)}
                className={`group flex items-center rounded-2xl transition-all duration-300 relative ${
                  isCollapsed ? 'w-14 h-14 justify-center' : 'w-full px-5 py-4'
                } ${
                  isActive
                    ? 'bg-secondary text-white shadow-xl shadow-secondary/20'
                    : 'text-white/40 hover:text-white'
                }`}
              >
                <div className={`relative z-10 ${isActive ? 'text-white' : 'group-hover:text-white'}`}>
                  {getIcon(item.key)}
                </div>

                <AnimatePresence mode="wait">
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="ml-4 text-xs font-black uppercase tracking-widest whitespace-nowrap relative z-10"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {isActive && !isCollapsed && (
                  <motion.div 
                    layoutId="active-highlight"
                    className="absolute inset-0 bg-gradient-to-r from-secondary/50 to-secondary rounded-2xl -z-0"
                  />
                )}
                
                {isCollapsed && (
                  <div className="absolute left-[calc(100%+15px)] px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest pointer-events-none opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all z-50 whitespace-nowrap shadow-2xl">
                    {item.label}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        <div className={`mt-auto pt-6 border-t border-white/5 transition-all duration-500 ${isCollapsed ? 'items-center' : ''}`}>
          <AnimatePresence mode="wait">
            {!isCollapsed ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-white/5 p-5 rounded-[2rem] border border-white/5"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-black text-black">
                    {userEmail[0].toUpperCase()}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary italic">Activo</p>
                    <p className="text-xs font-bold text-white truncate">{userEmail}</p>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="w-full py-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-red-500/20"
                >
                  Desconectar
                </button>
              </motion.div>
            ) : (
              <motion.button
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                onClick={onLogout}
                className="w-12 h-12 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white flex items-center justify-center border border-red-500/20 transition-all"
                title="Cerrar Sesión"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
