import React from 'react';
import { motion } from 'framer-motion';
import { Shield, MapPin, CheckCircle, ArrowRight, Wallet, Globe, Lock, Sparkles, TrendingUp, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { LogoIcon } from '../components/Logo';
import placeIndepImg from '../assets/place-indep.png';
import PublicFooter from '../components/PublicFooter';

const Home = () => {
  const handlePlaceImageError = (e) => {
    if (!e.target.dataset.triedFallback) {
      e.target.dataset.triedFallback = "true";
      e.target.src = "assets/place-indep.png";
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#05070C] text-slate-900 dark:text-slate-100 pt-20 md:pt-24 relative transition-colors duration-300">
      <Navbar />

      <main className="relative">
        {/* Effet de fond global */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/20 rounded-full blur-[120px] opacity-30" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-[100px] opacity-20" />
        </div>

        <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-10 pt-8 md:pt-12 pb-24 md:pb-32 relative z-10">

          {/* Section Hero */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="space-y-6 md:space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-600/20 rounded-full border border-blue-200 dark:border-blue-500/30">
                <Sparkles size={14} className="text-blue-600 dark:text-blue-400" />
                <span className="text-[10px] md:text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-[0.2em]">Standard de Sécurité Foncière 2.0</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter leading-[1.1] text-slate-900 dark:text-white">
                L'Immobilier <br />
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 dark:from-blue-400 dark:via-indigo-300 dark:to-blue-500 bg-clip-text text-transparent">Sans Risque à Bukavu.</span>
              </h1>

              <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed font-medium">
                Kivu Immobilier+ sécurise vos parcelles et maisons au Sud-Kivu grâce à la validation terrain assermentée et l'escrow blockchain.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  to="/properties"
                  className="group px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold text-white transition-all active:scale-95 shadow-xl shadow-blue-600/30 flex items-center justify-center gap-3"
                >
                  Explorer les annonces
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/register"
                  className="px-8 py-4 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 dark:bg-white/[0.05] dark:border-white/10 dark:hover:bg-white/10 dark:text-white font-bold transition-all flex items-center justify-center gap-2"
                >
                  Devenir Propriétaire
                </Link>
              </div>

              {/* Badge de confiance supplémentaire */}
              <div className="flex items-center gap-6 pt-4 text-slate-500 dark:text-slate-400 text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <Award size={14} className="text-blue-600 dark:text-blue-400" />
                  <span>Notarisation blockchain</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield size={14} className="text-blue-600 dark:text-blue-400" />
                  <span>Escrow certifié</span>
                </div>
              </div>
            </motion.div>

            {/* Image Héro Sans Cadre : Place de l'Indépendance */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              className="relative flex justify-center items-center"
            >
              <div className="relative w-full max-w-lg lg:max-w-xl group">
                <img
                  src={placeIndepImg || "assets/place-indep.png"}
                  alt="Place de l'Indépendance Bukavu"
                  onError={handlePlaceImageError}
                  className="w-full h-auto object-contain drop-shadow-[0_20px_50px_rgba(37,99,235,0.25)] group-hover:scale-105 transition-transform duration-700"
                />

                {/* Badges d'accompagnement discrets */}
                <div className="absolute -bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4 bg-white/90 dark:bg-slate-950/90 border border-slate-200 dark:border-blue-500/30 rounded-2xl p-3 sm:p-4 flex items-center justify-between shadow-2xl">
                  <div className="flex items-center gap-3">
                    <MapPin size={18} className="text-blue-600 dark:text-blue-400 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Place de l'Indépendance</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">Bukavu, Sud-Kivu • RDC</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-blue-600 text-white rounded-lg text-[9px] font-black uppercase tracking-wider shadow-md">
                    Zone Certifiée
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Section des valeurs avec cartes améliorées */}
          <motion.section
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="mt-28 md:mt-36 lg:mt-40"
          >
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-white/5 rounded-full border border-blue-200 dark:border-white/10 mb-4">
                <TrendingUp size={12} className="text-blue-600 dark:text-blue-400" />
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400">Pourquoi nous choisir</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                Une confiance <span className="text-blue-600 dark:text-blue-400">inébranlable</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {[
                {
                  icon: <Globe size={26} />,
                  title: 'Transparence Totale',
                  desc: 'Accédez à l\'historique complet de chaque parcelle, des origines aux transactions récentes, via la blockchain.',
                  color: 'from-blue-500/20 to-blue-600/10',
                  iconColor: 'text-blue-600 dark:text-blue-400'
                },
                {
                  icon: <Lock size={26} />,
                  title: 'Paiement Sécurisé',
                  desc: 'Les fonds sont séquestrés et libérés uniquement après le transfert effectif du titre de propriété.',
                  color: 'from-emerald-500/20 to-emerald-600/10',
                  iconColor: 'text-emerald-600 dark:text-emerald-400'
                },
                {
                  icon: <Shield size={26} />,
                  title: 'Zéro Fraude',
                  desc: 'Chaque bien est unique, certifié et ancré sur la blockchain, rendant toute falsification impossible.',
                  color: 'from-purple-500/20 to-purple-600/10',
                  iconColor: 'text-purple-600 dark:text-purple-400'
                }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="group relative bg-white border border-slate-200 dark:border-blue-400/15 dark:bg-gradient-to-br dark:from-[#17284a] dark:to-[#0a1224] rounded-2xl p-6 md:p-8 transition-all hover:border-blue-400 dark:hover:border-blue-400/50 shadow-md dark:shadow-black/30 hover:shadow-xl overflow-hidden"
                >
                  <div className="relative z-10">
                    <div className={`w-14 h-14 rounded-xl bg-blue-50 dark:bg-gradient-to-br ${item.color} flex items-center justify-center mb-6 ${item.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                      {item.icon}
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-3">{item.title}</h3>
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Section statistiques rapides */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-20 pt-8 border-t border-slate-200 dark:border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
          >
            <div>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">50+</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-1">Biens vérifiés</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">100%</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-1">Sécurité escrow</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">24/7</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-1">Support dédié</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">Blockchain</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-1">Localnet 8545</p>
            </div>
          </motion.div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
};

export default Home;
