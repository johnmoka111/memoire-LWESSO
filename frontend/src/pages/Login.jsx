import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Loader2, ArrowRight, Shield, Eye, EyeOff, AlertCircle, CheckCircle2, MapPin, Building2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import { LogoIcon } from '../components/Logo';
import Navbar from '../components/Navbar';
import placeImg from '../assets/place.jpeg';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

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
      setError(err.response?.data?.error || err.response?.data?.message || 'Vérifiez vos identifiants ou votre connexion.');
    } finally {
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
          {/* Formulaire de Connexion (Carte Blanche Pure) */}
          <div className="p-6 sm:p-10 flex flex-col justify-between">
            <div>
              {/* Header de marque */}
              <div className="flex items-center gap-3 mb-8">
                <LogoIcon size="md" />
                <div>
                  <h2 className="text-sm font-black text-slate-900 tracking-tight">Kivu Immobilier<span className="text-blue-600">+</span></h2>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Portail Officiel • Sud-Kivu</p>
                </div>
              </div>

              <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-1">
                  Se Connecter
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  Saisissez votre email et mot de passe pour accéder au tableau de bord.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-600 text-xs font-bold"
                    >
                      <AlertCircle size={18} className="shrink-0" />
                      <span>{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Champ Email */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Adresse Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-sm text-black font-bold outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all placeholder:text-slate-400"
                      placeholder="votre.email@kivuimmobilier.cd"
                      required
                    />
                  </div>
                </div>

                {/* Champ Mot de Passe */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-10 py-3 text-sm text-black font-bold outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all placeholder:text-slate-400"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-700"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Options : Se souvenir & Mot de passe oublié */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-600 font-medium">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Se souvenir de moi</span>
                  </label>
                  <span className="text-blue-600 hover:underline cursor-pointer font-bold">
                    Mot de passe oublié ?
                  </span>
                </div>

                {/* Bouton SE CONNECTER */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 mt-4"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <>
                      <span>SE CONNECTER</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Lien Vers Inscription */}
            <div className="mt-8 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
              Vous n'avez pas encore de compte ?{' '}
              <Link to="/register" className="text-blue-600 font-bold hover:underline ml-1">
                S'inscrire gratuitement
              </Link>
            </div>
          </div>

          {/* Section Droite : Vitrine Visuelle Kivu Immobilier+ (Desktop) */}
          <div className="hidden lg:relative lg:flex flex-col justify-between p-8 bg-gradient-to-br from-[#060812] via-[#0B101D] to-[#0D1426] text-white overflow-hidden">
            <div className="absolute inset-0 opacity-30">
              <img src={placeImg || "assets/place.jpeg"} alt="Bukavu" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060812] via-[#0B101D]/90 to-transparent" />
            </div>

            <div className="relative z-10 space-y-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 text-[10px] font-black uppercase tracking-widest">
                <Shield size={12} /> Espace Sécurisé
              </span>
              <h3 className="text-2xl font-black text-white leading-tight">
                Plateforme Numérique Foncière du Sud-Kivu.
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Supervisez vos titres fonciers, validez les inspections terrain et effectuez des transactions certifiées en toute confiance.
              </p>
            </div>

            <div className="relative z-10 space-y-3 pt-6 border-t border-white/10">
              <div className="flex items-center gap-3 text-xs text-slate-200">
                <CheckCircle2 size={16} className="text-blue-400 shrink-0" />
                <span>Titres Fonciers Numérisés & Protégés</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-200">
                <Building2 size={16} className="text-blue-400 shrink-0" />
                <span>Supervision Directe des Agents et Notaires</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-200">
                <MapPin size={16} className="text-blue-400 shrink-0" />
                <span>Couverture Complète : Bukavu, Ibanda, Kadutu...</span>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Login;