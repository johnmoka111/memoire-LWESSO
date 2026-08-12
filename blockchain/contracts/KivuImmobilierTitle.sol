// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title KivuImmobilierTitle
 * @dev Représentation des titres fonciers sous forme de NFT (ERC-721) avec logique d'Escrow.
 * Suit strictement les orientations : Ancrage (NFT), Certification (Agent Oracle), Séquestre (Payable).
 */
contract KivuImmobilierTitle is ERC721URIStorage, Ownable, ReentrancyGuard {
    
    uint256 private _nextTokenId;
    
    struct TitleMetadata {
        bytes32 docHash;      // Empreinte SHA256 (32 bytes - Économe en Gas)
        uint256 escrowAmount; // Montant en séquestre (1 slot)
        address buyer;        // Adresse de l'acheteur (20 bytes)
        address payable seller; // Adresse du vendeur (20 bytes)
        bool isVerified;      // État certification (1 byte - Packé avec les adresses)
        string coordinates;   // Coordonnées GPS (Dynamic - Dernier car plus coûteux)
    }

    mapping(uint256 => TitleMetadata) public titles;
    mapping(address => bool) public isCertifiedAgent;
    mapping(bytes32 => bool) public documentHashes;

    event TitleMinted(uint256 indexed tokenId, bytes32 docHash, address owner);
    event TitleVerified(uint256 indexed tokenId, address agent);
    event DocumentHashStored(bytes32 indexed docHash);
    event EscrowDeposited(uint256 indexed tokenId, uint256 amount, address buyer);
    event SaleFinalized(uint256 indexed tokenId, address newOwner, uint256 amount);

    constructor() ERC721("Kivu Immobilier Title", "KIVU") Ownable(msg.sender) {}

    // --- GESTION DES AGENTS (Orientation 2) ---
    function setAgentStatus(address _agent, bool _status) external onlyOwner {
        isCertifiedAgent[_agent] = _status;
    }

    // --- ANCRAGE TECHNIQUE (Optionnel - pour compatibilité backend) ---
    function storeDocumentHash(bytes32 _docHash) external {
        documentHashes[_docHash] = true;
        emit DocumentHashStored(_docHash);
    }

    // --- ANCRAGE IMMUABLE & MINT (Orientation 1) ---
    /**
     * @dev Le vendeur "mint" son titre foncier numérique.
     * @param _uri Lien vers les métadonnées IPFS.
     * @param _docHash Empreinte SHA256 du document.
     * @param _coords Localisation GPS.
     */
    function mintTitle(string calldata _uri, bytes32 _docHash, string calldata _coords) external returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, _uri);
        
        titles[tokenId] = TitleMetadata({
            docHash: _docHash,
            escrowAmount: 0,
            buyer: address(0),
            seller: payable(msg.sender),
            isVerified: false,
            coordinates: _coords
        });

        emit TitleMinted(tokenId, _docHash, msg.sender);
        return tokenId;
    }

    // --- CERTIFICATION PHYSIQUE (Orientation 2) ---
    /**
     * @dev L'agent certifié valide la réalité du terrain.
     */
    function verifyTitle(uint256 _tokenId) external {
        require(isCertifiedAgent[msg.sender], "Seul un agent certifie peut valider");
        titles[_tokenId].isVerified = true;
        emit TitleVerified(_tokenId, msg.sender);
    }

    // --- TRANSACTION SÉQUESTRE (Orientation 3) ---
    /**
     * @dev L'acheteur dépose les fonds sur le contrat.
     */
    function depositEscrow(uint256 _tokenId) external payable nonReentrant {
        require(msg.value > 0, "Le montant doit etre superieur a 0");
        require(titles[_tokenId].escrowAmount == 0, "Transaction deja en cours");
        require(ownerOf(_tokenId) != msg.sender, "Le proprietaire ne peut pas acheter son propre bien");
        
        titles[_tokenId].escrowAmount = msg.value;
        titles[_tokenId].buyer = msg.sender;
        
        emit EscrowDeposited(_tokenId, msg.value, msg.sender);
    }

    uint256 public platformFeeBasisPoints = 250; // 2.5% par défaut

    /**
     * @dev Définit les frais de plateforme (en points de base). Seul l'admin peut appeler.
     */
    function setPlatformFee(uint256 _fee) external onlyOwner {
        require(_fee <= 1000, "Frais maximum de 10%");
        platformFeeBasisPoints = _fee;
    }

    /**
     * @dev Finalise la vente : transfère le NFT à l'acheteur et l'argent au vendeur (moins les frais).
     */
    function releaseFunds(uint256 _tokenId) external nonReentrant {
        TitleMetadata storage t = titles[_tokenId];
        require(t.isVerified, "Le titre doit etre verifie par un agent");
        require(msg.sender == owner() || msg.sender == t.buyer || isCertifiedAgent[msg.sender], "Non autorise");
        require(t.escrowAmount > 0, "Aucun fonds en sequestre");

        uint256 totalAmount = t.escrowAmount;
        t.escrowAmount = 0;
        address buyer = t.buyer;
        address payable seller = t.seller;
        
        // Calcul des frais (Automatisation - Orientation 4)
        uint256 feeAmount = (totalAmount * platformFeeBasisPoints) / 10000;
        uint256 sellerAmount = totalAmount - feeAmount;

        // Transfert de la propriété du NFT (Ancrage immuable)
        _transfer(seller, buyer, _tokenId);
        
        // Distribution automatique (PaymentSplitter logic - Orientation 2)
        (bool feeSuccess, ) = payable(owner()).call{value: feeAmount}("");
        require(feeSuccess, "Echec du transfert des frais");

        (bool sellerSuccess, ) = seller.call{value: sellerAmount}("");
        require(sellerSuccess, "Echec du transfert au vendeur");

        emit SaleFinalized(_tokenId, buyer, totalAmount);
    }

    event DisputeResolved(uint256 indexed tokenId, bool releaseToSeller, address resolver);

    /**
     * @dev Résolution de litige par l'Administrateur (Arbitrage).
     * @param _tokenId ID du titre concerné.
     * @param _releaseToSeller Si true, paie le vendeur. Si false, rembourse l'acheteur.
     */
    function adminResolve(uint256 _tokenId, bool _releaseToSeller) external onlyOwner nonReentrant {
        TitleMetadata storage t = titles[_tokenId];
        require(t.escrowAmount > 0, "Aucun fonds en sequestre");

        uint256 amount = t.escrowAmount;
        t.escrowAmount = 0;
        address buyer = t.buyer;
        address payable seller = t.seller;

        if (_releaseToSeller) {
            // Calcul des frais
            uint256 feeAmount = (amount * platformFeeBasisPoints) / 10000;
            uint256 sellerAmount = amount - feeAmount;

            _transfer(seller, buyer, _tokenId);
            
            (bool feeSuccess, ) = payable(owner()).call{value: feeAmount}("");
            require(feeSuccess, "Echec transfert frais");

            (bool sellerSuccess, ) = seller.call{value: sellerAmount}("");
            require(sellerSuccess, "Echec transfert vendeur");
        } else {
            // Remboursement à l'acheteur
            (bool success, ) = payable(buyer).call{value: amount}("");
            require(success, "Echec remboursement");
        }

        emit DisputeResolved(_tokenId, _releaseToSeller, msg.sender);
    }

    // Fonction de sécurité pour empêcher l'envoi direct d'ETH
    receive() external payable {
        revert("Utilisez depositEscrow pour bloquer des fonds");
    }
}
