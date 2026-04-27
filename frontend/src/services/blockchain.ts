import { ethers } from 'ethers';
import KivuMarketEscrowABI from '../abis/KivuMarketEscrow.json';

// L'adresse sera remplie après le déploiement via Hardhat
const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000";

/**
 * Service pour interagir avec le Smart Contract KivuMarketEscrow.
 */
export const BlockchainService = {
  
  /**
   * Se connecte au wallet de l'utilisateur (MetaMask).
   */
  async getSigner() {
    if (!window.ethereum) throw new Error("MetaMask n'est pas installé");
    const provider = new ethers.BrowserProvider(window.ethereum);
    return await provider.getSigner();
  },

  /**
   * Initialise le contrat avec un signer.
   */
  async getContract() {
    const signer = await this.getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, KivuMarketEscrowABI, signer);
  },

  /**
   * Création d'un Escrow (Dépôt des fonds par l'Acheteur).
   */
  async createEscrow(sellerAddress: string, agentAddress: string, propertyId: number, amountETH: string) {
    const contract = await this.getContract();
    const tx = await contract.createEscrow(sellerAddress, agentAddress, propertyId, {
      value: ethers.parseEther(amountETH)
    });
    return await tx.wait();
  },

  /**
   * Validation par l'Agent de terrain.
   */
  async validateByAgent(escrowId: number) {
    const contract = await this.getContract();
    const tx = await contract.validateByAgent(escrowId);
    return await tx.wait();
  },

  /**
   * Libération des fonds (par le Propriétaire après validation).
   */
  async releaseFunds(escrowId: number) {
    const contract = await this.getContract();
    const tx = await contract.releaseFunds(escrowId);
    return await tx.wait();
  },

  /**
   * Résolution de litige par l'Admin.
   */
  async adminResolve(escrowId: number, releaseToSeller: boolean) {
    const contract = await this.getContract();
    const tx = await contract.adminResolve(escrowId, releaseToSeller);
    return await tx.wait();
  },

  /**
   * Ancrage d'un hash de document sur la blockchain.
   */
  async storeDocumentHash(docHash: string) {
    const contract = await this.getContract();
    const bytes32Hash = ethers.zeroPadValue("0x" + docHash, 32);
    const tx = await contract.storeDocumentHash(bytes32Hash);
    return await tx.wait();
  }
};
