import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileSearch, CheckCircle, XCircle, MapPin, Eye, FileText, ShieldCheck, Clock, ExternalLink, Camera, Loader2, Info } from 'lucide-react';
import { Web3Service } from '../../services/web3';

const AgentDashboard = () => {
  const [activeTab, setActiveTab] = useState<'missions' | 'historique'>('missions');
  const [selectedMission, setSelectedMission] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  
  // Dans un cas réel, ces données proviendraient de la DB via le Backend
  const missions = [
    {
      id: 0, // TokenId sur la blockchain
      titre: 'Maison 4 pièces - Panzi',
      owner: 'Jean Dupont',
      commune: 'Ibanda',
      prix: '35000',
      superficie: '350m²',
      date: '24 Oct 2026',
      docs: ['Titre Foncier PDF', 'Plan Cadastral JPG'],
      status: 'assigne'
    },
    {
      id: 1,
      titre: 'Terrain vide Nguba',
      owner: 'Marie Claire',
      commune: 'Ibanda',
      prix: '85000',
      superficie: '600m²',
      date: '25 Oct 2026',
      docs: ['Titre Foncier PDF'],
      status: 'assigne'
    }
  ];

  const handleVerify = async (tokenId: number) => {
    setLoading(true);
    setStatus("Connexion à la Blockchain...");
    try {
      await Web3Service.connectWallet();
      setStatus("Envoi de la certification (Oracle Agent)...");
      await Web3Service.verifyProperty(tokenId);
      setStatus("Succès ! Titre certifié sur Ethereum.");
      setTimeout(() => setSelectedMission(null), 2000);
    } catch (error: any) {
      console.error(error);
      setStatus("Erreur : " + (error.message || "Transaction rejetée"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto xl:px-20 md:px-10 px-4 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Espace Agent Foncier</h1>
          <p className="text-slate-500 mt-1">Inspection terrain et certification immuable (Oracle Humain).</p>
        </div>
        
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveTab('missions')}
            className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'missions' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Missions en attente</span>
          </button>
          <button
            onClick={() => setActiveTab('historique')}
            className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'historique' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>Historique</span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'missions' ? (
          <motion.div
            key="missions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 gap-6"
          >
            {missions.map((mission) => (
              <div key={mission.id} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                <div className="flex flex-col lg:flex-row justify-between gap-8">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-lg text-xs font-bold uppercase tracking-wider border border-amber-100">À inspecter</span>
                      <span className="text-sm text-slate-400 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        ID Jeton : #{mission.id}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">{mission.titre}</h2>
                    <div className="flex flex-wrap items-center gap-6 text-slate-600 mb-6">
                      <div className="flex items-center">
                        <MapPin className="w-5 h-5 mr-2 text-slate-400" />
                        <span className="font-medium">{mission.commune}</span>
                      </div>
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 mr-2 text-slate-400" />
                        <span>Propriétaire : <span className="font-bold text-slate-900">{mission.owner}</span></span>
                      </div>
                    </div>
                  </div>

                  <div className="lg:w-72 flex flex-col justify-center">
                    <button 
                      onClick={() => setSelectedMission(mission)}
                      className="w-full flex items-center justify-center space-x-2 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                    >
                      <Eye className="w-5 h-5" />
                      <span>Examiner & Certifier</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
             <CheckCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
             <p className="text-slate-500 font-medium">Aucun historique de certification récent.</p>
          </div>
        )}
      </AnimatePresence>

      {/* Modal d'examen (Orientation n°2) */}
      {selectedMission && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-[32px] w-full max-w-2xl overflow-hidden shadow-2xl"
          >
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Certification Blockchain</h2>
                <p className="text-sm text-slate-500">Signature de l'état "isVerified" pour le Jeton #{selectedMission.id}</p>
              </div>
              <button onClick={() => setSelectedMission(null)} className="p-2 hover:bg-white rounded-full transition shadow-sm border border-slate-200">
                <XCircle className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="p-8 space-y-8">
              <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100 flex gap-4">
                <Info className="w-6 h-6 text-indigo-600 flex-shrink-0" />
                <div className="text-sm text-indigo-800">
                  <p className="font-bold mb-1">Rôle d'Oracle Humain</p>
                  <p>Votre signature sur la blockchain atteste que vous avez physiquement vérifié l'existence du terrain et la véracité des documents.</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Preuves Terrain</h3>
                <div className="p-6 border-2 border-dashed border-slate-200 rounded-2xl text-center">
                  <Camera className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p className="text-xs font-bold text-slate-500">Ajouter les photos géo-taguées de l'inspection</p>
                </div>
              </div>

              {status && (
                <div className={`p-4 rounded-xl text-sm font-bold ${status.includes("Succès") ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-slate-100 text-slate-700"}`}>
                   {loading && <Loader2 className="w-4 h-4 animate-spin inline mr-2" />}
                   {status}
                </div>
              )}
            </div>

            <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
              <button 
                onClick={() => setSelectedMission(null)}
                className="flex-1 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold"
              >
                Annuler
              </button>
              <button 
                onClick={() => handleVerify(selectedMission.id)}
                disabled={loading}
                className="flex-[2] py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all flex items-center justify-center space-x-2 disabled:bg-slate-300"
              >
                <ShieldCheck className="w-5 h-5" />
                <span>Signer la Certification</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AgentDashboard;
