import { ethers } from 'ethers';

// ABI mise à jour pour KivuMarketTitle (ERC-721 + Escrow)
export const KIVU_TITLE_ABI = [
  "function mintTitle(string memory _uri, string memory _docHash, string memory _coords) external returns (uint256)",
  "function verifyTitle(uint256 _tokenId) external",
  "function depositEscrow(uint256 _tokenId) external payable",
  "function releaseFunds(uint256 _tokenId) external",
  "function refundBuyer(uint256 _tokenId) external",
  "function titles(uint256 tokenId) external view returns (string docHash, string coordinates, bool isVerified, uint256 escrowAmount, address buyer, address seller)",
  "function ownerOf(uint256 tokenId) external view returns (address)",
  "event TitleMinted(uint256 indexed tokenId, string docHash, address owner)",
  "event TitleVerified(uint256 indexed tokenId, address agent)",
  "event EscrowDeposited(uint256 indexed tokenId, uint256 amount, address buyer)",
  "event SaleFinalized(uint256 indexed tokenId, address newOwner, uint256 amount)"
];

// Adresse du contrat (à mettre à jour après déploiement)
export const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export class Web3Service {
  private static provider: ethers.BrowserProvider | null = null;

  static async getProvider() {
    if (!window.ethereum) throw new Error("MetaMask n'est pas installé");
    if (!this.provider) this.provider = new ethers.BrowserProvider(window.ethereum);
    return this.provider;
  }

  static async connectWallet() {
    const provider = await this.getProvider();
    const accounts = await provider.send("eth_requestAccounts", []);
    return accounts[0];
  }

  // --- ANCRAGE (Orientation 1) ---
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
      coordinates: details[1],
      isVerified: details[2],
      escrowAmount: ethers.formatEther(details[3]),
      buyer: details[4],
      seller: details[5],
      owner: await contract.ownerOf(tokenId)
    };
  }
}
