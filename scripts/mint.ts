import "dotenv/config";
import { ethers } from "ethers";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// >>> your deployed address
const CONTRACT_ADDRESS = "0x8546afE98172Da80097F581D5B6F3cfdD14938Eb";

async function main() {
  const rpcUrl = process.env.RPC_URL!;
  const pk = process.env.PRIVATE_KEY!;
  if (!rpcUrl || !pk) throw new Error("Missing RPC_URL or PRIVATE_KEY in .env");

  // Always works: read artifact JSON file directly
  const artifactPath = path.join(
    __dirname,
    "../artifacts/contracts/SummerPostcard.sol/SummerPostcard.json"
  );
  const artifact = JSON.parse(readFileSync(artifactPath, "utf8"));

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(pk, provider);

  // Attach to contract
  const contract = new ethers.Contract(CONTRACT_ADDRESS, artifact.abi, wallet);

  console.log("Minting postcard...");
  const tx = await contract.mintPostcard("Hello Onchain Summer 🌞");
  console.log("Tx sent:", tx.hash);

  const receipt = await tx.wait();
  console.log("✅ Confirmed in block:", receipt.blockNumber);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
