import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  MapPin, 
  User, 
  Clock, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  Loader2,
  AlertCircle,
  FileText,
  Camera
} from 'lucide-react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { API_URL } from '../config';
import { useToast } from '../context/ToastContext';

const AgentMissions = () => {
  const { toast } = useToast();
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [validatingId, setValidatingId] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);
  const [panoramaUrl, setPanoramaUrl] = useState('');
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  const rejectionReasons = [
    "Document foncier falsifié",
    "Titre foncier expiré",
    "Conflit de voisinage (limites)",
    "Bien déjà vendu à un tiers",
    "Hypothèque non déclarée",
    "Propriétaire non identifié",
    "Bien inexistant aux coordonnées indiquées",
    "Superficie réelle inférieure à la déclaration",
    "Zone non constructible / protégée",
    "Litige familial (succession)",
    "Bâtiment en état de délabrement avancé",
    "Absence de certificat d'enregistrement",
    "Double adressage (conflit cadastral)",
    "Bien sous saisie judiciaire",
    "Informations photos mensongères",
    "Risque d'éboulement / zone de danger",
    "Servitude de passage non respectée",
    "Fraude fiscale sur les taxes foncières",
    "Refus d'inspection par le propriétaire",
    "Autre raison (préciser)"
  ];

  useEffect(() => {
    fetchMissions();
  }, []);

  const fetchMissions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/agent/missions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMissions(response.data.data || []);
    } catch (err) {
      console.error("Erreur lors de la récupération des missions", err);
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async (propertyId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/agent/validate/${propertyId}`, {
        panorama_url: panoramaUrl
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setValidatingId(null);
      setPanoramaUrl('');
      fetchMissions();
    } catch (err) {
      toast(err.response?.data?.message || "Erreur lors de la validation", 'error');
    }
  };

  const handleReject = async (propertyId) => {
    const finalReason = selectedReason === "Autre raison (préciser)" ? customReason : selectedReason;
    if (!finalReason) {
      toast("Veuillez sélectionner ou écrire une raison.", 'warning');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/agent/reject/${propertyId}`, {
        reason: finalReason
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setRejectingId(null);
      setSelectedReason('');
      setCustomReason('');
      fetchMissions();
    } catch (err) {
      toast(err.response?.data?.message || "Erreur lors du rejet", 'error');
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-[#05070C] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        
        <main className="p-4 md:p-10 space-y-10 mb-20 md:mb-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Mes Missions</h1>
              <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">Expertises de terrain à effectuer</p>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
              <ShieldCheck size={16} className="text-primary" />
              <span className="text-[10px] font-black text-primary uppercase tracking-widest">{missions.length} Missions actives</span>
            </div>
          </div>

          <div className="space-y-6">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-primary" size={48} />
              </div>
            ) : missions.length === 0 ? (
              <div className="card py-20 text-center opacity-30 border-dashed">
                <CheckCircle2 size={64} className="mx-auto mb-6 text-slate-500" />
                <p className="font-black uppercase tracking-widest text-sm">Aucune mission en attente</p>
                <p className="text-[10px] mt-2">Vous recevrez une notification dès qu'une expertise vous sera confiée.</p>
              </div>
            ) : (
              missions.map((prop) => (
                <motion.div 
                  key={prop.id}
                  layout
                  className="card group hover:border-primary/20 transition-all !p-0 overflow-hidden"
                >
                  <div className="flex flex-col lg:flex-row">
                    <div className="p-8 flex-1 space-y-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                             <span className="bg-primary/20 text-primary text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
                               En attente de validation
                             </span>
                          </div>
                          <h3 className="text-2xl font-black mb-1">{prop.titre}</h3>
                          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest">
                             <MapPin size={14} className="text-primary" />
                             {prop.commune}, {prop.quartier}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-black text-slate-900 dark:text-white">${parseFloat(prop.prix_usd ?? prop.prix ?? 0).toLocaleString()}</p>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">USD</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-200 dark:border-white/5">
                        <div className="space-y-1">
                          <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">Superficie</p>
                          <p className="text-sm font-bold">{prop.superficie} m²</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">Propriétaire</p>
                          <div className="flex items-center gap-2">
                             <User size={12} className="text-slate-500" />
                             <p className="text-sm font-bold truncate">{prop.owner_name || 'Inconnu'}</p>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">Chambres / SDB</p>
                          <p className="text-sm font-bold">{prop.chambres} / {prop.sdb}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">Assigné le</p>
                          <div className="flex items-center gap-2">
                             <Clock size={12} className="text-slate-500" />
                             <p className="text-sm font-bold">{new Date(prop.updated_at || prop.created_at).toLocaleDateString('fr-FR')}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-white/[0.02] border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-white/5 p-8 w-full lg:w-96 flex flex-col justify-center gap-4">
                      {validatingId === prop.id ? (
                        <div className="space-y-4">
                           <div className="space-y-2">
                             <label className="text-[9px] font-black uppercase tracking-widest text-primary">Lien Visite 360° (Optionnel)</label>
                             <input 
                               type="text" 
                               className="input-field w-full text-xs" 
                               placeholder="https://..."
                               value={panoramaUrl}
                               onChange={(e) => setPanoramaUrl(e.target.value)}
                             />
                           </div>
                           <div className="flex gap-2">
                              <button 
                                onClick={() => handleValidate(prop.id)}
                                className="btn-primary flex-1 !py-3 text-[10px]"
                              >
                                CONFIRMER LA VALIDATION
                              </button>
                              <button 
                                onClick={() => { setValidatingId(null); setPanoramaUrl(''); }}
                                className="p-3 bg-slate-200/50 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-xl"
                              >
                                <XIcon size={18} />
                              </button>
                           </div>
                        </div>
                      ) : rejectingId === prop.id ? (
                        <div className="space-y-4">
                           <div className="space-y-2">
                             <label className="text-[9px] font-black uppercase tracking-widest text-red-500">Motif du rejet / Litige</label>
                             <select 
                               className="input-field w-full text-xs"
                               value={selectedReason}
                               onChange={(e) => setSelectedReason(e.target.value)}
                             >
                               <option value="">Sélectionner une raison...</option>
                               {rejectionReasons.map((r, i) => (
                                 <option key={i} value={r}>{r}</option>
                               ))}
                             </select>
                             {selectedReason === "Autre raison (préciser)" && (
                               <textarea 
                                 className="input-field w-full text-xs mt-2" 
                                 placeholder="Détaillez le litige ici..."
                                 rows={3}
                                 value={customReason}
                                 onChange={(e) => setCustomReason(e.target.value)}
                               />
                             )}
                           </div>
                           <div className="flex gap-2">
                              <button 
                                onClick={() => handleReject(prop.id)}
                                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-[10px] tracking-widest transition-all"
                              >
                                SIGNALER LE LITIGE
                              </button>
                              <button 
                                onClick={() => { setRejectingId(null); setSelectedReason(''); setCustomReason(''); }}
                                className="p-3 bg-slate-200/50 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-xl"
                              >
                                <XIcon size={18} />
                              </button>
                           </div>
                        </div>
                      ) : (
                        <>
                          <button 
                            onClick={() => setValidatingId(prop.id)}
                            className="btn-primary w-full flex items-center justify-center gap-3 shadow-lg shadow-primary/10"
                          >
                            VALIDER LE BIEN <CheckCircle2 size={18} />
                          </button>
                          <button 
                            onClick={() => setRejectingId(prop.id)}
                            className="w-full py-3 bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                          >
                             <AlertCircle size={14} /> Signaler un litige
                          </button>
                        </>
                      )}
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

const XIcon = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
);

export default AgentMissions;
