import { useCallback, useEffect, useState } from "react";
import { 
  Transaction, 
  VersionedTransaction, 
  PublicKey,
  ComputeBudgetProgram,
  TransactionMessage,
  TransactionInstruction
} from "@solana/web3.js";
import { useAppKitAccount, useWalletInfo } from "@reown/appkit/react";
import { useAppKitConnection } from "@reown/appkit-adapter-solana/react";
import type { Provider } from "@reown/appkit-adapter-solana/react";

interface WalletProvider {
  publicKey: PublicKey | null;
  signTransaction: (transaction: Transaction | VersionedTransaction) => Promise<Transaction | VersionedTransaction>;
  signAndSendTransaction: (transaction: Transaction | VersionedTransaction, skipPreflight?: boolean) => Promise<string>;
  signAllTransactions: (transactions: (Transaction | VersionedTransaction)[]) => Promise<(Transaction | VersionedTransaction)[]>;
  signMessage?: (message: Uint8Array) => Promise<Uint8Array>;
  connected: boolean;
  walletName: string | null;
  supportsPriorityFees: boolean;
}

/**
 * Hook to get a unified wallet provider interface that works with multiple Solana wallets
 * Handles differences between Phantom, Trust Wallet, Solflare, and other wallets
 * Updated for 2025 with priority fee support and improved Trust Wallet compatibility
 * Now uses official Reown AppKit hooks for proper wallet detection
 */
