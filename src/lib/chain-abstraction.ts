/**
 * Chain Abstraction Layer
 *
 * Provides unified interfaces for both EVM (Polygon) and Solana operations
 * Enables seamless switching between chains while maintaining consistent API
 *
 * Compatible with Next.js 15 + React 19
 */

import {
  ChainType,
  SupportedChain,
  EVMChain,
  SolanaChain,
  isEVMChain,
  isSolanaChain,
} from "./chains";
import {
  Connection,
  PublicKey,
  Transaction as SolanaTransaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

// Unified wallet interface
export interface UnifiedWallet {
  address: string;
  chainType: ChainType;
  isConnected: boolean;
  balance?: string;
}

// Unified transaction interface
export interface UnifiedTransaction {
  hash?: string;
  signature?: string;
  from: string;
  to: string;
  amount: string;
  chainType: ChainType;
  status: "pending" | "confirmed" | "failed";
  timestamp?: number;
  explorerUrl?: string;
}

// Transaction parameters
export interface TransactionParams {
  to: string;
  amount: string; // In native currency (ETH/SOL)
  data?: string; // For contract calls
}

// Chain operation result
export interface ChainOperationResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  transactionHash?: string;
  transactionSignature?: string;
}

// Abstract base class for chain operations
export abstract class ChainAdapter {
  protected chain: SupportedChain;

  constructor(chain: SupportedChain) {
    this.chain = chain;
  }

  // Abstract methods that must be implemented by each chain
  abstract connect(): Promise<ChainOperationResult<UnifiedWallet>>;
  abstract disconnect(): Promise<ChainOperationResult<void>>;
  abstract getBalance(address: string): Promise<ChainOperationResult<string>>;
  abstract sendTransaction(
    params: TransactionParams
  ): Promise<ChainOperationResult<UnifiedTransaction>>;
  abstract getTransactionStatus(
    hash: string
  ): Promise<ChainOperationResult<"pending" | "confirmed" | "failed">>;
  abstract formatAddress(address: string, chars?: number): string;
  abstract validateAddress(address: string): boolean;
  abstract getExplorerUrl(hash: string): string;

  // Common methods
  getChainInfo(): SupportedChain {
    return this.chain;
  }

  getChainType(): ChainType {
    return this.chain.type;
  }

  isTestnet(): boolean {
    return this.chain.isTestnet;
  }
}

// EVM Chain Adapter
export class EVMChainAdapter extends ChainAdapter {
  protected chain: EVMChain;

  constructor(chain: EVMChain) {
    super(chain);
    this.chain = chain;
  }

  async connect(): Promise<ChainOperationResult<UnifiedWallet>> {
    try {
      // SECURITY: Check if this is a user-initiated connection
      if (typeof window === "undefined" || !window.ethereum) {
        return {
          success: false,
          error:
            "No EVM wallet found. Please install MetaMask or another Web3 wallet.",
        };
      }

      // SECURITY: Only connect when explicitly requested by user
      // Never auto-connect on page load for enterprise security
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (!accounts || accounts.length === 0) {
        return {
          success: false,
          error: "No accounts found",
        };
      }

      // Switch to the correct network if needed
      await this.switchNetwork();

      const wallet: UnifiedWallet = {
        address: accounts[0],
        chainType: ChainType.EVM,
        isConnected: true,
      };

      return {
        success: true,
        data: wallet,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to connect EVM wallet",
      };
    }
  }

  async disconnect(): Promise<ChainOperationResult<void>> {
    // EVM wallets don't have a programmatic disconnect
    // This is handled by the wallet extension itself
    return {
      success: true,
    };
  }

  async getBalance(address: string): Promise<ChainOperationResult<string>> {
    try {
      if (!window.ethereum) {
        return {
          success: false,
          error: "No EVM wallet found",
        };
      }

      const balance = await window.ethereum.request({
        method: "eth_getBalance",
        params: [address, "latest"],
      });

      // Convert from wei to ETH/MATIC
      const balanceInEth = parseInt(balance, 16) / Math.pow(10, 18);

      return {
        success: true,
        data: balanceInEth.toString(),
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to get balance",
      };
    }
  }

