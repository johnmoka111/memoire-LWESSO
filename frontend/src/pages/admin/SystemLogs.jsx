import React, { useEffect, useState } from 'react';
import { Activity, ChevronLeft, ChevronRight, Clock, Search, ShieldAlert } from 'lucide-react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import { API_URL } from '../../config';

const SystemLogs = () => {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 30, total: 0, total_pages: 1 });
  const fetchLogs = async (page = pagination.page, query = search) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/admin/system-logs`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }, params: { page, limit: pagination.limit, search: query } });
      setLogs(response.data?.data?.items || []);
      setPagination(response.data?.data?.pagination || { page: 1, limit: 30, total: 0, total_pages: 1 });
    } finally { setLoading(false); }
  };
  useEffect(() => { const timer = setTimeout(() => fetchLogs(1, search), search ? 350 : 0); return () => clearTimeout(timer); }, [search]);
  const date = (value) => value ? new Date(value.replace(' ', 'T')).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }) : '—';

  return <div className="flex min-h-screen bg-slate-100 text-slate-900 dark:bg-[#05070C] dark:text-slate-100"><Sidebar /><div className="flex min-w-0 flex-1 flex-col"><Navbar /><main className="mx-auto w-full max-w-7xl space-y-7 p-4 pt-24 md:p-8 md:pt-28">
    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-blue-700 dark:border-blue-900/70 dark:bg-blue-950/50 dark:text-blue-300"><ShieldAlert size={13} /> Audit administrateur</div><h1 className="mt-3 text-3xl font-black tracking-tight dark:text-white">Journaux système</h1><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Action, responsable, heure, adresse IP et appareil.</p></div><div className="relative w-full sm:w-80"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher une activité…" className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 dark:border-white/10 dark:bg-white/5 dark:text-white" /></div></div>
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#0B101D]"><div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3 dark:border-white/10 dark:bg-white/[0.03]"><span className="text-xs font-bold text-slate-600 dark:text-slate-300">{pagination.total} événement(s) actifs · archivage JSON après 30 jours</span><Activity size={17} className="text-blue-500" /></div>
      {loading ? <div className="h-64 animate-pulse bg-slate-50 dark:bg-white/[0.03]" /> : logs.length === 0 ? <div className="p-16 text-center text-sm text-slate-500 dark:text-slate-400">Aucune activité trouvée.</div> : <div>{logs.map((log) => <article key={log.id} className="flex gap-4 border-b border-slate-100 px-5 py-4 last:border-0 dark:border-white/[0.06]"><div className="mt-0.5 h-fit rounded-xl bg-blue-50 p-2 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400"><Activity size={16} /></div><div className="min-w-0 flex-1"><p className="text-sm font-bold text-slate-800 dark:text-white">{log.description}</p><p className="mt-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300">Par : {log.prenom || log.nom ? `${log.prenom || ''} ${log.nom || ''}`.trim() : 'Système'}{log.email ? ` (${log.email})` : ''}</p><p className="mt-1 break-all text-[11px] text-slate-500 dark:text-slate-400">IP : {log.ip_address || 'inconnue'} · Appareil : {log.device || 'non identifié'} · {log.method || 'SYSTEM'} {log.route || ''}</p></div><time className="hidden items-center gap-1 whitespace-nowrap text-[11px] text-slate-500 dark:text-slate-400 sm:flex"><Clock size={13} />{date(log.created_at)}</time></article>)}</div>}
      <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-5 py-3 dark:border-white/10 dark:bg-white/[0.03]"><span className="text-xs text-slate-500 dark:text-slate-400">Page {pagination.page} / {pagination.total_pages}</span><div className="flex gap-2"><button disabled={pagination.page <= 1} onClick={() => fetchLogs(pagination.page - 1)} className="rounded-lg border border-slate-200 p-2 disabled:opacity-40 dark:border-white/10"><ChevronLeft size={16} /></button><button disabled={pagination.page >= pagination.total_pages} onClick={() => fetchLogs(pagination.page + 1)} className="rounded-lg border border-slate-200 p-2 disabled:opacity-40 dark:border-white/10"><ChevronRight size={16} /></button></div></div>
    </section></main></div></div>;
};

export default SystemLogs;
