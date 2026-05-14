import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, UserPlus, Mail, ShieldCheck, X, Check, Loader2, MapPin, 
  Building2, ArrowRight, Camera, UserCircle, Trash2, Phone, 
  Calendar, Edit3, Search, Power, PowerOff, UserCheck, UserX, 
  TrendingUp, Activity, Shield, ChevronDown, Copy, CheckCircle2, 
  AlertCircle, Filter, Fingerprint, Lock, Key, RefreshCw, Send
} from 'lucide-react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import { KIVU_LOCATIONS } from '../../data/locations';
import { API_URL } from '../../config';

const generateUniversalId = (id) => {
  const hash = Math.abs(id * 12345).toString(16).toUpperCase();
  const segment1 = hash.slice(0, 4).padEnd(4, '0');
  const segment2 = id.toString().padStart(4, '0');
  return `KM-${segment1}-${segment2}`;
};

const StatCard = ({ label, value, icon: Icon, color }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="relative overflow-hidden bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 rounded-3xl p-6"
  >
    <div className={`absolute -right-4 -top-4 w-24 h-24 blur-3xl opacity-20 rounded-full ${color.split(' ')[0]}`} />
    <div className="flex justify-between items-start relative z-10">
      <div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">{label}</p>
        <h3 className="text-3xl font-black text-white tracking-tighter">{value}</h3>
      </div>
      <div className={`p-3 rounded-2xl ${color} shadow-lg shadow-black/20`}>
        <Icon size={20} />
      </div>
    </div>
  </motion.div>
);

