# 🌞 Onchain Summer Postcards

A simple dApp for **Onchain Summer** on **Base Sepolia**.  
Users connect their wallet, write a summer message, and mint it as an **NFT postcard**.  
They can also read postcards by **Token ID**.

---

## 🚀 Live Demo (optional)
👉 [Try it here](https://postcard-dapp.vercel.app/)


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
```

### 2) Contracts (optional deploy)

The contract is already deployed on Base Sepolia (address above).  
If you want to redeploy:

Copy `.env.example` to `.env` and fill in:
```ini
RPC_URL=https://sepolia.base.org
PRIVATE_KEY=0xYOUR_TEST_WALLET_PRIVATE_KEY
```

Then run:
```bash
npx hardhat compile
npx tsx scripts/deploy.ts
```

### 3) Frontend
```bash
cd postcard-frontend
npm install
```

Create `.env` file by copying `.env.example`:

```ini
VITE_RPC_URL=https://sepolia.base.org
VITE_CONTRACT_ADDRESS=0xYOUR_CONTRACT_ADDRESS


Run:
```bash
npm run dev
```

Then open → [http://localhost:5173](http://localhost:5173)

**Use the app:**
- Click **Connect Wallet** (MetaMask).  
- Type a message → **Mint Postcard**.  
- Read any postcard by entering **Token ID** (first mint is `0`).  

---

## 🔒 Environment Files

`.env` is ignored by git (`.gitignore`).  
Use these examples to configure locally:

**`/.env.example`** (root, for Hardhat scripts):
```ini
RPC_URL=https://sepolia.base.org
PRIVATE_KEY=0xYOUR_TEST_WALLET_PRIVATE_KEY
```

**`/postcard-frontend/.env.example`** (frontend):
```ini
VITE_RPC_URL=https://sepolia.base.org
VITE_CONTRACT_ADDRESS=0xYOUR_CONTRACT_ADDRESS
```

---

## 📸 Screenshots
(postcard-frontend/public/screenshot/canvas1.png)
(postcard-frontend/public/screenshot/canvas2.png)

---

## 🗺️ Roadmap
- “My Postcards” list (owned NFTs)  
- Likes & Collects  
- Host frontend on Vercel/Netlify  
- Contract verification on BaseScan  
