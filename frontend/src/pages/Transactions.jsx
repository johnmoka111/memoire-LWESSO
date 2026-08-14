import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Search, Filter, ArrowUpRight, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { API_URL } from '../config';

const Transactions = () => {
  const [txs, setTxs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`${API_URL}/transactions`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setTxs(res.data.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);


  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-[#05070C] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-4 md:p-10 space-y-10 mb-20 md:mb-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Transactions</h1>
              <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">Historique de vos opérations Escrow</p>
            </div>
            <div className="flex gap-3">
               <button className="p-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 transition-all shadow-sm">
                  <Search size={20} />
               </button>
               <button className="p-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 transition-all shadow-sm">
                  <Filter size={20} />
               </button>
            </div>
          </div>

          <div className="card min-h-[400px]">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin text-primary" size={48} />
              </div>
            ) : txs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center opacity-30">
                <Wallet size={64} className="mb-6" />
                <p className="text-sm font-black uppercase tracking-widest">Aucune transaction trouvée</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-white/5">
                      <th className="py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Détails du bien</th>
                      <th className="py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Montant</th>
                      <th className="py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">État</th>
                      <th className="py-6 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {txs.map((tx, i) => (
                      <tr key={i} className="border-b border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                        <td className="py-6">
                          <p className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{tx.property_title || 'N/A'}</p>
                          <p className="text-[10px] text-slate-600 font-mono tracking-tighter mt-1">{tx.tx_creation?.substring(0, 16)}...</p>
                        </td>
                        <td className="py-6">
                          <p className="font-black text-slate-900 dark:text-white">${parseFloat(tx.montant_usd || 0).toLocaleString()}</p>
                          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{tx.montant_eth} ETH</p>
                        </td>
                        <td className="py-6">
                           <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                             tx.etat === 'libere' ? 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5' : 
                             tx.etat === 'cree' ? 'border-amber-500/20 text-amber-500 bg-amber-500/5' : 
                             'border-slate-200 dark:border-white/10 text-slate-500 bg-white/5'
                           }`}>
                             {tx.etat}
                           </span>
                        </td>
                        <td className="py-6 text-right">
                          <p className="text-xs font-bold text-slate-400">
                            {new Date(tx.created_at).toLocaleDateString('fr-FR')}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Transactions;
