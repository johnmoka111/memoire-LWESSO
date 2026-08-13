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
import Sidebar from '../components/Sidebar';

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
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-700" />

      <div className="relative h-56 bg-gradient-to-br from-white/[0.02] to-transparent flex items-center justify-center overflow-hidden">
        {property.image_url ? (
          <img src={property.image_url} alt={property.titre} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        ) : (
          <HomeIcon size={56} className="text-white/10 relative z-10" />
        )}
        <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm ${statusStyles[property.statut]}`}>
          {property.statut === 'valide' && 'Validé'}
          {property.statut === 'en_attente' && 'En attente'}
          {property.statut === 'assigne' && 'Assigné'}
          {property.statut === 'vendu' && 'Vendu'}
        </div>

        {property.statut === 'valide' && (
          <div className="absolute top-4 left-4 px-2 py-1 rounded-full bg-emerald-500/20 backdrop-blur-sm border border-emerald-500/30">
            <div className="flex items-center gap-1">
              <CheckCircle size={10} className="text-emerald-400" />
              <span className="text-[8px] font-bold text-emerald-400 uppercase">Vérifié</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-5 md:p-6">
        <h3 className="text-lg md:text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors line-clamp-1">
          {property.titre}
        </h3>
        <div className="flex items-center gap-1.5 text-slate-400 text-xs md:text-sm mb-4">
          <MapPin size={14} className="text-primary flex-shrink-0" />
          <span className="truncate">{property.commune}, Bukavu</span>
        </div>

        <div className="flex items-center gap-4 mb-5 text-[10px] text-slate-500">
          <div className="flex items-center gap-1">
            <Layers size={12} />
            <span>{property.superficie || 'N/C'} m²</span>
          </div>
          <div className="flex items-center gap-1">
            <Building2 size={12} />
            <span>{property.type_bien || 'Bien'}</span>
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
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white"
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
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white"
              value={localFilters.commune}
              onChange={e => setLocalFilters({ ...localFilters, commune: e.target.value })}
            >
              <option value="all">Toutes</option>
              {availableCommunes.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 block">Prix min ($)</label>
              <input
                type="number"
                placeholder="0"
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white"
                value={localFilters.minPrice}
                onChange={e => setLocalFilters({ ...localFilters, minPrice: e.target.value })}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 block">Prix max ($)</label>
              <input
                type="number"
                placeholder="Illimité"
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white"
                value={localFilters.maxPrice}
                onChange={e => setLocalFilters({ ...localFilters, maxPrice: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-8 pt-4 border-t border-white/10">
          <button onClick={handleReset} className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-semibold transition-all">Réinitialiser</button>
          <button onClick={handleApply} className="flex-1 py-3 bg-gradient-to-r from-primary to-indigo-500 rounded-xl text-sm font-bold transition-all text-white">Appliquer</button>
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

  useEffect(() => {
    const token = localStorage.getItem('token');
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

    axios.get(`${API_URL}/properties`, config)
      .then(res => setListings(res.data.data || []))
      .catch(() => setListings([]))
      .finally(() => setLoading(false));
  }, []);

  const availableCommunes = useMemo(() => {
    const communes = new Set(listings.map(p => p.commune).filter(Boolean));
    return Array.from(communes);
  }, [listings]);

  const filteredListings = useMemo(() => {
    let filtered = [...listings];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.titre?.toLowerCase().includes(query) ||
        p.commune?.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query)
      );
    }

    if (filters.statut !== 'all') {
      filtered = filtered.filter(p => p.statut === filters.statut);
    }

    if (filters.commune !== 'all') {
      filtered = filtered.filter(p => p.commune === filters.commune);
    }

    if (filters.type !== 'all') {
      filtered = filtered.filter(p => p.type_bien === filters.type);
    }

    if (filters.minPrice) {
      filtered = filtered.filter(p => parseFloat(p.prix) >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(p => parseFloat(p.prix) <= parseFloat(filters.maxPrice));
    }

    return filtered;
  }, [listings, searchQuery, filters]);

  const FilterDesktop = () => (
    <div className="hidden md:block w-72 shrink-0">
      <div className="sticky top-24 space-y-8 bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-md">
        <div className="flex items-center gap-2 text-white font-bold mb-4">
          <Filter size={18} className="text-primary" /> Filtres
        </div>
        
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase text-slate-500 block">Statut</label>
            <select 
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-primary outline-none"
              value={filters.statut}
              onChange={e => setFilters({...filters, statut: e.target.value})}
            >
              <option value="all">Tous</option>
              <option value="valide">Validé</option>
              <option value="en_attente">En attente</option>
              <option value="assigne">Assigné</option>
              <option value="vendu">Vendu</option>
            </select>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase text-slate-500 block">Commune</label>
            <select 
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-primary outline-none"
              value={filters.commune}
              onChange={e => setFilters({...filters, commune: e.target.value})}
            >
              <option value="all">Toutes</option>
              {availableCommunes.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase text-slate-500 block">Type</label>
            <select 
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-primary outline-none"
              value={filters.type}
              onChange={e => setFilters({...filters, type: e.target.value})}
            >
              <option value="all">Tous</option>
              <option value="terrain">Terrain</option>
              <option value="maison">Maison</option>
              <option value="appartement">Appartement</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-slate-500 block">Min ($)</label>
              <input 
                type="number" 
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none"
                value={filters.minPrice}
                onChange={e => setFilters({...filters, minPrice: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-slate-500 block">Max ($)</label>
              <input 
                type="number" 
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none"
                value={filters.maxPrice}
                onChange={e => setFilters({...filters, maxPrice: e.target.value})}
              />
            </div>
          </div>
        </div>

        {(filters.statut !== 'all' || filters.commune !== 'all' || filters.type !== 'all' || filters.minPrice || filters.maxPrice) && (
          <button 
            onClick={() => setFilters({ statut: 'all', commune: 'all', type: 'all', minPrice: '', maxPrice: '' })}
            className="w-full py-3 text-[10px] font-black uppercase tracking-widest text-primary hover:text-white border border-primary/20 hover:bg-primary/10 rounded-xl transition-all"
          >
            Réinitialiser
          </button>
        )}
      </div>
    </div>
  );

  const token = localStorage.getItem('token');

  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

  const user = useMemo(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  }, []);

  const adminContent = (
    <div className="max-w-7xl mx-auto space-y-8 w-full">
      {/* Header Admin */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#0B101D] border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-950/70 text-blue-400 border border-blue-800/50 rounded-full text-[10px] font-black uppercase tracking-widest mb-3">
            <Shield size={12} /> Console de Supervision Foncière
          </span>
          <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight">
            Gestion des Annonces Immobilier
          </h1>
          <p className="text-slate-400 text-xs md:text-sm mt-1">
            Tableau de contrôle des propriétés soumises, en cours d'inspection et certifiées au Sud-Kivu.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setViewMode('table')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              viewMode === 'table'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Layers size={16} /> Vue Tableau Admin
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              viewMode === 'grid'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Building2 size={16} /> Vue Grille
          </button>
          <Link
            to="/properties/create"
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
          >
            + Nouvelle Annonce
          </Link>
        </div>
      </div>

      {/* Barre de Recherche et Filtres Admin */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#080C16] p-4 border border-slate-800 rounded-2xl">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Rechercher par titre, commune, référence..."
            className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-black font-bold outline-none focus:border-blue-600"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            className="bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-black font-bold outline-none"
            value={filters.statut}
            onChange={e => setFilters({ ...filters, statut: e.target.value })}
          >
            <option value="all">Tous les Statuts</option>
            <option value="valide">🟢 Validés & Certifiés</option>
            <option value="en_attente">🟡 En Attente de Terrain</option>
            <option value="assigne">🔵 Assignés Agent</option>
            <option value="vendu">⚪ Vendus</option>
          </select>
          
          <select
            className="bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-black font-bold outline-none"
            value={filters.commune}
            onChange={e => setFilters({ ...filters, commune: e.target.value })}
          >
            <option value="all">Toutes les Communes</option>
            {availableCommunes.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Vue Tableau pour Admins et Agents */}
      {viewMode === 'table' ? (
        <div className="bg-[#0B101D] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#070914] border-b border-slate-800 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-6">Propriété & Localisation</th>
                  <th className="py-4 px-6">Type & Surface</th>
                  <th className="py-4 px-6">Prix Estimatifs ($)</th>
                  <th className="py-4 px-6">Statut Blockchain</th>
                  <th className="py-4 px-6">Agent Responsable</th>
                  <th className="py-4 px-6 text-right">Actions Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      Chargement des propriétés admin en cours...
                    </td>
                  </tr>
                ) : filteredListings.length > 0 ? (
                  filteredListings.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-slate-900 overflow-hidden shrink-0 border border-slate-800 flex items-center justify-center">
                            {p.image_url ? (
                              <img src={p.image_url} alt={p.titre} className="w-full h-full object-cover" />
                            ) : (
                              <HomeIcon size={20} className="text-slate-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-white text-sm line-clamp-1">{p.titre}</p>
                            <p className="text-slate-400 text-[11px] flex items-center gap-1 mt-0.5">
                              <MapPin size={12} className="text-blue-400" /> {p.commune}, Bukavu
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-bold text-white">{p.type_bien || 'Maison'}</span>
                        <p className="text-slate-500 text-[10px] mt-0.5">{p.superficie || 'N/C'} m²</p>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm font-black text-white">${parseFloat(p.prix).toLocaleString()}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${statusStyles[p.statut]}`}>
                          {p.statut === 'valide' && <>🟢 Validé & Minté</>}
                          {p.statut === 'en_attente' && <>🟡 Inspection Requise</>}
                          {p.statut === 'assigne' && <>🔵 En Cours</>}
                          {p.statut === 'vendu' && <>⚪ Vendu / Transféré</>}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-slate-300">
                          <div className="w-6 h-6 rounded-full bg-blue-900/50 border border-blue-700 flex items-center justify-center text-[10px] font-bold text-blue-300">
                            {p.agent_nom ? p.agent_nom.charAt(0) : 'A'}
                          </div>
                          <span className="font-medium text-xs">{p.agent_nom || 'Non Assigné'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/properties/${p.id}`}
                            className="px-3 py-1.5 bg-blue-950 hover:bg-blue-900 border border-blue-800 text-blue-300 rounded-lg font-bold text-[11px] transition-all"
                          >
                            Gérer / Fiche
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      Aucune propriété ne correspond aux critères de recherche admin.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredListings.map((property, idx) => (
            <PropertyCard key={property.id} property={property} index={idx} />
          ))}
        </div>
      )}
    </div>
  );

  const publicContent = (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full">
      {/* Header avec barre de recherche publique */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">
        <div className="max-w-xl">
          <h1 className="text-2xl md:text-4xl font-black text-white mb-2 tracking-tight">
            Catalogue <span className="text-blue-400 italic">Kivu Immobilier</span>
          </h1>
          <p className="text-slate-400 text-xs md:text-sm">Explorez les biens certifiés sur la blockchain au Sud-Kivu.</p>
        </div>

        <div className="relative group w-full md:w-96">
          <div className="flex items-center bg-white border border-slate-300 rounded-2xl px-4 py-3 shadow-md">
            <Search className="text-slate-500 mr-3 shrink-0" size={18} />
            <input
              type="text"
              placeholder="Quartier, type, mot-clé..."
              className="bg-transparent border-none text-black font-bold w-full focus:ring-0 outline-none text-sm"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <button 
              onClick={() => setShowFilters(true)}
              className="md:hidden ml-3 p-2 bg-slate-100 rounded-lg text-blue-600 hover:bg-slate-200 transition-all"
            >
              <SlidersHorizontal size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Grille principale avec sidebar filtres desktop */}
      <div className="flex flex-col md:flex-row gap-8">
        <FilterDesktop />

        <div className="flex-1">
          <div className="flex items-center justify-between mb-8">
            <p className="text-slate-400 text-xs md:text-sm">
              <span className="text-white font-bold">{filteredListings.length}</span> {filteredListings.length > 1 ? 'biens disponibles' : 'bien disponible'}
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-96 bg-[#0B101D] rounded-2xl animate-pulse border border-slate-800" />
              ))}
            </div>
          ) : filteredListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredListings.map((property, idx) => (
                <PropertyCard key={property.id} property={property} index={idx} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-24 h-24 bg-[#0B101D] rounded-full flex items-center justify-center mb-6 border border-slate-800">
                <AlertCircle size={40} className="text-slate-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-400 mb-2">Aucun bien trouvé</h3>
              <p className="text-slate-500 text-sm">Essayez de modifier vos critères de recherche ou de filtres.</p>
            </div>
          )}
        </div>
      </div>

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

  if (token) {
    return (
      <div className="flex min-h-screen bg-[#05070C] text-slate-100 font-sans">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
          <Navbar />
          <main className="flex-1 p-4 md:p-8">
            {adminContent}
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070C] text-slate-100 font-sans pb-20">
      <Navbar />
      {publicContent}
    </div>
  );
};

export default Properties;