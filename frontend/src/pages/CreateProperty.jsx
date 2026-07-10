import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ArrowLeft, ArrowRight, Check, MapPin, DollarSign, FileText, Camera, Wallet, Loader2, X, Maximize2, Minimize2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { API_URL } from '../config';
import { KIVU_LOCATIONS } from '../data/locations';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Fix pour les icônes Leaflet par défaut qui ne s'affichent pas toujours bien avec Webpack/Esbuild
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const LocationMarker = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position ? <Marker position={position} /> : null;
};

const CreateProperty = () => {
  const token = localStorage.getItem('token');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const totalSteps = 4;
  const navigate = useNavigate();
  const photoInputRef = useRef(null);
  const docInputRef = useRef(null);

  const [mapCenter, setMapCenter] = useState([-2.5026, 28.8614]); // Bukavu par défaut
  const [markerPosition, setMarkerPosition] = useState(null);
  const [isMapMaximized, setIsMapMaximized] = useState(false);

  const [formData, setFormData] = useState({
    titre: '', 
    type_bien: 'maison', 
    prix: '', 
    province: 'Sud-Kivu',
    ville: 'Bukavu',
    commune: 'Ibanda', 
    quartier: '',
    description: '', 
    superficie: '', 
    chambres: 0,
    sdb: 0,
    document: null,
    panorama_url: '', 
    latitude: '',
    longitude: '',
    photos: [] // Tableau d'objets { file, description }
  });

  const [previews, setPreviews] = useState([]);

  // Mise à jour lat/lng quand le marqueur change
  useEffect(() => {
    if (markerPosition) {
      setFormData(prev => ({
        ...prev,
        latitude: markerPosition[0].toFixed(6),
        longitude: markerPosition[1].toFixed(6)
      }));
    }
  }, [markerPosition]);

  const handlePhotoSelect = (e) => {
    const files = Array.from(e.target.files);
    
    const newPhotos = files.map(file => ({
      file: file,
      description: '' // Par défaut vide
    }));

    setFormData(prev => ({ 
      ...prev, 
      photos: [...prev.photos, ...newPhotos] 
    }));

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const updatePhotoDescription = (index, desc) => {
    const newPhotos = [...formData.photos];
    newPhotos[index].description = desc;
    setFormData({ ...formData, photos: newPhotos });
  };

  const removePhoto = (index) => {
    const newPhotos = [...formData.photos];
    newPhotos.splice(index, 1);
    const newPreviews = [...previews];
    newPreviews.splice(index, 1);
    setFormData({ ...formData, photos: newPhotos });
    setPreviews(newPreviews);
  };

  const handleDocSelect = (e) => {
    setFormData({ ...formData, document: e.target.files[0] });
  };

  const nextStep = () => setStep(s => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const data = new FormData();
      
      // Ajout des champs texte
      Object.keys(formData).forEach(key => {
        if (key !== 'photos' && key !== 'document') {
          data.append(key, formData[key]);
        }
      });

      // Ajout du document
      if (formData.document) {
        data.append('document', formData.document);
      }

      // Ajout des photos AVEC leurs descriptions
      formData.photos.forEach((photoObj, index) => {
        data.append(`photo_${index}`, photoObj.file);
        data.append(`photo_desc_${index}`, photoObj.description);
      });
      data.append('photo_count', formData.photos.length);

      await axios.post(`${API_URL}/properties`, data, {
        headers: { 
          'Authorization': `Bearer ${token}` 
        }
      });
      
      setLoading(false);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Erreur réseau ou serveur : ' + (err.response?.data?.message || err.message));
      setLoading(false);
    }
  };

  const provinces = Object.keys(KIVU_LOCATIONS);
  const villes = formData.province ? Object.keys(KIVU_LOCATIONS[formData.province]) : [];
  const communes = (formData.province && formData.ville) ? Object.keys(KIVU_LOCATIONS[formData.province][formData.ville]) : [];

  const progress = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen pb-20 bg-dark">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 md:py-12">
        <div className="mb-10 text-center">
          <img src="assets/logo.png" alt="Logo" className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <h1 className="text-2xl md:text-3xl font-black mb-2 text-white">Nouvelle Annonce</h1>
          <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">Sécurisation Blockchain en cours</p>
        </div>

        <div className="relative h-1.5 w-full bg-white/5 rounded-full mb-12 overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="absolute top-0 left-0 h-full bg-primary" />
        </div>

        <div className="card relative overflow-hidden bg-secondary/10 border-white/5">
          <img src="assets/logo.png" alt="Watermark" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 opacity-[0.02] pointer-events-none" />

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="flex items-center gap-3 mb-6 text-primary">
                  <MapPin size={24} />
                  <h2 className="text-xl font-bold">Informations de base & Localisation</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Titre de l'annonce</label>
                      <input type="text" className="input-field" placeholder="Ex: Belle villa à Ibanda" 
                        value={formData.titre} onChange={(e) => setFormData({...formData, titre: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Type de bien</label>
                        <select className="input-field appearance-none" value={formData.type_bien} onChange={(e) => setFormData({...formData, type_bien: e.target.value})}>
                          <option value="maison">Maison</option>
                          <option value="appartement">Appartement</option>
                          <option value="terrain">Terrain</option>
                          <option value="commercial">Commercial</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Prix (USD)</label>
                        <div className="relative">
                          <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                          <input type="number" className="input-field pl-12" placeholder="85000" 
                            value={formData.prix} onChange={(e) => setFormData({...formData, prix: e.target.value})} />
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Province</label>
                            <select className="input-field appearance-none !py-3 text-[10px]" value={formData.province} onChange={(e) => setFormData({...formData, province: e.target.value, ville: '', commune: ''})}>
                                {provinces.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Ville</label>
                            <select className="input-field appearance-none !py-3 text-[10px]" value={formData.ville} disabled={!villes.length} onChange={(e) => setFormData({...formData, ville: e.target.value, commune: ''})}>
                                <option value="">Ville...</option>
                                {villes.map(v => <option key={v} value={v}>{v}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Commune</label>
                            <select className="input-field appearance-none !py-3 text-[10px]" value={formData.commune} disabled={!communes.length} onChange={(e) => setFormData({...formData, commune: e.target.value})}>
                                <option value="">Commune...</option>
                                {communes.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Latitude</label>
                        <input type="text" className="input-field !py-2 text-xs" value={formData.latitude} readOnly placeholder="-2.5026" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Longitude</label>
                        <input type="text" className="input-field !py-2 text-xs" value={formData.longitude} readOnly placeholder="28.8614" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1 flex justify-between items-center">
                      <span>Position sur la carte</span>
                      <button 
                        type="button"
                        onClick={() => setIsMapMaximized(true)}
                        className="flex items-center gap-1.5 text-primary hover:text-white transition-colors"
                      >
                        <Maximize2 size={12} />
                        Agrandir
                      </button>
                    </label>
                    <div className="h-[300px] rounded-xl overflow-hidden border border-white/10 z-0 relative group">
                      <MapContainer center={mapCenter} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />
                        <LocationMarker position={markerPosition} setPosition={setMarkerPosition} />
                      </MapContainer>
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                        <span className="text-[10px] font-bold text-white uppercase tracking-widest bg-dark/80 px-4 py-2 rounded-full border border-white/10">Cliquez pour placer le marqueur</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Map Maximized Modal */}
                <AnimatePresence>
                  {isMapMaximized && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-[2000] bg-dark/95 backdrop-blur-xl flex flex-col"
                    >
                      <div className="flex items-center justify-between p-6 border-b border-white/10">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <MapPin size={24} />
                          </div>
                          <div>
                            <h3 className="text-white font-bold">Localisation Précise</h3>
                            <p className="text-slate-500 text-[10px] uppercase tracking-widest">Cliquez n'importe où sur la carte pour placer le bien</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setIsMapMaximized(false)}
                          className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-all"
                        >
                          <Minimize2 size={24} />
                        </button>
                      </div>
                      
                      <div className="flex-1 relative">
                        <MapContainer 
                          center={markerPosition || mapCenter} 
                          zoom={15} 
                          scrollWheelZoom={true} 
                          style={{ height: '100%', width: '100%' }}
                        >
                          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />
                          <LocationMarker position={markerPosition} setPosition={setMarkerPosition} />
                        </MapContainer>
                        
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[2001] pointer-events-none">
                          <div className="bg-dark/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl flex items-center gap-8 pointer-events-auto">
                            <div className="space-y-1">
                              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Latitude</p>
                              <p className="text-white font-mono text-sm">{formData.latitude || '---'}</p>
                            </div>
                            <div className="w-px h-8 bg-white/10" />
                            <div className="space-y-1">
                              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Longitude</p>
                              <p className="text-white font-mono text-sm">{formData.longitude || '---'}</p>
                            </div>
                            <button 
                              onClick={() => setIsMapMaximized(false)}
                              className="btn-primary !py-3 px-8 text-xs ml-4"
                            >
                              CONFIRMER LA POSITION
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="flex items-center gap-3 mb-6 text-primary">
                  <FileText size={24} />
                  <h2 className="text-xl font-bold">Détails & Documents</h2>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Description détaillée</label>
                  <textarea className="input-field h-32 resize-none" placeholder="Décrivez les atouts du bien..." 
                    value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Superficie (m²)</label>
                    <input type="number" className="input-field" placeholder="Ex: 450" 
                      value={formData.superficie} onChange={(e) => setFormData({...formData, superficie: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Chambres</label>
                        <input type="number" className="input-field" placeholder="3" 
                        value={formData.chambres} onChange={(e) => setFormData({...formData, chambres: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Salles de bain</label>
                        <input type="number" className="input-field" placeholder="2" 
                        value={formData.sdb} onChange={(e) => setFormData({...formData, sdb: e.target.value})} />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Titre Foncier (PDF/Scan)</label>
                    <div onClick={() => docInputRef.current.click()} className={`relative h-[58px] flex items-center justify-center border-2 border-dashed rounded-xl transition-all cursor-pointer ${formData.document ? 'border-emerald-500 bg-emerald-500/5' : 'border-white/10 hover:border-primary/50'}`}>
                      <input type="file" ref={docInputRef} hidden onChange={handleDocSelect} />
                      <span className="text-xs font-bold uppercase tracking-widest">
                        {formData.document ? formData.document.name : 'CLIQUER POUR UPLOADER'}
                      </span>
                    </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="flex items-center gap-3 mb-6 text-primary">
                  <Camera size={24} />
                  <h2 className="text-xl font-bold">Médias & Vue 360°</h2>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Lien Panorama 360° (Optionnel)</label>
                  <input type="url" className="input-field" placeholder="Lien direct vers l'image 360° (ex: https://...)" 
                    value={formData.panorama_url} onChange={(e) => setFormData({...formData, panorama_url: e.target.value})} />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Photos (Illimitées)</label>
                    <span className="text-[10px] font-black text-primary">{formData.photos.length} photos ajoutées</span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto p-2 border border-white/5 rounded-xl">
                    {previews.map((preview, index) => (
                      <div key={index} className="flex gap-4 bg-white/[0.03] p-3 rounded-xl border border-white/5 group">
                        <div className="w-20 h-20 rounded-lg overflow-hidden relative shrink-0">
                          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <input 
                            type="text" 
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-1.5 text-[10px] text-white focus:border-primary/50 outline-none"
                            placeholder="Ex: Cuisine moderne"
                            value={formData.photos[index].description}
                            onChange={(e) => updatePhotoDescription(index, e.target.value)}
                          />
                          <button onClick={() => removePhoto(index)} className="text-[9px] text-red-400 font-bold uppercase flex items-center gap-1 hover:text-red-300 transition-colors">
                            <X size={12} /> Supprimer
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    <div onClick={() => photoInputRef.current.click()} className="h-[104px] bg-white/5 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center text-slate-600 hover:text-primary hover:border-primary/50 transition-all cursor-pointer gap-2">
                      <Camera size={24} />
                      <span className="text-[8px] font-black uppercase tracking-widest">Ajouter des photos</span>
                    </div>
                  </div>
                  <input type="file" ref={photoInputRef} hidden multiple accept="image/*" onChange={handlePhotoSelect} />
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 text-center py-8">
                <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 flex items-center justify-center mx-auto text-emerald-500 shadow-inner">
                  <Shield size={40} />
                </div>
                <div>
                  <h2 className="text-2xl font-black mb-2 text-white">Prêt pour Certification</h2>
                  <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">Vos documents et {formData.photos.length} photos seront envoyés pour validation terrain.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between">
            <button onClick={prevStep} disabled={step === 1 || loading} className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all ${step === 1 ? 'opacity-0' : 'text-slate-400 hover:text-white'}`}>
              <ArrowLeft size={18} /> Retour
            </button>

            {step < totalSteps ? (
              <button onClick={nextStep} className="btn-primary !py-3 px-8 text-xs flex items-center gap-3">
                CONTINUER <ArrowRight size={18} />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={loading} className="btn-primary bg-emerald-600 hover:bg-emerald-500 !py-3 px-8 text-xs flex items-center gap-3">
                {loading ? <Loader2 className="animate-spin" /> : <>VALIDER L'ANNONCE <Check size={18} /></>}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProperty;