export function useWalletProvider(): WalletProvider | null {
  const { address, isConnected } = useAppKitAccount();
  const { connection } = useAppKitConnection();
  const { walletInfo } = useWalletInfo(); // Official Reown hook for wallet detection
  const [walletProvider, setWalletProvider] = useState<WalletProvider | null>(null);
  const [detectionAttempts, setDetectionAttempts] = useState(0);

  useEffect(() => {
    if (!isConnected || !address || !connection) {
      setWalletProvider(null);
      return;
    }

    const detectAndSetupWallet = async () => {
      const publicKey = new PublicKey(address);
      const windowAny = window as any;
      
      // Use official Reown wallet info to identify the connected wallet
      const connectedWalletName = walletInfo?.name || '';
      const connectedWalletIcon = walletInfo?.icon || '';
      
      console.log("🔍 [WALLET DETECTION] Starting wallet detection...");
      console.log("🔍 [WALLET DETECTION] Reown walletInfo:", {
        name: connectedWalletName,
        icon: connectedWalletIcon
      });
      console.log("🔍 [WALLET DETECTION] Window objects present:", {
        hasPhantom: !!windowAny.phantom?.solana,
        hasTrustWallet: !!windowAny.trustwallet?.solana,
        hasSolflare: !!windowAny.solflare,
        hasBackpack: !!windowAny.backpack?.solana,
        hasGenericSolana: !!windowAny.solana,
        solanaIsPhantom: windowAny.solana?.isPhantom,
        solanaIsTrust: windowAny.solana?.isTrust,
        address: address
      });
      
      // CRITICAL: Use Reown's walletInfo to determine the actual connected wallet
      // This is the official way to detect which wallet is connected
      const isReownConnection = !!walletInfo;
      
      // Normalize wallet names from Reown
      const normalizedWalletName = connectedWalletName.toLowerCase();
      const isTrustWallet = normalizedWalletName.includes('trust');
      const isPhantom = normalizedWalletName.includes('phantom');
      const isSolflare = normalizedWalletName.includes('solflare');
      const isBackpack = normalizedWalletName.includes('backpack');
      const isExodus = normalizedWalletName.includes('exodus');
      const isBrave = normalizedWalletName.includes('brave');
      const isCoin98 = normalizedWalletName.includes('coin98');
      
      // 1. Check for Trust Wallet (prioritize Reown detection)
      if (isTrustWallet) {
        console.log(`🔵 Detected Trust Wallet via Reown AppKit (${connectedWalletName})`);
        
        // Trust Wallet typically doesn't inject window objects when connected via Reown
        // Use connection directly for transactions
        setWalletProvider({
          publicKey,
          signTransaction: async (tx) => {
            console.warn("Trust Wallet via Reown: Direct signing not available");
            return tx;
          },
          signAndSendTransaction: async (tx, skipPreflight = true) => {
            console.log("Trust Wallet via Reown: Using connection.sendTransaction with skipPreflight");
            try {
              if ('version' in tx) {
                return await connection.sendTransaction(tx, { skipPreflight });
              } else {
                return await connection.sendTransaction(tx, [], { skipPreflight });
              }
            } catch (err) {
              console.error("Trust Wallet transaction failed:", err);
              throw err;
            }
          },
          signAllTransactions: async (txs) => {
            console.warn("Trust Wallet via Reown: Batch signing not available");
            return txs;
          },
          connected: true,
          walletName: "Trust Wallet",
          supportsPriorityFees: true // Trust Wallet with Helius optimization
        });
        return;
      }
      
      // 2. Check for Phantom (prioritize Reown detection)
      if (isPhantom) {
        console.log(`🟣 Detected Phantom wallet via Reown AppKit (${connectedWalletName})`);
        
        // Check if Phantom has also injected window objects
        const phantom = windowAny.phantom?.solana;
        
        if (phantom && phantom.isPhantom) {
          // Phantom with direct window access
          console.log("🟣 Phantom has direct window access");
          setWalletProvider({
            publicKey,
            signTransaction: async (tx) => {
              return await phantom.signTransaction(tx);
            },
            signAndSendTransaction: async (tx, skipPreflight = false) => {
              const options = skipPreflight ? { skipPreflight: true } : {};
              const result = await phantom.signAndSendTransaction(tx, options);
              return result.signature || result;
            },
            signAllTransactions: async (txs) => {
              return await phantom.signAllTransactions(txs);
            },
            signMessage: phantom.signMessage ? async (message) => {
              const { signature } = await phantom.signMessage(message);
              return signature;
            } : undefined,
            connected: true,
            walletName: "Phantom",
            supportsPriorityFees: true
          });
        } else {
          // Phantom via Reown only
          console.log("🟣 Phantom via Reown (no direct access)");
          setWalletProvider({
            publicKey,
            signTransaction: async (tx) => {
              console.warn("Phantom via Reown: Direct signing not available");
              return tx;
            },
            signAndSendTransaction: async (tx, skipPreflight = true) => {
              console.log("Phantom via Reown: Using connection.sendTransaction");
              if ('version' in tx) {
                return await connection.sendTransaction(tx, { skipPreflight });
              } else {
                return await connection.sendTransaction(tx, [], { skipPreflight });
              }
            },
            signAllTransactions: async (txs) => {
              console.warn("Phantom via Reown: Batch signing not available");
              return txs;
            },
            connected: true,
            walletName: "Phantom",
            supportsPriorityFees: true
          });
        }
        return;
      }
      
      // 3. Check for Solflare (prioritize Reown detection)
      if (isSolflare) {
        console.log(`🟠 Detected Solflare wallet via Reown AppKit (${connectedWalletName})`);
        
        const solflare = windowAny.solflare;
        
        if (solflare && solflare.isSolflare) {
          // Solflare with direct window access
          console.log("🟠 Solflare has direct window access");
          setWalletProvider({
            publicKey,
            signTransaction: async (tx) => {
              return await solflare.signTransaction(tx);
            },
            signAndSendTransaction: async (tx, skipPreflight = false) => {
              const options = skipPreflight ? { skipPreflight: true } : {};
              const result = await solflare.signAndSendTransaction(tx, options);
              return result.signature || result;
            },
            signAllTransactions: async (txs) => {
              return await solflare.signAllTransactions(txs);
            },
            signMessage: solflare.signMessage ? async (message) => {
              const { signature } = await solflare.signMessage(message);
              return signature;
            } : undefined,
            connected: true,
            walletName: "Solflare",
            supportsPriorityFees: true
          });
        } else {
          // Solflare via Reown only
          console.log("🟠 Solflare via Reown (no direct access)");
          setWalletProvider({
            publicKey,
            signTransaction: async (tx) => {
              console.warn("Solflare via Reown: Direct signing not available");
              return tx;
            },
            signAndSendTransaction: async (tx, skipPreflight = true) => {
              console.log("Solflare via Reown: Using connection.sendTransaction");
              if ('version' in tx) {
                return await connection.sendTransaction(tx, { skipPreflight });
              } else {
                return await connection.sendTransaction(tx, [], { skipPreflight });
              }
            },
            signAllTransactions: async (txs) => {
              console.warn("Solflare via Reown: Batch signing not available");
              return txs;
            },
            connected: true,
            walletName: "Solflare",
            supportsPriorityFees: true
          });
        }
        return;
      }
      
      // 4. Check for Backpack
      if (isBackpack || windowAny.backpack?.solana) {
        console.log("🎒 Detected Backpack wallet");
        const backpack = windowAny.backpack?.solana;
        
        if (backpack) {
          setWalletProvider({
            publicKey,
            signTransaction: async (tx) => {
              return await backpack.signTransaction(tx);
            },
            signAndSendTransaction: async (tx, skipPreflight = false) => {
              const options = skipPreflight ? { skipPreflight: true } : {};
              const result = await backpack.signAndSendTransaction(tx, options);
              return result.signature || result;
            },
            signAllTransactions: async (txs) => {
              return await backpack.signAllTransactions(txs);
            },
            signMessage: backpack.signMessage ? async (message) => {
              const { signature } = await backpack.signMessage(message);
              return signature;
            } : undefined,
            connected: true,
            walletName: "Backpack",
            supportsPriorityFees: true
          });
        } else {
          // Backpack via Reown only
          setWalletProvider({
            publicKey,
            signTransaction: async (tx) => {
              console.warn("Backpack via Reown: Direct signing not available");
              return tx;
            },
            signAndSendTransaction: async (tx, skipPreflight = true) => {
              console.log("Backpack via Reown: Using connection.sendTransaction");
              if ('version' in tx) {
                return await connection.sendTransaction(tx, { skipPreflight });
              } else {
                return await connection.sendTransaction(tx, [], { skipPreflight });
              }
            },
            signAllTransactions: async (txs) => {
              console.warn("Backpack via Reown: Batch signing not available");
              return txs;
            },
            connected: true,
            walletName: "Backpack",
            supportsPriorityFees: false
          });
        }
        return;
      }
      
      // 5. Check for other wallets via Reown
      if (isReownConnection && connectedWalletName) {
        const walletName = connectedWalletName;
        console.log(`⚡ Using ${walletName} via Reown AppKit`);
        
        setWalletProvider({
          publicKey,
          signTransaction: async (tx) => {
            console.warn(`${walletName}: Direct signing not available via Reown`);
            return tx;
          },
          signAndSendTransaction: async (tx, skipPreflight = true) => {
            console.log(`${walletName}: Using connection.sendTransaction`);
            if ('version' in tx) {
              return await connection.sendTransaction(tx, { skipPreflight });
            } else {
              return await connection.sendTransaction(tx, [], { skipPreflight });
            }
          },
          signAllTransactions: async (txs) => {
            console.warn(`${walletName}: Batch signing not available via Reown`);
            return txs;
          },
          connected: true,
          walletName,
          supportsPriorityFees: isExodus || isBrave || isCoin98
        });
        return;
      }
      
      // 6. Fallback: Direct window.solana injection (when not using Reown)
      if (!isReownConnection && windowAny.solana) {
        console.log("🔗 Detected generic Solana wallet (direct injection)");
        const solana = windowAny.solana;
        
        // Try to identify the wallet
        const walletName = solana.isPhantom ? "Phantom" : 
                          solana.isSolflare ? "Solflare" :
                          solana.isTrust ? "Trust Wallet" :
                          solana.isExodus ? "Exodus" :
                          solana.isBraveWallet ? "Brave" :
                          solana.isCoin98 ? "Coin98" :
                          solana.isMathWallet ? "MathWallet" :
                          "Solana Wallet";
        
        setWalletProvider({
          publicKey,
          signTransaction: async (tx) => {
            if (solana.signTransaction) {
              return await solana.signTransaction(tx);
            }
            console.warn(`${walletName} doesn't support signTransaction directly`);
            return tx;
          },
          signAndSendTransaction: async (tx, skipPreflight = false) => {
            if (solana.signAndSendTransaction) {
              try {
                const options = skipPreflight ? { skipPreflight: true } : {};
                const result = await solana.signAndSendTransaction(tx, options);
                return result.signature || result;
              } catch (err) {
                console.warn(`${walletName} signAndSendTransaction failed, using fallback`);
              }
            }
            // Fallback
            if (solana.signTransaction) {
              const signed = await solana.signTransaction(tx);
              const signature = await connection.sendRawTransaction(
                signed.serialize(),
                { skipPreflight }
              );
              return signature;
            } else {
              // Direct send without signing (wallet will handle signing)
              if ('version' in tx) {
                return await connection.sendTransaction(tx, { skipPreflight });
              } else {
                return await connection.sendTransaction(tx, [], { skipPreflight });
              }
            }
          },
          signAllTransactions: async (txs) => {
            if (solana.signAllTransactions) {
              return await solana.signAllTransactions(txs);
            }
            // Fallback: sign individually
            const signed = [];
            for (const tx of txs) {
              if (solana.signTransaction) {
                signed.push(await solana.signTransaction(tx));
              } else {
                signed.push(tx);
              }
            }
            return signed;
          },
          signMessage: solana.signMessage ? async (message) => {
            const { signature } = await solana.signMessage(message);
            return signature;
          } : undefined,
          connected: true,
          walletName,
          supportsPriorityFees: false
        });
        return;
      }
      
      // 7. Final fallback: Use connection directly
      console.log("🔌 Using direct connection fallback (no wallet object detected)");
      setWalletProvider({
        publicKey,
        signTransaction: async (tx) => {
          console.warn("Direct signing not available, transaction must be sent");
          return tx;
        },
        signAndSendTransaction: async (tx, skipPreflight = true) => {
          console.log("Using connection.sendTransaction directly");
          if ('version' in tx) {
            return await connection.sendTransaction(tx, { skipPreflight });
          } else {
            return await connection.sendTransaction(tx, [], { skipPreflight });
          }
        },
        signAllTransactions: async (txs) => {
          console.warn("Batch signing not available");
          return txs;
        },
        connected: true,
        walletName: "Connected Wallet",
        supportsPriorityFees: false
      });
    };

    // Add a small delay and retry logic for wallet detection
    // Some wallets inject their objects after a delay
    const timeoutId = setTimeout(() => {
      detectAndSetupWallet();
    }, detectionAttempts * 100); // Increase delay with each attempt
    
    return () => clearTimeout(timeoutId);
  }, [isConnected, address, connection, detectionAttempts, walletInfo]);
  
  // Retry detection if no wallet found after initial attempt
  useEffect(() => {
    if (isConnected && !walletProvider && detectionAttempts < 3) {
      const retryTimeout = setTimeout(() => {
        console.log(`🔄 [WALLET DETECTION] Retrying detection (attempt ${detectionAttempts + 1}/3)`);
        setDetectionAttempts(prev => prev + 1);
      }, 500);
      return () => clearTimeout(retryTimeout);
    }
  }, [isConnected, walletProvider, detectionAttempts]);

  return walletProvider;
}

/**
 * Hook to get an Anchor-compatible wallet interface
 */
export function useAnchorWallet() {
  const walletProvider = useWalletProvider();
  
  if (!walletProvider) return null;
  
  return {
    publicKey: walletProvider.publicKey,
    signTransaction: walletProvider.signTransaction,
    signAllTransactions: walletProvider.signAllTransactions,
  };
}