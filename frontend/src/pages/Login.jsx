import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    console.log('Tentative de connexion pour:', email);
    
    try {
      // Test de l'API réelle
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      console.log('Connexion API réussie');
      localStorage.setItem('token', res.data.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.data.user));
      navigate('/dashboard');
    } catch (err) {
      console.error('Erreur API:', err);
      setError(err.response?.data?.message || 'Impossible de contacter le serveur. Vérifiez vos identifiants ou votre connexion.');
    } finally {
      setStepLoading(false); // Fix variable name if needed, but let's stick to state
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 relative">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-3 mb-8">
            <img src="/assets/logo.png" alt="Logo" className="w-16 h-16 object-contain" />
          </Link>
          <h1 className="text-4xl font-black mb-2 tracking-tight">Connexion</h1>
          <p className="text-slate-500 font-bold tracking-widest uppercase text-[10px]">Espace Sécurisé KivuMarket+</p>
        </div>

        <div className="card">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Email Professionnel</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-12"
                  placeholder="admin@kivumarket.cd"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-12"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-3 shadow-lg shadow-primary/20"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <>ACCÉDER AU DASHBOARD <ArrowRight size={20} /></>}
            </button>
          </form>

          <div className="mt-8 text-center pt-8 border-t border-white/5">
            <p className="text-slate-500 text-sm font-medium">
              Pas encore de compte ?{' '}
              <Link to="/register" className="text-primary font-bold hover:underline">Créer un compte</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
