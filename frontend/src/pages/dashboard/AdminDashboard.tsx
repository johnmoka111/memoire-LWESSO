import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Building2, 
  ShieldCheck, 
  AlertCircle, 
  Plus, 
  Search, 
  CheckCircle, 
  XCircle, 
  ArrowUpRight, 
  Gavel, 
  Coins,
  Loader2,
  Info
} from 'lucide-react';
import { Web3Service } from '../../services/web3';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'agents' | 'transactions' | 'litiges'>('agents');
  const [loading, setLoading] = useState(false);
  const [txStatus, setTxStatus] = useState<string | null>(null);

  // Simulation des transactions en séquestre
  const transactions = [
    {
      id: 0, // TokenId
      propriete: "Villa Nguba #0",
      vendeur: "0x123...456",
      acheteur: "0x789...012",
      montant: "12.5 ETH",
      status: "Verified", // Déjà certifié par l'agent
      date: "26 Oct 2026"
    }
  ];

  const handleFinalize = async (tokenId: number) => {
    setLoading(true);
    setTxStatus("Finalisation de la vente sur la blockchain...");
    try {
      await Web3Service.connectWallet();
      await Web3Service.finalizeSale(tokenId);
      setTxStatus("Vente finalisée avec succès ! NFT transféré et fonds libérés.");
    } catch (error: any) {
      console.error(error);
      setTxStatus("Erreur : " + (error.message || "Échec de la transaction"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto xl:px-20 md:px-10 px-4 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Console d'Arbitrage Admin</h1>
          <p className="text-slate-500 mt-2 text-lg">Supervision des transactions et résolution des litiges immobiliers.</p>
        </div>
        
        <div className="flex bg-slate-100 p-2 rounded-[24px] border border-slate-200">
          <button onClick={() => setActiveTab('agents')} className={`px-8 py-3 rounded-[20px] text-sm font-bold transition-all ${activeTab === 'agents' ? 'bg-white text-slate-900 shadow-xl shadow-slate-200' : 'text-slate-500'}`}>Agents</button>
          <button onClick={() => setActiveTab('transactions')} className={`px-8 py-3 rounded-[20px] text-sm font-bold transition-all ${activeTab === 'transactions' ? 'bg-white text-slate-900 shadow-xl shadow-slate-200' : 'text-slate-500'}`}>Séquestres</button>
          <button onClick={() => setActiveTab('litiges')} className={`px-8 py-3 rounded-[20px] text-sm font-bold transition-all ${activeTab === 'litiges' ? 'bg-white text-slate-900 shadow-xl shadow-slate-200' : 'text-slate-500'}`}>Litiges</button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'transactions' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-8 py-6 text-xs font-black uppercase text-slate-400 tracking-widest">Bien (NFT)</th>
                    <th className="px-8 py-6 text-xs font-black uppercase text-slate-400 tracking-widest">Séquestre</th>
                    <th className="px-8 py-6 text-xs font-black uppercase text-slate-400 tracking-widest">Statut Blockchain</th>
                    <th className="px-8 py-6 text-xs font-black uppercase text-slate-400 tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/50 transition">
                      <td className="px-8 py-8">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center">
                            <Building2 className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{tx.propriete}</div>
                            <div className="text-xs text-slate-400 font-medium">TokenID #{tx.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-8">
                        <div className="flex items-center gap-2 text-rose-600 font-black">
                          <Coins className="w-4 h-4" />
                          {tx.montant}
                        </div>
                      </td>
                      <td className="px-8 py-8">
                        <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 w-fit px-4 py-1.5 rounded-full border border-emerald-100 text-xs font-black">
                          <ShieldCheck className="w-4 h-4" />
                          CERTIFIÉ PAR AGENT
                        </div>
                      </td>
                      <td className="px-8 py-8 text-right">
                        <button 
                          onClick={() => handleFinalize(tx.id)}
                          disabled={loading}
                          className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition shadow-lg shadow-slate-200 flex items-center gap-2 ml-auto disabled:bg-slate-300"
                        >
                          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Gavel className="w-4 h-4" />}
                          Libérer les fonds
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {txStatus && (
              <div className="p-6 bg-slate-900 text-white rounded-[24px] flex items-center gap-4 shadow-2xl">
                <Info className="w-6 h-6 text-rose-400" />
                <span className="font-bold tracking-tight">{txStatus}</span>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'agents' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm border-dashed flex flex-col items-center justify-center text-center space-y-4 min-h-[300px]">
              <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center">
                <Plus className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Nouvel Agent</h3>
                <p className="text-sm text-slate-500">Ajouter un oracle certifié.</p>
              </div>
            </div>
            {/* Liste des agents existants... */}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
