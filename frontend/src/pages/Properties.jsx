import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Shield, CheckCircle, Search, SlidersHorizontal,
  ArrowRight, Home as HomeIcon, X, Filter, Building2,
  TrendingUp, Eye, Heart, Star, Clock, AlertCircle,
  ChevronDown, DollarSign, Layers, Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import Navbar from '../components/Navbar';

// Mapping des styles de statut
const statusStyles = {
  valide: 'bg-gradient-to-r from-emerald-500/20 to-emerald-600/10 text-emerald-400 border-emerald-500/30',
  en_attente: 'bg-gradient-to-r from-amber-500/20 to-amber-600/10 text-amber-400 border-amber-500/30',
  assigne: 'bg-gradient-to-r from-primary/20 to-indigo-500/10 text-primary border-primary/30',
  vendu: 'bg-gradient-to-r from-slate-500/20 to-slate-600/10 text-slate-400 border-slate-500/30',
};

// Composant PropertyCard amélioré avec dégradés et effets
const PropertyCard = ({ property, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden transition-all hover:border-white/20 hover:shadow-2xl hover:shadow-primary/5"
    >
      {/* Effet de lumière au survol */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-700" />

      {/* Image / zone visuelle */}
      <div className="relative h-56 bg-gradient-to-br from-white/[0.02] to-transparent flex items-center justify-center overflow-hidden">
        {property.image_url ? (
          <img src={property.image_url} alt={property.titre} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        ) : (
          <>
            <img src="/assets/logo.png" alt="Watermark" className="absolute w-24 h-24 opacity-10" />
            <HomeIcon size={56} className="text-white/10 relative z-10" />
          </>
        )}
        <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm ${statusStyles[property.statut]}`}>
          {property.statut === 'valide' && 'Validé'}
          {property.statut === 'en_attente' && 'En attente'}
          {property.statut === 'assigne' && 'Assigné'}
          {property.statut === 'vendu' && 'Vendu'}
        </div>

        {/* Badge de vérification */}
        {property.statut === 'valide' && (
          <div className="absolute top-4 left-4 px-2 py-1 rounded-full bg-emerald-500/20 backdrop-blur-sm border border-emerald-500/30">
            <div className="flex items-center gap-1">
              <CheckCircle size={10} className="text-emerald-400" />
              <span className="text-[8px] font-bold text-emerald-400 uppercase">Vérifié</span>
            </div>
          </div>
        )}
      </div>

      {/* Contenu de la carte */}
      <div className="p-5 md:p-6">
        <h3 className="text-lg md:text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors line-clamp-1">
          {property.titre}
        </h3>
        <div className="flex items-center gap-1.5 text-slate-400 text-xs md:text-sm mb-4">
          <MapPin size={14} className="text-primary flex-shrink-0" />
          <span className="truncate">{property.commune}, Bukavu</span>
        </div>

        {/* Métriques supplémentaires */}
        <div className="flex items-center gap-4 mb-5 text-[10px] text-slate-500">
          <div className="flex items-center gap-1">
            <Layers size={12} />
            <span>{property.surface || 'N/C'} m²</span>
          </div>
          <div className="flex items-center gap-1">
            <Building2 size={12} />
            <span>{property.type || 'Terrain'}</span>
          </div>
        </div>

        <div className="flex items-end justify-between pt-5 border-t border-white/10">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">Prix</p>
            <p className="text-2xl md:text-3xl font-black text-white">
              ${parseFloat(property.prix).toLocaleString()}
            </p>
          </div>
          <Link
            to={`/properties/${property.id}`}
            className="px-5 py-2.5 bg-gradient-to-r from-primary to-indigo-500 hover:from-primary/90 hover:to-indigo-500/90 rounded-xl text-[10px] font-bold uppercase tracking-wider text-white transition-all active:scale-95 shadow-lg shadow-primary/20 flex items-center gap-2"
          >
            Détails <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

// Composant de filtres avancés
const FilterSidebar = ({ filters, setFilters, availableCommunes, onClose }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleApply = () => {
    setFilters(localFilters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters = { statut: 'all', commune: 'all', type: 'all', minPrice: '', maxPrice: '' };
    setLocalFilters(resetFilters);
    setFilters(resetFilters);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:hidden">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="relative z-10 w-full max-w-md bg-gradient-to-br from-[#0F0F1A] to-[#0A0A0F] border border-white/10 rounded-2xl p-6 max-h-[80vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Filter size={18} className="text-primary" /> Filtres avancés
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg"><X size={18} /></button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 block">Statut</label>
            <select
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm"
              value={localFilters.statut}
              onChange={e => setLocalFilters({ ...localFilters, statut: e.target.value })}
            >
              <option value="all">Tous</option>
              <option value="valide">Validé</option>
              <option value="en_attente">En attente</option>
              <option value="assigne">Assigné</option>
              <option value="vendu">Vendu</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 block">Commune</label>
            <select
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm"
              value={localFilters.commune}
              onChange={e => setLocalFilters({ ...localFilters, commune: e.target.value })}
            >
              <option value="all">Toutes</option>
              {availableCommunes.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 block">Type de bien</label>
            <select
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm"
              value={localFilters.type}
              onChange={e => setLocalFilters({ ...localFilters, type: e.target.value })}
            >
              <option value="all">Tous</option>
              <option value="terrain">Terrain</option>
              <option value="maison">Maison</option>
              <option value="appartement">Appartement</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 block">Prix min ($)</label>
              <input
                type="number"
                placeholder="0"
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm"
                value={localFilters.minPrice}
                onChange={e => setLocalFilters({ ...localFilters, minPrice: e.target.value })}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 block">Prix max ($)</label>
              <input
                type="number"
                placeholder="Illimité"
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm"
                value={localFilters.maxPrice}
                onChange={e => setLocalFilters({ ...localFilters, maxPrice: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-8 pt-4 border-t border-white/10">
          <button onClick={handleReset} className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-semibold transition-all">Réinitialiser</button>
          <button onClick={handleApply} className="flex-1 py-3 bg-gradient-to-r from-primary to-indigo-500 rounded-xl text-sm font-bold transition-all">Appliquer</button>
        </div>
      </motion.div>
    </div>
  );
};

const Properties = () => {
  const [listings, setListings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    statut: 'all',
    commune: 'all',
    type: 'all',
    minPrice: '',
    maxPrice: ''
  });

  // Récupération des propriétés
  useEffect(() => {
    const token = localStorage.getItem('token');
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

    axios.get(`${API_URL}/properties`, config)
      .then(res => setListings(res.data.data || []))
      .catch(() => setListings([]))
      .finally(() => setLoading(false));
  }, []);

  // Extraire les communes uniques pour le filtre
  const availableCommunes = useMemo(() => {
    const communes = new Set(listings.map(p => p.commune).filter(Boolean));
    return Array.from(communes);
  }, [listings]);

  // Filtrage des propriétés
  const filteredListings = useMemo(() => {
    let filtered = [...listings];

    // Filtre recherche textuelle
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.titre?.toLowerCase().includes(query) ||
        p.commune?.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query)
      );
    }

    // Filtre statut
    if (filters.statut !== 'all') {
      filtered = filtered.filter(p => p.statut === filters.statut);
    }

    // Filtre commune
    if (filters.commune !== 'all') {
      filtered = filtered.filter(p => p.commune === filters.commune);
    }

    // Filtre type
    if (filters.type !== 'all') {
      filtered = filtered.filter(p => p.type === filters.type);
    }

    // Filtre prix
    if (filters.minPrice) {
      filtered = filtered.filter(p => parseFloat(p.prix) >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(p => parseFloat(p.prix) <= parseFloat(filters.maxPrice));
    }

    return filtered;
  }, [listings, searchQuery, filters]);

  // Composant de filtres desktop
  const FilterDesktop = () => (
    <div className="hidden md:block w-80 flex-shrink-0 space-y-6">
      <div className="bg-gradient-to-br from-white/[0.03] to-transparent border border-white/10 rounded-2xl p-5">
        <h3 className="font-bold text-white mb-5 flex items-center gap-2"><Filter size={16} /> Filtres</h3>

        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-500 block mb-2">Statut</label>
            <select
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm"
              value={filters.statut}
              onChange={e => setFilters({ ...filters, statut: e.target.value })}
            >
              <option value="all">Tous</option>
              <option value="valide">Validé</option>
              <option value="en_attente">En attente</option>
              <option value="assigne">Assigné</option>
              <option value="vendu">Vendu</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-500 block mb-2">Commune</label>
            <select
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm"
              value={filters.commune}
              onChange={e => setFilters({ ...filters, commune: e.target.value })}
            >
              <option value="all">Toutes</option>
              {availableCommunes.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-500 block mb-2">Type</label>
            <select
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm"
              value={filters.type}
              onChange={e => setFilters({ ...filters, type: e.target.value })}
            >
              <option value="all">Tous</option>
              <option value="terrain">Terrain</option>
              <option value="maison">Maison</option>
              <option value="appartement">Appartement</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-500 block mb-2">Min ($)</label>
              <input
                type="number"
                placeholder="0"
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-sm"
                value={filters.minPrice}
                onChange={e => setFilters({ ...filters, minPrice: e.target.value })}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-500 block mb-2">Max ($)</label>
              <input
                type="number"
                placeholder="∞"
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-sm"
                value={filters.maxPrice}
                onChange={e => setFilters({ ...filters, maxPrice: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-3">
          <TrendingUp size={16} className="text-primary" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Marché actif</span>
        </div>
        <p className="text-2xl font-bold text-white">{filteredListings.length}</p>
        <p className="text-[10px] text-slate-500">biens correspondants</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0F] via-[#0F0F1A] to-[#0A0A0F] text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-5 md:px-8 lg:px-10 py-12 md:py-20">
        {/* En-tête avec dégradé */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/15 via-primary/5 to-transparent border border-white/10 p-6 md:p-8 mb-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px]" />
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
              Annonces <span className="text-primary">Vérifiées</span>
            </h1>
            <p className="text-slate-400 max-w-2xl text-base md:text-lg">
              Sélection de biens immobiliers à Bukavu sécurisés par validation terrain et blockchain.
            </p>
          </div>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-sm focus:border-primary/50 focus:bg-white/[0.05] outline-none transition-all placeholder:text-slate-600"
              placeholder="Rechercher par titre, commune, quartier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowFilters(true)}
            className="md:hidden flex items-center justify-center gap-2 px-5 py-3.5 bg-white/[0.03] border border-white/10 rounded-xl text-sm font-semibold hover:bg-white/10 transition-all"
          >
            <SlidersHorizontal size={18} /> Filtres
          </button>
        </div>

        {/* Grille principale avec sidebar filtres desktop */}
        <div className="flex flex-col md:flex-row gap-8">
          <FilterDesktop />

          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-96 bg-white/[0.02] rounded-2xl animate-pulse border border-white/5" />
                ))}
              </div>
            ) : filteredListings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-24 h-24 bg-white/[0.02] rounded-full flex items-center justify-center mb-6">
                  <AlertCircle size={40} className="text-slate-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-400 mb-2">Aucun bien trouvé</h3>
                <p className="text-slate-500 text-sm">Essayez de modifier vos critères de recherche ou de filtres.</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <p className="text-sm text-slate-500">
                    <span className="font-bold text-white">{filteredListings.length}</span> résultat(s)
                  </p>
                  {(filters.statut !== 'all' || filters.commune !== 'all' || filters.type !== 'all' || filters.minPrice || filters.maxPrice) && (
                    <button
                      onClick={() => setFilters({ statut: 'all', commune: 'all', type: 'all', minPrice: '', maxPrice: '' })}
                      className="text-[10px] font-bold uppercase text-primary hover:underline"
                    >
                      Réinitialiser les filtres
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredListings.map((property, idx) => (
                    <PropertyCard key={property.id} property={property} index={idx} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Modal filtres mobile */}
      <AnimatePresence>
        {showFilters && (
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            availableCommunes={availableCommunes}
            onClose={() => setShowFilters(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Properties;