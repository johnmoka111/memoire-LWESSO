import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileSearch, 
  CheckCircle, 
  XCircle, 
  MapPin, 
  Eye, 
  FileText, 
  ShieldCheck, 
  Clock, 
  ExternalLink, 
  Camera, 
  Loader2, 
  Info,
  Navigation,
  Check,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { Web3Service } from '../../services/web3';
import { propertyService } from '../../services/api';
import { ipfsService } from '../../services/ipfs';

const AgentDashboard = () => {
  const [activeTab, setActiveTab] = useState<'missions' | 'historique'>('missions');
  const [selectedMission, setSelectedMission] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  
  const [gpsCoords, setGpsCoords] = useState("");
  const [inspectionPhoto, setInspectionPhoto] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const [missions, setMissions] = useState<any[]>([]);

  useEffect(() => {
    fetchMissions();
  }, []);

  const fetchMissions = async () => {
    try {
      setLoading(true);
      const data = await propertyService.getMissions();
      setMissions(data.data || []);
    } catch (error) {
      console.error("Erreur missions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setInspectionPhoto(e.target.files[0]);
    }
  };

  const handleVerify = async (tokenId: number) => {
    setLoading(true);
    setStatus("Ancrage sur IPFS...");
    try {
      let photoIpfsUrl = "";
      if (inspectionPhoto) {
        setIsUploading(true);
        const result = await ipfsService.uploadFile(inspectionPhoto);
        photoIpfsUrl = result.url;
        setIsUploading(false);
      }

      setStatus("Signature MetaMask...");
      await Web3Service.connectWallet();
      
      setStatus("Certification Blockchain...");
      await Web3Service.verifyProperty(tokenId);
      
      setStatus("Finalisation Backend...");
      await propertyService.validateProperty(selectedMission.id, photoIpfsUrl);

      setStatus("Terminé !");
      
      setTimeout(() => {
        setSelectedMission(null);
        setStep(1);
        setStatus(null);
        fetchMissions();
      }, 2000);

    } catch (error: any) {
      console.error(error);
      setStatus("Erreur");
    } finally {
      setLoading(false);
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black mb-8">Console Agent</h1>
        
        <div className="grid grid-cols-1 gap-6">
          {missions.map((m) => (
            <div key={m.id} className="bg-white p-6 rounded-3xl border shadow-sm flex justify-between items-center">
              <div>
                <h3 className="font-bold text-xl">{m.titre}</h3>
                <p className="text-slate-500">{m.commune}</p>
              </div>
              <button onClick={() => setSelectedMission(m)} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold">Inspecter</button>
            </div>
          ))}
        </div>

        {selectedMission && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white w-full max-w-md rounded-[32px] p-8">
              <h2 className="text-2xl font-bold mb-6">Certification #{selectedMission.id}</h2>
              {step === 1 ? (
                <div className="space-y-4">
                  <input type="text" placeholder="GPS" value={gpsCoords} onChange={e => setGpsCoords(e.target.value)} className="w-full p-4 border rounded-xl" />
                  <input type="file" onChange={handleFileChange} className="w-full" />
                  <button onClick={() => setStep(2)} className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold">Suivant</button>
                </div>
              ) : (
                <div className="space-y-4 text-center">
                  <p>Prêt pour la signature blockchain</p>
                  <button onClick={() => handleVerify(selectedMission.id)} disabled={loading} className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold">Signer</button>
                  {status && <p className="text-sm font-bold text-emerald-600">{status}</p>}
                </div>
              )}
              <button onClick={() => setSelectedMission(null)} className="mt-4 text-slate-400 w-full">Annuler</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentDashboard;