  async sendTransaction(
    params: TransactionParams
  ): Promise<ChainOperationResult<UnifiedTransaction>> {
    try {
      if (!window.ethereum) {
        return {
          success: false,
          error: "No EVM wallet found",
        };
      }

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (!accounts || accounts.length === 0) {
        return {
          success: false,
          error: "No connected accounts",
        };
      }

      // Convert amount to wei
      const amountInWei = Math.floor(
        parseFloat(params.amount) * Math.pow(10, 18)
      );

      const transactionHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: accounts[0],
            to: params.to,
            value: "0x" + amountInWei.toString(16),
            data: params.data || "0x",
          },
        ],
      });

      const transaction: UnifiedTransaction = {
        hash: transactionHash,
        from: accounts[0],
        to: params.to,
        amount: params.amount,
        chainType: ChainType.EVM,
        status: "pending",
        timestamp: Date.now(),
        explorerUrl: this.getExplorerUrl(transactionHash),
      };

      return {
        success: true,
        data: transaction,
        transactionHash,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Transaction failed",
      };
    }
  }

  async getTransactionStatus(
    hash: string
  ): Promise<ChainOperationResult<"pending" | "confirmed" | "failed">> {
    try {
      if (!window.ethereum) {
        return {
          success: false,
          error: "No EVM wallet found",
        };
      }

      const receipt = await window.ethereum.request({
        method: "eth_getTransactionReceipt",
        params: [hash],
      });

      if (!receipt) {
        return {
          success: true,
          data: "pending",
        };
      }

      const status = receipt.status === "0x1" ? "confirmed" : "failed";

      return {
        success: true,
        data: status,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to get transaction status",
      };
    }
  }

  formatAddress(address: string, chars: number = 4): string {
    if (!address) return "";
    if (address.length <= chars * 2) return address;
    return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
  }

  validateAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  getExplorerUrl(hash: string): string {
    return `${this.chain.blockExplorer.url}/tx/${hash}`;
  }

  private async switchNetwork(): Promise<void> {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x" + this.chain.chainId.toString(16) }],
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x" + this.chain.chainId.toString(16),
              chainName: this.chain.name,
              nativeCurrency: this.chain.nativeCurrency,
              rpcUrls: this.chain.rpcUrls,
              blockExplorerUrls: [this.chain.blockExplorer.url],
            },
          ],
        });
      }
    }
  }
}

// Solana Chain Adapter
export class SolanaChainAdapter extends ChainAdapter {
  protected chain: SolanaChain;
  private connection: Connection;

  constructor(chain: SolanaChain) {
    super(chain);
    this.chain = chain;
    this.connection = new Connection(chain.rpcUrl, "confirmed");
  }

  async connect(): Promise<ChainOperationResult<UnifiedWallet>> {
    try {
      // This will be handled by the Solana wallet adapter in the React context
      // For now, return a placeholder implementation
      return {
        success: false,
        error: "Solana connection should be handled by wallet adapter context",
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to connect Solana wallet",
      };
    }
  }

  async disconnect(): Promise<ChainOperationResult<void>> {
    // Handled by wallet adapter
    return {
      success: true,
    };
  }

  async getBalance(address: string): Promise<ChainOperationResult<string>> {
    try {
      const publicKey = new PublicKey(address);
      const balance = await this.connection.getBalance(publicKey);
      const balanceInSol = balance / LAMPORTS_PER_SOL;

      return {
        success: true,
        data: balanceInSol.toString(),
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to get balance",
      };
    }
  }

  async sendTransaction(
    params: TransactionParams
  ): Promise<ChainOperationResult<UnifiedTransaction>> {
    try {
      // This will be handled by the Solana wallet adapter hooks
      // For now, return a placeholder implementation
      return {
        success: false,
        error: "Solana transactions should be handled by wallet adapter hooks",
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Transaction failed",
      };
    }
  }

  async getTransactionStatus(
    signature: string
  ): Promise<ChainOperationResult<"pending" | "confirmed" | "failed">> {
    try {
      const status = await this.connection.getSignatureStatus(signature);

      if (!status.value) {
        return {
          success: true,
          data: "pending",
        };
      }

      if (status.value.err) {
        return {
          success: true,
          data: "failed",
        };
      }

      return {
        success: true,
        data: "confirmed",
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to get transaction status",
      };
    }
  }

  formatAddress(address: string, chars: number = 4): string {
    if (!address) return "";
    if (address.length <= chars * 2) return address;
    return `${address.slice(0, chars)}...${address.slice(-chars)}`;
  }

  validateAddress(address: string): boolean {
    try {
      new PublicKey(address);
      return true;
    } catch {
      return false;
    }
  }

  getExplorerUrl(signature: string): string {
    const cluster =
      this.chain.network === WalletAdapterNetwork.Mainnet
        ? ""
        : `?cluster=${this.chain.network}`;
    return `${this.chain.blockExplorer.url}/tx/${signature}${cluster}`;
  }
}

// Chain adapter factory
export class ChainAdapterFactory {
  static createAdapter(chain: SupportedChain): ChainAdapter {
    if (isEVMChain(chain)) {
      return new EVMChainAdapter(chain);
    }
    if (isSolanaChain(chain)) {
      return new SolanaChainAdapter(chain);
    }
    throw new Error(`Unsupported chain type`);
  }
}

// Utility function to get the appropriate adapter
export function getChainAdapter(chain: SupportedChain): ChainAdapter {
  return ChainAdapterFactory.createAdapter(chain);
}

// Extend window interface for EVM wallet
declare global {
  interface Window {
    ethereum?: any;
  }
}
