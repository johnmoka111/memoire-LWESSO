import axios from 'axios';

// Note: Pour une application réelle, ces clés doivent être dans un fichier .env sécurisé
const PINATA_API_KEY = '';
const PINATA_SECRET_KEY = '';

/**
 * Service pour interagir avec IPFS via Pinata.
 * Permet de stocker les documents et les métadonnées de manière décentralisée.
 */
export const ipfsService = {
  
  /**
   * Upload un fichier sur IPFS.
   */
  uploadFile: async (file: File) => {
    if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
      console.warn("Pinata API Keys non configurées. Simulation de l'upload IPFS...");
      return {
        ipfsHash: "QmSimulatedHash" + Math.random().toString(36).substring(7),
        url: URL.createObjectURL(file)
      };
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
      maxBodyLength: Infinity,
      headers: {
        'Content-Type': `multipart/form-data;`,
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_KEY,
      },
    });

    return {
      ipfsHash: response.data.IpfsHash,
      url: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`
    };
  },

  /**
   * Upload des métadonnées JSON sur IPFS.
   */
  uploadMetadata: async (metadata: object) => {
    if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
      return {
        ipfsHash: "QmSimulatedMetadataHash" + Math.random().toString(36).substring(7)
      };
    }

    const response = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', metadata, {
      headers: {
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_KEY,
      },
    });

    return {
      ipfsHash: response.data.IpfsHash,
      url: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`
    };
  }
};
