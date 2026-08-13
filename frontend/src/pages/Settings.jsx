import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Phone, Lock, Shield, Save, Loader2, Camera,
  CheckCircle, AlertCircle, Key, Eye, EyeOff,
  Award, Sparkles, Cpu, ChevronRight, Check, ArrowRight, ArrowLeft, Wallet, Bell
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
  
  const [activeSection, setActiveSection] = useState(1);
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
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar_url: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      const token = localStorage.getItem('token');
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
        const updatedUser = res.data?.data?.user || { ...user, ...payload };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        return true;
      } else {
        throw new Error(res.data?.message || "Erreur de mise à jour");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Erreur lors de la mise à jour");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e?.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (passwordData.new_password !== passwordData.confirm_password) {
      setPasswordError("Les nouveaux mots de passe ne correspondent pas");
      return false;
    }
    if (passwordData.new_password.length < 6) {
      setPasswordError("Le mot de passe doit contenir au moins 6 caractères");
      return false;
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
        setTimeout(() => setPasswordSuccess(false), 3000);
        return true;
      } else {
        throw new Error(res.data?.message || "Échec du changement");
      }
    } catch (err) {
      setPasswordError(err.response?.data?.message || err.message || "Erreur lors du changement de mot de passe");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    { id: 1, title: '1. Informations Personnelles', desc: 'Identité et photo de profil', icon: User },
    { id: 2, title: '2. Sécurité & Mot de Passe', desc: 'Authentification et chiffrement', icon: Lock },
    { id: 3, title: '3. Portefeuille Blockchain', desc: 'Intégration Web3 & MetaMask', icon: Wallet },
    { id: 4, title: '4. Préférences de Session', desc: 'Rôle et clés de connexion', icon: Cpu }
  ];

  return (
    <div className="flex min-h-screen bg-[#080A12] text-slate-100 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <Navbar />

        <main className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full space-y-8">
          {/* Header */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/30 via-primary/10 to-transparent border border-white/10 p-6 md:p-8">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-[10px] font-black uppercase tracking-widest">
                  <Sparkles size={12} /> Configuration Pas-à-Pas
                </span>
                <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight">Paramètres du Compte</h1>
                <p className="text-slate-400 text-xs md:text-sm">Complétez les sections ci-dessous l'une après l'autre pour sécuriser votre compte.</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 bg-white/5 rounded-2xl px-4 py-2 border border-white/10 shrink-0">
                <Shield size={14} className="text-emerald-400" />
                <span>Protection SSL & Web3 Active</span>
              </div>
            </div>
          </div>

          {/* Barre de Progression Étape par Étape (Expérience similaire à CreateProperty) */}
          <div className="relative h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(activeSection / 4) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Navigation par Sections Étape par Étape */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {sections.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              const isDone = activeSection > sec.id;

              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden ${
                    isActive
                      ? 'bg-blue-950/70 border-blue-600 text-white shadow-lg'
                      : isDone
                      ? 'bg-emerald-950/30 border-emerald-800/50 text-slate-300'
                      : 'bg-[#0B101D] border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 rounded-xl ${isActive ? 'bg-blue-600 text-white' : isDone ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-slate-400'}`}>
                      {isDone ? <Check size={16} /> : <Icon size={16} />}
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Sec 0{sec.id}</span>
                  </div>
                  <p className="text-xs font-bold truncate">{sec.title}</p>
                  <p className="text-[10px] text-slate-500 truncate mt-0.5">{sec.desc}</p>
                </button>
              );
            })}
          </div>

          {/* Contenu des Sections Complétables l'une après l'autre */}
          <div className="bg-[#0B101D] border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
            {/* SECTION 1 : INFORMATIONS PERSONNELLES */}
            {activeSection === 1 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-950/60 border border-blue-800/40 rounded-2xl text-blue-400">
                      <User size={22} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Section 1 — Informations Personnelles</h2>
                      <p className="text-xs text-slate-400">Mettez à jour vos identifiants et votre photo de profil.</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 bg-blue-950/60 px-3 py-1 rounded-full border border-blue-800/40">Étape 1 sur 4</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-[#080C16] border border-slate-800 rounded-2xl">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-900 border border-slate-700 flex items-center justify-center">
                      {formData.avatar_url ? (
                        <img src={formData.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <User size={40} className="text-slate-500" />
                      )}
                    </div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-2 -right-2 p-2 bg-blue-600 rounded-xl text-white shadow-lg hover:bg-blue-500 transition-all"
                    >
                      <Camera size={14} />
                    </button>
                    <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleAvatarChange} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{formData.prenom} {formData.nom}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{formData.email}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 mt-2">Format accepté : JPG, PNG (Max 5Mo)</p>
                  </div>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-2">Prénom</label>
                      <input
                        type="text"
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-black font-bold outline-none focus:border-blue-600"
                        value={formData.prenom}
                        onChange={e => setFormData({ ...formData, prenom: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-2">Nom</label>
                      <input
                        type="text"
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-black font-bold outline-none focus:border-blue-600"
                        value={formData.nom}
                        onChange={e => setFormData({ ...formData, nom: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-2">Téléphone</label>
                    <input
                      type="tel"
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-black font-bold outline-none focus:border-blue-600"
                      placeholder="+243 XXX XXX XXX"
                      value={formData.telephone}
                      onChange={e => setFormData({ ...formData, telephone: e.target.value })}
                    />
                  </div>

                  {success && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-bold flex items-center gap-2">
                      <CheckCircle size={16} /> Section 1 enregistrée avec succès !
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <span className="text-xs text-slate-500">Sauvegardez pour passer à la section suivante.</span>
                    <button
                      type="button"
                      onClick={async (e) => {
                        const ok = await handleUpdateProfile(e);
                        if (ok) setActiveSection(2);
                      }}
                      disabled={loading}
                      className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-indigo-500/20"
                    >
                      {loading ? <Loader2 className="animate-spin" size={16} /> : <>Valider & Section Suivante <ArrowRight size={16} /></>}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* SECTION 2 : SÉCURITÉ ET MOT DE PASSE */}
            {activeSection === 2 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-400">
                      <Lock size={22} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Section 2 — Sécurité & Mot de Passe</h2>
                      <p className="text-xs text-slate-400">Renforcez l'accès à votre compte administrateur.</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">Étape 2 sur 4</span>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-5">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-2">Mot de passe actuel</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 outline-none pr-10"
                        value={passwordData.current_password}
                        onChange={e => setPasswordData({ ...passwordData, current_password: e.target.value })}
                        required
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-slate-500 hover:text-white">
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-2">Nouveau mot de passe</label>
                      <input
                        type="password"
                        className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 outline-none"
                        value={passwordData.new_password}
                        onChange={e => setPasswordData({ ...passwordData, new_password: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-2">Confirmer le nouveau mot de passe</label>
                      <input
                        type="password"
                        className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 outline-none"
                        value={passwordData.confirm_password}
                        onChange={e => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  {passwordSuccess && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-bold flex items-center gap-2">
                      <CheckCircle size={16} /> Mot de passe modifié avec succès !
                    </div>
                  )}

                  {passwordError && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-bold flex items-center gap-2">
                      <AlertCircle size={16} /> {passwordError}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <button type="button" onClick={() => setActiveSection(1)} className="px-4 py-2 text-xs text-slate-400 hover:text-white flex items-center gap-2">
                      <ArrowLeft size={16} /> Section Précédente
                    </button>
                    <button
                      type="button"
                      onClick={async (e) => {
                        if (passwordData.new_password) {
                          const ok = await handleChangePassword(e);
                          if (ok) setActiveSection(3);
                        } else {
                          setActiveSection(3);
                        }
                      }}
                      disabled={loading}
                      className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20"
                    >
                      {loading ? <Loader2 className="animate-spin" size={16} /> : <>Enregistrer & Section 3 <ArrowRight size={16} /></>}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* SECTION 3 : PORTEFEUILLE BLOCKCHAIN */}
            {activeSection === 3 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400">
                      <Wallet size={22} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Section 3 — Portefeuille Blockchain & Web3</h2>
                      <p className="text-xs text-slate-400">Vérifiez les clés de signature et le nœud Hardhat.</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">Étape 3 sur 4</span>
                </div>

                <div className="p-5 bg-white/[0.02] border border-white/10 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">Réseau Local Hardhat</span>
                    <span className="px-2.5 py-1 text-[9px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Connected 8545
                    </span>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Adresse de Contrat Escrow</label>
                    <input type="text" readOnly className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-300 font-mono" value="0x5FbDB2315678afecb367f032d93F642f64180aa3" />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <button type="button" onClick={() => setActiveSection(2)} className="px-4 py-2 text-xs text-slate-400 hover:text-white flex items-center gap-2">
                    <ArrowLeft size={16} /> Section Précédente
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSection(4)}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20"
                  >
                    Confirmer & Section 4 <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* SECTION 4 : PRÉFÉRENCES DE SESSION */}
            {activeSection === 4 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-2xl text-purple-400">
                      <Cpu size={22} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Section 4 — Préférences & Session Active</h2>
                      <p className="text-xs text-slate-400">Récapitulatif et validation de la configuration de votre compte.</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">Étape 4 sur 4</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-white/[0.02] border border-white/10 rounded-2xl space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Rôle Actif</span>
                    <p className="text-sm font-bold text-white uppercase">{user.role || 'Utilisateur'}</p>
                  </div>
                  <div className="p-4 bg-white/[0.02] border border-white/10 rounded-2xl space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Environnement OS</span>
                    <p className="text-sm font-bold text-emerald-400">Windows Desktop Active</p>
                  </div>
                </div>

                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center space-y-2">
                  <Award size={32} className="text-emerald-400 mx-auto" />
                  <h3 className="text-sm font-bold text-white">Toutes les sections sont complétées avec succès !</h3>
                  <p className="text-xs text-slate-400">Votre profil et votre session sont parfaitement sécurisés.</p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <button type="button" onClick={() => setActiveSection(3)} className="px-4 py-2 text-xs text-slate-400 hover:text-white flex items-center gap-2">
                    <ArrowLeft size={16} /> Section Précédente
                  </button>
                  <a
                    href="#/dashboard"
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-primary text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-indigo-500/20"
                  >
                    Retour au Tableau de Bord <Check size={16} />
                  </a>
                </div>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;