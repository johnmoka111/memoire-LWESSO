import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet,
  ShieldCheck,
  Clock,
  ArrowUpRight,
  Plus,
  ExternalLink,
  AlertCircle,
  Loader2,
  Building2,
  Activity,
  ChevronRight,
  TrendingUp,
  CheckCircle,
  XCircle,
  Calendar,
  Users,
  DollarSign,
  BarChart3,
  Sparkles,
  ClipboardCheck,
  ListChecks,
  CheckCheck,
  MapPin
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { API_URL } from '../config';

// StatCard sous le thème Bleu de Nuit & Noir
const StatCard = ({ label, value, icon: Icon, color, subValue, trend, trendValue }) => (
  <motion.div
    whileHover={{ y: -4, transition: { duration: 0.2 } }}
    className="relative group bg-[#0B101D] border border-slate-800/80 rounded-2xl p-6 overflow-hidden transition-all hover:border-slate-700 hover:shadow-2xl shadow-lg"
  >
    <div className="relative z-10">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center border border-white/5`}>
          <Icon size={20} />
        </div>
        {trend && (
          <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-full">
            <TrendingUp size={10} className="text-emerald-400" />
            <span className="text-[9px] font-bold text-emerald-400">{trendValue}</span>
          </div>
        )}
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 mb-1">{label}</p>
      <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">{value}</h3>
      {subValue && <p className="text-[10px] font-medium text-slate-500 mt-2">{subValue}</p>}
    </div>
  </motion.div>
);

const QuickAction = ({ to, icon: Icon, label, description, tone = 'blue' }) => {
  const tones = {
    blue: 'border-slate-800 hover:border-blue-700/50 hover:bg-blue-950/30 text-blue-400',
    emerald: 'border-slate-800 hover:border-emerald-700/50 hover:bg-emerald-950/30 text-emerald-400',
    amber: 'border-slate-800 hover:border-amber-700/50 hover:bg-amber-950/30 text-amber-400'
  };

  return (
    <Link to={to} className={`group flex items-center gap-3 rounded-xl border bg-[#080B14] p-3.5 transition-all ${tones[tone]}`}>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 transition-transform group-hover:scale-105"><Icon size={16} /></span>
      <span className="min-w-0 flex-1"><span className="block text-xs font-bold text-white">{label}</span><span className="block truncate text-[10px] text-slate-500">{description}</span></span>
      <ChevronRight size={15} className="text-slate-600 transition-transform group-hover:translate-x-1" />
    </Link>
  );
};

