import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';

const mapAuthError = (error: any) => {
  if (!error) return 'No se pudo completar la autenticación.';

  if (error.code === 'invalid_credentials') {
    return 'Credenciales inválidas. Verifica tu correo y cédula.';
  }

  if (error.code === 'email_not_confirmed') {
    return 'Debes confirmar tu correo antes de iniciar sesión.';
  }

  return error.message || 'No se pudo completar la autenticación.';
};

const Login = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [cedula, setCedula] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const syncProfileIfAuthenticated = async (normalizedEmail: string, normalizedCedula: string, nameFallback: string) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) return;

    const displayName =
      nameFallback || session.user?.user_metadata?.full_name || session.user?.email?.split('@')[0] || 'Jugador';

    const { data: existingUser } = await supabase
      .from('app_users')
      .select('id, role')
      .eq('email', normalizedEmail)
      .maybeSingle();

    const payload = {
      full_name: displayName,
      email: normalizedEmail,
      cedula: normalizedCedula,
      role: existingUser?.role || 'jugador',
    };

    await supabase.from('app_users').upsert(payload, { onConflict: 'email' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedCedula = cedula.trim();

    try {
      if (isRegistering) {
        if (!fullName.trim()) {
          throw new Error('Debes ingresar tu nombre completo.');
        }

        const { data, error: signUpError } = await supabase.auth.signUp({
          email: normalizedEmail,
          password: normalizedCedula,
          options: {
            data: {
              full_name: fullName.trim(),
              cedula: normalizedCedula,
            },
          },
        });

        if (signUpError) throw signUpError;

        await syncProfileIfAuthenticated(normalizedEmail, normalizedCedula, fullName.trim());

        if (!data.session) {
          alert('Registro creado. Revisa tu correo para confirmar tu cuenta.');
        } else {
          alert('¡Bienvenido! Registro exitoso.');
        }

        return;
      }

      // Intentar Login
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password: normalizedCedula,
      });

      // Si falla, intentamos Auto-Activación (Solo si el error es de credenciales)
      if (signInError) {
        if (signInError.code === 'invalid_credentials') {
          // Intentamos registrar al usuario automáticamente
          // Si el usuario existe en app_users (BD) pero no en Auth, esto lo activará
          const { data: autoSignUpData, error: autoSignUpError } = await supabase.auth.signUp({
            email: normalizedEmail,
            password: normalizedCedula,
            options: {
              data: {
                cedula: normalizedCedula,
              },
            },
          });

          // Si el auto-registro funciona, sincronizamos y entramos
          if (!autoSignUpError && autoSignUpData.session) {
             await syncProfileIfAuthenticated(normalizedEmail, normalizedCedula, '');
             return; 
          }
          
          // Si el error de signUp es que el usuario ya existe, entonces la contraseña (cédula) está realmente mal
          if (autoSignUpError?.message?.includes('already registered')) {
            throw signInError;
          }
        }
        throw signInError;
      }

      await syncProfileIfAuthenticated(normalizedEmail, normalizedCedula, '');
    } catch (err: any) {
      setError(mapAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center mb-10"
      >
        <span className="inline-block px-4 py-1 mb-4 rounded-full glass border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-primary">
          {isRegistering ? 'Crear Nuevo Perfil' : 'Acceso Restringido'}
        </span>
        <h1 className="text-5xl md:text-6xl font-black text-white mb-2 tracking-tighter italic">
          TRÁNSITO<span className="text-secondary">QUIZ</span>
        </h1>
        <p className="text-white/40 text-sm font-medium">
          {isRegistering ? 'Únete a la élite de conductores' : 'Inicia sesión para continuar tu entrenamiento'}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-10 relative overflow-hidden group shadow-2xl"
      >
        {/* Animated Light Effect */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 blur-[60px] rounded-full group-hover:bg-primary/30 transition-colors" />

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {error && (
            <motion.div 
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="bg-danger/20 border border-danger/30 rounded-2xl p-4 text-danger text-xs font-bold flex items-center space-x-3"
            >
               <span>⚠️</span> <span>{error}</span>
            </motion.div>
          )}

          {isRegistering && (
            <div>
              <label className="block text-white/50 text-[10px] font-black uppercase tracking-widest mb-2 px-1">Nombre Completo</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-transparent transition-all"
                placeholder="Ej. Juan Pérez"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-white/50 text-[10px] font-black uppercase tracking-widest mb-2 px-1">Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-transparent transition-all"
              placeholder="conductor@ruta.com"
              required
            />
          </div>

          <div>
            <label className="block text-white/50 text-[10px] font-black uppercase tracking-widest mb-2 px-1">Número de Cédula</label>
            <input
              type="text"
              inputMode="numeric"
              value={cedula}
              onChange={(e) => setCedula(e.target.value.replace(/[^0-9]/g, ''))}
              className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-transparent transition-all"
              placeholder="Ingresa tu documento"
              required
              minLength={6}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-secondary text-white font-black rounded-2xl shadow-xl shadow-secondary/20 hover:shadow-secondary/40 transition-all uppercase tracking-widest disabled:opacity-50"
          >
            {loading ? 'Procesando...' : isRegistering ? 'Crear Cuenta' : 'Ingresar'}
          </motion.button>
        </form>

        <div className="mt-8 text-center relative z-10">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-white/30 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors"
          >
            {isRegistering ? '¿Ya tienes una cuenta? Entrar' : '¿No tienes cuenta? Registrarse'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
