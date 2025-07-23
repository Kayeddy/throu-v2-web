import { cookieStorage, createStorage } from "@wagmi/core";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { SolanaAdapter } from "@reown/appkit-adapter-solana";
import { polygon, solanaDevnet } from "@reown/appkit/networks";

// Get projectId from https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID;

if (!projectId) {
  throw new Error("Project ID is not defined");
}

// Define the networks array with devnet instead of testnet
const networks = [polygon, solanaDevnet] as any;

// Set up the Wagmi Adapter for EVM chainss
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks,
});

// Set up the Solana Adapter for devnet
export const solanaAdapter = new SolanaAdapter();

export const config = wagmiAdapter.wagmiConfig;
