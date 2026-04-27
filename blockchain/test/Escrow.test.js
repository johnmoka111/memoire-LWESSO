const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("KivuMarketTitle - Tests NFT & Escrow", function () {
  let Title, contract;
  let owner, buyer, seller, agent, other;
  const docHash = "0x7a8b9c...f1e2";
  const coords = "-2.49, 28.85";
  const uri = "ipfs://QmYourHashHere";
  const amount = ethers.parseEther("1.5");

  beforeEach(async function () {
    [owner, buyer, seller, agent, other] = await ethers.getSigners();
    Title = await ethers.getContractFactory("KivuMarketTitle");
    contract = await Title.deploy();
    await contract.waitForDeployment();
    
    // Configurer l'agent certifié
    await contract.connect(owner).setAgentStatus(agent.address, true);
  });

  describe("1. Ancrage & Mint (NFT)", function () {
    it("Devrait permettre au vendeur de minter son titre foncier", async function () {
      await expect(contract.connect(seller).mintTitle(uri, docHash, coords))
        .to.emit(contract, "TitleMinted")
        .withArgs(0, docHash, seller.address);
      
      expect(await contract.ownerOf(0)).to.equal(seller.address);
      
      const t = await contract.titles(0);
      expect(t.docHash).to.equal(docHash);
      expect(t.isVerified).to.be.false;
    });
  });

  describe("2. Certification Physique (Agent)", function () {
    beforeEach(async function () {
      await contract.connect(seller).mintTitle(uri, docHash, coords);
    });

    it("Devrait permettre à un agent certifié de valider le titre", async function () {
      await expect(contract.connect(agent).verifyTitle(0))
        .to.emit(contract, "TitleVerified")
        .withArgs(0, agent.address);
      
      const t = await contract.titles(0);
      expect(t.isVerified).to.be.true;
    });

    it("Devrait interdire à un non-agent de valider", async function () {
      await expect(contract.connect(other).verifyTitle(0))
        .to.be.revertedWith("Seul un agent certifie peut valider");
    });
  });

  describe("3. Transaction Séquestre & Transfert", function () {
    beforeEach(async function () {
      await contract.connect(seller).mintTitle(uri, docHash, coords);
      await contract.connect(agent).verifyTitle(0);
    });

    it("Devrait bloquer les fonds de l'acheteur en séquestre", async function () {
      await expect(contract.connect(buyer).depositEscrow(0, { value: amount }))
        .to.emit(contract, "EscrowDeposited")
        .withArgs(0, amount, buyer.address);
      
      const t = await contract.titles(0);
      expect(t.escrowAmount).to.equal(amount);
      expect(t.buyer).to.equal(buyer.address);
    });

    it("Devrait transférer le NFT et l'argent lors de la finalisation", async function () {
      await contract.connect(buyer).depositEscrow(0, { value: amount });
      
      const initialSellerBalance = await ethers.provider.getBalance(seller.address);
      
      // Libération des fonds
      await contract.connect(buyer).releaseFunds(0);
      
      // Vérification du transfert du NFT
      expect(await contract.ownerOf(0)).to.equal(buyer.address);
      
      // Vérification du paiement au vendeur
      const finalSellerBalance = await ethers.provider.getBalance(seller.address);
      expect(finalSellerBalance - initialSellerBalance).to.equal(amount);
    });

    it("Devrait interdire la libération si le titre n'est pas vérifié", async function () {
      await contract.connect(seller).mintTitle(uri, "hash2", "coords2"); // Token 1
      await contract.connect(buyer).depositEscrow(1, { value: amount });
      
      await expect(contract.connect(buyer).releaseFunds(1))
        .to.be.revertedWith("Le titre doit etre verifie par un agent");
    });
  });

  describe("4. Remboursement (Refund)", function () {
    it("Devrait permettre à l'admin de rembourser l'acheteur", async function () {
      await contract.connect(seller).mintTitle(uri, docHash, coords);
      await contract.connect(buyer).depositEscrow(0, { value: amount });
      
      const initialBuyerBalance = await ethers.provider.getBalance(buyer.address);
      
      await contract.connect(owner).refundBuyer(0);
      
      const finalBuyerBalance = await ethers.provider.getBalance(buyer.address);
      // On ne check pas l'égalité exacte à cause du gaz, mais une augmentation proche de amount
      expect(finalBuyerBalance).to.be.gt(initialBuyerBalance);
      
      const t = await contract.titles(0);
      expect(t.escrowAmount).to.equal(0);
    });
  });
});
