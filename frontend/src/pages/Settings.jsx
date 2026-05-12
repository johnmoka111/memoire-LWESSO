import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Lock, Shield, Save, Loader2, Camera, CheckCircle } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const Settings = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    nom: user.nom || '',
    prenom: user.prenom || '',
    telephone: user.telephone || '',
    avatar_url: user.avatar_url || null,
    currentPassword: '',
    newPassword: ''
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
    try {
      // Simulation d'update
      const updatedUser = { ...user, ...formData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert("Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-dark">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        
        <main className="p-4 md:p-10 space-y-10 mb-20 md:mb-0">
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Paramètres</h1>
            <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">Gérer votre compte et vos préférences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profil Card */}
            <div className="card h-fit space-y-8 text-center relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-primary/20"></div>
               
               <div className="relative inline-block mt-4">
                  <div className="w-28 h-28 rounded-full bg-primary/5 border-2 border-white/5 flex items-center justify-center text-primary overflow-hidden shadow-2xl">
                    {formData.avatar_url ? (
                      <img src={formData.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User size={48} className="opacity-20" />
                    )}
                  </div>
                  <button 
                    onClick={() => fileInputRef.current.click()}
                    className="absolute bottom-1 right-1 p-2.5 bg-primary rounded-full text-white shadow-lg border-2 border-dark hover:scale-110 transition-transform"
                  >
                    <Camera size={16} />
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    hidden 
                    accept="image/*" 
                    onChange={handleAvatarChange} 
                  />
               </div>

               <div>
                <h2 className="text-xl font-black tracking-tight">{user.prenom} {user.nom}</h2>
                <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                  <Shield size={10} className="text-primary" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-primary">
                    {user.role}
                  </span>
                </div>
               </div>

               <div className="space-y-4 pt-6 border-t border-white/5">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-slate-500">Email</span>
                  <span className="text-white truncate max-w-[150px]">{user.email}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-slate-500">Statut Compte</span>
                  <span className="text-emerald-500 flex items-center gap-1"><CheckCircle size={10} /> Actif</span>
                </div>
              </div>
            </div>

            {/* Formulaire Settings */}
            <div className="lg:col-span-2 space-y-8">
              <div className="card">
                <div className="flex items-center gap-3 mb-10">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <User size={20} />
                  </div>
                  <h3 className="text-lg font-black tracking-tight">Informations Générales</h3>
                </div>

                <form onSubmit={handleUpdate} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Prénom</label>
                      <input 
                        type="text" 
                        className="input-field" 
                        value={formData.prenom}
                        onChange={e => setFormData({...formData, prenom: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Nom de famille</label>
                      <input 
                        type="text" 
                        className="input-field" 
                        value={formData.nom}
                        onChange={e => setFormData({...formData, nom: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Numéro de téléphone</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                      <input 
                        type="tel" 
                        className="input-field pl-12" 
                        value={formData.telephone}
                        onChange={e => setFormData({...formData, telephone: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="pt-10 border-t border-white/5">
                    <div className="flex items-center gap-3 mb-10">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <Lock size={20} />
                      </div>
                      <h3 className="text-lg font-black tracking-tight">Sécurité du compte</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Nouveau mot de passe</label>
                        <input 
                          type="password" 
                          className="input-field" 
                          placeholder="••••••••"
                          onChange={e => setFormData({...formData, newPassword: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Confirmer le mot de passe</label>
                        <input 
                          type="password" 
                          className="input-field" 
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-8 border-t border-white/5">
                    {success ? (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 text-emerald-500 font-black text-xs uppercase tracking-widest"
                      >
                        <CheckCircle size={18} /> Profil mis à jour
                      </motion.div>
                    ) : <div></div>}
                    
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="btn-primary flex items-center gap-3 shadow-lg shadow-primary/20 px-12"
                    >
                      {loading ? <Loader2 className="animate-spin" /> : <><Save size={18} /> ENREGISTRER</>}
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
