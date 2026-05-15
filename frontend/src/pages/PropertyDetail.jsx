import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Shield, CheckCircle, ArrowLeft, User, Maximize2,
  ExternalLink, Wallet, Loader2, Info, X, Home, Ruler,
  Bed, Bath, Calendar, TrendingUp, Smartphone, Mail,
  MessageCircle, Star, Award, Globe, Lock, CreditCard,
  AlertTriangle, Sparkles
} from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import Navbar from '../components/Navbar';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix pour les icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Composant PanoramaViewer amélioré avec gestion d'erreur et fallback
const PanoramaViewer = ({ url }) => {
  const ref = useRef(null);
  const [viewer, setViewer] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!url || !ref.current) return;

    // Vérifier si pannellum est chargé
    const initViewer = () => {
      if (window.pannellum && ref.current) {
        try {
          const panoViewer = window.pannellum.viewer(ref.current, {
            type: 'equirectangular',
            panorama: url,
            autoLoad: true,
            compass: true,
            hfov: 110,
            showControls: true,
            mouseZoom: true,
            showZoomCtrl: true,
            showFullscreenCtrl: true,
          });
          setViewer(panoViewer);
        } catch (err) {
          console.error('Pannellum error:', err);
          setError(true);
        }
      } else {
        // Attendre que la librairie se charge
        const interval = setInterval(() => {
          if (window.pannellum) {
            clearInterval(interval);
            initViewer();
          }
        }, 100);
        return () => clearInterval(interval);
      }
    };

    initViewer();

    return () => {
      if (viewer) {
        viewer.destroy();
      }
    };
  }, [url]);

  if (!url || error) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-slate-900/50 to-slate-800/30 flex flex-col items-center justify-center">
        <div className="text-center p-8">
          <Maximize2 size={56} className="mx-auto mb-5 text-slate-600 opacity-40" />
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Visite 360° indisponible</p>
          <p className="text-[10px] text-slate-500 mt-2">Actualisation des images en cours</p>
        </div>
      </div>
    );
  }

  return <div ref={ref} className="w-full h-full" />;
};