const TransactionItem = ({ tx, index }) => {
  const isLibere = tx.etat === 'libere';
  const date = new Date(tx.created_at);
  const formattedDate = date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-[#080C16] border border-slate-800/60 hover:border-slate-700 transition-all group"
    >
      <div className="flex items-center gap-3.5 mb-3 sm:mb-0">
        <div className="w-9 h-9 rounded-lg bg-blue-950/60 border border-blue-800/40 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
          <ArrowUpRight size={17} />
        </div>
        <div>
          <p className="font-bold text-white text-xs tracking-tight">{tx.property_title || 'Transaction immobilière'}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <Calendar size={10} className="text-slate-500" />
            <p className="text-[9px] text-slate-500 uppercase tracking-wider font-medium">{formattedDate}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between sm:justify-end gap-5">
        <div className="text-right">
          <p className="font-bold text-white text-sm">${parseFloat(tx.montant_usd || 0).toLocaleString()}</p>
          <span className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${isLibere ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
            {isLibere ? 'Libéré' : 'En séquestre'}
          </span>
        </div>
        <ChevronRight size={15} className="text-slate-600 group-hover:text-blue-400 transition-colors" />
      </div>
    </motion.div>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState({ transactions: [], properties: [], balance: 0, total_properties: 0, total_agents: 0 });
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user.role?.toLowerCase().trim();
  const isAdmin = ['admin', 'superadmin', 'administrateur'].includes(role);
  const isAgent = role === 'agent';

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Bon matin');
    else if (hour < 18) setGreeting('Bon après-midi');
    else setGreeting('Bonsoir');

    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [statsRes, activityRes] = await Promise.all([
          axios.get(`${API_URL}/dashboard/stats`, config),
          isAdmin
            ? axios.get(`${API_URL}/properties`, config)
            : isAgent
              ? axios.get(`${API_URL}/agent/missions`, config) 
              : axios.get(`${API_URL}/transactions`, config)
        ]);

        setStats({
          ...statsRes.data.data,
          transactions: activityRes.data.data || [],
          balance: statsRes.data.data?.active_escrow || 0,
          total_properties: statsRes.data.data?.total_properties || 0,
          total_agents: statsRes.data.data?.total_agents || 0
        });
      } catch (err) {
        console.error("Erreur chargement dashboard", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAdmin, isAgent]);

  const transactionsList = Array.isArray(stats.transactions) ? stats.transactions : [];
  const pendingTransactions = transactionsList.filter(tx => tx?.etat !== 'libere').length;
  const totalVolume = transactionsList.reduce((sum, tx) => sum + parseFloat(tx?.montant_usd || tx?.prix || 0), 0);
  const recentTransactions = transactionsList.slice(0, 5);
  const pendingItems = transactionsList.filter(item => ['en_attente', 'pending', 'a_valider'].includes(item?.statut?.toLowerCase())).length;
  const completedMissions = transactionsList.filter(item => ['valide', 'termine', 'completed'].includes(item?.statut?.toLowerCase())).length;
  const missionProgress = transactionsList.length ? Math.round((completedMissions / transactionsList.length) * 100) : 0;

  const canCreateProperty = user.role === 'proprietaire' || isAdmin;
  const dashboardLabel = isAdmin ? 'Centre de pilotage' : isAgent ? 'Espace terrain' : 'Tableau de bord';
  const dashboardSubtitle = isAdmin
    ? 'Suivez le catalogue, les validations et votre réseau d’agents.'
    : isAgent
      ? 'Organisez vos visites et avancez sur vos missions prioritaires.'
      : 'Gardez une vue claire sur votre activité immobilière.';

  return (
    <div className="flex min-h-screen bg-[#05070C] text-slate-100 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <Navbar />

        <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* Header Bleu de Nuit & Noir */}
          <div className="relative overflow-hidden rounded-2xl bg-[#090E1A] border border-slate-800/80 p-6 md:p-8 shadow-xl">
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-950/70 border border-blue-800/60 rounded-full text-[10px] font-black uppercase tracking-widest text-blue-300">
                  <Sparkles size={12} className="text-blue-400" />
                  <span>{dashboardLabel}</span>
                </div>
                <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight">
                  {greeting}, <span className="text-blue-400">{user.prenom || 'Invité'}</span>
                </h1>
                <p className="text-slate-400 text-xs md:text-sm flex items-center gap-2"><Activity size={13} className="text-slate-500" />{dashboardSubtitle}</p>
              </div>

              {isAgent ? (
                <Link to="/agent/missions" className="px-5 py-3 bg-blue-900/60 hover:bg-blue-900/80 border border-blue-700/50 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 whitespace-nowrap">
                  <ClipboardCheck size={16} /> Voir mes missions
                </Link>
              ) : canCreateProperty && (
                <Link
                  to="/properties/create"
                  className="px-5 py-3 bg-gradient-to-r from-blue-700 to-slate-800 hover:from-blue-600 hover:to-slate-700 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <Plus size={16} /> Nouvelle annonce
                </Link>
              )}
            </div>
          </div>

          {/* Cartes statistiques en Bleu de Nuit & Noir */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-[#0B101D] rounded-2xl animate-pulse border border-slate-800" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                label={isAdmin ? 'Validations à traiter' : isAgent ? 'Missions assignées' : 'Actifs en séquestre'}
                value={isAdmin ? pendingItems : isAgent ? transactionsList.length : `${parseFloat(stats.balance).toLocaleString()} $`}
                icon={isAdmin ? ClipboardCheck : isAgent ? ListChecks : Wallet}
                color="bg-blue-950/60 text-blue-400"
                subValue={isAdmin ? 'Demandent votre attention' : isAgent ? 'Dossiers à suivre' : 'USD verrouillés'}
                trend={(isAdmin && pendingItems > 0) || (isAgent && missionProgress > 0)}
                trendValue={isAgent ? `${missionProgress}% finalisées` : `${pendingItems} à revoir`}
              />
              <StatCard
                label={isAdmin ? "Réseau d’agents" : isAgent ? "Missions terminées" : "Propriétés"}
                value={isAdmin ? (stats.total_agents || 0) : isAgent ? completedMissions : stats.total_properties}
                icon={isAdmin ? Users : isAgent ? CheckCheck : Building2}
                color="bg-emerald-950/60 text-emerald-400"
                subValue={isAdmin ? "Collaborateurs enregistrés" : isAgent ? "Expertises validées" : "Total catalogue"}
              />
              <StatCard
                label={isAdmin ? "Catalogue" : isAgent ? "À planifier" : "Transactions"}
                value={isAdmin ? stats.total_properties : isAgent ? Math.max(transactionsList.length - completedMissions, 0) : stats.transactions.length}
                icon={isAdmin ? Building2 : isAgent ? Calendar : Activity}
                color="bg-slate-900 text-slate-300"
                subValue={isAdmin ? "Biens référencés" : isAgent ? "Interventions restantes" : "Dont pending"}
                trend={!isAdmin && !isAgent && pendingTransactions > 0}
                trendValue={`${pendingTransactions} en attente`}
              />
              <StatCard
                label="Volume total"
                value={`${totalVolume.toLocaleString()} $`}
                icon={DollarSign}
                color="bg-purple-950/60 text-purple-400"
                subValue="Cumulé"
              />
            </div>
          )}

          {/* Section principale : Activités récentes + Clé Blockchain */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-[#0B101D] border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border-b border-slate-800/80 bg-[#080C16]">
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {isAdmin ? 'Vue opérationnelle' : isAgent ? 'Prochaines missions' : 'Activité récente'}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {isAdmin ? 'Les biens les plus récents du catalogue' : isAgent ? 'Vos expertises terrain à traiter en priorité' : 'Dernières transactions immobilières'}
                    </p>
                  </div>
                  <Link 
                    to={isAdmin ? "/properties" : isAgent ? "/agent/missions" : "/transactions"}
                    className="mt-2 sm:mt-0 inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Voir tout <ChevronRight size={14} />
                  </Link>
                </div>

                <div className="p-5">
                  {recentTransactions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="w-16 h-16 bg-white/[0.02] rounded-full flex items-center justify-center mb-3">
                        <AlertCircle size={26} className="text-slate-600" />
                      </div>
                      <p className="text-xs font-semibold text-slate-400">
                        {isAgent ? 'Aucune mission en attente' : isAdmin ? 'Aucun bien récent' : 'Aucune transaction récente'}
                      </p>
                      <p className="text-[10px] text-slate-600 uppercase tracking-wider mt-1">Le flux est vide</p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {recentTransactions.map((item, idx) => {
                        if (isAgent || isAdmin) {
                          const isMission = isAgent;
                          return (
                            <motion.div
                              key={item.id || idx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.04 }}
                              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-[#080C16] border border-slate-800/60 hover:border-slate-700 transition-all group"
                            >
                              <div className="flex items-center gap-3.5">
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isMission ? 'bg-blue-950/60 text-blue-400 border border-blue-800/40' : 'bg-slate-900 text-slate-300 border border-slate-700'}`}>
                                  {isMission ? <ShieldCheck size={17} /> : <Building2 size={17} />}
                                </div>
                                <div>
                                  <p className="font-bold text-white text-xs tracking-tight">{item.titre}</p>
                                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">{item.quartier}, {item.commune}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-5 mt-3 sm:mt-0">
                                <div className="text-right">
                                  <p className="font-bold text-white text-sm">${parseFloat(item.prix || 0).toLocaleString()}</p>
                                  <span className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                    item.statut === 'valide' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 
                                    item.statut === 'en_attente' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 
                                    'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                  }`}>
                                    {item.statut === 'valide' ? 'Validé' : item.statut === 'en_attente' ? 'À Valider' : 'En cours'}
                                  </span>
                                </div>
                                <Link to={`/properties/${item.id}`} className="p-1.5 hover:bg-white/5 rounded-lg transition-colors">
                                  <ChevronRight size={15} className="text-slate-600 group-hover:text-blue-400" />
                                </Link>
                              </div>
                            </motion.div>
                          );
                        }
                        return <TransactionItem key={item.id || idx} tx={item} index={idx} />;
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar Colonne Droite: Actions & Web3 */}
            <div className="space-y-4">
              {(isAdmin || isAgent) && (
                <div className="rounded-2xl border border-slate-800 bg-[#0B101D] p-5 shadow-xl">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Raccourcis</p>
                      <h3 className="mt-0.5 text-sm font-bold text-white">{isAdmin ? 'Actions de supervision' : 'Mon plan de terrain'}</h3>
                    </div>
                    <div className="rounded-lg bg-white/5 p-2 text-blue-400">{isAdmin ? <BarChart3 size={16} /> : <MapPin size={16} />}</div>
                  </div>
                  <div className="space-y-2">
                    {isAdmin ? <>
                      <QuickAction to="/admin/validations" icon={ClipboardCheck} label="Traiter les validations" description={`${pendingItems} dossier(s) à examiner`} tone="amber" />
                      <QuickAction to="/admin/agents" icon={Users} label="Gérer les agents" description="Ajouter, activer ou suivre l’équipe" tone="emerald" />
                    </> : <>
                      <QuickAction to="/agent/missions" icon={ListChecks} label="Ouvrir mes missions" description={`${Math.max(transactionsList.length - completedMissions, 0)} intervention(s) restante(s)`} tone="blue" />
                      <QuickAction to="/messages" icon={Activity} label="Consulter les messages" description="Restez en lien avec l’équipe" tone="emerald" />
                    </>}
                  </div>
                </div>
              )}

              {/* Clé Blockchain Escrow */}
              <div className="bg-[#0B101D] border border-slate-800/80 rounded-2xl p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-950/60 border border-blue-800/40 flex items-center justify-center text-blue-400">
                    <ShieldCheck size={20} />
                  </div>
                  <span className="bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase text-emerald-400">
                    Escrow Web3
                  </span>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Votre clé publique</p>
                  <code className="text-[11px] font-mono text-slate-300 break-all bg-[#070A12] p-2.5 rounded-xl block border border-slate-800">
                    {user.wallet_address
                      ? `${user.wallet_address.substring(0, 12)}...${user.wallet_address.substring(30)}`
                      : '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'}
                  </code>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-[10px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Hardhat 8545 Localnet</span>
                  </div>
                  <ExternalLink size={13} className="text-slate-500 hover:text-blue-400 cursor-pointer" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
