import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Wallet, ArrowRight, ArrowLeft, Check, Loader2, Shield, CheckCircle2, Building2, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import { LogoIcon } from '../components/Logo';
import Navbar from '../components/Navbar';

const Register = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nom: '', prenom: '', email: '', password: '', role: 'acheteur', wallet: ''
  });

  const nextStep = () => setStep(s => Math.min(s + 1, 3));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleRegister = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post(`${API_URL}/auth/register`, formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Une erreur est survenue lors de l\'inscription');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060812] text-slate-100 font-sans flex flex-col justify-between pt-20 relative overflow-hidden">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 md:p-8 relative z-10 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-4xl bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 border border-slate-200"
        >
          {/* Formulaire d'Inscription (Gauche) */}
          <div className="p-6 sm:p-10 flex flex-col justify-between">
            <div>
              {/* Branding Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <LogoIcon size="md" />
                  <div>
                    <h2 className="text-sm font-black text-slate-900 tracking-tight">Kivu Immobilier<span className="text-blue-600">+</span></h2>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Création de Compte</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-blue-50 text-blue-600 border border-blue-200 rounded-full text-[10px] font-black uppercase tracking-widest">
                  Étape {step} / 3
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-6">
                <div 
                  className="bg-blue-600 h-full transition-all duration-300"
                  style={{ width: `${(step / 3) * 100}%` }}
                />
              </div>

              <div className="mb-6">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1">
                  {step === 1 && "Vos Informations Personnelles"}
                  {step === 2 && "Sécurité & Coordonnées"}
                  {step === 3 && "Rôle & Adresse Wallet"}
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  {step === 1 && "Saisissez votre prénom et votre nom officiel."}
                  {step === 2 && "Entrez votre adresse email et votre mot de passe."}
                  {step === 3 && "Choisissez votre type de profil et votre adresse MetaMask."}
                </p>
              </div>

              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">Prénom</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                        <input
                          type="text"
                          value={formData.prenom}
                          onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-sm text-black font-bold outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all placeholder:text-slate-400"
                          placeholder="Jean"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">Nom de Famille</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                        <input
                          type="text"
                          value={formData.nom}
                          onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-sm text-black font-bold outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all placeholder:text-slate-400"
                          placeholder="Muderhwa"
                          required
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">Adresse Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-sm text-black font-bold outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all placeholder:text-slate-400"
                          placeholder="jean.muderhwa@exemple.cd"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">Mot de Passe</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                        <input
                          type="password"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-sm text-black font-bold outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all placeholder:text-slate-400"
                          placeholder="••••••••"
                          required
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    {error && (
                      <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-bold">
                        {error}
                      </div>
                    )}

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">Profil Utilisateur</label>
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-black font-bold outline-none focus:bg-white focus:border-blue-600"
                      >
                        <option value="acheteur">Acheteur / Investisseur</option>
                        <option value="proprietaire">Propriétaire Vendeur</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">Adresse Wallet MetaMask (Optionnel)</label>
                      <div className="relative">
                        <Wallet className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                        <input
                          type="text"
                          value={formData.wallet}
                          onChange={(e) => setFormData({ ...formData, wallet: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-sm text-black font-bold outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all placeholder:text-slate-400"
                          placeholder="0x1234...abcd"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation des Étapes */}
              <div className="flex items-center justify-between gap-4 mt-8 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={prevStep}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all ${step === 1 ? 'invisible' : 'visible'}`}
                >
                  <ArrowLeft size={16} /> Précédent
                </button>

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all"
                  >
                    Suivant <ArrowRight size={16} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleRegister}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="animate-spin" size={16} /> : <>TERMINER <Check size={16} /></>}
                  </button>
                )}
              </div>
            </div>

            {/* Lien Connexion */}
            <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
              Déjà un compte ?{' '}
              <Link to="/login" className="text-blue-600 font-bold hover:underline ml-1">
                Se connecter
              </Link>
            </div>
          </div>

          {/* Section Droite : Vitrine Inscription (Desktop) */}
          <div className="hidden lg:relative lg:flex flex-col justify-between p-8 bg-gradient-to-br from-[#060812] via-[#0B101D] to-[#0D1426] text-white overflow-hidden">
            <div className="absolute inset-0 opacity-30">
              <img src="assets/place.jpeg" alt="Bukavu" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060812] via-[#0B101D]/90 to-transparent" />
            </div>

            <div className="relative z-10 space-y-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 text-[10px] font-black uppercase tracking-widest">
                <Shield size={12} /> Rejoignez Kivu Immobilier+
              </span>
              <h3 className="text-2xl font-black text-white leading-tight">
                Le Premier Réseau Foncier Certifié du Sud-Kivu.
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Rejoignez des centaines de propriétaires et d'acheteurs en toute sécurité grâce à nos protocoles de notarisation et d'escrow blockchain.
              </p>
            </div>

            <div className="relative z-10 space-y-3 pt-6 border-t border-white/10">
              <div className="flex items-center gap-3 text-xs text-slate-200">
                <CheckCircle2 size={16} className="text-blue-400 shrink-0" />
                <span>Protection Intégrale de vos Achats</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-200">
                <Building2 size={16} className="text-blue-400 shrink-0" />
                <span>Certification en Ligne des Parcelles</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-200">
                <MapPin size={16} className="text-blue-400 shrink-0" />
                <span>Support Dédié à Bukavu & Région Kivu</span>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Register;
