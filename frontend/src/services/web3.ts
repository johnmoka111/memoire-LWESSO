import { ethers } from 'ethers';
import { ipfsService } from './ipfs';

// ABI mise à jour pour KivuMarketTitle (ERC-721 + Escrow)
export const KIVU_TITLE_ABI = [
  "function mintTitle(string calldata _uri, bytes32 _docHash, string calldata _coords) external returns (uint256)",
  "function verifyTitle(uint256 _tokenId) external",
  "function depositEscrow(uint256 _tokenId) external payable",
  "function releaseFunds(uint256 _tokenId) external",
  "function adminResolve(uint256 _tokenId, bool _releaseToSeller) external",
  "function setPlatformFee(uint256 _fee) external",
  "function titles(uint256 tokenId) external view returns (bytes32 docHash, uint256 escrowAmount, address buyer, address seller, bool isVerified, string coordinates)",
  "function ownerOf(uint256 tokenId) external view returns (address)",
  "event TitleMinted(uint256 indexed tokenId, bytes32 docHash, address owner)",
  "event TitleVerified(uint256 indexed tokenId, address agent)",
  "event EscrowDeposited(uint256 indexed tokenId, uint256 amount, address buyer)",
  "event SaleFinalized(uint256 indexed tokenId, address newOwner, uint256 amount)",
  "event DisputeResolved(uint256 indexed tokenId, bool releaseToSeller, address resolver)"
];

// Adresse du contrat (à mettre à jour après déploiement)
export const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export class Web3Service {
  private static provider: ethers.BrowserProvider | null = null;

  static async getProvider() {
    if (!window.ethereum) throw new Error("MetaMask n'est pas installé");
    
    // Vérifier et proposer de passer sur GoChain Testnet si nécessaire
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x7A69' }], // 31337 en hexadécimal
      });
    } catch (switchError: any) {
      // Le code 4902 indique que la chaine n'est pas ajoutée à MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x7A69',
                chainName: 'GoChain Testnet',
                nativeCurrency: { name: 'GO', symbol: 'GO', decimals: 18 },
                rpcUrls: ['https://testnet-rpc.gochain.io'],
                blockExplorerUrls: ['https://testnet-explorer.gochain.io'],
              },
            ],
          });
        } catch (addError) {
          throw new Error("Impossible de configurer GoChain Testnet automatiquement.");
        }
      } else {
        throw new Error("Erreur de connexion au réseau GoChain Testnet.");
      }
    }

    if (!this.provider) this.provider = new ethers.BrowserProvider(window.ethereum);
    return this.provider;
  }

  static async connectWallet() {
    const provider = await this.getProvider();
    const accounts = await provider.send("eth_requestAccounts", []);
    return accounts[0];
  }

  // --- ANCRAGE (Orientation 1) ---
  /**
   * Crée les métadonnées IPFS pour un titre et retourne le CID.
   */
  static async createPropertyMetadata(propertyData: any, documents: string[]) {
    const metadata = {
      name: `KivuMarket Title: ${propertyData.titre}`,
      description: propertyData.description,
      image: propertyData.imageUrl || "",
      external_url: `https://kivumarket.app/property/${propertyData.id}`,
      attributes: [
        { trait_type: "Commune", value: propertyData.commune },
        { trait_type: "Prix", value: propertyData.prix },
        { trait_type: "Vendeur", value: propertyData.sellerName }
      ],
      properties: {
        documents: documents,
        coordinates: propertyData.coords
      }
    };
    
    const result = await ipfsService.uploadMetadata(metadata);
    return `ipfs://${result.ipfsHash}`;
  }

  static async mintPropertyTitle(metadataUri: string, docHash: string, coords: string) {
    const provider = await this.getProvider();
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, KIVU_TITLE_ABI, signer);

    const tx = await contract.mintTitle(metadataUri, docHash, coords);
    return await tx.wait();
  }

  // --- CERTIFICATION (Orientation 2) ---
  static async verifyProperty(tokenId: number) {
    const provider = await this.getProvider();
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, KIVU_TITLE_ABI, signer);

    const tx = await contract.verifyTitle(tokenId);
    return await tx.wait();
  }

  // --- SÉQUESTRE (Orientation 3) ---
  static async depositToEscrow(tokenId: number, amountEth: string) {
    const provider = await this.getProvider();
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, KIVU_TITLE_ABI, signer);

    const tx = await contract.depositEscrow(tokenId, { 
      value: ethers.parseEther(amountEth) 
    });
    return await tx.wait();
  }

  static async finalizeSale(tokenId: number) {
    const provider = await this.getProvider();
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, KIVU_TITLE_ABI, signer);

    const tx = await contract.releaseFunds(tokenId);
    return await tx.wait();
  }

  // --- LECTURE EN TEMPS RÉEL (Orientation 4) ---
  static async getTitleDetails(tokenId: number) {
    const provider = await this.getProvider();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, KIVU_TITLE_ABI, provider);
    
    const details = await contract.titles(tokenId);
    return {
      docHash: details[0],
      escrowAmount: ethers.formatEther(details[1]),
      buyer: details[2],
      seller: details[3],
      isVerified: details[4],
      coordinates: details[5],
      owner: await contract.ownerOf(tokenId)
    };
  }
}
