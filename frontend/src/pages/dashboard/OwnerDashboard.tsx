import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Home, MapPin, FileText, CheckCircle, Clock, AlertTriangle, Upload, Loader2 } from 'lucide-react';
import { propertyService } from '../../services/api';
import { Web3Service } from '../../services/web3';
import { ipfsService } from '../../services/ipfs';

const OwnerDashboard = () => {
  const [activeTab, setActiveTab] = useState<'mes-biens' | 'nouveau'>('mes-biens');

  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    titre: '',
    type: 'terrain',
    commune: 'ibanda',
    prix: '',
    description: '',
    coords: '-2.5000, 28.8600'
  });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      // Pour la démo, on utilise l'index filtré par le backend si implémenté, 
      // ou on récupère tout et on filtre ici si nécessaire
      const res = await propertyService.getMissions(); // On réutilise le service missions ou on en crée un spécifique
      // setProperties(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert("Veuillez uploader le document foncier.");
      return;
    }

    setLoading(true);
    try {
      setStatus("Étape 1/3 : Upload du document sur IPFS...");
      const docResult = await ipfsService.uploadFile(file);
      
      setStatus("Étape 2/3 : Génération des métadonnées NFT...");
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const metadataUri = await Web3Service.createPropertyMetadata({
        ...formData,
        sellerName: user.name,
      }, [docResult.url]);

      setStatus("Étape 3/3 : Signature et Mint sur la Blockchain...");
      // docHash doit être un bytes32 (hash du document)
      const docHash = "0x" + Math.random().toString(16).padEnd(64, '0').slice(2, 66); // Simulation hash
      await Web3Service.mintPropertyTitle(metadataUri, docHash, formData.coords);

      setStatus("Finalisation : Enregistrement en base de données...");
      await propertyService.createProperty({
        ...formData,
        document_hash: docHash,
        metadata_url: metadataUri,
        image_url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750" // Image par défaut
      });

      setStatus("Succès ! Votre bien est en attente de certification.");
      setTimeout(() => {
        setActiveTab('mes-biens');
        setStatus(null);
      }, 2000);
      
    } catch (error: any) {
      console.error(error);
      setStatus("Erreur : " + (error.message || "Échec de l'opération"));
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case 'valide':
        return <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium"><CheckCircle className="w-3 h-3" /><span>Validé</span></span>;
      case 'en_attente':
        return <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium"><Clock className="w-3 h-3" /><span>En attente</span></span>;
      default:
        return <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium"><Clock className="w-3 h-3" /><span>En attente</span></span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Mon Patrimoine Immobilier</h1>
          <p className="text-slate-500">Gérez vos titres fonciers numériques et suivez vos ventes en cours.</p>
        </div>
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200">
          <button
            onClick={() => setActiveTab('mes-biens')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'mes-biens' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Mes Titres
          </button>
          <button
            onClick={() => setActiveTab('nouveau')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'nouveau' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Ancrer un nouveau bien
          </button>
        </div>
      </div>

      {/* Résumé Financier (Spécifique Propriétaire) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500 mb-1">Total Biens Ancrés</p>
          <p className="text-2xl font-bold text-slate-900">{properties.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500 mb-1">Ventes en Séquestre</p>
          <p className="text-2xl font-bold text-amber-600">
            {properties.filter(p => p.escrow_status === 'locked').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-indigo-100 bg-indigo-50/30 shadow-sm">
          <p className="text-sm text-indigo-600 font-medium mb-1">Gains cumulés</p>
          <p className="text-2xl font-bold text-indigo-700">$0.00</p>
        </div>
      </div>

      {activeTab === 'mes-biens' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((prop, index) => (
            <motion.div
              key={prop.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group"
            >
              <div className="relative h-48 overflow-hidden">
                <img src={prop.image} alt={prop.titre} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute top-4 right-4">
                  {getStatusBadge(prop.statut)}
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-slate-900 line-clamp-1" title={prop.titre}>{prop.titre}</h3>
                </div>
                <div className="flex items-center text-slate-500 text-sm mb-4 space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{prop.commune}</span>
                </div>
                
                {/* Indicateur de Séquestre */}
                {prop.escrow_status === 'locked' && (
                  <div className="mb-4 p-2 bg-amber-50 rounded-lg border border-amber-100 flex items-center space-x-2 text-xs text-amber-700 font-medium">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Fonds verrouillés en séquestre par un acheteur</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="text-lg font-bold text-indigo-600">${prop.prix}</div>
                  <button className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors flex items-center space-x-1">
                    <FileText className="w-4 h-4" />
                    <span>Gérer le titre</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Add new card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: properties.length * 0.1 }}
            onClick={() => setActiveTab('nouveau')}
            className="bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-8 cursor-pointer hover:bg-indigo-50 hover:border-indigo-200 transition-colors group min-h-[340px]"
          >
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm text-slate-400 group-hover:text-indigo-600 group-hover:scale-110 transition-all mb-4">
              <Plus className="w-8 h-8" />
            </div>
            <h3 className="font-semibold text-slate-700 group-hover:text-indigo-900">Ajouter un nouveau bien</h3>
            <p className="text-sm text-slate-500 text-center mt-2">Soumettez votre bien foncier pour certification par un agent agréé.</p>
          </motion.div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8"
        >
          <div className="flex items-center space-x-4 mb-8 pb-6 border-b border-slate-100">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <Home className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Soumettre un bien</h2>
              <p className="text-sm text-slate-500">Remplissez les informations de votre bien pour commencer le processus.</p>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Titre du bien</label>
                <input 
                  type="text" 
                  required
                  value={formData.titre}
                  onChange={(e) => setFormData({...formData, titre: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all" 
                  placeholder="Ex: Parcelle résidentielle..." 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Type de bien</label>
                <select 
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all"
                >
                  <option value="terrain">Terrain</option>
                  <option value="maison">Maison</option>
                  <option value="appartement">Appartement</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Commune</label>
                <select 
                  value={formData.commune}
                  onChange={(e) => setFormData({...formData, commune: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all"
                >
                  <option value="ibanda">Ibanda</option>
                  <option value="kadutu">Kadutu</option>
                  <option value="bagira">Bagira</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Prix (USD)</label>
                <input 
                  type="number" 
                  required
                  value={formData.prix}
                  onChange={(e) => setFormData({...formData, prix: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all" 
                  placeholder="Ex: 50000" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
              <textarea 
                rows={4} 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all resize-none" 
                placeholder="Décrivez votre bien en détail..."
              ></textarea>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
              <label className="flex flex-col items-center justify-center cursor-pointer">
                <Upload className="w-8 h-8 text-slate-400 mb-2" />
                <span className="text-sm font-medium text-slate-600">
                  {file ? file.name : "Cliquez pour uploader le Titre Foncier (PDF/JPG)"}
                </span>
                <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
              </label>
            </div>

            {status && (
              <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center space-x-3 text-indigo-700 text-sm font-medium">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{status}</span>
              </div>
            )}

            <div className="pt-6 border-t border-slate-100 flex justify-end space-x-4">
              <button type="button" disabled={loading} onClick={() => setActiveTab('mes-biens')} className="px-6 py-3 text-slate-600 font-medium hover:bg-slate-50 rounded-xl transition-colors">Annuler</button>
              <button 
                type="submit" 
                disabled={loading}
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Soumettre sur la Blockchain</span>
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
};

export default OwnerDashboard;
