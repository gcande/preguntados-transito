import React from 'react';
import { motion } from 'framer-motion';

interface DashboardModuleProps {
  role: string;
  userEmail: string;
  totalQuestions: number;
  totalUsers: number;
  onGoToGame: () => void;
  onGoToQuestions: () => void;
  onGoToUsers: () => void;
}

const DashboardModule: React.FC<DashboardModuleProps> = ({
  role,
  userEmail,
  totalQuestions,
  totalUsers,
  onGoToGame,
  onGoToQuestions,
  onGoToUsers,
}) => {
  const isAdmin = role === 'admin';

  return (
    <section className="space-y-10 py-6">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center space-x-4 mb-2">
          <div className={`w-3 h-3 rounded-full ${isAdmin ? 'bg-primary shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-secondary shadow-[0_0_10px_rgba(59,130,246,0.5)]'}`} />
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">
            {isAdmin ? 'System Administrator' : 'Rookie Driver'}
          </p>
        </div>
        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter italic">
          Centro de <span className={isAdmin ? 'text-primary' : 'text-secondary'}>Control</span>
        </h2>
        <p className="text-white/40 mt-4 text-lg font-medium max-w-2xl leading-relaxed">
          {isAdmin 
            ? 'Gestiona la base de conocimientos, supervisa a los conductores y optimiza la experiencia de aprendizaje.' 
            : `¡Bienvenido de nuevo, ${userEmail.split('@')[0]}! Prepárate para dominar las vías colombianas.`}
        </p>
      </motion.header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isAdmin && (
          <>
            <motion.div 
              whileHover={{ y: -5 }}
              className="glass-card p-10 flex flex-col justify-between group overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Repositorio</span>
                <p className="text-6xl font-black text-white mt-2 group-hover:scale-110 transition-transform origin-left">{totalQuestions}</p>
                <p className="text-white/40 text-sm font-bold mt-1 uppercase">Preguntas Activas</p>
              </div>
              <button
                onClick={onGoToQuestions}
                className="mt-8 px-6 py-4 bg-primary/10 hover:bg-primary text-primary hover:text-black rounded-2xl border border-primary/20 transition-all font-black uppercase text-xs tracking-widest"
              >
                Gestionar Banco
              </button>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="glass-card p-10 flex flex-col justify-between group overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-3xl group-hover:bg-secondary/10 transition-colors" />
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-secondary">Comunidad</span>
                <p className="text-6xl font-black text-white mt-2 group-hover:scale-110 transition-transform origin-left">{totalUsers}</p>
                <p className="text-white/40 text-sm font-bold mt-1 uppercase">Usuarios Registrados</p>
              </div>
              <button
                onClick={onGoToUsers}
                className="mt-8 px-6 py-4 bg-secondary/10 hover:bg-secondary text-secondary hover:text-white rounded-2xl border border-secondary/20 transition-all font-black uppercase text-xs tracking-widest"
              >
                Directorio
              </button>
            </motion.div>
          </>
        )}

        <motion.div 
          whileHover={{ y: -5 }}
          className={`glass-card p-10 flex flex-col justify-between group overflow-hidden ${!isAdmin ? 'lg:col-span-2' : ''}`}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/10 transition-colors" />
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-accent">Laboratorio</span>
            <p className="text-3xl font-black text-white mt-4 leading-tight italic uppercase">Simulador de <br/>Examen 2026</p>
            <p className="text-white/40 text-sm font-bold mt-2 uppercase">Entrenar flujo de juego</p>
          </div>
          <button
            onClick={onGoToGame}
            className="mt-8 px-6 py-4 bg-accent/10 hover:bg-accent text-accent hover:text-black rounded-2xl border border-accent/20 transition-all font-black uppercase text-xs tracking-widest"
          >
            Abrir Simulador
          </button>
        </motion.div>
      </div>

      {!isAdmin && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="p-10 glass rounded-[2.5rem] border-white/5 relative overflow-hidden"
        >
             <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-secondary/10 to-transparent" />
             <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-left">
                    <h3 className="text-2xl font-black text-white italic">TU PRÓXIMO LOGRO</h3>
                    <p className="text-white/40 font-medium">Completa un examen con 100% de efectividad para desbloquear el modo experto.</p>
                </div>
                <div className="flex -space-x-4">
                    {[1,2,3,4].map(i => (
                        <div key={i} className="w-12 h-12 rounded-full border-2 border-background bg-slate-800 flex items-center justify-center text-xl shadow-xl">
                            {['🥇', '🌟', '🔥', '🚀'][i-1]}
                        </div>
                    ))}
                </div>
             </div>
        </motion.div>
      )}
    </section>
  );
};

export default DashboardModule;
