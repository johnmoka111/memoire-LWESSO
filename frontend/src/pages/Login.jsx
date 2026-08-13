import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Loader2, ArrowRight, Shield, Eye, EyeOff, AlertCircle, ShieldCheck, CheckCircle2, LockKeyhole } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import { LogoIcon } from '../components/Logo';
import Navbar from '../components/Navbar';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <div className="min-h-screen bg-[#05070C] text-slate-100 font-sans flex flex-col justify-between relative overflow-hidden">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 md:p-8 relative z-10 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-5xl bg-[#0B101D] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2"
        >
          {/* Panneau Gauche : Présentation Kivu Immobilier+ (Desktop) */}
          <div className="hidden lg:flex flex-col justify-between p-10 bg-gradient-to-br from-[#080C16] via-[#0D1426] to-[#060812] border-r border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <LogoIcon size="lg" />
                <div>
                  <h2 className="text-xl font-black text-white tracking-tight">Kivu Immobilier<span className="text-blue-500">+</span></h2>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Securité Foncière Blockchain</p>
                </div>
              </div>

              <div className="space-y-4 my-8">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 text-blue-400 border border-blue-800/50 text-[10px] font-black uppercase tracking-widest">
                  <Shield size={12} /> Espace d'Authentification Sécurisé
                </span>
                <h3 className="text-3xl font-black text-white leading-tight">
                  Accédez à votre Console de Gestion Immobilier.
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Supervisez vos titres fonciers, validez les inspections terrain et effectuez des transactions certifiées au Sud-Kivu en toute sérénité.
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-800">
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <CheckCircle2 size={16} className="text-blue-400 shrink-0" />
                  <span>Validation Terrain par Agents Assermentés</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <CheckCircle2 size={16} className="text-blue-400 shrink-0" />
                  <span>Notarisation et Séquestre Escrow Blockchain</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <CheckCircle2 size={16} className="text-blue-400 shrink-0" />
                  <span>Protocole anti-falsification au Sud-Kivu</span>
                </div>
              </div>
            </div>

            <div className="pt-8 text-[11px] text-slate-500 font-bold flex items-center justify-between border-t border-slate-800/60 relative z-10">
              <span>© 2026 Kivu Immobilier+</span>
              <span className="flex items-center gap-1"><LockKeyhole size={12} /> Chiffrement SSL-256</span>
            </div>
          </div>

          {/* Formulaire de Connexion (Droite sur Desktop) */}
          <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-center">
            <div className="text-center lg:text-left mb-8">
              <div className="lg:hidden flex justify-center mb-4">
                <LogoIcon size="lg" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
                Connexion à votre Compte
              </h1>
              <p className="text-slate-400 text-xs">
                Entrez vos identifiants pour accéder au tableau de bord.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-400 text-xs font-bold"
                  >
                    <AlertCircle size={18} className="shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">
                  Adresse Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 text-slate-500" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-sm text-black font-bold outline-none focus:border-blue-600"
                    placeholder="votre.email@kivuimmobilier.cd"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Mot de Passe
                  </label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 text-slate-500" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-10 py-3 text-sm text-black font-bold outline-none focus:border-blue-600"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-500 hover:text-black"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
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

            <div className="mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-400">
              Vous n'avez pas de compte ?{' '}
              <Link to="/register" className="text-blue-400 font-bold hover:underline ml-1">
                Créer un compte
              </Link>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Login;