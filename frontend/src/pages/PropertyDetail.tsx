import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Share, Heart, ChevronLeft, BadgeCheck, Lock, ArrowRight, Star, Info, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { Web3Service } from '../services/web3';

const PropertyDetail = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [txStatus, setTxStatus] = useState<string | null>(null);
  const [blockchainData, setBlockchainData] = useState<any>(null);

  // Orientation 4 : Récupération temps réel via useEffect
  useEffect(() => {
    const fetchBlockchainState = async () => {
      try {
        if (id) {
          const data = await Web3Service.getTitleDetails(Number(id));
          setBlockchainData(data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données blockchain:", error);
      }
    };
    fetchBlockchainState();
  }, [id]);

  const property = {
    id: id,
    titre: "Villa de Luxe avec Vue sur le Lac",
    prix: "120,000",
    description: "Une magnifique propriété située sur les hauteurs de Nguba, offrant une vue imprenable sur le Lac Kivu. Ce terrain de 600m² comprend une villa moderne de 4 chambres, un jardin aménagé et un garage spacieux. Document sécurisé par NFT ERC-721.",
    superficie: "600",
    quartier: "Nguba",
    commune: "Ibanda",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80"
    ]
  };

  const handlePurchase = async () => {
    setLoading(true);
    setTxStatus("Connexion à MetaMask...");
    try {
      await Web3Service.connectWallet();
      setTxStatus("Dépôt en cours sur le Smart Contract (Escrow)...");
      
      // Orientation 3 : Utilisation de msg.value via depositToEscrow
      await Web3Service.depositToEscrow(
        Number(id),
        "0.01" // Montant de test en ETH
      );
      
      setTxStatus("Succès ! Vos fonds sont bloqués en séquestre jusqu'à la validation finale.");
      // Rafraîchir les données
      const data = await Web3Service.getTitleDetails(Number(id));
      setBlockchainData(data);
    } catch (error: any) {
      console.error(error);
      setTxStatus("Erreur : " + (error.message || "Transaction annulée"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white">
      <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 px-4 pt-6 pb-20">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center text-slate-800 hover:underline font-semibold gap-1">
              <ChevronLeft className="w-4 h-4" />
              Retour
            </Link>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 underline font-semibold hover:bg-slate-50 p-2 rounded-lg transition">
                <Share className="w-4 h-4" />
                Partager
              </button>
              <button className="flex items-center gap-2 underline font-semibold hover:bg-slate-50 p-2 rounded-lg transition">
                <Heart className="w-4 h-4" />
                Enregistrer
              </button>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">{property.titre}</h1>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4 font-semibold text-slate-800 underline">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-slate-900" />
                <span>4.9</span>
              </div>
              <span>{property.quartier}, {property.commune}</span>
            </div>
            
            {blockchainData?.isVerified ? (
              <div className="flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                <ShieldCheck className="w-4 h-4" />
                Titre Certifié par Agent
              </div>
            ) : (
              <div className="flex items-center gap-1 text-amber-700 font-bold bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                <ShieldCheck className="w-4 h-4" />
                En attente de certification physique
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-6 rounded-2xl overflow-hidden aspect-[16/9] md:aspect-[21/9]">
          <div className="h-full w-full">
            <img src={property.images[0]} className="object-cover w-full h-full hover:brightness-90 transition cursor-pointer" alt="Main" />
          </div>
          <div className="hidden md:block h-full w-full">
            <img src={property.images[1]} className="object-cover w-full h-full hover:brightness-90 transition cursor-pointer" alt="Secondary" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-12">
          <div className="md:col-span-2 space-y-8">
            <div className="flex justify-between items-center border-b border-slate-200 pb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Propriétaire NFT : {blockchainData?.owner ? `${blockchainData.owner.substring(0,6)}...${blockchainData.owner.substring(38)}` : "Chargement..."}</h2>
                <p className="text-slate-500">ID du Jeton (NFT) : #{id} • Hash : {blockchainData?.docHash || "..."}</p>
              </div>
              <div className="w-14 h-14 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-xl">
                <User className="w-6 h-6" />
              </div>
            </div>

            <div className="space-y-6 border-b border-slate-200 pb-12">
              <div className="flex gap-4">
                <ShieldCheck className="w-8 h-8 text-rose-500 mt-1" />
                <div>
                  <h3 className="font-bold text-lg">Ancrage Immuable (NFT)</h3>
                  <p className="text-slate-500">Ce bien est représenté par un jeton ERC-721 unique. Le hash du titre est gravé sur Ethereum.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <BadgeCheck className="w-8 h-8 text-rose-500 mt-1" />
                <div>
                  <h3 className="font-bold text-lg">Localisation GPS : {blockchainData?.coordinates || "..."}</h3>
                  <p className="text-slate-500">Les coordonnées géographiques sont inscrites dans les métadonnées du NFT.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Lock className="w-8 h-8 text-rose-500 mt-1" />
                <div>
                  <h3 className="font-bold text-lg">Escrow Financier (Dépôt : {blockchainData?.escrowAmount || "0"} ETH)</h3>
                  <p className="text-slate-500">Paiement sécurisé. Les fonds ne sont libérés qu'après le transfert légal du titre.</p>
                </div>
              </div>
            </div>

            <div className="py-6">
              <p className="text-lg text-slate-700 leading-relaxed">
                {property.description}
              </p>
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="sticky top-28 bg-white border border-slate-200 rounded-3xl p-6 shadow-xl shadow-slate-100 space-y-6">
              <div className="flex justify-between items-end">
                <div className="flex items-center gap-1">
                  <span className="text-2xl font-bold">${property.prix}</span>
                  <span className="text-slate-500">total</span>
                </div>
              </div>

              <div className="rounded-xl border border-slate-400 p-4 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="font-bold uppercase text-[10px]">Statut Transaction</span>
                  <span className="font-semibold text-rose-600">{blockchainData?.escrowAmount > 0 ? "Fonds bloqués" : "Disponible"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-bold uppercase text-[10px]">Certification</span>
                  <span className="font-semibold">{blockchainData?.isVerified ? "Vérifié" : "En attente"}</span>
                </div>
              </div>

              <button 
                onClick={handlePurchase}
                disabled={loading || blockchainData?.escrowAmount > 0}
                className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-rose-100 transition disabled:bg-slate-300 flex items-center justify-center gap-3"
              >
                {loading ? "Chargement..." : blockchainData?.escrowAmount > 0 ? "Déjà réservé" : (
                  <>
                    Acheter via Escrow
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              {txStatus && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs font-medium text-slate-600 flex gap-2">
                  <Info className="w-4 h-4 flex-shrink-0" />
                  <span>{txStatus}</span>
                </div>
              )}

              <div className="pt-4 border-t border-slate-200 text-center text-xs text-slate-400">
                L'adresse de l'acheteur sera enregistrée sur le contrat.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
