import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Shield, Briefcase, MapPin } from 'lucide-react';

type Role = 'proprietaire' | 'acheteur' | 'agent';

const Register = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    role: 'acheteur' as Role,
    telephone: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigate('/login');
    }, 1500);
  };

  const roles = [
    { id: 'acheteur', title: 'Acheteur', icon: User, desc: 'Je cherche à acheter un bien' },
    { id: 'proprietaire', title: 'Propriétaire', icon: MapPin, desc: 'Je veux vendre ou certifier mon bien' }
  ];

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100 overflow-hidden relative">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-40 h-40 bg-violet-50 rounded-full blur-3xl"></div>
          
          <div className="text-center mb-10 relative">
            <div className="inline-flex p-3 bg-violet-50 rounded-2xl text-violet-600 mb-4">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Créer un compte</h1>
            <p className="text-slate-500">Rejoignez la première plateforme foncière sécurisée du Kivu</p>
          </div>

          <div className="flex mb-8 relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -z-10 -translate-y-1/2"></div>
            <div className="flex justify-between w-full z-10">
              {[1, 2].map((s) => (
                <div 
                  key={s} 
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm transition-colors ${
                    step >= s ? 'bg-violet-600 text-white shadow-lg shadow-violet-200' : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {s}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={step === 2 ? handleRegister : (e) => { e.preventDefault(); setStep(2); }} className="space-y-6 relative">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  <label className="block text-sm font-medium text-slate-700 mb-4">Je suis un...</label>
                  <div className="grid gap-4">
                    {roles.map((r) => {
                      const Icon = r.icon;
                      const isSelected = formData.role === r.id;
                      return (
                        <div
                          key={r.id}
                          onClick={() => setFormData({...formData, role: r.id as Role})}
                          className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex items-center space-x-4 ${
                            isSelected ? 'border-violet-600 bg-violet-50/50' : 'border-slate-100 hover:border-violet-200 hover:bg-slate-50'
                          }`}
                        >
                          <div className={`p-3 rounded-lg ${isSelected ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className={`font-semibold ${isSelected ? 'text-violet-900' : 'text-slate-700'}`}>{r.title}</h3>
                            <p className={`text-sm ${isSelected ? 'text-violet-600/80' : 'text-slate-500'}`}>{r.desc}</p>
                          </div>
                          {isSelected && (
                            <div className="ml-auto w-5 h-5 rounded-full bg-violet-600 flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full mt-6 py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium transition-all shadow-lg shadow-slate-200"
                  >
                    Continuer
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Prénom</label>
                      <input
                        type="text"
                        value={formData.prenom}
                        onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-600/20 focus:border-violet-600 transition-all outline-none text-slate-700"
                        placeholder="Jean"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Nom</label>
                      <input
                        type="text"
                        value={formData.nom}
                        onChange={(e) => setFormData({...formData, nom: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-600/20 focus:border-violet-600 transition-all outline-none text-slate-700"
                        placeholder="Dupont"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Adresse Email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-5 h-5" />
                      </div>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-600/20 focus:border-violet-600 transition-all outline-none text-slate-700"
                        placeholder="jean.dupont@exemple.cd"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Mot de passe</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-5 h-5" />
                      </div>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-600/20 focus:border-violet-600 transition-all outline-none text-slate-700"
                        placeholder="••••••••"
                        required
                        minLength={8}
                      />
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-1/3 py-3.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-all"
                    >
                      Retour
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-2/3 flex items-center justify-center space-x-2 py-3.5 px-4 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-violet-200 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
                    >
                      {isLoading ? (
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <span>Créer le compte</span>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-600 text-sm">
              Déjà un compte ?{' '}
              <Link to="/login" className="font-semibold text-violet-600 hover:text-violet-700 transition-colors">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
