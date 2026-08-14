import React, { createContext, useContext, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Info, TriangleAlert, X } from 'lucide-react';

const ToastContext = createContext(null);
const meta = {
  success: { icon: CheckCircle2, classes: 'border-emerald-500/25 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/90 dark:text-emerald-100', iconClass: 'text-emerald-500' },
  error: { icon: AlertCircle, classes: 'border-red-500/25 bg-red-50 text-red-900 dark:bg-red-950/90 dark:text-red-100', iconClass: 'text-red-500' },
  warning: { icon: TriangleAlert, classes: 'border-amber-500/25 bg-amber-50 text-amber-900 dark:bg-amber-950/90 dark:text-amber-100', iconClass: 'text-amber-500' },
  info: { icon: Info, classes: 'border-blue-500/25 bg-blue-50 text-blue-900 dark:bg-slate-900 dark:text-white', iconClass: 'text-blue-500' }
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [confirmation, setConfirmation] = useState(null);
  const counter = useRef(0);
  const dismiss = (id) => setToasts((items) => items.filter((item) => item.id !== id));
  const toast = (message, type = 'info') => {
    const id = ++counter.current;
    setToasts((items) => [...items, { id, message, type }]);
    window.setTimeout(() => dismiss(id), 5000);
  };
  const confirm = ({ title = 'Confirmer cette action', message, confirmLabel = 'Confirmer', tone = 'danger' }) => new Promise((resolve) => setConfirmation({ title, message, confirmLabel, tone, resolve }));
  const closeConfirmation = (accepted) => { confirmation?.resolve(accepted); setConfirmation(null); };

  return <ToastContext.Provider value={{ toast, confirm }}>
    {children}
    <div className="fixed right-4 top-4 z-[3000] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3 sm:right-6 sm:top-6"><AnimatePresence>{toasts.map(({ id, message, type }) => { const item = meta[type] || meta.info; const Icon = item.icon; return <motion.div key={id} initial={{ opacity: 0, x: 24, y: -8 }} animate={{ opacity: 1, x: 0, y: 0 }} exit={{ opacity: 0, x: 24 }} className={`flex items-start gap-3 rounded-2xl border p-4 shadow-2xl backdrop-blur-xl ${item.classes}`}><Icon size={19} className={`mt-0.5 shrink-0 ${item.iconClass}`} /><p className="flex-1 text-xs font-semibold leading-relaxed">{message}</p><button onClick={() => dismiss(id)} className="rounded-lg p-1 opacity-60 transition hover:bg-black/5 hover:opacity-100 dark:hover:bg-white/10" aria-label="Fermer"><X size={15} /></button></motion.div>; })}</AnimatePresence></div>
    <AnimatePresence>{confirmation && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[3100] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm"><motion.div initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 12 }} className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-[#0B101D]"><div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-red-500/10 text-red-500"><TriangleAlert size={21} /></div><h2 className="text-lg font-black text-slate-900 dark:text-white">{confirmation.title}</h2><p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{confirmation.message}</p><div className="mt-6 flex justify-end gap-3"><button onClick={() => closeConfirmation(false)} className="rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5">Annuler</button><button onClick={() => closeConfirmation(true)} className={`rounded-xl px-4 py-2.5 text-xs font-bold text-white ${confirmation.tone === 'danger' ? 'bg-red-600 hover:bg-red-500' : 'bg-blue-600 hover:bg-blue-500'}`}>{confirmation.confirmLabel}</button></div></motion.div></motion.div>}</AnimatePresence>
  </ToastContext.Provider>;
};

export const useToast = () => useContext(ToastContext) || { toast: () => {}, confirm: async () => false };
