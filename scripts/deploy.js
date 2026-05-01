import hre from "hardhat";
import fs from "fs";

async function main() {
  console.log(`Deploying CertificateVerification contract to network: ${hre.network.name}...`);

  // Use the provider and wallet defined by the hardhat network config
  const [deployer] = await hre.ethers.getSigners();
  
  if (!deployer) {
    throw new Error("No deployer account found! Check your PRIVATE_KEY in .env");
  }

  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy the contract
  const contract = await hre.ethers.deployContract("CertificateVerification");
  await contract.waitForDeployment();
  const address = await contract.getAddress();

  console.log(`CertificateVerification deployed successfully to: ${address}`);
  console.log(`Use this address in your backend .env file as CONTRACT_ADDRESS=${address}`);
  
  // Try to update .env file automatically if it exists
  try {
    const envPath = ".env";
    if (fs.existsSync(envPath)) {
      let envContent = fs.readFileSync(envPath, "utf8");
      if (envContent.includes("CONTRACT_ADDRESS=")) {
        envContent = envContent.replace(/CONTRACT_ADDRESS=.*/, `CONTRACT_ADDRESS=${address}`);
      } else {
        envContent += `\nCONTRACT_ADDRESS=${address}`;
      }
      fs.writeFileSync(envPath, envContent);
      console.log("Automatically updated root .env with CONTRACT_ADDRESS!");
    }
  } catch (error) {
    console.warn("Could not automatically update .env file. Please update CONTRACT_ADDRESS manually.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
