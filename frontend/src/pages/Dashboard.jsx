import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet, 
  ShieldCheck, 
  Clock, 
  ArrowUpRight, 
  Plus, 
  ExternalLink,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { API_URL } from '../config';

const StatCard = ({ label, value, icon: Icon, color }) => (
  <div className="card relative overflow-hidden group">
    <div className="flex justify-between items-start relative z-10">
      <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center mb-6`}>
        <Icon size={24} />
      </div>
    </div>
    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">{label}</p>
    <h3 className="text-3xl font-black text-white">{value}</h3>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({ transactions: [], properties: [], balance: 0 });
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [transactionsRes, propertiesRes] = await Promise.all([
          axios.get(`${API_URL}/transactions`),
          axios.get(`${API_URL}/properties`)
        ]);
        
        const myProps = propertiesRes.data.data?.filter(p => p.owner_id === user.id) || [];
        const myTxs = transactionsRes.data.data || [];
        
        // Calculer le solde escrow réel
        const totalEscrow = myTxs.reduce((acc, tx) => acc + (tx.etat === 'cree' ? parseFloat(tx.montant_usd || 0) : 0), 0);

        setStats({
          transactions: myTxs,
          properties: myProps,
          balance: totalEscrow
        });
      } catch (err) {
        console.error("Erreur lors du chargement des données", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.id]);

  return (
    <div className="flex min-h-screen bg-dark">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Navbar />
        
        <main className="p-4 md:p-10 space-y-10 mb-20 md:mb-0">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Tableau de bord</h1>
              <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">Bienvenue, {user.prenom} {user.nom}</p>
            </div>
            {(user.role === 'proprietaire' || user.role === 'admin') && (
              <Link to="/properties/create" className="btn-primary flex items-center justify-center gap-3">
                <Plus size={20} /> Nouvelle Annonce
              </Link>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="animate-spin text-primary" size={48} />
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard 
                  label="Solde Escrow Actif" 
                  value={`${stats.balance.toLocaleString()} $`} 
                  icon={Wallet} 
                  color="bg-primary/10 text-primary" 
                />
                <StatCard 
                  label="Propriétés Listées" 
                  value={stats.properties.length} 
                  icon={ShieldCheck} 
                  color="bg-emerald-500/10 text-emerald-500" 
                />
                <StatCard 
                  label="Transactions Récentes" 
                  value={stats.transactions.length} 
                  icon={Clock} 
                  color="bg-blue-500/10 text-blue-500" 
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity Table */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="card h-full">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-xl font-bold">Activités Récentes</h3>
                      {stats.transactions.length > 0 && (
                        <Link to="/transactions" className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Voir tout</Link>
                      )}
                    </div>
                    
                    {stats.transactions.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-20 text-center opacity-30">
                        <AlertCircle size={48} className="mb-4" />
                        <p className="text-sm font-bold uppercase tracking-widest">Aucune activité enregistrée</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {stats.transactions.slice(0, 5).map((tx, i) => (
                          <div key={i} className="flex items-center justify-between group p-4 rounded-xl hover:bg-white/5 transition-all">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-primary transition-colors">
                                <ArrowUpRight size={20} />
                              </div>
                              <div>
                                <p className="font-bold text-white text-sm">{tx.property_title || 'Transaction Escrow'}</p>
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                                  {new Date(tx.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-black text-white text-sm">${parseFloat(tx.montant_usd || 0).toLocaleString()}</p>
                              <span className={`text-[9px] font-black uppercase tracking-[0.15em] ${tx.etat === 'libere' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                {tx.etat}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* KivuMarket+ Card (Blockchain Identity) */}
                <div className="space-y-6">
                  <div className="card bg-primary/5 border-primary/20 relative overflow-hidden h-full flex flex-col justify-between p-8">
                    {/* Background Logo Watermark */}
                    <img src="/assets/logo.png" alt="Logo" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 opacity-[0.03] pointer-events-none" />
                    
                    <div>
                      <div className="flex justify-between items-start mb-12">
                        <img src="/assets/logo.png" alt="Logo" className="w-10 h-10 object-contain opacity-50" />
                        <div className="px-3 py-1 bg-primary/20 rounded-full border border-primary/30 text-[9px] font-black text-primary uppercase tracking-widest">
                          Kivu Card
                        </div>
                      </div>
                      
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Identifiant Blockchain</p>
                      <h4 className="text-lg font-bold text-white mb-8 font-mono tracking-widest">
                        {user.wallet_address ? `${user.wallet_address.substring(0, 6)}...${user.wallet_address.substring(38)}` : 'NON CONNECTÉ'}
                      </h4>
                    </div>

                    <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${user.wallet_address ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Réseau GoChain</span>
                      </div>
                      <ExternalLink size={14} className="text-slate-500" />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
