import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Shield, CheckCircle, Search, SlidersHorizontal, ArrowRight, Home as HomeIcon, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import Navbar from '../components/Navbar';

const statusStyles = {
  valide: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  en_attente: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  assigne: 'text-primary bg-primary/10 border-primary/20',
  vendu: 'text-slate-400 bg-white/5 border-white/10',
};

const PropertyCard = ({ property, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
    className="card !p-0 overflow-hidden hover:border-primary/50 transition-all group"
  >
    <div className="h-56 bg-secondary relative flex items-center justify-center">
      <img src="/assets/logo.png" alt="Watermark" className="absolute w-20 h-20 opacity-5" />
      <HomeIcon size={48} className="text-white/10" />
      <div className={`absolute top-4 right-4 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest ${statusStyles[property.statut]}`}>
        {property.statut}
      </div>
    </div>

    <div className="p-8">
      <h3 className="text-white font-bold text-xl mb-3 group-hover:text-primary transition-colors">{property.titre}</h3>
      <div className="flex items-center gap-2 text-slate-400 text-sm mb-6">
        <MapPin size={14} className="text-primary" />
        <span>{property.commune}, Bukavu</span>
      </div>

      <div className="flex items-end justify-between pt-6 border-t border-white/5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Prix</p>
          <p className="text-3xl font-black text-white">${property.prix.toLocaleString()}</p>
        </div>
        <Link to={`/properties/${property.id}`} className="btn-primary !py-2.5 !px-4 text-xs flex items-center gap-2">
          VOIR <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  </motion.div>
);

const Properties = () => {
  const [listings, setListings] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_URL}/properties`)
      .then(res => setListings(res.data.data || []))
      .catch(() => setListings([])) // Empty or use MOCK if needed
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="mb-16">
          <h1 className="text-5xl font-black mb-4">Annonces <span className="text-primary">Vérifiées</span></h1>
          <p className="text-slate-400 max-w-2xl text-lg">Sélection de biens immobiliers à Bukavu sécurisés par validation terrain et blockchain.</p>
        </div>

        <div className="flex gap-4 mb-12">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input type="text" className="input-field pl-12" placeholder="Rechercher par commune, quartier..." 
              onChange={(e) => setSearch(e.target.value)} />
          </div>
          <button className="card !p-4 flex items-center gap-2 text-slate-400 hover:text-white transition-all font-bold">
            <SlidersHorizontal size={20} /> FILTRES
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1,2,3].map(i => <div key={i} className="h-96 bg-white/5 rounded-2xl animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {listings.map((p, i) => <PropertyCard key={p.id} property={p} index={i} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Properties;
