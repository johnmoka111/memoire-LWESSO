import React from 'react';
import { motion } from 'framer-motion';
import { Shield, MapPin, CheckCircle, ArrowRight, Wallet, Globe, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Home = () => {
  return (
    <div className="min-h-screen bg-transparent">
      <Navbar />

      <main className="max-w-7xl mx-auto px-8 pt-20 pb-32 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-bold mb-8">
              <Shield size={14} />
              <span>Standard de Sécurité Foncière 2.0</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-8 leading-[0.9]">
              L'Immobilier <br />
              <span className="text-primary">Sans Risque.</span>
            </h1>
            
            <p className="text-xl text-slate-400 max-w-lg mb-12 leading-relaxed">
              KivuMarket+ sécurise vos achats à Bukavu grâce à la validation terrain et l'escrow blockchain.
            </p>

            <div className="flex flex-col sm:flex-row gap-5">
              <Link to="/properties" className="btn-primary flex items-center justify-center gap-3">
                Explorer les annonces <ArrowRight size={20} />
              </Link>
              <Link to="/register" className="px-10 py-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold transition-all">
                Devenir Propriétaire
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="relative aspect-square max-w-[500px] mx-auto">
              <div className="relative z-10 w-full h-full card flex items-center justify-center">
                <img src="/assets/logo.png" alt="KivuMarket+ Logo" className="w-4/5 h-4/5 object-contain" />
              </div>
              
              <div className="absolute -top-4 -right-4 card p-4 flex items-center gap-3 shadow-2xl">
                <CheckCircle size={18} className="text-emerald-500" />
                <div className="text-xs font-bold uppercase tracking-widest">Titre Vérifié</div>
              </div>
              
              <div className="absolute bottom-10 -left-10 card p-4 flex items-center gap-3 shadow-2xl">
                <Wallet size={18} className="text-primary" />
                <div className="text-xs font-bold uppercase tracking-widest">Escrow Actif</div>
              </div>
            </div>
          </motion.div>
        </div>

        <section className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <Globe size={24} />, title: 'Transparence Totale', desc: 'Accédez à l\'historique complet de chaque parcelle.' },
            { icon: <Lock size={24} />, title: 'Paiement Sécurisé', desc: 'Fonds libérés après transfert effectif du titre.' },
            { icon: <Shield size={24} />, title: 'Zéro Fraude', desc: 'Chaque bien est unique et ancré sur la blockchain.' }
          ].map((item, i) => (
            <motion.div 
              key={i}
              className="card group hover:border-primary/50 transition-all"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
              <p className="text-slate-400 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default Home;
