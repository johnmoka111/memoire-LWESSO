import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Shield, CheckCircle, ArrowLeft, User, Maximize2, ExternalLink, Wallet, Loader2, Info } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import Navbar from '../components/Navbar';

const PanoramaViewer = ({ url }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (!url || !ref.current || !window.pannellum) return;
    window.pannellum.viewer(ref.current, {
      type: 'equirectangular',
      panorama: url,
      autoLoad: true,
      compass: true,
      hfov: 110,
      showControls: true,
    });
  }, [url]);

  return (
    <div ref={ref} className="w-full h-full bg-slate-900/50">
      {!url && (
        <div className="w-full h-full flex flex-col items-center justify-center text-slate-600">
          <Maximize2 size={48} className="mb-4 opacity-20" />
          <p className="text-xs font-bold uppercase tracking-widest">Visite 360° indisponible</p>
        </div>
      )}
    </div>
  );
};

const MOCK = {
  id: 1,
  titre: 'Villa moderne à Ibanda',
  commune: 'Ibanda',
  quartier: 'Zone résidentielle',
  prix: 85000,
  type_bien: 'villa',
  statut: 'valide',
  owner_name: 'Muderhwa J.',
  superficie: 450,
  description: 'Magnifique villa moderne avec jardin arboré, terrasse panoramique et accès sécurisé. Idéalement située dans le quartier résidentiel d\'Ibanda, cette propriété bénéficie d\'une vue dégagée sur la ville. Les titres fonciers ont été vérifiés et sont ancrés sur la blockchain Ethereum.',
  panorama_url: null,
};

const PropertyDetail = () => {
  const { id } = useParams();
  const [p, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

    axios.get(`${API_URL}/properties/${id}`, config)
      .then(res => setProperty(res.data.data))
      .catch(() => setProperty(MOCK))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center">
      <Loader2 className="animate-spin text-indigo-500" size={48} />
    </div>
  );

  const data = p || MOCK;

  return (
    <div className="min-h-screen bg-transparent">
      <Navbar />

      <div className="max-w-7xl mx-auto px-8 py-12">
        <Link to="/properties" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-10 font-bold text-sm group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Retour au catalogue
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Viewer 360 */}
            <div className="relative glass-card h-[500px] overflow-hidden group">
              <PanoramaViewer url={data.panorama_url} />
              <div className="absolute top-6 left-6 flex gap-3">
                <div className="px-4 py-2 bg-black/60 backdrop-blur-md rounded-xl text-[10px] font-bold uppercase tracking-widest text-white flex items-center gap-2">
                  <Maximize2 size={12} /> Vue 360°
                </div>
                <div className="px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 backdrop-blur-md rounded-xl text-[10px] font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                  <CheckCircle size={12} /> Titre Certifié
                </div>
              </div>
            </div>

            {/* Info Block */}
            <div className="glass-card p-10">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-400 mb-2 block">{data.type_bien}</span>
                  <h1 className="text-4xl font-extrabold tracking-tight mb-4">{data.titre}</h1>
                  <div className="flex items-center gap-2 text-slate-400">
                    <MapPin size={18} className="text-indigo-500" />
                    <span className="text-lg font-medium">{data.commune}, {data.quartier || 'Bukavu'}</span>
                  </div>
                </div>
                {data.superficie && (
                  <div className="text-right glass-card px-6 py-4">
                    <p className="text-3xl font-black text-white">{data.superficie}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Superficie m²</p>
                  </div>
                )}
              </div>

              <div className="prose prose-invert max-w-none">
                <p className="text-slate-400 leading-relaxed text-lg italic border-l-2 border-indigo-500/30 pl-6">
                  "{data.description || 'Une propriété exceptionnelle vérifiée par nos services experts.'}"
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
                {[
                  { label: 'Blockchain', val: 'Vérifié', icon: <Shield size={14} />, color: 'text-emerald-400' },
                  { label: 'Terrain', val: 'Validé', icon: <CheckCircle size={14} />, color: 'text-indigo-400' },
                  { label: 'Arbitrage', val: 'Actif', icon: <Info size={14} />, color: 'text-blue-400' },
                  { label: 'Escrow', val: 'Disponible', icon: <Wallet size={14} />, color: 'text-purple-400' },
                ].map((item, i) => (
                  <div key={i} className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">{item.label}</p>
                    <div className={`flex items-center gap-2 font-bold ${item.color}`}>
                      {item.icon} {item.val}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Blockchain Proof */}
            <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-3xl p-8 flex items-center gap-8">
              <div className="w-20 h-20 shrink-0 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500">
                <Shield size={40} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Preuve d'Immuabilité Blockchain</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  Les métadonnées de ce titre foncier sont hachées et stockées sur la blockchain. Toute modification non autorisée du registre physique sera immédiatement détectée.
                </p>
                <a href="#" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-bold text-xs uppercase tracking-widest">
                  Consulter sur le registre public <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="glass-card p-10 sticky top-32">
              <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/5">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                  <User className="text-white" size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Propriétaire</p>
                  <p className="font-bold text-white">{data.owner_name}</p>
                </div>
              </div>

              <div className="mb-10">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Prix total</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-white">${data.prix?.toLocaleString()}</span>
                  <span className="text-slate-500 font-bold">USD</span>
                </div>
                <p className="text-xs text-indigo-400/70 mt-2 font-medium">≈ {(data.prix * 2800).toLocaleString()} CDF (Taux du jour)</p>
              </div>

              <button
                onClick={() => setBuying(true)}
                disabled={buying}
                className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-4 transition-all shadow-2xl shadow-indigo-600/30 active:scale-95"
              >
                {buying ? <Loader2 className="animate-spin" /> : <><Wallet size={24} /> ACHETER VIA ESCROW</>}
              </button>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3 text-xs text-slate-400 leading-relaxed">
                  <Shield size={16} className="text-emerald-500 shrink-0" />
                  <span>Vos fonds sont bloqués dans un smart-contract jusqu'à signature finale.</span>
                </div>
                <div className="flex items-start gap-3 text-xs text-slate-400 leading-relaxed">
                  <CheckCircle size={16} className="text-indigo-500 shrink-0" />
                  <span>Assistance juridique KivuMarket+ incluse dans la transaction.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
