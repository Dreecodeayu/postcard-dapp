# 🌞 Onchain Summer Postcards

A simple dApp for **Onchain Summer** on **Base Sepolia**.  
Users connect their wallet, write a summer message, and mint it as an **NFT postcard**.  
They can also read postcards by **Token ID**.

---

## 🚀 Live Demo (optional)
> If deployed (e.g. Vercel/Netlify), paste link here.  
> Otherwise, run locally with instructions below.

---

## 📜 Contract Details
- **Name:** `SummerPostcard`
- **Network:** Base Sepolia
- **Contract Address:** `0x8546afE98172Da80097F581D5B6F3cfdD14938Eb`
- **Explorer:** [Base Sepolia Scan](https://sepolia.basescan.org/address/0x8546afE98172Da80097F581D5B6F3cfdD14938Eb)

---

## 🧱 Tech Stack
- Solidity (Hardhat 3, ESM)
- Ethers v6
- React + Vite + TypeScript
- wagmi v2 (MetaMask)
- Base Sepolia testnet

---

## 🖥️ Running Locally

### 0) Requirements
- Node.js v18+  
- MetaMask browser extension (switch to **Base Sepolia**)

### 1) Clone and install
```bash
git clone https://github.com/Dreecodeayu/postcard-dapp.git
cd postcard-dapp
npm install

2) Contracts (optional deploy)

    The contract is already deployed on Base Sepolia.

    If you want to redeploy:

    1.  Copy .env.example to .env and fill in:

    2.  Compile and deploy:
            npx hardhat compile
            npx tsx scripts/deploy.ts

    3.  Frontend
            cd postcard-frontend
            npm install

            Create .env file by copying .env.example:
            VITE_RPC_URL=https://sepolia.base.org
            VITE_CONTRACT_ADDRESS=0x8546afE98172Da80097F581D5B6F3cfdD14938Eb
    
    4.  npm run dev
    
    5.  Then open → http://localhost:5173
