const hre = require("hardhat");

async function main() {
  console.log("Démarrage du déploiement de KivuMarketTitle...");

  const Title = await hre.ethers.getContractFactory("KivuMarketTitle");
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
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
