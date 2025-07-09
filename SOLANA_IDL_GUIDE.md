# Solana IDL Integration Guide - 2025

## 📋 Overview

This project uses **Solita** by Metaplex Foundation to generate TypeScript hooks from Solana program IDL files. This follows 2025 best practices for Solana dApp development.

## 🗂️ Directory Structure

```
src/
├── utils/
│   ├── abis/                     # EVM contract ABIs
│   │   ├── projectAdmin.json
│   │   └── ...
│   └── idls/                     # Solana program IDLs
│       ├── projectAdmin.json     # YOUR IDL GOES HERE
│       └── example-structure.json
├── generated/
│   └── solana/                   # Generated TypeScript code
│       ├── accounts/
│       ├── instructions/
│       ├── types/
│       └── index.ts
└── hooks/
    └── blockchain/
        └── solana/               # Your custom Solana hooks
            ├── investments/
            ├── projects/
            └── user/
```

## 🔧 How to Use Your IDL

### 1. Place Your IDL File
- Copy your IDL JSON file to: `src/utils/idls/projectAdmin.json`
- Update the program ID in `.solitarc.js` with your actual program ID

### 2. Update Configuration
Edit `.solitarc.js`:
```javascript
const programId = 'YOUR_ACTUAL_PROGRAM_ID'; // Replace this
```

### 3. Generate TypeScript Code
Run the generation command:
```bash
npm run solita
# or 
npm run generate:solana
```

### 4. Use Generated Code
The generated code will be in `src/generated/solana/` and can be imported like:
```typescript
import { 
  investIx, 
  InvestAccounts, 
  InvestArgs 
} from '@/generated/solana';
```

## 📊 What Solita Generates

### Instructions
- `investIx()` - Creates instruction
- `investInvoke()` - Invokes instruction
- `investInvokeWithSigners()` - Invokes with signers

### Accounts
- `InvestAccounts` - TypeScript interface
- Account validation functions
- Serialization/deserialization

### Types
- All custom types from your IDL
- Proper TypeScript interfaces
- Borsh serialization support

## 🔄 Integration with Existing Hooks

After generation, integrate with your hook structure:

```typescript
// src/hooks/blockchain/solana/investments/useInvestment.ts
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { investIx, InvestAccounts, InvestArgs } from '@/generated/solana';

export const useInvestment = () => {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

  const executeInvestment = async (args: InvestArgs) => {
    if (!publicKey) throw new Error('Wallet not connected');
    
    const accounts: InvestAccounts = {
      investor: publicKey,
      project: args.projectPubkey,
      // ... other accounts
    };

    const instruction = investIx(accounts, args);
    const transaction = new Transaction().add(instruction);
    
    return await sendTransaction(transaction, connection);
  };

  return { executeInvestment };
};
```

## ⚡ Advanced Features

### Type Aliases
Add to `.solitarc.js`:
```javascript
typeAliases: {
  UnixTimestamp: 'i64',
  TokenAmount: 'u64'
}
```

### Custom Serializers
For complex types:
```javascript
serializers: {
  Metadata: './src/custom/metadata-serializer.ts',
}
```

### IDL Hooks
Modify IDL before generation:
```javascript
idlHook: (idl) => {
  // Modify IDL if needed
  return idl;
}
```

## 🚀 Best Practices

1. **Keep IDL in Version Control**: Include your IDL file in git
2. **Regenerate After Changes**: Run `npm run solita` after program updates
3. **Custom Hook Layer**: Create wrapper hooks for your specific use cases
4. **Error Handling**: Add proper error handling around generated functions
5. **Type Safety**: Use TypeScript interfaces for all interactions

## 🔧 Troubleshooting

### Common Issues:
- **Missing Program ID**: Update `.solitarc.js` with correct program ID
- **Invalid IDL**: Validate your IDL structure matches Anchor/Shank format
- **Generation Errors**: Check console output for specific error messages

### Debug Commands:
```bash
# Verbose generation
npx solita --verbose

# Clear generated files
rm -rf src/generated/solana/*
npm run solita
```

## 📚 Resources

- [Solita Documentation](https://github.com/metaplex-foundation/solita)
- [Anchor IDL Specification](https://docs.anchor-lang.com/)
- [Solana Program Library](https://spl.solana.com/)