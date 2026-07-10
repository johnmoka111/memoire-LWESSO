import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Loader2, ArrowRight, Shield, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';

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
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      localStorage.setItem('token', res.data.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.data.user));
      navigate('/dashboard');
    } catch (err) {
      console.error('Erreur API:', err);
      setError(err.response?.data?.message || 'Impossible de contacter le serveur. Vérifiez vos identifiants ou votre connexion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0F] via-[#0F0F1A] to-[#0A0A0F] flex items-center justify-center p-5 md:p-8 relative overflow-hidden">
      {/* Effets de fond */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] opacity-30" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-500/20 rounded-full blur-[100px] opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]" />
        
        {/* Filigrane Logo Centré */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] opacity-[0.02] pointer-events-none">
            <img src="assets/logo.png" alt="" className="w-full h-full object-contain" />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8 md:mb-10">
          <Link to="/" className="inline-flex items-center justify-center mb-6 transition-transform hover:scale-105 duration-300">
            <img src="assets/logo.png" alt="KivuMobilier" className="w-20 h-20 md:w-24 md:h-24 object-contain" />
          </Link>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2 bg-gradient-to-r from-white via-white to-primary/70 bg-clip-text text-transparent">
            Connexion
          </h1>
          <p className="text-slate-500 font-bold tracking-[0.2em] uppercase text-[9px] md:text-[10px]">
            Espace sécurisé KivuMobilier
          </p>
        </div>

        <div className="relative group bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8 transition-all hover:border-white/20 hover:shadow-2xl hover:shadow-primary/5">
          {/* Effet de lumière */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none rounded-2xl" />

          <form onSubmit={handleLogin} className="space-y-6">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3"
                >
                  <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-400 text-[10px] font-bold uppercase tracking-wider leading-relaxed flex-1">
                    {error}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">
                  Email professionnel
                </label>
                <div className="relative group/input">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-primary transition-colors" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-sm outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all placeholder:text-slate-600"
                    placeholder="agent@kivumarket.cd"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">
                  Mot de passe
                </label>
                <div className="relative group/input">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-primary transition-colors" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-11 pr-12 py-3.5 text-sm outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all placeholder:text-slate-600"
                    placeholder="••••••••"
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
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-primary to-indigo-500 hover:from-primary/90 hover:to-indigo-500/90 text-white font-bold rounded-xl transition-all active:scale-[0.98] shadow-xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  ACCÉDER AU DASHBOARD
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-slate-500 text-xs md:text-sm font-medium">
              Pas encore de compte ?{' '}
              <Link to="/register" className="text-primary font-bold hover:underline transition-all">
                Créer un compte
              </Link>
            </p>
          </div>

          {/* Badge de sécurité */}
          <div className="mt-6 flex items-center justify-center gap-2 text-[9px] text-slate-600">
            <Shield size={12} />
            <span>Connexion sécurisée • Chiffrement SSL</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;