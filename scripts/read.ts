import "dotenv/config";
import { ethers } from "ethers";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CONTRACT_ADDRESS = "0x8546afE98172Da80097F581D5B6F3cfdD14938Eb";

async function main() {
  const artifactPath = path.join(
    __dirname,
    "../artifacts/contracts/SummerPostcard.sol/SummerPostcard.json"
  );
  const artifact = JSON.parse(readFileSync(artifactPath, "utf8"));

  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL!);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, artifact.abi, provider);

  // First minted postcard = tokenId 0
  const msg0 = await contract.postcardMessage(0);
  const owner0 = await contract.ownerOf(0);

  console.log("Token #0 message:", msg0);
  console.log("Token #0 owner:  ", owner0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
