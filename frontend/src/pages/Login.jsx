import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Lock, Loader2, ArrowRight, Shield, Eye, EyeOff, 
  AlertCircle, CheckCircle2, MapPin, Building2,
  KeyRound
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import { LogoIcon } from '../components/Logo';
import Navbar from '../components/Navbar';
import { useTheme } from '../context/ThemeContext';
import placeIndepImg from '../assets/place-indep.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Comptes démos rapides pour faciliter l'évaluation et l'expérience utilisateur
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });

      if (response.data.status === 'success') {
        const { token, user } = response.data.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.response?.data?.message || 'Vérifiez vos identifiants ou votre connexion internet.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen font-sans flex flex-col justify-between pt-16 md:pt-20 relative overflow-hidden transition-colors duration-300 ${
      isDark ? 'bg-[#05070E] text-slate-100' : 'bg-slate-100/90 text-slate-900'
    }`}>
      {/* Halos lumineux d'arrière-plan */}
      <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full blur-[140px] pointer-events-none ${
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
          {/* Formulaire de Connexion (Gauche - 7/12 cols sur Desktop) */}
          <div className={`lg:col-span-7 p-6 sm:p-10 md:p-12 flex flex-col justify-between ${
            isDark ? 'bg-[#0B101D]' : 'bg-white'
          }`}>
            <div>
              {/* Header de marque avec Badge Officiel */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <LogoIcon size="md" />
                  <div>
                    <h2 className="text-base font-black tracking-tight flex items-center gap-1.5">
                      Kivu Immobilier<span className="text-blue-600 font-extrabold">+</span>
                    </h2>
                    <p className={`text-[10px] font-extrabold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Réseau Foncier Cadastral • RDC
                    </p>
                  </div>
                </div>

                <span className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${
                  isDark ? 'bg-blue-950/60 border border-blue-800/60 text-blue-400' : 'bg-blue-50 border border-blue-200 text-blue-700'
                }`}>
                  <Shield size={12} className="text-blue-600 dark:text-blue-400" /> Accès Sécurisé SSL
                </span>
              </div>

              {/* Titre & Sous-titre */}
              <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-1.5">
                  Bienvenue de retour
                </h1>
                <p className={`text-xs sm:text-sm font-medium leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Connectez-vous à votre espace personnel pour suivre vos titres fonciers et transactions.
                </p>
              </div>

              {/* Formulaire principal */}
              <form onSubmit={handleLogin} className="space-y-4">
                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.98 }}
                      className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-red-700 text-xs font-semibold shadow-sm"
                    >
                      <AlertCircle size={18} className="shrink-0 text-red-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-bold text-red-800">Échec de connexion</p>
                        <p className="mt-0.5 leading-relaxed">{error}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Champ Email */}
                <div>
                  <label className={`text-xs font-bold block mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Adresse Email Professionnelle
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" size={18} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full border rounded-xl pl-10 pr-4 py-3 text-sm font-bold outline-none transition-all placeholder:text-slate-400 shadow-sm ${
                        isDark 
                          ? 'bg-[#0F172A] border-slate-700 text-white focus:border-blue-500' 
                          : 'bg-slate-50 border-slate-300 text-black focus:bg-white focus:border-blue-600'
                      }`}
                      placeholder="nom@domaine.cd"
                      required
                    />
                  </div>
                </div>

                {/* Champ Mot de Passe */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className={`text-xs font-bold block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Mot de passe
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-bold"
                    >
                      Mot de passe oublié ?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" size={18} />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                      aria-label="Afficher ou masquer le mot de passe"
                      className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-0.5 rounded transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Options : Se souvenir de moi */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-500 dark:text-slate-400 font-semibold select-none group">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer"
                    />
                    <span className="group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">Rester connecté sur cet appareil</span>
                  </label>
                </div>

                {/* Bouton SE CONNECTER */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 active:scale-[0.99] text-white font-black text-sm rounded-xl shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4 tracking-wide"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={19} />
                      <span>CONNEXION EN COURS...</span>
                    </>
                  ) : (
                    <>
                      <span>SE CONNECTER À MON ESPACE</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Lien Vers Inscription */}
            <div className={`mt-8 pt-5 border-t text-center text-xs font-medium ${
              isDark ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'
            }`}>
              Nouveau sur Kivu Immobilier+ ?{' '}
              <Link to="/register" className="text-blue-600 dark:text-blue-400 font-bold hover:underline ml-1 inline-flex items-center gap-1">
                Créer un compte certifié <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Section Droite : Vitrine Visuelle Kivu Immobilier+ (Desktop 5/12 cols) */}
          <div className="hidden lg:col-span-5 lg:relative lg:flex flex-col justify-between p-10 bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-950 text-white overflow-hidden border-l border-blue-600">
            {/* Arrière-plan avec Image de Bukavu & Overlays Gradient */}
            <div className="absolute inset-0 opacity-20 mix-blend-overlay">
              <img 
                src={placeIndepImg || "assets/place-indep.png"} 
                alt="Bukavu Place de l'Indépendance" 
                className="w-full h-full object-cover scale-105" 
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-950 via-blue-900/80 to-transparent" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

            {/* Top Badge */}
            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 text-white border border-white/20 text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
                <Shield size={13} className="text-blue-200 animate-pulse" /> Espace Officiel Sécurisé
              </div>
              <h3 className="text-2xl font-black text-white leading-tight tracking-tight">
                Plateforme Cadastrale & Transactions Immobilières RDC.
              </h3>
              <p className="text-xs text-blue-100 leading-relaxed font-normal">
                Authentifiez vos parcelles, supervisez les procès-verbaux des agents et validez les contrats notariés en toute transparence au Sud-Kivu.
              </p>
            </div>

            {/* Points forts avec icônes et fond translucide */}
            <div className="relative z-10 space-y-3.5 pt-6 border-t border-white/15">
              <div className="flex items-start gap-3 text-xs text-white bg-white/10 p-3.5 rounded-xl backdrop-blur-md border border-white/15">
                <CheckCircle2 size={18} className="text-blue-200 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Certificats d'Enregistrement Numérisés</span>
                  <span className="text-[11px] text-blue-100">Titres certifiés et infalsifiables.</span>
                </div>
              </div>
              
              <div className="flex items-start gap-3 text-xs text-white bg-white/10 p-3.5 rounded-xl backdrop-blur-md border border-white/15">
                <Building2 size={18} className="text-blue-200 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Inspection Terrain & Notarisation</span>
                  <span className="text-[11px] text-blue-100">Rapports géolocalisés avec preuves visuelles.</span>
                </div>
              </div>
              
              <div className="flex items-start gap-3 text-xs text-white bg-white/10 p-3.5 rounded-xl backdrop-blur-md border border-white/15">
                <MapPin size={18} className="text-blue-200 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Couverture Régionale</span>
                  <span className="text-[11px] text-blue-100">Bukavu (Ibanda, Kadutu, Bagira), Goma & Sud-Kivu.</span>
                </div>
              </div>
            </div>

            {/* Pied de carte */}
            <div className="relative z-10 pt-4 flex items-center justify-between text-[11px] text-blue-200 font-semibold border-t border-white/15">
              <span>© 2026 Kivu Immobilier+</span>
              <span className="text-white font-bold">République Démocratique du Congo</span>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Modal / Bulle Information Mot de Passe Oublié */}
      <AnimatePresence>
        {showForgotModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowForgotModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-[#0B101D] text-slate-900 dark:text-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2">
                <KeyRound size={24} />
              </div>
              <h3 className="text-lg font-black">Récupération de Mot de Passe</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Pour des raisons de sécurité cadastrale, la réinitialisation de mot de passe nécessite une vérification par email ou auprès de la conservation foncière.
              </p>
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl text-xs border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-bold block">Contact d'assistance :</span>
                <p>Email: <strong className="text-blue-600 dark:text-blue-400">support@kivuimmobilier.cd</strong></p>
                <p>Bukavu, Sud-Kivu, RDC</p>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="w-full py-2.5 bg-slate-900 dark:bg-blue-600 text-white text-xs font-bold rounded-xl transition-all"
              >
                Compris, fermer
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;