const Agents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdAgentInfo, setCreatedAgentInfo] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingAgent, setEditingAgent] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const fileInputRef = useRef(null);
  
  const [newAgent, setNewAgent] = useState({ 
    nom: '', prenom: '', email: '', telephone: '',
    province: '', ville: '', commune: '', photo_passeport: null
  });

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/agents`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setAgents(res.data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (agent) => {
    if (!window.confirm(`Voulez-vous réinitialiser le mot de passe de ${agent.prenom} ? Un nouvel email lui sera envoyé.`)) return;
    
    setIsSubmitting(true);
    try {
      const res = await axios.post(`${API_URL}/admin/agents/${agent.id}/reset-password`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const newPass = res.data?.data?.new_password;
      setCreatedAgentInfo({ email: agent.email, password: newPass, isReset: true });
      setShowAddModal(true);
    } catch (err) {
      alert("Erreur lors de la réinitialisation");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer définitivement cet agent ?")) return;
    try {
      await axios.delete(`${API_URL}/admin/agents/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchAgents();
    } catch (err) {
      alert("Erreur réseau");
    }
  };

  const handleToggleStatus = async (agent) => {
    try {
      await axios.put(`${API_URL}/admin/agents/${agent.id}`, { is_active: agent.is_active ? 0 : 1 }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchAgents();
    } catch (err) {
      alert("Erreur");
    }
  };

  const openEditModal = (agent) => {
    setEditingAgent({ ...agent, photo_passeport: agent.avatar_url });
    setCreatedAgentInfo(null);
    setShowAddModal(true);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (editingAgent) setEditingAgent({ ...editingAgent, avatar_url: reader.result, photo_passeport: reader.result });
        else setNewAgent({ ...newAgent, photo_passeport: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingAgent) {
        await axios.put(`${API_URL}/admin/agents/${editingAgent.id}`, editingAgent, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setEditingAgent(null);
        setShowAddModal(false);
      } else {
        const res = await axios.post(`${API_URL}/admin/agents`, newAgent, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        const pass = res.data?.data?.temporary_password || 'Généré';
        setCreatedAgentInfo({ email: newAgent.email, password: pass });
      }
      fetchAgents();
    } catch (err) {
      alert("Erreur : " + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredAgents = agents.filter(a => {
    const matchesSearch = `${a.prenom} ${a.nom} ${a.email}`.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' && a.is_active) || (statusFilter === 'inactive' && !a.is_active);
    return matchesSearch && matchesStatus;
  });

  const activeCount = agents.filter(a => a.is_active).length;
  const currentAgent = editingAgent || newAgent;
  const provinces = Object.keys(KIVU_LOCATIONS);
  const villes = currentAgent.province ? Object.keys(KIVU_LOCATIONS[currentAgent.province]) : [];
  const communes = (currentAgent.province && currentAgent.ville) ? Object.keys(KIVU_LOCATIONS[currentAgent.province][currentAgent.ville]) : [];

  return (
    <div className="flex h-screen bg-[#050507] text-white overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <Navbar />
        
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <main className="p-4 md:p-8 lg:p-12 space-y-12 pb-24">
            
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                   <Send size={12} className="text-primary" />
                   <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">Notifications SMTP Activées</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight italic">Gestion <span className="text-primary">RH</span></h1>
                <p className="text-slate-500 text-sm max-w-xl font-medium">Les agents reçoivent automatiquement leurs accès par email lors de l'activation.</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                  <input 
                    type="text" 
                    placeholder="Filtrer..." 
                    className="bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-sm w-full sm:w-64 outline-none focus:border-primary/50 transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button 
                  onClick={() => { setEditingAgent(null); setCreatedAgentInfo(null); setShowAddModal(true); }}
                  className="bg-primary hover:bg-indigo-500 px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-3 whitespace-nowrap"
                >
                  <UserPlus size={20} /> NOUVEL AGENT
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
               <StatCard label="Total Agents" value={agents.length} icon={Users} color="bg-blue-500/20 text-blue-400" />
               <StatCard label="En Ligne" value={activeCount} icon={UserCheck} color="bg-emerald-500/20 text-emerald-400" />
               <StatCard label="Suspendus" value={agents.length - activeCount} icon={UserX} color="bg-red-500/20 text-red-400" />
               <StatCard label="Emails Envoyés" value={agents.length} icon={Send} color="bg-amber-500/20 text-amber-400" />
            </div>

            <div className="flex items-center gap-4 border-b border-white/5 pb-6 overflow-x-auto no-scrollbar">
               {['all', 'active', 'inactive'].map(f => (
                 <button 
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${statusFilter === f ? 'bg-primary text-white' : 'bg-white/5 text-slate-500 hover:bg-white/10'}`}
                 >
                   {f === 'all' ? 'Touts' : f === 'active' ? 'Actifs' : 'Suspendus'}
                 </button>
               ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
              {loading ? (
                [1, 2, 3, 4].map(i => <div key={i} className="h-80 bg-white/5 rounded-[2.5rem] animate-pulse" />)
              ) : filteredAgents.map((agent) => (
                  <motion.div 
                    layout
                    key={agent.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`relative bg-[#0A0A0F] border rounded-[2.5rem] p-8 transition-all duration-500 group ${agent.is_active ? 'border-white/5 hover:border-primary/40' : 'border-red-500/20 grayscale'}`}
                  >
                    <div className="flex justify-between items-start mb-8">
                      <div className="relative">
                        <div className={`w-20 h-20 rounded-[1.8rem] overflow-hidden border-2 p-1 ${agent.is_active ? 'border-emerald-500/30' : 'border-red-500/30'}`}>
                          <div className="w-full h-full rounded-[1.5rem] overflow-hidden bg-secondary/50">
                            {agent.avatar_url ? (
                              <img src={agent.avatar_url} alt="Agent" className="w-full h-full object-cover" />
                            ) : (
                              <UserCircle size={40} className="w-full h-full p-4 text-slate-700" />
                            )}
                          </div>
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-full border-4 border-[#0A0A0F] flex items-center justify-center ${agent.is_active ? 'bg-emerald-500' : 'bg-red-500'}`}>
                           {agent.is_active ? <Check size={12} className="text-dark" /> : <PowerOff size={12} />}
                        </div>
                      </div>

                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button onClick={() => openEditModal(agent)} className="p-3 bg-white/5 hover:bg-primary rounded-xl transition-all shadow-xl"><Edit3 size={16} /></button>
                        <button onClick={() => handleDelete(agent.id)} className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-xl"><Trash2 size={16} /></button>
                      </div>
                    </div>

                    <div className="space-y-1 mb-6">
                      <h3 className="text-xl font-black text-white truncate">{agent.prenom} {agent.nom}</h3>
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary/80 font-mono">{generateUniversalId(agent.id)}</p>
                    </div>

                    <div className="space-y-3 mb-8 p-5 bg-white/[0.02] rounded-3xl border border-white/5 group-hover:bg-primary/[0.03] transition-colors relative">
                       <div className="flex items-center justify-between group/id">
                          <div className="flex items-center gap-3 overflow-hidden">
                             <Mail size={12} className="text-slate-600" />
                             <span className="text-[10px] font-bold text-slate-400 truncate">{agent.email}</span>
                          </div>
                          <button onClick={() => copyToClipboard(agent.email)} className="text-slate-600 hover:text-white"><Copy size={12}/></button>
                       </div>
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                             <Lock size={12} className="text-slate-600" />
                             <span className="text-[10px] font-black text-slate-600 tracking-widest">••••••••</span>
                          </div>
                          <button 
                            onClick={() => handleResetPassword(agent)}
                            className="flex items-center gap-1.5 px-3 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-[8px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all"
                          >
                            <RefreshCw size={10} /> Réinitialiser
                          </button>
                       </div>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                       <div className="flex items-center gap-2 text-slate-600">
                          <MapPin size={12} />
                          <span className="text-[9px] font-black uppercase tracking-widest">{agent.commune || 'KIVU'}</span>
                       </div>
                       <button 
                        onClick={() => handleToggleStatus(agent)}
                        className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${agent.is_active ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-dark' : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-dark'}`}
                       >
                         {agent.is_active ? 'Suspendre' : 'Réactiver'}
                       </button>
                    </div>
                  </motion.div>
                ))
              }
            </div>
          </main>
        </div>
      </div>

      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)} className="absolute inset-0 bg-black/95 backdrop-blur-md" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 30 }} 
              className="bg-[#0A0A0F] border border-white/10 w-full max-w-2xl relative z-[1100] rounded-[3rem] overflow-hidden shadow-2xl"
            >
              <div className="p-10 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-primary/10 to-transparent">
                 <div>
                   <h2 className="text-3xl font-black italic text-white tracking-tighter">{editingAgent ? 'Éditer' : createdAgentInfo?.isReset ? 'Réinitialisation' : 'Nouvel'} <span className="text-primary">Agent</span></h2>
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Plateforme KivuMarket+ — Bukavu, RDC</p>
                 </div>
                 <button onClick={() => setShowAddModal(false)} className="p-4 bg-white/5 rounded-2xl hover:bg-red-500 transition-all text-white"><X size={24} /></button>
              </div>

              <div className="p-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
                {createdAgentInfo ? (
                  <div className="text-center py-10 space-y-12">
                    <div className={`w-24 h-24 rounded-[2rem] ${createdAgentInfo.isReset ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'} flex items-center justify-center mx-auto shadow-2xl animate-pulse`}>
                      {createdAgentInfo.isReset ? <RefreshCw size={48} strokeWidth={3} /> : <Check size={48} strokeWidth={3} />}
                    </div>
                    <div className="space-y-6">
                      <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase">{createdAgentInfo.isReset ? 'Mot de passe' : 'Compte'} <span className={createdAgentInfo.isReset ? 'text-amber-400' : 'text-emerald-400'}>{createdAgentInfo.isReset ? 'Réinitialisé' : 'Généré'}</span></h3>
                      <p className="text-slate-500 text-xs font-bold px-10">Un email de confirmation contenant ces identifiants a été envoyé à l'agent.</p>
                      
                      <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
                         <div className="bg-white/5 p-6 rounded-3xl border border-white/5 text-left flex justify-between items-center group">
                            <div>
                               <p className="text-[9px] font-black text-primary uppercase mb-1">Email de l'agent</p>
                               <p className="text-sm font-bold text-white font-mono select-all">{createdAgentInfo.email}</p>
                            </div>
                            <button onClick={() => copyToClipboard(createdAgentInfo.email)} className="p-3 bg-white/5 rounded-xl hover:bg-primary transition-all"><Copy size={16} /></button>
                         </div>
                         <div className="bg-white/5 p-6 rounded-3xl border border-white/5 text-left flex justify-between items-center group">
                            <div>
                               <p className="text-[9px] font-black text-amber-500 uppercase mb-1">Mot de Passe Visible</p>
                               <p className="text-3xl font-black text-white font-mono tracking-widest select-all">{createdAgentInfo.password}</p>
                            </div>
                            <button onClick={() => copyToClipboard(createdAgentInfo.password)} className="p-3 bg-white/5 rounded-xl hover:bg-amber-500 transition-all">
                               {copySuccess ? <CheckCircle2 size={16} className="text-white" /> : <Copy size={16} />}
                            </button>
                         </div>
                      </div>
                    </div>
                    <button onClick={() => setShowAddModal(false)} className="px-12 py-5 bg-white text-dark font-black rounded-2xl shadow-2xl hover:scale-105 transition-all">TERMINER</button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="flex flex-col md:flex-row gap-10">
                       <div className="flex flex-col items-center gap-4">
                          <div className="w-32 h-32 rounded-[2rem] bg-white/[0.02] border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden cursor-pointer relative group"
                               onClick={() => fileInputRef.current.click()}>
                             {(editingAgent ? editingAgent.avatar_url : newAgent.photo_passeport) ? (
                               <img src={editingAgent ? editingAgent.avatar_url : newAgent.photo_passeport} alt="Profile" className="w-full h-full object-cover" />
                             ) : (
                               <Camera size={32} className="text-slate-700 group-hover:text-primary transition-colors" />
                             )}
                          </div>
                          <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handlePhotoChange} />
                       </div>

                       <div className="flex-1 space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                             <input type="text" required className="bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-primary transition-all text-sm font-bold" placeholder="Prénom" 
                              value={editingAgent ? editingAgent.prenom : newAgent.prenom} 
                              onChange={e => editingAgent ? setEditingAgent({...editingAgent, prenom: e.target.value}) : setNewAgent({...newAgent, prenom: e.target.value})} />
                             <input type="text" required className="bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-primary transition-all text-sm font-bold" placeholder="Nom" 
                              value={editingAgent ? editingAgent.nom : newAgent.nom} 
                              onChange={e => editingAgent ? setEditingAgent({...editingAgent, nom: e.target.value}) : setNewAgent({...newAgent, nom: e.target.value})} />
                          </div>
                          <input type="email" required className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-primary transition-all text-sm font-bold disabled:opacity-30" placeholder="Email" 
                            disabled={editingAgent}
                            value={editingAgent ? editingAgent.email : newAgent.email} 
                            onChange={e => editingAgent ? null : setNewAgent({...newAgent, email: e.target.value})} />
                          <input type="tel" required className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-primary transition-all text-sm font-bold" placeholder="Téléphone" 
                            value={editingAgent ? editingAgent.telephone : newAgent.telephone} 
                            onChange={e => editingAgent ? setEditingAgent({...editingAgent, telephone: e.target.value}) : setNewAgent({...newAgent, telephone: e.target.value})} />
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8 border-t border-white/5">
                        <select className="bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-primary transition-all text-[10px] font-black uppercase appearance-none" required 
                          value={editingAgent ? editingAgent.province : newAgent.province} 
                          onChange={e => editingAgent ? setEditingAgent({...editingAgent, province: e.target.value, ville: '', commune: ''}) : setNewAgent({...newAgent, province: e.target.value, ville: '', commune: ''})}>
                          <option value="">Province</option>
                          {provinces.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                        <select className="bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-primary transition-all text-[10px] font-black uppercase appearance-none disabled:opacity-20" required 
                          disabled={!currentAgent.province} 
                          value={editingAgent ? editingAgent.ville : newAgent.ville} 
                          onChange={e => editingAgent ? setEditingAgent({...editingAgent, ville: e.target.value, commune: ''}) : setNewAgent({...newAgent, ville: e.target.value, commune: ''})}>
                          <option value="">Ville</option>
                          {villes.map(v => <option key={v} value={v}>{v}</option>)}
                        </select>
                        <select className="bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-primary transition-all text-[10px] font-black uppercase appearance-none disabled:opacity-20" required 
                          disabled={!currentAgent.ville} 
                          value={editingAgent ? editingAgent.commune : newAgent.commune} 
                          onChange={e => editingAgent ? setEditingAgent({...editingAgent, commune: e.target.value}) : setNewAgent({...newAgent, commune: e.target.value})}>
                          <option value="">Commune</option>
                          {communes.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    <button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-indigo-600 py-5 rounded-2xl font-black text-lg shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3">
                      {isSubmitting ? <Loader2 className="animate-spin text-white" /> : <>{editingAgent ? 'CONFIRMER LES MODIFICATIONS' : 'ACTIVER LE COMPTE AGENT'}</>}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Agents;