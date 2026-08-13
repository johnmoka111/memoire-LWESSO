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
  CheckCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { API_URL } from '../config';

// StatCard améliorée avec dégradés et effets
const StatCard = ({ label, value, icon: Icon, color, subValue, trend, trendValue }) => (
  <motion.div
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
    className="relative group bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur-sm border border-white/10 rounded-2xl p-6 overflow-hidden transition-all hover:border-white/20 hover:shadow-2xl"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
    <div className={`absolute -right-6 -top-6 w-32 h-32 blur-3xl rounded-full ${color.split(' ')[0]} opacity-20 group-hover:opacity-40 transition-opacity`} />

    <div className="relative z-10">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center shadow-lg shadow-black/20`}>
          <Icon size={22} />
        </div>
        {trend && (
          <div className="flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded-full">
            <TrendingUp size={10} className="text-emerald-400" />
            <span className="text-[9px] font-bold text-emerald-400">{trendValue}</span>
          </div>
        )}
      </div>
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-1">{label}</p>
      <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
      {subValue && <p className="text-[10px] font-medium text-slate-500 mt-2">{subValue}</p>}
    </div>
  </motion.div>
);

const QuickAction = ({ to, icon: Icon, label, description, tone = 'primary' }) => {
  const tones = {
    primary: 'border-primary/20 hover:border-primary/50 hover:bg-primary/10 text-primary',
    emerald: 'border-emerald-500/20 hover:border-emerald-500/50 hover:bg-emerald-500/10 text-emerald-400',
    amber: 'border-amber-500/20 hover:border-amber-500/50 hover:bg-amber-500/10 text-amber-400'
  };

  return (
    <Link to={to} className={`group flex items-center gap-3 rounded-2xl border bg-white/[0.02] p-4 transition-all ${tones[tone]}`}>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 transition-transform group-hover:scale-110"><Icon size={18} /></span>
      <span className="min-w-0 flex-1"><span className="block text-sm font-bold text-white">{label}</span><span className="block truncate text-[10px] text-slate-500">{description}</span></span>
      <ChevronRight size={16} className="text-slate-600 transition-transform group-hover:translate-x-1" />
    </Link>
  );
};

// Composant de transaction récente amélioré
const TransactionItem = ({ tx, index }) => {
  const isLibere = tx.etat === 'libere';
  const date = new Date(tx.created_at);
  const formattedDate = date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-primary/20 hover:bg-white/[0.04] transition-all group"
    >
      <div className="flex items-center gap-4 mb-3 sm:mb-0">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-indigo-500/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
          <ArrowUpRight size={18} />
        </div>
        <div>
          <p className="font-bold text-white text-sm tracking-tight">{tx.property_title || 'Transaction immobilière'}</p>
          <div className="flex items-center gap-2 mt-1">
            <Calendar size={10} className="text-slate-500" />
            <p className="text-[9px] text-slate-500 uppercase tracking-wider font-medium">{formattedDate}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between sm:justify-end gap-6">
        <div className="text-right">
          <p className="font-bold text-white text-base">${parseFloat(tx.montant_usd || 0).toLocaleString()}</p>
          <span className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${isLibere ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
            }`}>
            {isLibere ? 'Libéré' : 'En séquestre'}
          </span>
        </div>
        <ChevronRight size={16} className="text-slate-600 group-hover:text-primary transition-colors" />
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
    // Définir le message d'accueil selon l'heure
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

  // Calculs supplémentaires à partir des données existantes
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
    <div className="flex min-h-screen bg-gradient-to-br from-[#0A0A0F] via-[#0F0F1A] to-[#0A0A0F] text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 relative overflow-hidden">
        <Navbar />

        <div className="flex-1 overflow-y-auto overflow-x-auto custom-scrollbar">
          <main className="p-4 md:p-6 lg:p-8 xl:p-10 space-y-10">

            {/* En-tête avec dégradé et message personnalisé */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/15 via-primary/5 to-transparent border border-white/10 p-6 md:p-8">
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-[100px] opacity-40" />
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-primary/30 to-primary/10 rounded-full border border-primary/30 backdrop-blur-sm">
                    <Sparkles size={12} className="text-primary" />
                    <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">{dashboardLabel}</span>
                  </div>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                    {greeting}, <span className="text-primary">{user.prenom || 'Invité'}</span>
                  </h1>
                  <p className="text-slate-400 text-sm flex items-center gap-2"><Activity size={12} />{dashboardSubtitle}</p>
                </div>

                {isAgent ? (
                  <Link to="/agent/missions" className="group px-6 py-3 bg-gradient-to-r from-primary to-indigo-500 hover:from-primary/90 hover:to-indigo-500/90 text-white font-semibold rounded-xl transition-all active:scale-95 shadow-xl shadow-primary/20 flex items-center justify-center gap-2 whitespace-nowrap">
                    <ClipboardCheck size={18} /> Voir mes missions
                  </Link>
                ) : canCreateProperty && (
                  <Link
                    to="/properties/create"
                    className="group px-6 py-3 bg-gradient-to-r from-primary to-indigo-500 hover:from-primary/90 hover:to-indigo-500/90 text-white font-semibold rounded-xl transition-all active:scale-95 shadow-xl shadow-primary/20 flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                    Nouvelle annonce
                  </Link>
                )}
              </div>
            </div>

            {/* Cartes statistiques améliorées */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-36 bg-white/[0.02] rounded-2xl animate-pulse border border-white/5" />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  label={isAdmin ? 'Validations à traiter' : isAgent ? 'Missions assignées' : 'Actifs en séquestre'}
                  value={isAdmin ? pendingItems : isAgent ? transactionsList.length : `${parseFloat(stats.balance).toLocaleString()} $`}
                  icon={isAdmin ? ClipboardCheck : isAgent ? ListChecks : Wallet}
                  color="bg-gradient-to-br from-primary/20 to-indigo-500/20 text-primary"
                  subValue={isAdmin ? 'Demandent votre attention' : isAgent ? 'Dossiers à suivre' : 'USD verrouillés'}
                  trend={(isAdmin && pendingItems > 0) || (isAgent && missionProgress > 0)}
                  trendValue={isAgent ? `${missionProgress}% finalisées` : `${pendingItems} à revoir`}
                />
                <StatCard
                  label={isAdmin ? "Réseau d’agents" : isAgent ? "Missions terminées" : "Propriétés"}
                  value={isAdmin ? (stats.total_agents || 0) : isAgent ? completedMissions : stats.total_properties}
                  icon={isAdmin ? Users : isAgent ? CheckCheck : Building2}
                  color={isAdmin ? "bg-gradient-to-br from-blue-500/20 to-indigo-500/20 text-blue-400" : "bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-400"}
                  subValue={isAdmin ? "Collaborateurs enregistrés" : isAgent ? "Expertises validées" : "Total catalogue"}
                />
                <StatCard
                  label={isAdmin ? "Catalogue" : isAgent ? "À planifier" : "Transactions"}
                  value={isAdmin ? stats.total_properties : isAgent ? Math.max(transactionsList.length - completedMissions, 0) : stats.transactions.length}
                  icon={isAdmin ? Building2 : isAgent ? Calendar : Activity}
                  color="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-blue-400"
                  subValue={isAdmin ? "Biens référencés" : isAgent ? "Interventions restantes" : "Dont pending"}
                  trend={!isAdmin && !isAgent && pendingTransactions > 0}
                  trendValue={`${pendingTransactions} en attente`}
                />
                <StatCard
                  label="Volume total"
                  value={`${totalVolume.toLocaleString()} $`}
                  icon={DollarSign}
                  color="bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-purple-400"
                  subValue="Cumulé"
                />
              </div>
            )}

            {/* Section principale : Transactions récentes + Wallet */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Colonne Transactions - 2/3 */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-gradient-to-br from-white/[0.02] to-transparent border border-white/10 rounded-2xl overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border-b border-white/10 bg-white/[0.02]">
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {isAdmin ? 'Vue opérationnelle' : isAgent ? 'Prochaines missions' : 'Activité récente'}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        {isAdmin ? 'Les biens les plus récents du catalogue' : isAgent ? 'Vos expertises terrain à traiter en priorité' : 'Dernières transactions immobilières'}
                      </p>
                    </div>
                    <Link 
                      to={isAdmin ? "/properties" : isAgent ? "/agent/missions" : "/transactions"}
                      className="mt-3 sm:mt-0 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      Voir tout <ChevronRight size={16} />
                    </Link>
                  </div>

                  <div className="p-6">
                    {recentTransactions.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-20 h-20 bg-white/[0.02] rounded-full flex items-center justify-center mb-4">
                          <AlertCircle size={32} className="text-slate-600" />
                        </div>
                        <p className="text-sm font-semibold text-slate-400">
                          {isAgent ? 'Aucune mission en attente' : isAdmin ? 'Aucun bien récent' : 'Aucune transaction récente'}
                        </p>
                        <p className="text-[10px] text-slate-600 uppercase tracking-wider mt-1">Le flux est actuellement vide</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {recentTransactions.map((item, idx) => {
                          if (isAgent || isAdmin) {
                            // Rendu spécifique pour une mission ou une propriété admin
                            const isMission = isAgent;
                            return (
                              <motion.div
                                key={item.id || idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-primary/20 hover:bg-white/[0.04] transition-all group"
                              >
                                <div className="flex items-center gap-4">
                                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform ${isMission ? 'bg-primary/20 text-primary' : 'bg-blue-500/20 text-blue-400'}`}>
                                    {isMission ? <ShieldCheck size={18} /> : <Building2 size={18} />}
                                  </div>
                                  <div>
                                    <p className="font-bold text-white text-sm tracking-tight">{item.titre}</p>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">{item.quartier}, {item.commune}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-6 mt-3 sm:mt-0">
                                  <div className="text-right">
                                    <p className="font-bold text-white text-base">${parseFloat(item.prix || 0).toLocaleString()}</p>
                                    <span className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                      item.statut === 'valide' ? 'bg-emerald-500/20 text-emerald-400' : 
                                      item.statut === 'en_attente' ? 'bg-amber-500/20 text-amber-400' : 
                                      'bg-primary/20 text-primary'
                                    }`}>
                                      {item.statut === 'valide' ? 'Validé' : item.statut === 'en_attente' ? 'À Valider' : 'En cours'}
                                    </span>
                                  </div>
                                  <Link to={`/properties/${item.id}`} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                                    <ChevronRight size={16} className="text-slate-600 group-hover:text-primary" />
                                  </Link>
                                </div>
                              </motion.div>
                            );
                          }
                          // Rendu classique pour transaction
                          return <TransactionItem key={item.id || idx} tx={item} index={idx} />;
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Colonne Wallet / Sécurité - 1/3 */}
              <div className="space-y-6">
                {(isAdmin || isAgent) && (
                  <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent p-5">
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Raccourcis</p>
                        <h3 className="mt-1 text-lg font-bold text-white">{isAdmin ? 'Actions de supervision' : 'Mon plan de terrain'}</h3>
                      </div>
                      <div className="rounded-xl bg-white/5 p-2 text-primary">{isAdmin ? <BarChart3 size={18} /> : <MapPin size={18} />}</div>
                    </div>
                    <div className="space-y-2">
                      {isAdmin ? <>
                        <QuickAction to="/admin/validations" icon={ClipboardCheck} label="Traiter les validations" description={`${pendingItems} dossier(s) à examiner`} tone="amber" />
                        <QuickAction to="/admin/agents" icon={Users} label="Gérer les agents" description="Ajouter, activer ou suivre l’équipe" tone="emerald" />
                      </> : <>
                        <QuickAction to="/agent/missions" icon={ListChecks} label="Ouvrir mes missions" description={`${Math.max(transactionsList.length - completedMissions, 0)} intervention(s) restante(s)`} tone="primary" />
                        <QuickAction to="/messages" icon={Activity} label="Consulter les messages" description="Restez en lien avec l’équipe" tone="emerald" />
                      </>}
                    </div>
                  </div>
                )}
                <div className="relative group bg-gradient-to-br from-primary/5 via-indigo-500/5 to-transparent border border-primary/20 rounded-2xl overflow-hidden transition-all hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-[80px]" />

                  <div className="relative z-10 p-6">
                    <div className="flex items-center justify-between mb-8">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/30 to-indigo-500/30 flex items-center justify-center">
                        <ShieldCheck size={24} className="text-primary" />
                      </div>
                      <div className="bg-primary/20 px-3 py-1 rounded-full border border-primary/30 text-[9px] font-bold text-primary uppercase tracking-wider backdrop-blur-sm">
                        Escrow sécurisé
                      </div>
                    </div>

                    <div className="space-y-4 mb-8">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2">Votre clé publique</p>
                        <code className="text-xs font-mono text-white/80 break-all bg-white/[0.03] p-2 rounded-lg block border border-white/5">
                          {user.wallet_address
                            ? `${user.wallet_address.substring(0, 12)}...${user.wallet_address.substring(30)}`
                            : 'Génération en cours...'}
                        </code>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-glow animate-pulse" />
                          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">GoChain Mainnet</span>
                        </div>
                        <ExternalLink size={14} className="text-slate-500 cursor-pointer hover:text-primary transition-colors" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
                      <div className="text-center p-2 bg-white/[0.02] rounded-xl">
                        <p className="text-[8px] font-bold uppercase text-slate-500">Garantie</p>
                        <p className="text-xs font-bold text-emerald-400">100% Blockchain</p>
                      </div>
                      <div className="text-center p-2 bg-white/[0.02] rounded-xl">
                        <p className="text-[8px] font-bold uppercase text-slate-500">Audit</p>
                        <p className="text-xs font-bold text-primary">Kivu Security</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Petite carte d'info complémentaire (optionnelle) */}
                <div className="bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Clock size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-amber-400">Séquestre actif</p>
                      <p className="text-[9px] text-slate-500">Les fonds sont protégés par contrat intelligent</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
