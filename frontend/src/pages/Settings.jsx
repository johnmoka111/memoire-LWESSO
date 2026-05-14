import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Phone, Lock, Shield, Save, Loader2, Camera,
  CheckCircle, AlertCircle, Smartphone, Key, Eye, EyeOff,
  MapPin, Briefcase, Calendar, Award, TrendingUp, Sparkles
} from 'lucide-react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { API_URL } from '../config';

const Settings = () => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : {};
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    nom: user.nom || '',
    prenom: user.prenom || '',
    telephone: user.telephone || '',
    email: user.email || '',
    avatar_url: user.avatar_url || null
  });

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Synchroniser formData avec user à chaque changement de user (ex: après mise à jour)
  useEffect(() => {
    setFormData({
      nom: user.nom || '',
      prenom: user.prenom || '',
      telephone: user.telephone || '',
      email: user.email || '',
      avatar_url: user.avatar_url || null
    });
  }, [user]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Compression / résolution basique
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar_url: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      // Envoi des données du profil
      const payload = {
        nom: formData.nom,
        prenom: formData.prenom,
        telephone: formData.telephone,
        avatar_url: formData.avatar_url
      };

      const res = await axios.put(`${API_URL}/user/profile`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data?.success || res.status === 200) {
        // Récupérer l'utilisateur mis à jour (soit depuis la réponse, soit refetch)
        const updatedUser = res.data?.data?.user || { ...user, ...payload };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 4000);
      } else {
        throw new Error(res.data?.message || "Erreur de mise à jour");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Erreur lors de la mise à jour du profil");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    // Validations côté client
    if (passwordData.new_password !== passwordData.confirm_password) {
      setPasswordError("Les nouveaux mots de passe ne correspondent pas");
      return;
    }
    if (passwordData.new_password.length < 6) {
      setPasswordError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`${API_URL}/user/password`, {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data?.success || res.status === 200) {
        setPasswordSuccess(true);
        setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
        setTimeout(() => setPasswordSuccess(false), 4000);
      } else {
        throw new Error(res.data?.message || "Échec du changement");
      }
    } catch (err) {
      setPasswordError(err.response?.data?.message || err.message || "Erreur lors du changement de mot de passe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0A0A0F] via-[#0F0F1A] to-[#0A0A0F] text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-auto">
        <Navbar />

        <main className="p-4 md:p-6 lg:p-8 xl:p-10 space-y-10 overflow-x-auto">
          {/* En-tête avec dégradé */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/15 via-primary/5 to-transparent border border-white/10 p-6 md:p-8">
            <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-[80px]" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-primary/30 to-primary/10 rounded-full border border-primary/30 backdrop-blur-sm">
                  <Sparkles size={12} className="text-primary" />
                  <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Espace personnel sécurisé</span>
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                  Paramètres du <span className="text-primary">compte</span>
                </h1>
                <p className="text-slate-400 text-sm max-w-xl">
                  Gérez vos informations personnelles, votre photo de profil et modifiez votre mot de passe en toute sécurité.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 bg-white/5 rounded-full px-4 py-2 border border-white/5">
                <Shield size={14} className="text-primary" />
                <span>Données chiffrées • Connexion sécurisée</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Carte de profil - version améliorée avec dégradés */}
            <div className="relative group bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur-sm border border-white/10 rounded-2xl p-6 h-fit transition-all hover:border-white/20 hover:shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none" />
              <div className="relative z-10 text-center">
                <div className="relative inline-block mb-6">
                  <div className={`w-32 h-32 rounded-xl overflow-hidden bg-gradient-to-br from-white/10 to-white/5 border-2 border-white/10 flex items-center justify-center mx-auto shadow-xl transition-all group-hover:border-primary/30`}>
                    {formData.avatar_url ? (
                      <img src={formData.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User size={56} className="text-slate-600" />
                    )}
                  </div>
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="absolute -bottom-2 -right-2 p-3 bg-gradient-to-r from-primary to-indigo-500 rounded-xl text-white shadow-lg border-2 border-[#0A0A0F] hover:scale-110 transition-all"
                  >
                    <Camera size={16} />
                  </button>
                  <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleAvatarChange} />
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">
                  {user.prenom} {user.nom}
                </h2>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full border border-primary/20 mb-6">
                  <Shield size={12} className="text-primary" />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-primary">
                    {user.role === 'admin' ? 'Administrateur' : user.role === 'agent' ? 'Agent foncier' : 'Propriétaire'}
                  </span>
                </div>

                <div className="space-y-3 text-left bg-white/[0.02] rounded-xl p-4 border border-white/5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Email</span>
                    <span className="text-xs text-slate-300 truncate max-w-[180px]">{user.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Téléphone</span>
                    <span className="text-xs text-slate-300">{user.telephone || 'Non renseigné'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Statut</span>
                    <span className="text-emerald-400 text-xs flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Certifié
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Panneau d'édition - Informations générales */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-gradient-to-br from-white/[0.02] to-transparent border border-white/10 rounded-2xl overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-6 border-b border-white/10 bg-white/[0.02]">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-indigo-500/20 flex items-center justify-center text-primary">
                    <User size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Informations personnelles</h3>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Modifiez vos données affichées sur la plateforme</p>
                  </div>
                </div>

                <form onSubmit={handleUpdateProfile} className="p-6 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">Prénom</label>
                      <input
                        type="text"
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-3.5 outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all text-sm font-medium"
                        value={formData.prenom}
                        onChange={e => setFormData({ ...formData, prenom: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">Nom</label>
                      <input
                        type="text"
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-3.5 outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all text-sm font-medium"
                        value={formData.nom}
                        onChange={e => setFormData({ ...formData, nom: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">Numéro de téléphone</label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                      <input
                        type="tel"
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-12 pr-5 py-3.5 outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all text-sm font-medium"
                        placeholder="+243 XXX XXX XXX"
                        value={formData.telephone}
                        onChange={e => setFormData({ ...formData, telephone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">Email (non modifiable)</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                      <input
                        type="email"
                        disabled
                        className="w-full bg-white/[0.02] border border-white/10 rounded-xl pl-12 pr-5 py-3.5 text-sm text-slate-400 cursor-not-allowed"
                        value={formData.email}
                      />
                    </div>
                    <p className="text-[9px] text-slate-600 mt-1">L'adresse email ne peut pas être modifiée. Contactez le support si nécessaire.</p>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-6 border-t border-white/10 gap-4">
                    <div>
                      <AnimatePresence>
                        {success && (
                          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-emerald-500 font-bold text-[10px] uppercase tracking-wider">
                            <CheckCircle size={14} /> Profil mis à jour avec succès
                          </motion.div>
                        )}
                        {error && (
                          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-red-500 font-bold text-[10px] uppercase tracking-wider">
                            <AlertCircle size={14} /> {error}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-8 py-3.5 bg-gradient-to-r from-primary to-indigo-500 hover:from-primary/90 hover:to-indigo-500/90 text-white font-semibold rounded-xl transition-all active:scale-95 shadow-xl shadow-primary/20 flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                      {loading ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18} /> Enregistrer les modifications</>}
                    </button>
                  </div>
                </form>
              </div>

              {/* Section changement de mot de passe */}
              <div className="bg-gradient-to-br from-white/[0.02] to-transparent border border-white/10 rounded-2xl overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-6 border-b border-white/10 bg-white/[0.02]">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center text-amber-400">
                    <Lock size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Sécurité & authentification</h3>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Changer votre mot de passe de connexion</p>
                  </div>
                </div>

                <form onSubmit={handleChangePassword} className="p-6 space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">Mot de passe actuel</label>
                    <div className="relative group">
                      <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                      <input
                        type={showPassword ? "text" : "password"}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-12 pr-12 py-3.5 outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all text-sm font-medium"
                        placeholder="Votre mot de passe actuel"
                        value={passwordData.current_password}
                        onChange={e => setPasswordData({ ...passwordData, current_password: e.target.value })}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-primary transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">Nouveau mot de passe</label>
                      <input
                        type="password"
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-3.5 outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all text-sm font-medium"
                        placeholder="Min. 6 caractères"
                        value={passwordData.new_password}
                        onChange={e => setPasswordData({ ...passwordData, new_password: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">Confirmer le nouveau mot de passe</label>
                      <input
                        type="password"
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-3.5 outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all text-sm font-medium"
                        placeholder="Répéter le mot de passe"
                        value={passwordData.confirm_password}
                        onChange={e => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-white/10 gap-4">
                    <div>
                      <AnimatePresence>
                        {passwordSuccess && (
                          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-emerald-500 font-bold text-[10px] uppercase tracking-wider">
                            <CheckCircle size={14} /> Mot de passe modifié avec succès
                          </motion.div>
                        )}
                        {passwordError && (
                          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-red-500 font-bold text-[10px] uppercase tracking-wider">
                            <AlertCircle size={14} /> {passwordError}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-xl transition-all active:scale-95 shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                      {loading ? <Loader2 className="animate-spin" size={18} /> : <><Lock size={18} /> Changer le mot de passe</>}
                    </button>
                  </div>
                </form>
              </div>

              {/* Carte d'information complémentaire */}
              <div className="bg-gradient-to-r from-primary/5 to-transparent border border-primary/20 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Award size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Compte vérifié</p>
                    <p className="text-[9px] text-slate-500">Toutes vos informations sont protégées par chiffrement SSL</p>
                  </div>
                </div>
                <div className="flex gap-3 text-[9px] text-slate-400">
                  <span>Dernière connexion : {new Date().toLocaleDateString()}</span>
                  <span>•</span>
                  <span>ID utilisateur : {user.id || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;