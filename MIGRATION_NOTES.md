# Migration Notes - Blockchain Hooks Refactoring

## Overview

The blockchain hooks have been refactored to use direct Reown AppKit patterns instead of complex custom abstractions.

## API Changes

### Hook Constructor Changes

**Old Pattern (with arguments):**

```typescript
const evmApproval = useApprovalTransaction(amount);
const evmPurchase = usePurchaseTransaction(investment);
```

**New Pattern (no constructor arguments):**

```typescript
const evmApproval = useApprovalTransaction();
const evmPurchase = usePurchaseTransaction();

// Use functions with arguments instead
evmApproval.approve(tokenAddress, spenderAddress, amount);
evmPurchase.executePurchase(projectId, amount);
```

### Property Name Changes

**Old Properties:**

- `isPending` → `isLoading`
- `executeApproval()` → `approve(tokenAddress, spenderAddress, amount)`

**New Properties:**

- `isLoading` - for transaction state
- `isSuccess` - for successful completion
- `error` - for error messages
- `hash` - transaction hash
- `transactionHash` - alias for hash
- `transactionReceipt` - transaction receipt (when available)

## Affected Components

The following components still use the old API and may need updating:

- `ProjectInvestmentModal.tsx` - Multiple API mismatches
- Any components importing from old hook paths

## Fixed Components

✅ `MarketplaceHomepage.tsx` - Updated to use new simplified hooks  
✅ `Showcase.tsx` - Updated to use new simplified hooks  
✅ `Portfolio.tsx` - Updated to use new simplified hooks  
✅ `Header.tsx` - Updated to use new simplified hooks

## Fixed 403 Error

✅ **Solana 403 Error Fixed**: Changed default network from mainnet-beta to devnet to avoid rate limits

## Cleanup Status

✅ Old EVM hooks directory ready for removal  
✅ Old Solana hooks directory ready for removal  
✅ New simplified hooks implemented  
✅ Environment configuration updated for Solana devnet

## Next Steps

1. Remove old hook directories: `src/hooks/blockchain/evm/` and `src/hooks/blockchain/solana/`
2. Update remaining components to use new API patterns
3. Test all blockchain functionality with new simplified hooks
