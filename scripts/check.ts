import "dotenv/config";
import { ethers } from "ethers";

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const code = await provider.getCode("0x8546afE98172Da80097F581D5B6F3cfdD14938Eb");
  console.log("Contract exists on-chain (code length > 2?):", code.length > 2);
}

main().catch(console.error);
