import { useMemo, useState } from "react";
import {
  useAccount,
  useChainId,
  useConnect,
  useDisconnect,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { baseSepolia } from "wagmi/chains";

// ---- helpers ----
const RAW_ADDR = import.meta.env.VITE_CONTRACT_ADDRESS as string | undefined;
function normalizeAddress(a?: string): `0x${string}` | null {
  if (!a) return null;
  const s = a.trim();
  return /^0x[a-fA-F0-9]{40}$/.test(s) ? (s as `0x${string}`) : null;
}
const CONTRACT_ADDRESS = normalizeAddress(RAW_ADDR);

// minimal ABI
const abi = [
  { type: "function", name: "mintPostcard", stateMutability: "nonpayable", inputs: [{ name: "message", type: "string" }], outputs: [] },
  { type: "function", name: "postcardMessage", stateMutability: "view", inputs: [{ type: "uint256" }], outputs: [{ type: "string" }] },
  { type: "function", name: "ownerOf", stateMutability: "view", inputs: [{ type: "uint256" }], outputs: [{ type: "address" }] },
] as const;

// ---- connect bar ----
function ConnectBar() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { connect, connectors, isPending, error: connectError } = useConnect();
  const { disconnect } = useDisconnect();

  const injected = connectors.find((c) => c.id === "injected") ?? connectors[0];
  const wrongNet = isConnected && chainId !== baseSepolia.id;

  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
      {isConnected ? (
        <>
          <span style={{ fontFamily: "monospace" }}>{address?.slice(0, 6)}…{address?.slice(-4)}</span>
          <button onClick={() => disconnect()} style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #ddd" }}>
            Disconnect
          </button>
        </>
      ) : (
        <button
          onClick={() => injected && connect({ connector: injected })}
          disabled={isPending || !injected}
          style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #ddd" }}
        >
          {isPending ? "Opening MetaMask…" : "Connect Wallet"}
        </button>
      )}
      {wrongNet && (
        <span style={{ color: "#b7791f", background: "#fff3cd", border: "1px solid #ffe58f", padding: "4px 8px", borderRadius: 6 }}>
          Switch to <b>Base Sepolia</b> in MetaMask
        </span>
      )}
      {connectError && <span style={{ color: "crimson" }}>Connect error: {connectError.message}</span>}
    </div>
  );
}

// ---- main app ----
export default function App() {
  const { isConnected } = useAccount();
  const [msg, setMsg] = useState("");
  const [tokenId, setTokenId] = useState<number>(0);

  const {
    writeContract,
    data: txHash,
    isPending: isWriting,
    error: writeError,
  } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  // only enable read when we have a valid address
  const readEnabled = useMemo(() => Boolean(CONTRACT_ADDRESS), []);
  const { data: postcard, error: readError } = useReadContract(
    readEnabled
      ? {
          address: CONTRACT_ADDRESS as `0x${string}`,
          abi,
          functionName: "postcardMessage",
          args: [BigInt(Number.isFinite(tokenId) ? tokenId : 0)],
          chainId: baseSepolia.id,
        }
      : // pass a noop to keep hooks stable if no address yet
        ({} as any)
  );

  const handleMint = () => {
    if (!CONTRACT_ADDRESS) return; // invalid env – guarded UI below will show message
    const text = msg.trim();
    if (!text) return;
    try {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: "mintPostcard",
        args: [text],
        chainId: baseSepolia.id,
      });
    } catch (e) {
      console.error("mint error", e);
    }
  };

  return (
    <div style={{ maxWidth: 640, margin: "24px auto", padding: 16 }}>
      <h1>Onchain Summer Postcards 🌞</h1>
      <ConnectBar />

      {!CONTRACT_ADDRESS && (
        <div style={{ marginBottom: 12, padding: 12, background: "#fdecea", border: "1px solid #f5c2c7", borderRadius: 8, color: "#842029" }}>
          Invalid or missing <code>VITE_CONTRACT_ADDRESS</code>. Put a valid 0x… address in <code>postcard-frontend/.env</code> and restart
          <code> npm run dev</code>.
          <div style={{ marginTop: 6 }}><b>Current value:</b> {RAW_ADDR ? RAW_ADDR : "(not set)"}</div>
        </div>
      )}

      <textarea
        placeholder="Write your summer message…"
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        rows={4}
        style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #ddd", marginBottom: 12 }}
      />

      <button
        onClick={handleMint}
        disabled={!isConnected || isWriting || isConfirming || !msg.trim() || !CONTRACT_ADDRESS}
        style={{ padding: "10px 16px", borderRadius: 8, border: "none", background: "#1677ff", color: "#fff", cursor: "pointer" }}
      >
        {isWriting ? "Confirm in MetaMask…" : isConfirming ? "Waiting for block…" : "Mint Postcard"}
      </button>

      {writeError && <div style={{ marginTop: 8, color: "crimson" }}>Write error: {writeError.message}</div>}

      {isSuccess && txHash && (
        <div style={{ marginTop: 12 }}>
          ✅ Minted! Tx:{" "}
          <a href={`https://sepolia.basescan.org/tx/${txHash}`} target="_blank" rel="noreferrer">
            {txHash.slice(0, 10)}…
          </a>
        </div>
      )}

      <div style={{ marginTop: 24 }}>
        <h3>Read a postcard</h3>
        <label>
          Token ID:{" "}
          <input
            type="number"
            min={0}
            value={tokenId}
            onChange={(e) => setTokenId(parseInt(e.target.value || "0", 10))}
            style={{ width: 100, padding: 6, borderRadius: 6, border: "1px solid #ddd", marginLeft: 8 }}
          />
        </label>
        <div style={{ marginTop: 8, padding: 12, background: "#f6f6f6", borderRadius: 8, minHeight: 48 }}>
          {!CONTRACT_ADDRESS
            ? "(set VITE_CONTRACT_ADDRESS to enable reads)"
            : readError
            ? `Read error: ${readError.message}`
            : postcard
            ? postcard.toString()
            : "(no message or not minted yet)"}
        </div>
      </div>
    </div>
  );
}
