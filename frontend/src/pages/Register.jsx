import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Wallet, ArrowRight, ArrowLeft, Check, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';

const Register = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nom: '', prenom: '', email: '', password: '', role: 'acheteur', wallet: ''
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleRegister = async () => {
    setLoading(true);
    setError('');
    try {
      await axios.post(`${API_URL}/auth/register`, formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex mb-6">
            <img src="assets/logo.png" alt="Logo" className="w-16 h-16 object-contain" />
          </Link>
          <h1 className="text-3xl font-black mb-2">Inscription</h1>
          
          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mt-4">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${step === i ? 'w-8 bg-primary' : 'w-2 bg-white/10'}`} />
            ))}
          </div>
        </div>

        <div className="card relative overflow-hidden">
          <img src="assets/logo.png" alt="Watermark" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 opacity-[0.02] pointer-events-none" />

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <p className="text-center text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-8">Étape 1: Votre Identité</p>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Prénom</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input type="text" className="input-field pl-12" placeholder="Jean" value={formData.prenom}
                      onChange={(e) => setFormData({...formData, prenom: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Nom</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input type="text" className="input-field pl-12" placeholder="Muderhwa" value={formData.nom}
                      onChange={(e) => setFormData({...formData, nom: e.target.value})} />
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
                className="space-y-6"
              >
                <p className="text-center text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-8">Étape 2: Sécurité</p>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input type="email" className="input-field pl-12" placeholder="jean@exemple.cd" value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Mot de passe</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input type="password" className="input-field pl-12" placeholder="••••••••" value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})} />
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
                className="space-y-6"
              >
                <p className="text-center text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-8">Étape 3: Rôle & Wallet</p>
                {error && <p className="text-red-400 text-xs font-bold bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</p>}
                
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Je suis un</label>
                  <select 
                    className="input-field appearance-none"
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                  >
                    <option value="acheteur">Acheteur</option>
                    <option value="proprietaire">Propriétaire</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Adresse MetaMask (Optionnel)</label>
                  <div className="relative">
                    <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input type="text" className="input-field pl-12" placeholder="0x..." value={formData.wallet}
                      onChange={(e) => setFormData({...formData, wallet: e.target.value})} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="fixed bottom-0 left-0 right-0 md:relative bg-dark/90 md:bg-transparent backdrop-blur-xl md:backdrop-blur-none border-t border-white/5 md:border-none p-4 md:p-0 md:mt-12 md:pt-8 z-50 flex items-center justify-between mb-14 md:mb-0">
            <button 
              onClick={prevStep}
              className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-all ${step === 1 ? 'invisible' : 'visible'}`}
            >
              <ArrowLeft size={16} /> Retour
            </button>

            {step < 3 ? (
              <button onClick={nextStep} className="btn-primary !py-3 !px-8 text-xs flex items-center gap-2">
                CONTINUER <ArrowRight size={16} />
              </button>
            ) : (
              <button onClick={handleRegister} disabled={loading} className="btn-primary !py-3 !px-8 text-xs flex items-center gap-2">
                {loading ? <Loader2 className="animate-spin" /> : <>TERMINER <Check size={16} /></>}
              </button>
            )}
          </div>
        </div>

        <p className="mt-8 text-center text-slate-500 text-sm font-medium">
          Déjà un compte ? <Link to="/login" className="text-primary font-bold hover:underline">Se connecter</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
