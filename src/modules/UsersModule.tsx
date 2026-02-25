import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { AppUser } from '../types';

interface UsersModuleProps {
  canManage: boolean;
  users: AppUser[];
  loading: boolean;
  error: string;
  onRefresh: () => Promise<void>;
  currentUserEmail: string;
}

const buildForm = () => ({
  id: null as string | null,
  full_name: '',
  email: '',
  cedula: '',
  role: 'jugador' as 'admin' | 'jugador',
});

const UsersModule: React.FC<UsersModuleProps> = ({ 
  canManage, 
  users, 
  loading, 
  error, 
  onRefresh, 
  currentUserEmail 
}) => {
  const [form, setForm] = useState(buildForm());
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const isEditing = useMemo(() => form.id !== null, [form.id]);

  const resetForm = () => {
    setForm(buildForm());
    setFormError('');
    setShowForm(false);
  };

  const onChange = (field: keyof ReturnType<typeof buildForm>, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const fillForEdit = (item: AppUser) => {
    setForm({
      id: item.id,
      full_name: item.full_name || '',
      email: item.email || '',
      cedula: item.cedula || '',
      role: item.role || 'jugador',
    });
    setFormError('');
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submitForm = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canManage) return;

    const email = form.email.trim().toLowerCase();
    const fullName = form.full_name.trim();
    const cedula = form.cedula.trim();

    if (!fullName || !email || !cedula || !form.role) {
      setFormError('Completa todos los campos para continuar.');
      return;
    }

    setSaving(true);
    setFormError('');

    const payload = {
      full_name: fullName,
      email,
      cedula,
      role: form.role,
    };

    try {
      const query = isEditing
        ? supabase.from('app_users').update(payload).eq('id', form.id)
        : supabase.from('app_users').insert(payload);

      const { error: dbError } = await query;
      if (dbError) throw dbError;

      resetForm();
      await onRefresh();
    } catch (err: any) {
      setFormError(err.message || 'Error al guardar el usuario.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: AppUser) => {
    if (!canManage) return;
    if (item.email.toLowerCase() === currentUserEmail.toLowerCase()) {
      setFormError('No puedes eliminar tu propia cuenta administrativa.');
      return;
    }

    if (!window.confirm(`¿Seguro que deseas eliminar a ${item.full_name}?`)) return;

    try {
      const { error: delError } = await supabase.from('app_users').delete().eq('id', item.id);
      if (delError) throw delError;
      await onRefresh();
    } catch (err: any) {
      setFormError(err.message || 'Error al eliminar usuario.');
    }
  };

  if (!canManage) {
    return (
      <section className="glass-card p-10 text-center">
        <span className="text-4xl mb-4 block">🚫</span>
        <h2 className="text-2xl font-black text-white italic">ACCESO DENEGADO</h2>
        <p className="text-white/40 mt-2">No tienes los privilegios necesarios para administrar el directorio.</p>
      </section>
    );
  }

  return (
    <section className="space-y-10 py-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-3 h-3 rounded-full bg-secondary shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Directory Management</p>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter italic">
            Control de <span className="text-secondary">Usuarios</span>
          </h2>
          <p className="text-white/40 mt-4 text-lg font-medium max-w-xl">
            Gestiona los perfiles de los conductores y asigna roles administrativos.
          </p>
        </div>
        
        <button
          onClick={() => setShowForm(!showForm)}
          className={`px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all ${
            showForm ? 'bg-white/10 text-white' : 'bg-secondary text-white shadow-xl shadow-secondary/20 hover:scale-105'
          }`}

          style={{
            border: '2px solid white',
          }}
        >
          {showForm ? 'Cerrar Formulario' : 'Añadir Usuario'}
        </button>
      </header>

      {/* Info Alert about Auth vs DB */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 glass border-primary/20 bg-primary/5 rounded-3xl flex items-start space-x-4"
      >
        <span className="text-2xl">💡</span>
        <div className="text-sm">
            <p className="text-primary font-black uppercase tracking-widest mb-1">Nota importante para el administrador</p>
            <p className="text-white/60 font-medium">
                Al crear un usuario aquí, se añade a la base de datos de gestión, pero el usuario <strong>aún debe registrarse (Sign Up)</strong> en la pantalla inicial con el mismo correo y cédula para activar su acceso.
            </p>
        </div>
      </motion.div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={submitForm} className="glass-card p-8 md:p-12 space-y-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-[80px] pointer-events-none" />
               
               <h3 className="text-2xl font-black text-white italic flex items-center space-x-3 uppercase tracking-tight">
                  <span className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center text-secondary text-sm">
                    {isEditing ? '✎' : '+'}
                  </span>
                  <span>{isEditing ? 'Editar Perfil' : 'Nuevo Conductor'}</span>
               </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/30 px-1">Nombre Completo</label>
                  <input
                    value={form.full_name}
                    onChange={(e) => onChange('full_name', e.target.value)}
                    className="w-full px-5 py-4 rounded-2xl bg-slate-900/60 text-white border border-white/10 focus:border-secondary/50 focus:ring-4 focus:ring-secondary/10 outline-none transition-all font-medium"
                    placeholder="Ej. Juan Manuel Santos"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/30 px-1">Correo Institucional</label>
                  <input
                    value={form.email}
                    onChange={(e) => onChange('email', e.target.value)}
                    className="w-full px-5 py-4 rounded-2xl bg-slate-900/60 text-white border border-white/10 focus:border-secondary/50 focus:ring-4 focus:ring-secondary/10 outline-none transition-all font-medium"
                    placeholder="email@dominio.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/30 px-1">Cédula de Ciudadanía</label>
                  <input
                    value={form.cedula}
                    onChange={(e) => onChange('cedula', e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full px-5 py-4 rounded-2xl bg-slate-900/60 text-white border border-white/10 focus:border-secondary/50 focus:ring-4 focus:ring-secondary/10 outline-none transition-all font-medium"
                    placeholder="Sin puntos ni comas"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/30 px-1">Nivel de Acceso</label>
                  <select
                    value={form.role}
                    onChange={(e) => onChange('role', e.target.value as 'admin' | 'jugador')}
                    className="w-full px-5 py-4 rounded-2xl bg-slate-900/60 text-white border border-white/10 focus:border-secondary/50 focus:ring-4 focus:ring-secondary/10 outline-none transition-all font-black uppercase text-sm tracking-widest cursor-pointer"
                  >
                    <option value="jugador">Conductor (Jugador)</option>
                    <option value="admin">Administrador (Admin)</option>
                  </select>
                </div>
              </div>

              {(formError || error) && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 bg-danger/10 border border-danger/30 rounded-2xl text-danger text-xs font-bold"
                >
                  ⚠️ {formError || error}
                </motion.div>
              )}

              <div className="flex gap-4 pt-4 border-t border-white/5">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-8 py-5 rounded-2xl bg-white text-black font-black uppercase text-xs tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                >
                  {saving ? 'Procesando...' : isEditing ? 'Actualizar Registro' : 'Confirmar Creación'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-8 py-5 rounded-2xl bg-white/5 text-white/60 font-black uppercase text-xs tracking-[0.2em] border border-white/10 hover:bg-white/10 transition-all"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((item, idx) => {
          const isCurrent = item.email.toLowerCase() === currentUserEmail.toLowerCase();
          const isAdmin = item.role === 'admin';

          return (
            <motion.article 
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="glass p-8 rounded-[2.5rem] border-white/5 relative group hover:bg-white/10 transition-all duration-500"
            >
              <div className="flex justify-between items-start mb-6">
                 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-lg ${isAdmin ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary'}`}>
                    {isAdmin ? '🛡️' : '🚗'}
                 </div>
                 <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${isAdmin ? 'border-primary/30 text-primary bg-primary/5' : 'border-secondary/30 text-secondary bg-secondary/5'}`}>
                    {item.role}
                 </span>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-xl font-black text-white italic tracking-tight truncate">{item.full_name}</h4>
                  <p className="text-white/40 text-xs font-medium truncate">{item.email}</p>
                </div>
                
                <div className="flex items-center space-x-6">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Identificación</p>
                        <p className="text-sm font-bold text-white/80">{item.cedula || 'N/A'}</p>
                    </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={() => fillForEdit(item)}
                  className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(item)}
                  disabled={isCurrent}
                  className="flex-1 py-3 rounded-xl bg-danger/10 hover:bg-danger text-danger hover:text-white text-[10px] font-black uppercase tracking-widest border border-danger/20 transition-all disabled:opacity-30"
                >
                  Eliminar
                </button>
              </div>
              
              {isCurrent && (
                <div className="absolute top-4 right-4 animate-pulse">
                     <span className="w-2 h-2 rounded-full bg-accent block shadow-[0_0_10px_rgba(16,185,129,1)]" />
                </div>
              )}
            </motion.article>
          );
        })}

        {!loading && users.length === 0 && (
          <div className="md:col-span-3 py-20 text-center glass-card">
              <span className="text-5xl mb-4 block">📁</span>
              <p className="text-white/30 font-black uppercase tracking-widest">No se encontraron registros en el directorio.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default UsersModule;
