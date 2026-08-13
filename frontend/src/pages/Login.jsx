import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Loader2, ArrowRight, Shield, Eye, EyeOff, AlertCircle, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import { LogoIcon } from '../components/Logo';
import Navbar from '../components/Navbar';
import formImg from '../assets/form.jpeg';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleFormImageError = (e) => {
    if (!e.target.dataset.triedFallback) {
      e.target.dataset.triedFallback = "true";
      e.target.src = "assets/form.jpeg";
    }
  };

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
    <div className="min-h-screen bg-[#05070C] text-slate-100 font-sans flex flex-col justify-between pt-20 relative overflow-hidden">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 md:p-8 relative z-10 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-4xl bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 border border-slate-200"
        >
          {/* Formulaire de Connexion (Fidèle à form.jpeg) */}
          <div className="p-6 sm:p-10 flex flex-col justify-between">
            <div>
              {/* Header du Formulaire */}
              <div className="flex items-center gap-3 mb-6">
                <LogoIcon size="md" />
                <span className="text-sm font-black tracking-tight text-slate-900">Kivu Immobilier<span className="text-blue-600">+</span></span>
              </div>

              <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mb-1 uppercase">
                  WELCOME BACK
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  Welcome back! Please enter your details.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-600 text-xs font-bold"
                    >
                      <AlertCircle size={16} className="shrink-0" />
                      <span>{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Champ Email */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-black font-bold outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all placeholder:text-slate-400"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                {/* Champ Password */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-4 pr-10 py-3 text-sm text-black font-bold outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all placeholder:text-slate-400"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-700"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Remember me & Forgot Password */}
                <div className="flex items-center justify-between text-xs font-medium pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Remember me</span>
                  </label>
                  <a href="#/login" className="text-slate-600 hover:text-slate-900 font-semibold hover:underline">
                    Forgot password
                  </a>
                </div>

                {/* Bouton Sign in */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-[#EF4444] hover:bg-[#DC2626] text-white font-bold text-sm rounded-xl shadow-lg shadow-red-500/25 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 mt-2"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <span>Sign in</span>
                  )}
                </button>
              </form>
            </div>

            {/* Lien d'inscription bas de carte */}
            <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
              Don't have an account?{' '}
              <Link to="/register" className="text-red-500 font-bold hover:underline ml-1">
                Sign up for free
              </Link>
            </div>
          </div>

          {/* Panneau Illustration Droite (Desktop - Fidèle à form.jpeg) */}
          <div className="hidden lg:block relative bg-slate-100 overflow-hidden min-h-[480px]">
            <img
              src={formImg || "assets/form.jpeg"}
              alt="Form Artwork"
              onError={handleFormImageError}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Login;