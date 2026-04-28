import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  ShieldCheck, 
  Gavel, 
  Coins,
  Loader2,
  Info,
  TrendingUp,
  ShieldAlert,
  Plus
} from 'lucide-react';
import { Web3Service } from '../../services/web3';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'agents' | 'transactions' | 'litiges'>('transactions');
  const [loading, setLoading] = useState(false);
  const [txStatus, setTxStatus] = useState<string | null>(null);

  const stats = [
    { label: "Volume Séquestre", value: "45,250 $", icon: Coins, color: "text-rose-600", bg: "bg-rose-50" },
    { label: "Frais (2.5%)", value: "1,131 $", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Litiges", value: "2", icon: ShieldAlert, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  const transactions = [
    { id: 0, propriete: "Villa Nguba", vendeur: "0x123", acheteur: "0x789", montant: "125k $", isDisputed: false },
    { id: 1, propriete: "Terrain Panzi", vendeur: "0xABC", acheteur: "0x999", montant: "15k $", isDisputed: true }
  ];

  const handleFinalize = async (tokenId: number) => {
    setLoading(true);
    setTxStatus("Envoi sur la blockchain...");
    try {
      await Web3Service.connectWallet();
      await Web3Service.finalizeSale(tokenId);
      setTxStatus("Succès : Vente finalisée.");
    } catch (error: any) {
      setTxStatus("Erreur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black mb-10">Console d'Arbitrage</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((s, i) => (
            <div key={i} className="bg-white p-6 rounded-[24px] border shadow-sm">
              <div className={`${s.bg} ${s.color} w-10 h-10 rounded-xl flex items-center justify-center mb-4`}>
                <s.icon className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase">{s.label}</p>
              <p className="text-2xl font-black text-slate-900">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-[32px] border overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Propriété</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Montant</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">État</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-6 font-bold">{tx.propriete}</td>
                  <td className="px-6 py-6 text-rose-600 font-black">{tx.montant}</td>
                  <td className="px-6 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black ${tx.isDisputed ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                      {tx.isDisputed ? 'LITIGE' : 'OK'}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <button onClick={() => handleFinalize(tx.id)} disabled={loading || tx.isDisputed} className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold disabled:bg-slate-200">Libérer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {txStatus && (
          <div className="mt-8 p-6 bg-slate-900 text-white rounded-2xl flex items-center gap-4">
            <Info className="w-5 h-5 text-rose-400" />
            <span className="font-bold">{txStatus}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
