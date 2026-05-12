import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  UserPlus, 
  Mail, 
  Phone, 
  ShieldCheck, 
  X, 
  Check, 
  Loader2,
  MapPin,
  ChevronDown,
  Building2,
  Globe,
  ArrowRight,
  Camera,
  UserCircle
} from 'lucide-react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import { KIVU_LOCATIONS } from '../../data/locations';
import { API_URL } from '../../config';

const Agents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const fileInputRef = useRef(null);
  
  const [newAgent, setNewAgent] = useState({ 
    nom: '', 
    prenom: '', 
    email: '', 
    telephone: '',
    province: '',
    ville: '',
    commune: '',
    photo_passeport: null
  });

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/agents`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setAgents(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewAgent({ ...newAgent, photo_passeport: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await axios.post(`${API_URL}/admin/agents`, newAgent, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSuccessMsg(`Agent créé avec succès !`);
      fetchAgents();
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Erreur réseau';
      alert(`ERREUR : ${errorMsg}\n\nNote: Si vous avez un 404, j'ai mis à jour le backend pour corriger le routage en sous-répertoire.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const provinces = Object.keys(KIVU_LOCATIONS);
  const villes = newAgent.province ? Object.keys(KIVU_LOCATIONS[newAgent.province]) : [];
  const communes = (newAgent.province && newAgent.ville) ? Object.keys(KIVU_LOCATIONS[newAgent.province][newAgent.ville]) : [];

  return (
    <div className="flex min-h-screen bg-dark">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        
        <main className="p-4 md:p-10 space-y-10 mb-20 md:mb-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Gestion des Agents</h1>
              <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">Panneau d'administration des certificateurs fonciers</p>
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="btn-primary flex items-center justify-center gap-3 shadow-xl shadow-primary/20"
            >
              <UserPlus size={20} /> AJOUTER UN AGENT
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              [1, 2, 3].map(i => <div key={i} className="h-56 bg-white/5 rounded-3xl animate-pulse" />)
            ) : agents.length === 0 ? (
              <div className="col-span-full py-32 text-center opacity-20">
                <Users size={80} className="mx-auto mb-6" />
                <p className="font-black uppercase tracking-widest text-sm">Aucun agent dans le réseau</p>
              </div>
            ) : (
              agents.map((agent) => (
                <div key={agent.id} className="card group hover:border-primary/40 transition-all !p-0 overflow-hidden bg-secondary/20 border-white/5">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center">
                        {agent.avatar_url ? (
                          <img src={agent.avatar_url} alt="Agent" className="w-full h-full object-cover" />
                        ) : (
                          <UserCircle size={32} className="text-slate-600" />
                        )}
                      </div>
                      <div className="px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-[8px] font-black text-emerald-500 uppercase tracking-[0.2em]">Agent Certifié</div>
                    </div>
                    <h3 className="text-xl font-black mb-1 truncate">{agent.prenom} {agent.nom}</h3>
                    <div className="flex items-center gap-2 text-slate-500 mb-6">
                      <MapPin size={12} className="text-primary" />
                      <span className="text-[10px] font-bold uppercase tracking-widest truncate">{agent.commune || 'KivuMarket+'}</span>
                    </div>
                    <div className="pt-6 border-t border-white/5">
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                         <Mail size={14} className="text-slate-600" />
                         <span className="truncate">{agent.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>

      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)} className="absolute inset-0 bg-dark/95 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="card w-full max-w-2xl relative z-10 !p-0 overflow-hidden shadow-2xl border-white/10">
              <div className="p-10 border-b border-white/5 bg-white/[0.02]">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-black tracking-tight mb-1">Enregistrement Agent</h2>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Création de profil et affectation de juridiction</p>
                  </div>
                  <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-white/5 rounded-xl transition-colors"><X size={24} /></button>
                </div>
              </div>

              <div className="p-10 max-h-[70vh] overflow-y-auto">
                {successMsg ? (
                  <div className="text-center py-10 space-y-8">
                    <div className="w-24 h-24 rounded-3xl bg-emerald-500/10 flex items-center justify-center mx-auto text-emerald-500 shadow-inner">
                      <Check size={48} strokeWidth={3} />
                    </div>
                    <p className="text-emerald-400 text-lg font-black">{successMsg}</p>
                    <button onClick={() => { setSuccessMsg(''); setShowAddModal(false); }} className="btn-primary w-full font-black py-5">TERMINER</button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-10">
                    <div className="flex flex-col md:flex-row gap-10">
                      {/* Photo Upload Section */}
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-32 h-32 rounded-3xl bg-white/[0.03] border-2 border-dashed border-white/10 flex items-center justify-center relative overflow-hidden group hover:border-primary/50 transition-colors cursor-pointer"
                             onClick={() => fileInputRef.current.click()}>
                          {newAgent.photo_passeport ? (
                            <img src={newAgent.photo_passeport} alt="Passeport" className="w-full h-full object-cover" />
                          ) : (
                            <div className="flex flex-col items-center gap-2 text-slate-500">
                              <Camera size={32} />
                              <span className="text-[9px] font-black uppercase tracking-widest">PHOTO</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                             <Camera size={24} className="text-white" />
                          </div>
                        </div>
                        <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handlePhotoChange} />
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Format Passeport</p>
                      </div>

                      {/* Identité Section */}
                      <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input type="text" required className="input-field !bg-white/[0.03]" placeholder="Prénom" onChange={e => setNewAgent({...newAgent, prenom: e.target.value})} />
                          <input type="text" required className="input-field !bg-white/[0.03]" placeholder="Nom" onChange={e => setNewAgent({...newAgent, nom: e.target.value})} />
                        </div>
                        <input type="email" required className="input-field !bg-white/[0.03]" placeholder="Email professionnel" onChange={e => setNewAgent({...newAgent, email: e.target.value})} />
                        <input type="tel" required className="input-field !bg-white/[0.03]" placeholder="Téléphone (+243)" onChange={e => setNewAgent({...newAgent, telephone: e.target.value})} />
                      </div>
                    </div>

                    <div className="pt-8 border-t border-white/5">
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2 mb-6"><Building2 size={14} /> Affectation Géographique</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <select className="input-field !bg-white/[0.05] !py-4 appearance-none cursor-pointer" required onChange={e => setNewAgent({...newAgent, province: e.target.value, ville: '', commune: ''})}>
                          <option value="">PROVINCE</option>
                          {provinces.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                        <select className="input-field !bg-white/[0.05] !py-4 appearance-none cursor-pointer" required disabled={!newAgent.province} onChange={e => setNewAgent({...newAgent, ville: e.target.value, commune: ''})}>
                          <option value="">VILLE</option>
                          {villes.map(v => <option key={v} value={v}>{v}</option>)}
                        </select>
                        <select className="input-field !bg-white/[0.05] !py-4 appearance-none cursor-pointer" required disabled={!newAgent.ville} onChange={e => setNewAgent({...newAgent, commune: e.target.value})}>
                          <option value="">COMMUNE</option>
                          {communes.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>

                    <button type="submit" disabled={isSubmitting} className="btn-primary w-full flex items-center justify-center gap-4 !py-5">
                      {isSubmitting ? <Loader2 className="animate-spin" /> : <>ACTIVER LE COMPTE AGENT <ArrowRight size={20} /></>}
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
