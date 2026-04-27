// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title KivuMarketTitle
 * @dev Représentation des titres fonciers sous forme de NFT (ERC-721) avec logique d'Escrow.
 * Suit strictement les orientations : Ancrage (NFT), Certification (Agent Oracle), Séquestre (Payable).
 */
contract KivuMarketTitle is ERC721URIStorage, Ownable, ReentrancyGuard {
    
    uint256 private _nextTokenId;
    
    struct TitleMetadata {
        string docHash;       // Empreinte numérique du titre (Orientation 1)
        string coordinates;   // Coordonnées GPS (Orientation 1)
        bool isVerified;      // État de la certification physique (Orientation 2)
        uint256 escrowAmount; // Montant bloqué en séquestre (Orientation 3)
        address buyer;
        address payable seller;
    }

    mapping(uint256 => TitleMetadata) public titles;
    mapping(address => bool) public isCertifiedAgent;

    event TitleMinted(uint256 indexed tokenId, string docHash, address owner);
    event TitleVerified(uint256 indexed tokenId, address agent);
    event EscrowDeposited(uint256 indexed tokenId, uint256 amount, address buyer);
    event SaleFinalized(uint256 indexed tokenId, address newOwner, uint256 amount);

    constructor() ERC721("Kivu Market Title", "KIVU") Ownable(msg.sender) {}

    // --- GESTION DES AGENTS (Orientation 2) ---
    function setAgentStatus(address _agent, bool _status) external onlyOwner {
        isCertifiedAgent[_agent] = _status;
    }

    // --- ANCRAGE IMMUABLE & MINT (Orientation 1) ---
    /**
     * @dev Le vendeur "mint" son titre foncier numérique.
     * @param _uri Lien vers les métadonnées IPFS.
     * @param _docHash Empreinte SHA256 du document.
     * @param _coords Localisation GPS.
     */
    function mintTitle(string memory _uri, string memory _docHash, string memory _coords) external returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, _uri);
        
        titles[tokenId] = TitleMetadata({
            docHash: _docHash,
            coordinates: _coords,
            isVerified: false,
            escrowAmount: 0,
            buyer: address(0),
            seller: payable(msg.sender)
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

    /**
     * @dev Finalise la vente : transfère le NFT à l'acheteur et l'argent au vendeur.
     */
    function releaseFunds(uint256 _tokenId) external nonReentrant {
        TitleMetadata storage t = titles[_tokenId];
        require(t.isVerified, "Le titre doit etre verifie par un agent");
        require(msg.sender == owner() || msg.sender == t.buyer || isCertifiedAgent[msg.sender], "Non autorise");
        require(t.escrowAmount > 0, "Aucun fonds en sequestre");

        uint256 amount = t.escrowAmount;
        t.escrowAmount = 0;
        address buyer = t.buyer;
        address payable seller = t.seller;
        
        // Transfert de la propriété du NFT (Ancrage immuable)
        _transfer(seller, buyer, _tokenId);
        
        // Transfert des fonds au vendeur
        (bool success, ) = seller.call{value: amount}("");
        require(success, "Echec du transfert des fonds");

        emit SaleFinalized(_tokenId, buyer, amount);
    }

    /**
     * @dev Rembourse l'acheteur en cas de litige.
     */
    function refundBuyer(uint256 _tokenId) external nonReentrant {
        TitleMetadata storage t = titles[_tokenId];
        require(msg.sender == owner() || isCertifiedAgent[msg.sender], "Seul l'admin ou l'agent peut annuler");
        require(t.escrowAmount > 0, "Aucun fonds a rembourser");
        
        uint256 amount = t.escrowAmount;
        t.escrowAmount = 0;
        
        (bool success, ) = payable(t.buyer).call{value: amount}("");
        require(success, "Echec du remboursement");
    }

    // Fonction de sécurité pour empêcher l'envoi direct d'ETH
    receive() external payable {
        revert("Utilisez depositEscrow pour bloquer des fonds");
    }
}
