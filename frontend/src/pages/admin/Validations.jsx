import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, 
  MapPin, 
  User, 
  Clock, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  Loader2,
  AlertCircle,
  FileText
} from 'lucide-react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import { API_URL } from '../../config';

const Validations = () => {
  const [properties, setProperties] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigningId, setAssigningId] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const [propRes, agentRes] = await Promise.all([
        axios.get(`${API_URL}/admin/properties`, config), 
        axios.get(`${API_URL}/admin/agents`, config)
      ]);
      
      // Filtrer pour ne garder que ceux en attente d'assignation
      const pending = propRes.data.data?.filter(p => p.statut === 'en_attente') || [];
      setProperties(pending);
      setAgents(agentRes.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (propertyId) => {
    if (!selectedAgent) return;
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/properties/${propertyId}/assign`, {
        agent_id: selectedAgent
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAssigningId(null);
      setSelectedAgent('');
      fetchData(); // Rafraîchir la liste
    } catch (err) {
      alert("Erreur lors de l'assignation");
    }
  };

  return (
    <div className="flex min-h-screen bg-dark">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        
        <main className="p-4 md:p-10 space-y-10 mb-20 md:mb-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Validations Foncières</h1>
              <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">Assignation des missions de terrain</p>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full">
              <ShieldAlert size={16} className="text-amber-500" />
              <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">{properties.length} En attente</span>
            </div>
          </div>

          <div className="space-y-6">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-primary" size={48} />
              </div>
            ) : properties.length === 0 ? (
              <div className="card py-20 text-center opacity-30">
                <CheckCircle2 size={64} className="mx-auto mb-6" />
                <p className="font-black uppercase tracking-widest text-sm">Toutes les annonces sont traitées</p>
              </div>
            ) : (
              properties.map((prop) => (
                <motion.div 
                  key={prop.id}
                  layout
                  className="card group hover:border-primary/20 transition-all !p-0 overflow-hidden"
                >
                  <div className="flex flex-col lg:flex-row">
                    {/* Infos Principales */}
                    <div className="p-8 flex-1 space-y-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-2xl font-black mb-1">{prop.titre}</h3>
                          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest">
                            <MapPin size={14} className="text-primary" />
                            {prop.commune}, {prop.quartier}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-black text-primary">{prop.prix} ETH</p>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">${parseFloat(prop.prix_usd || 0).toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/5">
                        <div className="space-y-1">
                          <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">Superficie</p>
                          <p className="text-sm font-bold">{prop.superficie} m²</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">Type</p>
                          <p className="text-sm font-bold capitalize">{prop.type_bien}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">Propriétaire</p>
                          <div className="flex items-center gap-2">
                             <User size={12} className="text-slate-500" />
                             <p className="text-sm font-bold truncate">{prop.owner_name || 'Utilisateur'}</p>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">Soumis le</p>
                          <div className="flex items-center gap-2">
                             <Clock size={12} className="text-slate-500" />
                             <p className="text-sm font-bold">{new Date(prop.created_at).toLocaleDateString('fr-FR')}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Zone d'action (Assignation) */}
                    <div className="bg-white/[0.02] border-l border-white/5 p-8 w-full lg:w-96 flex flex-col justify-center">
                      {assigningId === prop.id ? (
                        <div className="space-y-4">
                          <p className="text-[10px] font-black uppercase tracking-widest text-primary">Choisir un Agent</p>
                          <select 
                            className="input-field w-full cursor-pointer"
                            value={selectedAgent}
                            onChange={(e) => setSelectedAgent(e.target.value)}
                          >
                            <option value="">Sélectionner...</option>
                            {agents.map(agent => (
                              <option key={agent.id} value={agent.id}>{agent.prenom} {agent.nom}</option>
                            ))}
                          </select>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleAssign(prop.id)}
                              disabled={!selectedAgent}
                              className="btn-primary flex-1 !py-3 text-[10px]"
                            >
                              CONFIRMER
                            </button>
                            <button 
                              onClick={() => { setAssigningId(null); setSelectedAgent(''); }}
                              className="p-3 bg-white/5 rounded-xl text-slate-500 hover:text-white"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setAssigningId(prop.id)}
                          className="btn-primary w-full flex items-center justify-center gap-3 shadow-lg shadow-primary/10"
                        >
                          ASSIGNER UN AGENT <ChevronRight size={18} />
                        </button>
                      )}
                      <p className="text-center text-[9px] text-slate-600 font-bold uppercase tracking-widest mt-6 italic">
                        Une mission terrain sera créée automatiquement
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

const X = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
);

export default Validations;
