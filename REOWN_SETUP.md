# Reown AppKit Setup Guide

This document explains how to set up and configure Reown AppKit for dual-chain (EVM + Solana) wallet connections in the Throu platform.

## Overview

We've replaced the previous wallet connection system with **Reown AppKit**, which provides:

- **Unified wallet connection** for both EVM (Polygon) and Solana
- **Social login support** (Google, Facebook, Apple, GitHub)
- **Email authentication**
- **Network switching** built-in
- **Modern UI/UX** with professional wallet modal
- **SSR support** for Next.js 15

## Phase 1 & 2 Implementation Complete

✅ **Phase 1: Dual-Chain Core Infrastructure**

- Wagmi configuration with multi-chain support (`src/lib/wagmi-config.ts`)
- Context provider for React Query and Wagmi (`src/app/context.tsx`)
- Layout integration with SSR support (`src/app/[locale]/layout.tsx`)
- Simplified providers system (`src/app/providers.tsx`)

✅ **Phase 2: Wallet Integration & Chain Switching**

- Reown wallet button component (`src/components/wallet/ReownWalletButton.tsx`)
- Chain indicator component (`src/components/ui/reown-chain-indicator.tsx`)
- Unified chain hooks (`src/hooks/useReownChain.ts`)
- Updated navigation components (`src/components/home/HomeNavigation.tsx`)

## Required Setup

### 1. Environment Variables

Create a `.env.local` file with:

```bash
# Get your Project ID from https://cloud.reown.com
NEXT_PUBLIC_REOWN_PROJECT_ID=your_project_id_here
```

### 2. Get Reown Project ID

1. Visit [https://cloud.reown.com](https://cloud.reown.com)
2. Create an account or sign in
3. Create a new project
4. Copy your Project ID
5. Add it to your `.env.local` file

### 3. Configure Networks (Already Done)

The wagmi config is set up with:

- **Mainnet** (Ethereum)
- **Polygon** (Primary EVM chain)
- **Polygon Mumbai** (Testnet)
- **Solana** (via SolanaAdapter)

## Component Usage

### Basic Wallet Button

```tsx
import ReownWalletButton from '@/components/wallet/ReownWalletButton'

// Simple connect button
<ReownWalletButton />

// Account management button
<ReownWalletButton variant="account" />

// Network selector
<ReownWalletButton variant="network" />
```

### Chain Indicator

```tsx
import ReownChainIndicator from '@/components/ui/reown-chain-indicator'

// Show current chain with text
<ReownChainIndicator />

// Show only the dot indicator
<ReownChainIndicator showText={false} />
```

### Chain Detection Hook

```tsx
import { useReownChain } from "@/hooks/useReownChain";

function MyComponent() {
  const { address, isConnected, chainId, chainType, isSolana, isEVM } =
    useReownChain();

  if (isSolana) {
    // Handle Solana-specific logic
  } else if (isEVM) {
    // Handle EVM-specific logic
  }
}
```

## Features

### ✅ Implemented Features

- **Multi-chain wallet connection** (EVM + Solana)
- **Unified wallet modal** with professional UI
- **Chain detection and switching**
- **Social logins** (Google, GitHub, Apple, Facebook)
- **Email authentication**
- **Browser wallet detection**
- **SSR/Hydration support**
- **TypeScript support**
- **Mobile responsive**

### 🔄 Integration Points

The following components now use Reown AppKit:

1. **HomeNavigation** - Updated with new wallet button and chain indicator
2. **Layout** - Includes ContextProvider and SSR setup
3. **Providers** - Simplified to work with Reown AppKit

### 🎯 Next Steps

To complete the full dual-chain implementation:

1. **Update marketplace components** to use `useReownChain()`
2. **Update investment modals** to handle both chains
3. **Update smart contract hooks** to work with detected chain
4. **Test wallet connections** on both Polygon and Solana
5. **Update transaction flows** to handle both chains

## Migration Notes

### What Changed

- **Removed**: Previous Solana wallet adapter setup
- **Removed**: Custom wallet connection modals
- **Removed**: Chain abstraction layer (now handled by Reown)
- **Added**: Reown AppKit configuration
- **Added**: New unified components and hooks

### What Stayed

- **Clerk authentication** (unchanged)
- **Theme system** (unchanged)
- **Internationalization** (unchanged)
- **Project structure** (unchanged)

## Troubleshooting

### Common Issues

1. **"Project ID not found"**

   - Ensure `NEXT_PUBLIC_REOWN_PROJECT_ID` is set in `.env.local`
   - Restart the development server after adding environment variables

2. **Wallet not connecting**

   - Check browser console for errors
   - Ensure wallet extensions are installed
   - Try refreshing the page

3. **Chain not detected**
   - Use the network selector button to switch chains
   - Ensure the wallet supports the target chain

### Debug Information

Use the browser console to check:

- `window.ethereum` (for EVM wallets)
- `window.solana` (for Solana wallets)
- Network requests to Reown services

## Resources

- [Reown AppKit Documentation](https://docs.reown.com/appkit/)
- [Wagmi Documentation](https://wagmi.sh/)
- [Solana Wallet Adapter](https://github.com/anza-xyz/wallet-adapter)

---

_This implementation follows the Reown AppKit Next.js documentation exactly and provides a solid foundation for dual-chain functionality._
