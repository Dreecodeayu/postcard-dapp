import "dotenv/config";
import { ethers } from "ethers";
import { readFileSync } from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  const rpcUrl = process.env.RPC_URL!;
  const pk = process.env.PRIVATE_KEY!;
  if (!rpcUrl || !pk) throw new Error("Missing RPC_URL or PRIVATE_KEY in .env");

  const artifactPath = path.join(
    __dirname,
    "../artifacts/contracts/SummerPostcard.sol/SummerPostcard.json"
  );
  const artifact = JSON.parse(readFileSync(artifactPath, "utf8"));

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(pk, provider);

  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);
  const contract = await factory.deploy();

  console.log("⏳ Deploying...");
  await contract.waitForDeployment();
  console.log("✅ SummerPostcard deployed at:", await contract.getAddress());
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
