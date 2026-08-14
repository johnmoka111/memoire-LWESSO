import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Lock, User, Wallet, ArrowRight, ArrowLeft, Check, Loader2, 
  Shield, CheckCircle2, Building2, MapPin, Eye, EyeOff, AlertCircle, 
  Phone, Sparkles, UserCheck, KeyRound
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import { LogoIcon } from '../components/Logo';
import Navbar from '../components/Navbar';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import placeIndepImg from '../assets/place-indep.png';

const Register = () => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stepError, setStepError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [connectingWallet, setConnectingWallet] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    telephone: '',
    role: 'acheteur',
    wallet: ''
  });

  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: 'bg-slate-200' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, label: 'Faible', color: 'bg-red-500', text: 'text-red-600' };
    if (score <= 3) return { score: 2, label: 'Moyen', color: 'bg-amber-500', text: 'text-amber-600' };
    if (score <= 4) return { score: 3, label: 'Fort', color: 'bg-blue-600', text: 'text-blue-600' };
    return { score: 4, label: 'Très Sécurisé', color: 'bg-emerald-500', text: 'text-emerald-600' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const nextStep = () => {
    setStepError('');
    if (step === 1) {
      if (!formData.prenom.trim() || !formData.nom.trim()) {
        setStepError('Veuillez remplir votre prénom et votre nom de famille.');
        return;
      }
    } else if (step === 2) {
      if (!formData.email.trim() || !formData.password) {
        setStepError('Veuillez entrer une adresse email valide et un mot de passe.');
        return;
      }
      if (formData.password.length < 6) {
        setStepError('Le mot de passe doit contenir au moins 6 caractères.');
        return;
      }
      if (confirmPassword && formData.password !== confirmPassword) {
        setStepError('Les mots de passe ne correspondent pas.');
        return;
      }
    }
    setStep((s) => Math.min(s + 1, 3));
  };

  const prevStep = () => {
    setStepError('');
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleConnectMetaMask = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        setConnectingWallet(true);
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts && accounts.length > 0) {
          setFormData((prev) => ({ ...prev, wallet: accounts[0] }));
        }
      } catch (err) {
        console.error("Erreur de connexion MetaMask:", err);
      } finally {
        setConnectingWallet(false);
      }
    } else {
      toast("MetaMask n'est pas détecté. Vous pourrez ajouter votre adresse wallet plus tard.", 'warning');
    }
  };

  const handleRegister = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');
    setStepError('');

    try {
      await axios.post(`${API_URL}/auth/register`, formData);
      navigate('/login?registered=1');
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.'
      );
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen font-sans flex flex-col justify-between pt-16 md:pt-20 relative overflow-hidden transition-colors duration-300 ${
      isDark ? 'bg-[#05070E] text-slate-100' : 'bg-slate-100/90 text-slate-900'
    }`}>
      {/* Halos lumineux d'arrière-plan */}
      <div className={`absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full blur-[140px] pointer-events-none ${
        isDark ? 'bg-blue-600/10' : 'bg-blue-200/40'
      }`} />
      <div className={`absolute bottom-10 right-10 w-[450px] h-[450px] rounded-full blur-[120px] pointer-events-none ${
        isDark ? 'bg-indigo-600/10' : 'bg-indigo-200/40'
      }`} />

      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative z-10 py-6 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className={`w-full max-w-5xl rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 border transition-colors duration-300 shadow-xl ${
            isDark 
              ? 'bg-[#0B101D] text-white border-slate-800 shadow-black/50' 
              : 'bg-white text-slate-900 border-slate-200 shadow-slate-300/50'
          }`}
        >
          {/* Formulaire d'Inscription (Gauche - 7/12 cols) */}
          <div className={`lg:col-span-7 p-6 sm:p-10 md:p-12 flex flex-col justify-between ${
            isDark ? 'bg-[#0B101D]' : 'bg-white'
          }`}>
            <div>
              {/* Branding Header & Stepper Badge */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <LogoIcon size="md" />
                  <div>
                    <h2 className="text-base font-black tracking-tight flex items-center gap-1">
                      Kivu Immobilier<span className="text-blue-600 font-extrabold">+</span>
                    </h2>
                    <p className={`text-[10px] font-extrabold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Nouveau Compte
                    </p>
                  </div>
                </div>

                <span className={`px-3.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider shadow-sm ${
                  isDark ? 'bg-blue-950/60 border border-blue-800/60 text-blue-400' : 'bg-blue-50 border border-blue-200 text-blue-700'
                }`}>
                  Étape {step} / 3
                </span>
              </div>

              {/* Stepper Visuel Interactif */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-xs font-bold mb-2">
                  <span className={`flex items-center gap-1.5 ${step >= 1 ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>1</span>
                    Identité
                  </span>
                  <span className={`flex items-center gap-1.5 ${step >= 2 ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>2</span>
                    Sécurité
                  </span>
                  <span className={`flex items-center gap-1.5 ${step >= 3 ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>3</span>
                    Profil & Web3
                  </span>
                </div>
                <div className={`w-full h-2 rounded-full overflow-hidden p-0.5 border ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
                }`}>
                  <motion.div
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full"
                    initial={{ width: '33%' }}
                    animate={{ width: `${(step / 3) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* Titre de l'Étape */}
              <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-1">
                  {step === 1 && "Vos Informations Personnelles"}
                  {step === 2 && "Sécurité & Identifiants"}
                  {step === 3 && "Choix du Profil & Wallet Blockchain"}
                </h1>
                <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {step === 1 && "Renseignez votre identité officielle pour vos futurs actes fonciers."}
                  {step === 2 && "Définissez une adresse email et un mot de passe ultra sécurisé."}
                  {step === 3 && "Sélectionnez votre type d'activité et associez un wallet MetaMask si désiré."}
                </p>
              </div>

              {/* Message d'erreur d'étape */}
              <AnimatePresence mode="wait">
                {(stepError || error) && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 text-xs font-bold"
                  >
                    <AlertCircle size={18} className="shrink-0 text-red-600" />
                    <span>{stepError || error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Formulaire Multi-Étapes */}
              <AnimatePresence mode="wait">
                {/* ÉTAPE 1 */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className={`text-xs font-bold block mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Prénom Officiel
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" size={18} />
                        <input
                          type="text"
                          value={formData.prenom}
                          onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                          className={`w-full border rounded-xl pl-10 pr-4 py-3 text-sm font-bold outline-none transition-all placeholder:text-slate-400 shadow-sm ${
                            isDark 
                              ? 'bg-[#0F172A] border-slate-700 text-white focus:border-blue-500' 
                              : 'bg-slate-50 border-slate-300 text-black focus:bg-white focus:border-blue-600'
                          }`}
                          placeholder="Jean-Baptiste"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className={`text-xs font-bold block mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Nom de Famille
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" size={18} />
                        <input
                          type="text"
                          value={formData.nom}
                          onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                          className={`w-full border rounded-xl pl-10 pr-4 py-3 text-sm font-bold outline-none transition-all placeholder:text-slate-400 shadow-sm ${
                            isDark 
                              ? 'bg-[#0F172A] border-slate-700 text-white focus:border-blue-500' 
                              : 'bg-slate-50 border-slate-300 text-black focus:bg-white focus:border-blue-600'
                          }`}
                          placeholder="Muderhwa"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className={`text-xs font-bold block mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Numéro de Téléphone (Optionnel)
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" size={18} />
                        <input
                          type="tel"
                          value={formData.telephone}
                          onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                          className={`w-full border rounded-xl pl-10 pr-4 py-3 text-sm font-bold outline-none transition-all placeholder:text-slate-400 shadow-sm ${
                            isDark 
                              ? 'bg-[#0F172A] border-slate-700 text-white focus:border-blue-500' 
                              : 'bg-slate-50 border-slate-300 text-black focus:bg-white focus:border-blue-600'
                          }`}
                          placeholder="+243 990 000 000"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ÉTAPE 2 */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className={`text-xs font-bold block mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Adresse Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" size={18} />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className={`w-full border rounded-xl pl-10 pr-4 py-3 text-sm font-bold outline-none transition-all placeholder:text-slate-400 shadow-sm ${
                            isDark 
                              ? 'bg-[#0F172A] border-slate-700 text-white focus:border-blue-500' 
                              : 'bg-slate-50 border-slate-300 text-black focus:bg-white focus:border-blue-600'
                          }`}
                          placeholder="jean.muderhwa@kivuimmobilier.cd"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className={`text-xs font-bold block mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Créer un Mot de Passe
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" size={18} />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          className={`w-full border rounded-xl pl-10 pr-11 py-3 text-sm font-bold outline-none transition-all placeholder:text-slate-400 shadow-sm ${
                            isDark 
                              ? 'bg-[#0F172A] border-slate-700 text-white focus:border-blue-500' 
                              : 'bg-slate-50 border-slate-300 text-black focus:bg-white focus:border-blue-600'
                          }`}
                          placeholder="••••••••••••"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-0.5"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>

                      {/* Jauge de force du mot de passe */}
                      {formData.password && (
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center justify-between text-[11px] font-bold">
                            <span className="text-slate-500">Force du mot de passe :</span>
                            <span className={passwordStrength.text}>{passwordStrength.label}</span>
                          </div>
                          <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                            <div
                              className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                              style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className={`text-xs font-bold block mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Confirmer le Mot de Passe
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" size={18} />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className={`w-full border rounded-xl pl-10 pr-4 py-3 text-sm font-bold outline-none transition-all placeholder:text-slate-400 shadow-sm ${
                            isDark 
                              ? 'bg-[#0F172A] border-slate-700 text-white focus:border-blue-500' 
                              : 'bg-slate-50 border-slate-300 text-black focus:bg-white focus:border-blue-600'
                          }`}
                          placeholder="••••••••••••"
                        />
                      </div>
                      {confirmPassword && (
                        <p className={`text-[11px] font-bold mt-1 ${formData.password === confirmPassword ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                          {formData.password === confirmPassword ? '✓ Mots de passe identiques' : '✗ Les mots de passe ne correspondent pas'}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* ÉTAPE 3 */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className={`text-xs font-bold block mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Sélectionnez votre Profil Utilisateur
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Option 1: Acheteur */}
                        <div
                          onClick={() => setFormData({ ...formData, role: 'acheteur' })}
                          className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                            formData.role === 'acheteur'
                              ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/60 shadow-md ring-2 ring-blue-600/20'
                              : isDark 
                                ? 'border-slate-800 bg-[#080C16] hover:border-slate-700' 
                                : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                              <UserCheck size={20} />
                            </div>
                            {formData.role === 'acheteur' && <CheckCircle2 size={18} className="text-blue-600 dark:text-blue-400" />}
                          </div>
                          <h4 className="text-sm font-black">Acheteur / Investisseur</h4>
                          <p className={`text-[11px] font-medium mt-1 leading-snug ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            Rechercher, réserver et acquérir des parcelles certifiées au Sud-Kivu.
                          </p>
                        </div>

                        {/* Option 2: Propriétaire */}
                        <div
                          onClick={() => setFormData({ ...formData, role: 'proprietaire' })}
                          className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                            formData.role === 'proprietaire'
                              ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/60 shadow-md ring-2 ring-blue-600/20'
                              : isDark 
                                ? 'border-slate-800 bg-[#080C16] hover:border-slate-700' 
                                : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                              <Building2 size={20} />
                            </div>
                            {formData.role === 'proprietaire' && <CheckCircle2 size={18} className="text-blue-600 dark:text-blue-400" />}
                          </div>
                          <h4 className="text-sm font-black">Propriétaire Vendeur</h4>
                          <p className={`text-[11px] font-medium mt-1 leading-snug ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            Publier vos terrains et soumettre vos titres à l'inspection notariale.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className={`text-xs font-bold block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                          Adresse Wallet MetaMask Web3 (Optionnel)
                        </label>
                        <button
                          type="button"
                          onClick={handleConnectMetaMask}
                          disabled={connectingWallet}
                          className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-bold flex items-center gap-1"
                        >
                          {connectingWallet ? <Loader2 className="animate-spin" size={13} /> : <Sparkles size={13} className="text-amber-500" />}
                          Connecter MetaMask
                        </button>
                      </div>

                      <div className="relative">
                        <Wallet className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" size={18} />
                        <input
                          type="text"
                          value={formData.wallet}
                          onChange={(e) => setFormData({ ...formData, wallet: e.target.value })}
                          className={`w-full border rounded-xl pl-10 pr-4 py-3 text-sm font-bold outline-none transition-all placeholder:text-slate-400 shadow-sm ${
                            isDark 
                              ? 'bg-[#0F172A] border-slate-700 text-white focus:border-blue-500' 
                              : 'bg-slate-50 border-slate-300 text-black focus:bg-white focus:border-blue-600'
                          }`}
                          placeholder="0x1234...abcd"
                        />
                      </div>
                      {formData.wallet && (
                        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-1 flex items-center gap-1">
                          <CheckCircle2 size={13} /> Wallet connecté: {formData.wallet.substring(0, 8)}...{formData.wallet.substring(formData.wallet.length - 6)}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation des Étapes */}
              <div className={`flex items-center justify-between gap-4 mt-8 pt-5 border-t ${
                isDark ? 'border-slate-800' : 'border-slate-100'
              }`}>
                <button
                  type="button"
                  onClick={prevStep}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-xs font-bold transition-all active:scale-95 ${
                    isDark 
                      ? 'border-slate-700 text-slate-300 hover:bg-slate-800' 
                      : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                  } ${step === 1 ? 'invisible pointer-events-none' : 'visible'}`}
                >
                  <ArrowLeft size={16} /> Précédent
                </button>

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs shadow-lg shadow-blue-600/25 transition-all active:scale-95 tracking-wide"
                  >
                    <span>Étape Suivante</span>
                    <ArrowRight size={16} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleRegister}
                    disabled={loading}
                    className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-black text-xs shadow-lg shadow-emerald-600/25 transition-all active:scale-95 disabled:opacity-50 tracking-wide"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        <span>CREATION DU COMPTE...</span>
                      </>
                    ) : (
                      <>
                        <span>CRÉER MON COMPTE</span>
                        <Check size={16} />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Lien Connexion */}
            <div className={`mt-8 pt-5 border-t text-center text-xs font-medium ${
              isDark ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'
            }`}>
              Vous avez déjà un compte ?{' '}
              <Link to="/login" className="text-blue-600 dark:text-blue-400 font-bold hover:underline ml-1 inline-flex items-center gap-1">
                Se connecter directement <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Section Droite : Vitrine Inscription (Desktop 5/12 cols) */}
          <div className="hidden lg:col-span-5 lg:relative lg:flex flex-col justify-between p-10 bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-950 text-white overflow-hidden border-l border-blue-600">
            <div className="absolute inset-0 opacity-20 mix-blend-overlay">
              <img src={placeIndepImg || "assets/place-indep.png"} alt="Bukavu" className="w-full h-full object-cover scale-105" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-950 via-blue-900/80 to-transparent" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 text-white border border-white/20 text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
                <Shield size={13} className="text-blue-200 animate-pulse" /> Réseau Foncier Certifié
              </span>
              <h3 className="text-2xl font-black text-white leading-tight tracking-tight">
                Plateforme Officielle du Sud-Kivu.
              </h3>
              <p className="text-xs text-blue-100 leading-relaxed font-normal">
                Rejoignez la première plateforme immobilière intégrant la notarisation, le cadastre numérique et la sécurité des fonds par Smart Contract Escrow.
              </p>
            </div>

            <div className="relative z-10 space-y-3.5 pt-6 border-t border-white/15">
              <div className="flex items-start gap-3 text-xs text-white bg-white/10 p-3.5 rounded-xl backdrop-blur-md border border-white/15">
                <CheckCircle2 size={18} className="text-blue-200 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Protection Totale des Acheteurs</span>
                  <span className="text-[11px] text-blue-100">Paiements sous séquestre jusqu'à validation.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs text-white bg-white/10 p-3.5 rounded-xl backdrop-blur-md border border-white/15">
                <Building2 size={18} className="text-blue-200 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Vérification par Experts Notaires</span>
                  <span className="text-[11px] text-blue-100">Contrôle d'authenticité avant publication.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs text-white bg-white/10 p-3.5 rounded-xl backdrop-blur-md border border-white/15">
                <MapPin size={18} className="text-blue-200 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Support Local à Bukavu</span>
                  <span className="text-[11px] text-blue-100">Equipe dédiée pour vous accompagner.</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-4 flex items-center justify-between text-[11px] text-blue-200 font-semibold border-t border-white/15">
              <span>© 2026 Kivu Immobilier+</span>
              <span className="text-white font-bold">République Démocratique du Congo</span>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Register;
