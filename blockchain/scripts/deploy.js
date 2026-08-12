const hre = require("hardhat");

async function main() {
  console.log("Démarrage du déploiement de KivuImmobilierTitle...");

  const Title = await hre.ethers.getContractFactory("KivuImmobilierTitle");
  const contract = await Title.deploy();

  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log(`✅ Contrat déployé avec succès à l'adresse : ${address}`);
  
  // Simulation de configuration initiale
  const [owner, buyer, seller, agent] = await hre.ethers.getSigners();
  console.log(`Admin (Owner) : ${owner.address}`);
  
  // On définit le compte #3 comme agent certifié pour les tests
  await contract.setAgentStatus(agent.address, true);
  console.log(`Agent Certifié configuré : ${agent.address}`);

  // Mint des titres fonciers de test (#1 à #5) attribués au vendeur (seller = compte #2)
  const docHash = hre.ethers.id("DOC_HASH_DEMO_KIVU_IMMOBILIER");
  for (let i = 1; i <= 5; i++) {
    const txMint = await contract.connect(seller).mintTitle(`https://kivuimmobilier.cd/api/titles/${i}`, docHash, `-2.49,28.85`);
    await txMint.wait();
    console.log(`✅ Titre NFT #${i-1} (Property #${i}) minté avec succès (Vendeur : ${seller.address})`);

    // Verification par l'agent certifié
    const txVerify = await contract.connect(agent).verifyTitle(i-1);
    await txVerify.wait();
    console.log(`  └─ Certifié par l'Agent : ${agent.address}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
