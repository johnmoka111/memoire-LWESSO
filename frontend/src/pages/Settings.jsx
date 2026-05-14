import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Lock, Shield, Save, Loader2, Camera, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { API_URL } from '../config';

const Settings = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    nom: user.nom || '',
    prenom: user.prenom || '',
    telephone: user.telephone || '',
    avatar_url: user.avatar_url || null,
    province: user.province || '',
    ville: user.ville || '',
    commune: user.commune || ''
  });

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar_url: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`${API_URL}/user/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data?.success) {
        const updatedUser = res.data.data.user;
        // Mettre à jour localStorage et l'état local
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#050507] text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        
        <main className="p-4 md:p-10 space-y-10 mb-20 md:mb-0 overflow-y-auto">
          <div>
            <h1 className="text-4xl font-black tracking-tight mb-2">Paramètres</h1>
            <p className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black">Gérer votre identité numérique certifiée</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profil Card */}
            <div className="bg-[#0A0A0F] border border-white/5 rounded-[2.5rem] p-8 h-fit space-y-8 text-center relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-transparent opacity-50"></div>
               
               <div className="relative inline-block mt-4">
                  <div className="w-32 h-32 rounded-[2.5rem] bg-white/[0.02] border-2 border-white/5 flex items-center justify-center text-primary overflow-hidden shadow-2xl group-hover:border-primary/30 transition-all duration-500">
                    {formData.avatar_url ? (
                      <img src={formData.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User size={56} className="text-slate-700" />
                    )}
                  </div>
                  <button 
                    onClick={() => fileInputRef.current.click()}
                    className="absolute -bottom-2 -right-2 p-3 bg-primary rounded-2xl text-white shadow-xl border-4 border-[#0A0A0F] hover:scale-110 transition-all"
                  >
                    <Camera size={18} />
                  </button>
                  <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleAvatarChange} />
               </div>

               <div>
                <h2 className="text-2xl font-black tracking-tighter">{user.prenom} {user.nom}</h2>
                <div className="inline-flex items-center gap-2 mt-3 px-4 py-1.5 bg-primary/10 rounded-xl border border-primary/20">
                  <Shield size={12} className="text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                    Compte {user.role}
                  </span>
                </div>
               </div>

               <div className="space-y-4 pt-8 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase text-slate-600 tracking-widest">Email</span>
                  <span className="text-[10px] font-bold text-slate-300 truncate max-w-[160px]">{user.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase text-slate-600 tracking-widest">Vérification</span>
                  <span className="text-emerald-500 text-[10px] font-black flex items-center gap-1 uppercase tracking-widest italic">Actif</span>
                </div>
              </div>
            </div>

            {/* Formulaire Settings */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-[#0A0A0F] border border-white/5 rounded-[2.5rem] p-10">
                <div className="flex items-center gap-4 mb-12">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                    <User size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black tracking-tight italic uppercase">Informations <span className="text-primary">Générales</span></h3>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Vos données visibles par vos collaborateurs</p>
                  </div>
                </div>

                <form onSubmit={handleUpdate} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Prénom de l'utilisateur</label>
                      <input 
                        type="text" 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 outline-none focus:border-primary/50 transition-all text-sm font-bold" 
                        value={formData.prenom}
                        onChange={e => setFormData({...formData, prenom: e.target.value})}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Nom de famille</label>
                      <input 
                        type="text" 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 outline-none focus:border-primary/50 transition-all text-sm font-bold" 
                        value={formData.nom}
                        onChange={e => setFormData({...formData, nom: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Province d'affectation</label>
                      <input 
                        type="text" 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 outline-none focus:border-primary/50 transition-all text-sm font-bold" 
                        placeholder="ex: Sud-Kivu"
                        value={formData.province}
                        onChange={e => setFormData({...formData, province: e.target.value})}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Ville</label>
                      <input 
                        type="text" 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 outline-none focus:border-primary/50 transition-all text-sm font-bold" 
                        placeholder="ex: Bukavu"
                        value={formData.ville}
                        onChange={e => setFormData({...formData, ville: e.target.value})}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Commune / Secteur</label>
                      <input 
                        type="text" 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 outline-none focus:border-primary/50 transition-all text-sm font-bold" 
                        placeholder="ex: Ibanda"
                        value={formData.commune}
                        onChange={e => setFormData({...formData, commune: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Numéro de téléphone direct</label>
                    <div className="relative group">
                      <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary transition-colors" size={20} />
                      <input 
                        type="tel" 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 pl-14 outline-none focus:border-primary/50 transition-all text-sm font-bold" 
                        placeholder="+243..."
                        value={formData.telephone}
                        onChange={e => setFormData({...formData, telephone: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-12 border-t border-white/5">
                    <div className="flex flex-col gap-2">
                        {success && (
                          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-widest">
                            <CheckCircle size={16} /> Modifications Enregistrées
                          </motion.div>
                        )}
                        {error && (
                          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 text-red-500 font-black text-[10px] uppercase tracking-widest">
                            <AlertCircle size={16} /> {error}
                          </motion.div>
                        )}
                    </div>
                    
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="bg-primary hover:bg-indigo-500 px-12 py-5 rounded-2xl font-black text-xs shadow-2xl shadow-primary/20 transition-all active:scale-95 flex items-center gap-3"
                    >
                      {loading ? <Loader2 className="animate-spin" /> : <><Save size={20} /> METTRE À JOUR LE PROFIL</>}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
