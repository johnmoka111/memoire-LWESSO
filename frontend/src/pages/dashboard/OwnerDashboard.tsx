import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Home, MapPin, FileText, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

const OwnerDashboard = () => {
  const [activeTab, setActiveTab] = useState<'mes-biens' | 'nouveau'>('mes-biens');

  const properties = [
    {
      id: 1,
      titre: 'Parcelle résidentielle - Muhumba',
      commune: 'Ibanda',
      prix: '50000',
      statut: 'valide',
      date: '12 Oct 2026',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 2,
      titre: 'Maison 4 pièces - Panzi',
      commune: 'Ibanda',
      prix: '35000',
      statut: 'en_attente',
      date: '24 Oct 2026',
      image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
  ];

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case 'valide':
        return <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium"><CheckCircle className="w-3 h-3" /><span>Validé</span></span>;
      case 'en_attente':
        return <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium"><Clock className="w-3 h-3" /><span>En attente</span></span>;
      default:
        return <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium"><AlertTriangle className="w-3 h-3" /><span>Inconnu</span></span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Espace Propriétaire</h1>
          <p className="text-slate-500">Gérez vos biens et suivez leur processus de certification.</p>
        </div>
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200">
          <button
            onClick={() => setActiveTab('mes-biens')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'mes-biens' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Mes Biens
          </button>
          <button
            onClick={() => setActiveTab('nouveau')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'nouveau' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Ajouter un bien
          </button>
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
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="text-lg font-bold text-indigo-600">${prop.prix}</div>
                  <button className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors flex items-center space-x-1">
                    <FileText className="w-4 h-4" />
                    <span>Détails</span>
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

          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Titre du bien</label>
                <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all" placeholder="Ex: Parcelle résidentielle..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Type de bien</label>
                <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all">
                  <option value="terrain">Terrain</option>
                  <option value="maison">Maison</option>
                  <option value="appartement">Appartement</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Commune</label>
                <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all">
                  <option value="ibanda">Ibanda</option>
                  <option value="kadutu">Kadutu</option>
                  <option value="bagira">Bagira</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Prix (USD)</label>
                <input type="number" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all" placeholder="Ex: 50000" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
              <textarea rows={4} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all resize-none" placeholder="Décrivez votre bien en détail..."></textarea>
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-end space-x-4">
              <button type="button" onClick={() => setActiveTab('mes-biens')} className="px-6 py-3 text-slate-600 font-medium hover:bg-slate-50 rounded-xl transition-colors">Annuler</button>
              <button type="button" className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98]">
                Enregistrer et continuer
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
};

export default OwnerDashboard;
