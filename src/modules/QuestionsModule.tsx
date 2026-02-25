import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Question } from '../types';

interface QuestionsModuleProps {
  canManage: boolean;
  questions: Question[];
  loading: boolean;
  error: string;
  onRefresh: () => Promise<void>;
}

const buildForm = (): Partial<Question> & { options: string[] } => ({
  id: undefined,
  category: 'Señales de Tránsito',
  question: '',
  options: ['', '', '', ''],
  correct_answer: '',
});

const QuestionsModule: React.FC<QuestionsModuleProps> = ({ 
  canManage, 
  questions, 
  loading, 
  error, 
  onRefresh 
}) => {
  const [form, setForm] = useState(buildForm());
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const isEditing = useMemo(() => form.id !== undefined, [form.id]);

  const resetForm = () => {
    setForm(buildForm());
    setFormError('');
    setShowForm(false);
  };

  const onChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const onOptionChange = (idx: number, value: string) => {
    const newOptions = [...form.options];
    newOptions[idx] = value;
    setForm((prev) => ({ ...prev, options: newOptions }));
  };

  const fillForEdit = (item: Question) => {
    setForm({
      id: item.id,
      category: item.category,
      question: item.question,
      options: [...item.options],
      correct_answer: item.correct_answer,
    });
    setFormError('');
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submitForm = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canManage) return;

    if (!form.question || !form.category || !form.correct_answer || form.options.some(o => !o)) {
      setFormError('Completa todos los campos y opciones.');
      return;
    }

    setSaving(true);
    setFormError('');

    const payload = {
      category: form.category,
      question: form.question,
      options: form.options,
      correct_answer: form.correct_answer,
    };

    try {
      const query = isEditing
        ? supabase.from('questions').update(payload).eq('id', form.id)
        : supabase.from('questions').insert(payload);

      const { error: dbError } = await query;
      if (dbError) throw dbError;

      resetForm();
      await onRefresh();
    } catch (err: any) {
      setFormError(err.message || 'Error al guardar la pregunta.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!canManage) return;
    if (!window.confirm('¿Deseas eliminar esta pregunta permanentemente?')) return;

    try {
      const { error: delError } = await supabase.from('questions').delete().eq('id', id);
      if (delError) throw delError;
      await onRefresh();
    } catch (err: any) {
      setFormError(err.message || 'Error al eliminar pregunta.');
    }
  };

  if (!canManage) {
     return (
        <section className="glass-card p-10 text-center">
          <span className="text-4xl mb-4 block">🔒</span>
          <h2 className="text-2xl font-black text-white italic">MÓDULO RESTRINGIDO</h2>
          <p className="text-white/40 mt-2">Solo los administradores pueden gestionar el banco de preguntas.</p>
        </section>
      );
  }

  return (
    <section className="space-y-10 py-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Knowledge Base</p>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter italic">
            Banco de <span className="text-primary">Preguntas</span>
          </h2>
          <p className="text-white/40 mt-4 text-lg font-medium max-w-xl">
            Crea, edita y organiza el contenido oficial para los exámenes de tránsito.
          </p>
        </div>
        
        <button
          onClick={() => setShowForm(!showForm)}
          className={`px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all ${
            showForm ? 'bg-white/10 text-white' : 'bg-primary text-black shadow-xl shadow-primary/20 hover:scale-105'
          }`}
        >
          {showForm ? 'Cerrar Editor' : 'Nueva Pregunta'}
        </button>
      </header>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={submitForm} className="glass-card p-8 md:p-12 space-y-10 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/30 px-1">Categoría</label>
                      <select
                        value={form.category}
                        onChange={(e) => onChange('category', e.target.value)}
                        className="w-full px-5 py-4 rounded-2xl bg-slate-900/60 text-white border border-white/10 focus:border-primary/50 outline-none transition-all font-black uppercase text-xs tracking-widest cursor-pointer"
                      >
                        <option value="Señales de Tránsito">🛑 Señales de Tránsito</option>
                        <option value="Normas de Tránsito">🛣️ Normas de Tránsito</option>
                        <option value="Infracciones y Sanciones">📝 Infracciones y Sanciones</option>
                        <option value="Mecánica y Seguridad">🔧 Mecánica y Seguridad</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/30 px-1">Enunciado de la Pregunta</label>
                      <textarea
                        value={form.question}
                        onChange={(e) => onChange('question', e.target.value)}
                        rows={4}
                        className="w-full px-5 py-4 rounded-2xl bg-slate-900/60 text-white border border-white/10 focus:border-primary/50 outline-none transition-all font-medium resize-none"
                        placeholder="Escribe aquí la pregunta..."
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 px-1">Opciones de Respuesta</label>
                    <div className="space-y-4">
                      {form.options.map((opt, idx) => (
                        <div key={idx} className="flex items-center space-x-3">
                          <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-black text-white/30">{String.fromCharCode(65 + idx)}</span>
                          <input
                            value={opt}
                            onChange={(e) => onOptionChange(idx, e.target.value)}
                            className="flex-1 px-4 py-3 rounded-xl bg-white/5 text-white border border-white/5 focus:border-primary/30 outline-none transition-all text-sm font-medium"
                            placeholder={`Opción ${idx + 1}`}
                          />
                          <input 
                            type="radio" 
                            name="correct_answer"
                            checked={form.correct_answer === opt && opt !== ''}
                            onChange={() => onChange('correct_answer', opt)}
                            className="w-5 h-5 accent-primary cursor-pointer"
                          />
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-primary font-black uppercase tracking-widest text-right italic">Selecciona la respuesta correcta con el radio botón</p>
                  </div>
               </div>

              {(formError || error) && (
                <div className="p-4 bg-danger/10 border border-danger/30 rounded-2xl text-danger text-xs font-bold">
                  ⚠️ {formError || error}
                </div>
              )}

              <div className="flex gap-4 pt-6 border-t border-white/5">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-8 py-5 rounded-2xl bg-primary text-black font-black uppercase text-xs tracking-[0.2em] transition-all hover:scale-[1.02] disabled:opacity-50"
                >
                  {saving ? 'Guardando...' : isEditing ? 'Actualizar Pregunta' : 'Publicar Pregunta'}
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

      <div className="space-y-4">
        {questions.map((item, idx) => (
          <motion.article 
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.02 }}
            className="glass p-6 md:p-8 rounded-[2rem] border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-white/5 transition-all group"
          >
            <div className="flex-1 space-y-4">
              <div className="flex items-center space-x-3">
                <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-black uppercase tracking-widest text-primary border border-primary/10">
                  {item.category}
                </span>
                <span className="text-[10px] font-bold text-white/20 uppercase">ID: #{item.id}</span>
              </div>
              <h4 className="text-xl font-black text-white italic tracking-tight">{item.question}</h4>
              <div className="flex flex-wrap gap-2">
                {item.options.map((opt, i) => (
                  <span key={i} className={`text-[10px] px-3 py-1 rounded-lg border ${opt === item.correct_answer ? 'border-accent text-accent bg-accent/5' : 'border-white/5 text-white/30'}`}>
                    {String.fromCharCode(65 + i)}) {opt}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex md:flex-col gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => fillForEdit(item)}
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 transition-all text-xs"
                title="Editar"
              >
                ✎
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-3 rounded-xl bg-danger/10 hover:bg-danger text-danger border border-danger/20 transition-all text-xs"
                title="Eliminar"
              >
                🗑
              </button>
            </div>
          </motion.article>
        ))}

        {!loading && questions.length === 0 && (
          <div className="py-20 text-center glass-card">
              <span className="text-5xl mb-4 block">🛰️</span>
              <p className="text-white/30 font-black uppercase tracking-widest">El banco de preguntas está vacío.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default QuestionsModule;