// Composant Modal d'achat Escrow
const PurchaseModal = ({ property, onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulation d'appel API d'achat (à adapter selon votre backend)
    setTimeout(() => {
      setLoading(false);
      setStep(2);
      if (onSuccess) onSuccess();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative z-10 w-full max-w-lg bg-gradient-to-br from-[#0F0F1A] to-[#0A0A0F] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-indigo-500" />

        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Wallet size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Achat sécurisé via Escrow</h3>
              <p className="text-[9px] text-slate-500 uppercase tracking-wider">{property?.titre}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X size={18} className="text-slate-400" />
          </button>
        </div>

        <div className="p-6">
          {step === 1 ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="bg-gradient-to-r from-primary/5 to-transparent border border-primary/10 rounded-xl p-4 mb-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Prix total</span>
                  <span className="text-2xl font-bold text-white">${property?.prix?.toLocaleString()} USD</span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-500 mt-2">
                  <span>Frais de séquestre inclus</span>
                  <span className="text-emerald-400">0% commission</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">Nom complet</label>
                <input
                  type="text"
                  required
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary/50 focus:bg-white/[0.05] outline-none transition-all"
                  value={formData.nom}
                  onChange={e => setFormData({ ...formData, nom: e.target.value })}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">Email</label>
                <input
                  type="email"
                  required
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary/50 focus:bg-white/[0.05] outline-none transition-all"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">Téléphone</label>
                <input
                  type="tel"
                  required
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary/50 focus:bg-white/[0.05] outline-none transition-all"
                  value={formData.telephone}
                  onChange={e => setFormData({ ...formData, telephone: e.target.value })}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">Message (optionnel)</label>
                <textarea
                  rows="2"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary/50 focus:bg-white/[0.05] outline-none transition-all resize-none"
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-primary to-indigo-500 hover:from-primary/90 hover:to-indigo-500/90 text-white font-bold rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <><Lock size={16} /> Lancer la procédure sécurisée</>}
              </button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8"
            >
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} className="text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Demande envoyée !</h3>
              <p className="text-slate-400 text-sm mb-6">
                Un agent KivuMarket+ vous contactera sous 24h pour finaliser l'achat via escrow.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-semibold transition-all"
              >
                Fermer
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// Mock fallback
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
  chambres: 4,
  sdb: 3,
  description: 'Magnifique villa moderne avec jardin arboré, terrasse panoramique et accès sécurisé. Idéalement située dans le quartier résidentiel d\'Ibanda, cette propriété bénéficie d\'une vue dégagée sur la ville. Les titres fonciers ont été vérifiés et sont ancrés sur la blockchain Ethereum.',
  panorama_url: null,
  images: [],
};

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [buying, setBuying] = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

    axios.get(`${API_URL}/properties/${id}`, config)
      .then(res => {
        setProperty(res.data.data);
      })
      .catch(() => setProperty(MOCK))
      .finally(() => setLoading(false));
  }, [id]);

  const handlePurchase = () => {
    setBuying(true);
    setShowPurchaseModal(true);
    setBuying(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0F] via-[#0F0F1A] to-[#0A0A0F] flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  const data = property || MOCK;
  const lat = parseFloat(data.latitude) || -2.5026;
  const lng = parseFloat(data.longitude) || 28.8614;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0F] via-[#0F0F1A] to-[#0A0A0F] text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-5 md:px-8 lg:px-10 py-8 md:py-12">
        {/* Bouton retour animé */}
        <Link
          to="/properties"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 font-medium text-sm group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Retour aux annonces
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-8">
            {/* Galerie Photos Améliorée */}
            {data.photos && data.photos.length > 0 ? (
              <div className="relative rounded-2xl overflow-hidden border border-white/10 group bg-[#050508]">
                {/* Photo principale */}
                <div className="w-full h-[350px] md:h-[500px] relative">
                  <img 
                    src={data.photos[activePhoto]?.url} 
                    alt="Vue principale" 
                    className="w-full h-full object-cover transition-all duration-700" 
                  />
                  
                  {/* Légende de la photo */}
                  {data.photos[activePhoto]?.description && (
                    <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black to-transparent">
                      <p className="text-white font-bold text-lg drop-shadow-lg">{data.photos[activePhoto].description}</p>
                    </div>
                  )}

                  {/* Badges sur la photo */}
                  <div className="absolute top-5 left-5 flex flex-wrap gap-3">
                    {data.statut === 'valide' && (
                      <div className="px-3 py-1.5 bg-emerald-500/80 backdrop-blur-md rounded-xl text-[9px] font-bold uppercase tracking-wider text-white flex items-center gap-1.5 shadow-lg">
                        <CheckCircle size={12} /> Titre certifié
                      </div>
                    )}
                  </div>
                </div>

                {/* Miniatures */}
                {data.photos.length > 1 && (
                  <div className="flex overflow-x-auto gap-3 p-3 bg-black/40 backdrop-blur-sm border-t border-white/10 hide-scrollbar">
                    {data.photos.map((photo, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => setActivePhoto(idx)}
                        className={`relative h-20 w-32 shrink-0 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${activePhoto === idx ? 'border-primary scale-95' : 'border-transparent opacity-60 hover:opacity-100'}`}
                      >
                        <img src={photo.url} alt="" className="w-full h-full object-cover" />
                        {photo.description && (
                           <div className="absolute bottom-0 left-0 w-full bg-black/60 py-0.5 px-1">
                              <p className="text-[7px] text-white truncate font-bold uppercase text-center">{photo.description}</p>
                           </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-[300px] bg-white/[0.02] rounded-2xl border border-white/10 flex items-center justify-center">
                 <div className="text-center text-slate-500">
                    <Home size={48} className="mx-auto mb-3 opacity-20" />
                    <p className="text-sm font-bold uppercase tracking-wider">Aucune photo disponible</p>
                 </div>
              </div>
            )}

            {/* Visionneuse 360° */}
            {data.panorama_url && (
              <div className="relative bg-gradient-to-br from-white/[0.03] to-transparent border border-white/10 rounded-2xl overflow-hidden h-[450px] group">
                 <div className="absolute top-5 left-5 z-10 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-xl text-[9px] font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                    <Maximize2 size={12} /> Visite Virtuelle 360° (Pannellum)
                 </div>
                 <PanoramaViewer url={data.panorama_url} />
              </div>
            )}

            {/* Carte informations principales */}
            <div className="relative group bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8 transition-all hover:border-white/20">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none rounded-2xl" />

              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 mb-3">
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      {data.type_bien}
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 text-white">
                    {data.titre}
                  </h1>
                  <div className="flex items-center gap-2 text-slate-400">
                    <MapPin size={16} className="text-primary" />
                    <span className="text-sm md:text-base">{data.commune}, {data.quartier || 'Bukavu'}</span>
                  </div>
                </div>
                {data.superficie && (
                  <div className="bg-white/[0.02] border border-white/5 rounded-xl px-5 py-3 text-center min-w-[100px]">
                    <p className="text-2xl font-bold text-white">{parseFloat(data.superficie).toFixed(2)}</p>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">m²</p>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-8">
                <p className="text-slate-300 leading-relaxed border-l-2 border-primary/40 pl-5 italic break-words">
                  "{data.description || 'Une propriété exceptionnelle vérifiée par nos services experts.'}"
                </p>
              </div>

              {/* Caractéristiques détaillées */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Chambres', value: data.chambres || '0', icon: <Bed size={14} /> },
                  { label: 'Salles de bain', value: data.sdb || '0', icon: <Bath size={14} /> },
                  { label: 'Surface terrain', value: data.superficie ? `${parseFloat(data.superficie).toFixed(2)} m²` : 'N/C', icon: <Ruler size={14} /> },
                  { 
                    label: 'Date & Heure', 
                    value: data.created_at 
                      ? new Date(data.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) 
                      : 'N/C', 
                    icon: <Calendar size={14} /> 
                  },
                ].map((item, idx) => (
                  <div key={idx} className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                      {item.icon}
                      <span className="text-[9px] font-bold uppercase tracking-wider">{item.label}</span>
                    </div>
                    <p className="text-white font-bold text-base">{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Blockchain proof */}
              <div className="bg-gradient-to-r from-primary/5 to-indigo-500/5 border border-primary/20 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-5">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Shield size={24} className="text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-white mb-1">Preuve blockchain immuable</h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    Ce titre est enregistré sur la blockchain GoChain. Toute tentative de modification frauduleuse est détectée instantanément.
                  </p>
                </div>
                <a href="#" className="text-primary hover:text-primary/80 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 whitespace-nowrap">
                  Vérifier <ExternalLink size={12} />
                </a>
              </div>
            </div>

            {/* Localisation OpenStreetMap */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white/[0.02] border border-white/10 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Globe size={16} className="text-primary" />
                  <h3 className="text-sm font-bold uppercase tracking-wider">Localisation précise (OSM)</h3>
                </div>
                <div className="aspect-video bg-white/[0.03] rounded-lg overflow-hidden border border-white/10 z-0">
                  <MapContainer center={[lat, lng]} zoom={15} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={[lat, lng]}>
                      <Popup>{data.titre}</Popup>
                    </Marker>
                  </MapContainer>
                </div>
                <p className="text-[10px] text-slate-500 mt-3 uppercase tracking-tighter">Lat: {lat} | Lng: {lng}</p>
              </div>
              <div className="bg-white/[0.02] border border-white/10 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <MessageCircle size={16} className="text-primary" />
                  <h3 className="text-sm font-bold uppercase tracking-wider">Contacter {data.agent_name ? "l'agent" : "l'agence"}</h3>
                </div>
                <div className="space-y-3">
                  <a href={`mailto:contact@kivumarket.com?subject=Demande d'information: ${data.titre}`} className="w-full py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors">
                    <Mail size={14} /> Envoyer un message
                  </a>
                  {data.agent_phone ? (
                    <a href={`tel:${data.agent_phone}`} className="w-full py-2.5 bg-primary text-black hover:bg-primary/90 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors">
                        <Smartphone size={14} /> Appeler {data.agent_name}
                    </a>
                  ) : (
                    <button className="w-full py-2.5 bg-white/5 cursor-not-allowed opacity-50 rounded-xl text-xs font-semibold flex items-center justify-center gap-2">
                        <Smartphone size={14} /> Aucun agent assigné
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar droit - Paiement & propriétaire */}
          <div className="space-y-6">
            <div className="sticky top-24 space-y-6">
              {/* Carte propriétaire */}
              <div className="relative group bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 rounded-2xl p-6 transition-all hover:border-white/20">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                    <User size={28} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Propriétaire vérifié</p>
                    <h3 className="text-xl font-bold text-white">{data.owner_name || 'Anonyme'}</h3>
                    <div className="flex items-center gap-1.5 text-amber-500">
                      <Star size={12} fill="currentColor" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Membre certifié</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 mb-8">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Prix de vente</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-white">
                        ${new Intl.NumberFormat('en-US').format(parseFloat(data.prix || 0))}
                      </span>
                      <span className="text-sm font-bold text-slate-500">USD</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2">≈ {new Intl.NumberFormat('fr-FR').format(parseFloat(data.prix || 0) * 2800)} CDF</p>
                  </div>
                </div>

                <button
                  onClick={handlePurchase}
                  disabled={buying}
                  className="w-full py-4 bg-gradient-to-r from-primary to-indigo-500 hover:from-primary/90 hover:to-indigo-500/90 text-white font-bold rounded-xl transition-all active:scale-[0.98] shadow-xl shadow-primary/20 flex items-center justify-center gap-3"
                >
                  {buying ? <Loader2 className="animate-spin" size={18} /> : <><Wallet size={18} /> Acheter via escrow</>}
                </button>

                <div className="mt-6 space-y-3 text-[10px] text-slate-500">
                  <div className="flex items-start gap-2">
                    <Lock size={12} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>Fonds bloqués par smart-contract jusqu'à la signature finale.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Award size={12} className="text-primary shrink-0 mt-0.5" />
                    <span>Assistance juridique incluse + vérification notariale.</span>
                  </div>
                </div>
              </div>

              {/* Badge de confiance */}
              <div className="bg-gradient-to-r from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-xl p-4 flex items-center gap-3">
                <Sparkles size={20} className="text-emerald-400" />
                <div>
                  <p className="text-[9px] font-bold uppercase text-emerald-400">Transaction 100% sécurisée</p>
                  <p className="text-[8px] text-slate-500">Garantie KivuMarket+</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal d'achat */}
      <AnimatePresence>
        {showPurchaseModal && (
          <PurchaseModal
            property={data}
            onClose={() => setShowPurchaseModal(false)}
            onSuccess={() => setShowPurchaseModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default PropertyDetail;