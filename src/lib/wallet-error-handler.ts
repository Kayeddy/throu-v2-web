// COMPREHENSIVE WALLET ERROR HANDLER
// Handles all possible wallet interaction scenarios with user-friendly messages and recovery actions

import { ChainType } from "@/stores/useUnifiedWalletStore";

export interface WalletError {
  type: 'USER_REJECTED' | 'TIMEOUT' | 'NOT_INSTALLED' | 'NETWORK_ERROR' | 'INSUFFICIENT_FUNDS' | 'UNKNOWN' | 'ACCOUNT_LOCKED' | 'WRONG_NETWORK' | 'RATE_LIMITED';
  code?: string | number;
  message: string;
  userMessage: string;
  originalError?: any;
  chain: ChainType;
  walletName?: string;
  isRetryable: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  suggestedActions: WalletErrorAction[];
}

export interface WalletErrorAction {
  label: string;
  action: () => void;
  type: 'primary' | 'secondary' | 'danger';
  icon?: string;
}

export class WalletErrorHandler {
  private static readonly ERROR_PATTERNS = {
    USER_REJECTED: [
      /user rejected/i,
      /user denied/i,
      /user cancelled/i,
      /rejected/i,
      /cancelled/i,
      /denied/i,
      /user canceled/i,
      /transaction was rejected/i,
      /request was rejected/i,
    ],
    TIMEOUT: [
      /timeout/i,
      /timed out/i,
      /connection timeout/i,
      /request timeout/i,
      /response timeout/i,
    ],
    NOT_INSTALLED: [
      /not installed/i,
      /not found/i,
      /not detected/i,
      /connector not found/i,
      /wallet not found/i,
      /no provider/i,
      /no wallet/i,
    ],
    NETWORK_ERROR: [
      /network/i,
      /connection/i,
      /rpc/i,
      /provider/i,
      /endpoint/i,
      /fetch/i,
      /cors/i,
    ],
    INSUFFICIENT_FUNDS: [
      /insufficient/i,
      /balance/i,
      /not enough/i,
      /inadequate/i,
    ],
    ACCOUNT_LOCKED: [
      /locked/i,
      /unlock/i,
      /password/i,
      /authentication/i,
      /unauthorized/i,
    ],
    WRONG_NETWORK: [
      /wrong network/i,
      /incorrect network/i,
      /chain id/i,
      /network mismatch/i,
      /unsupported network/i,
    ],
    RATE_LIMITED: [
      /rate limit/i,
      /too many requests/i,
      /rate exceeded/i,
      /throttled/i,
    ],
  };

  private static readonly ERROR_CODES = {
    // MetaMask/EVM error codes
    4001: 'USER_REJECTED',
    4100: 'ACCOUNT_LOCKED',
    4200: 'UNSUPPORTED_METHOD',
    4900: 'ACCOUNT_LOCKED',
    4901: 'WRONG_NETWORK',
    -32000: 'USER_REJECTED',
    -32002: 'USER_REJECTED',
    -32003: 'TRANSACTION_REJECTED',
    -32602: 'INVALID_REQUEST',
    -32603: 'INTERNAL_ERROR',

    // Custom timeout codes
    'TIMEOUT': 'TIMEOUT',
    'CONNECTION_TIMEOUT': 'TIMEOUT',
    'WALLET_NOT_FOUND': 'NOT_INSTALLED',
  } as const;

  public static parseError(
    error: any,
    chain: ChainType,
    walletName?: string,
    actionHandlers?: {
      onRetry?: () => void;
      onBack?: () => void;
      onInstall?: (walletName: string) => void;
      onHelp?: () => void;
      onClose?: () => void;
    }
  ): WalletError {
    console.log('🔍 Parsing wallet error:', {
      error,
      chain,
      walletName,
      type: typeof error,
      message: error?.message,
      code: error?.code,
    });

    const errorMessage = this.extractErrorMessage(error);
    const errorCode = this.extractErrorCode(error);
    const errorType = this.determineErrorType(errorMessage, errorCode);

    const walletError: WalletError = {
      type: errorType,
      code: errorCode,
      message: errorMessage,
      userMessage: this.getUserFriendlyMessage(errorType, walletName, chain),
      originalError: error,
      chain,
      walletName,
      isRetryable: this.isRetryable(errorType),
      severity: this.getSeverity(errorType),
      suggestedActions: this.getSuggestedActions(errorType, walletName, chain, actionHandlers),
    };

    console.log('✅ Parsed wallet error:', walletError);
    return walletError;
  }

  private static extractErrorMessage(error: any): string {
    if (typeof error === 'string') return error;
    if (error?.message) return error.message;
    if (error?.reason) return error.reason;
    if (error?.error?.message) return error.error.message;
    if (error?.toString) return error.toString();
    return 'Unknown error occurred';
  }

  private static extractErrorCode(error: any): string | number | undefined {
    if (error?.code !== undefined) return error.code;
    if (error?.error?.code !== undefined) return error.error.code;
    if (error?.data?.code !== undefined) return error.data.code;
    return undefined;
  }

  private static determineErrorType(message: string, code?: string | number): WalletError['type'] {
    // Check error code first
    if (code !== undefined) {
      const codeType = this.ERROR_CODES[code as keyof typeof this.ERROR_CODES];
      if (codeType) {
        return codeType as WalletError['type'];
      }
    }

    // Check message patterns
    const lowerMessage = message.toLowerCase();

    for (const [type, patterns] of Object.entries(this.ERROR_PATTERNS)) {
      if (patterns.some(pattern => pattern.test(lowerMessage))) {
        return type as WalletError['type'];
      }
    }

    return 'UNKNOWN';
  }

  private static getUserFriendlyMessage(
    type: WalletError['type'],
    walletName?: string,
    chain?: ChainType
  ): string {
    const wallet = walletName || 'wallet';
    const chainName = chain === 'evm' ? 'Ethereum/Polygon' : 'Solana';

    switch (type) {
      case 'USER_REJECTED':
        return `You declined the connection request in your ${wallet}. Please approve the connection to continue.`;

      case 'TIMEOUT':
        return `Connection to ${wallet} timed out. Please ensure your wallet is unlocked and try again.`;

      case 'NOT_INSTALLED':
        return `${wallet} is not installed on this device. Please install the wallet extension to continue.`;

      case 'NETWORK_ERROR':
        return `Network connection failed. Please check your internet connection and try again.`;

      case 'INSUFFICIENT_FUNDS':
        return `Insufficient funds to complete this transaction. Please add funds to your wallet.`;

      case 'ACCOUNT_LOCKED':
        return `Your ${wallet} is locked. Please unlock it and try again.`;

      case 'WRONG_NETWORK':
        return `Please switch to the correct ${chainName} network in your ${wallet}.`;

      case 'RATE_LIMITED':
        return `Too many connection attempts. Please wait a moment and try again.`;

      case 'UNKNOWN':
      default:
        return `Unable to connect to ${wallet}. Please try again or contact support if the problem persists.`;
    }
  }

  private static isRetryable(type: WalletError['type']): boolean {
    const nonRetryableTypes: WalletError['type'][] = ['NOT_INSTALLED'];
    return !nonRetryableTypes.includes(type);
  }

  private static getSeverity(type: WalletError['type']): WalletError['severity'] {
    switch (type) {
      case 'USER_REJECTED':
      case 'ACCOUNT_LOCKED':
        return 'low';

      case 'TIMEOUT':
      case 'WRONG_NETWORK':
      case 'RATE_LIMITED':
        return 'medium';

      case 'NETWORK_ERROR':
      case 'INSUFFICIENT_FUNDS':
        return 'high';

      case 'NOT_INSTALLED':
      case 'UNKNOWN':
        return 'critical';

      default:
        return 'medium';
    }
  }

  private static getSuggestedActions(
    type: WalletError['type'],
    walletName?: string,
    chain?: ChainType,
    handlers?: {
      onRetry?: () => void;
      onBack?: () => void;
      onInstall?: (walletName: string) => void;
      onHelp?: () => void;
      onClose?: () => void;
    }
  ): WalletErrorAction[] {
    const wallet = walletName || 'wallet';
    const actions: WalletErrorAction[] = [];

    switch (type) {
      case 'USER_REJECTED':
        actions.push(
          {
            label: 'Try Again',
            action: handlers?.onRetry || (() => {}),
            type: 'primary',
            icon: '🔄',
          },
          {
            label: 'Choose Different Wallet',
            action: handlers?.onBack || (() => {}),
            type: 'secondary',
            icon: '↩️',
          }
        );
        break;

      case 'TIMEOUT':
        actions.push(
          {
            label: 'Retry Connection',
            action: handlers?.onRetry || (() => {}),
            type: 'primary',
            icon: '🔄',
          },
          {
            label: 'Get Help',
            action: handlers?.onHelp || (() => {}),
            type: 'secondary',
            icon: '❓',
          }
        );
        break;

      case 'NOT_INSTALLED':
        actions.push(
          {
            label: `Install ${wallet}`,
            action: () => handlers?.onInstall?.(wallet),
            type: 'primary',
            icon: '📱',
          },
          {
            label: 'Choose Different Wallet',
            action: handlers?.onBack || (() => {}),
            type: 'secondary',
            icon: '↩️',
          }
        );
        break;

      case 'NETWORK_ERROR':
        actions.push(
          {
            label: 'Check Connection',
            action: handlers?.onRetry || (() => {}),
            type: 'primary',
            icon: '🌐',
          },
          {
            label: 'Try Different Network',
            action: handlers?.onBack || (() => {}),
            type: 'secondary',
            icon: '🔗',
          }
        );
        break;

      case 'ACCOUNT_LOCKED':
        actions.push(
          {
            label: 'Unlock Wallet',
            action: handlers?.onRetry || (() => {}),
            type: 'primary',
            icon: '🔓',
          },
          {
            label: 'Get Help',
            action: handlers?.onHelp || (() => {}),
            type: 'secondary',
            icon: '❓',
          }
        );
        break;

      case 'WRONG_NETWORK':
        actions.push(
          {
            label: 'Switch Network',
            action: handlers?.onRetry || (() => {}),
            type: 'primary',
            icon: '🔗',
          },
          {
            label: 'Choose Different Chain',
            action: handlers?.onBack || (() => {}),
            type: 'secondary',
            icon: '↩️',
          }
        );
        break;

      case 'INSUFFICIENT_FUNDS':
        actions.push(
          {
            label: 'Add Funds',
            action: handlers?.onHelp || (() => {}),
            type: 'primary',
            icon: '💰',
          },
          {
            label: 'Try Different Wallet',
            action: handlers?.onBack || (() => {}),
            type: 'secondary',
            icon: '👛',
          }
        );
        break;

      case 'RATE_LIMITED':
        actions.push(
          {
            label: 'Wait and Retry',
            action: () => {
              setTimeout(() => handlers?.onRetry?.(), 5000);
            },
            type: 'primary',
            icon: '⏱️',
          }
        );
        break;

      default:
        actions.push(
          {
            label: 'Try Again',
            action: handlers?.onRetry || (() => {}),
            type: 'primary',
            icon: '🔄',
          },
          {
            label: 'Get Support',
            action: handlers?.onHelp || (() => {}),
            type: 'secondary',
            icon: '🆘',
          }
        );
    }

    // Always add a close option
    actions.push({
      label: 'Close',
      action: handlers?.onClose || (() => {}),
      type: 'secondary',
      icon: '✕',
    });

    return actions;
  }

  // Utility methods for common error scenarios
  public static isUserRejection(error: any): boolean {
    const errorMessage = this.extractErrorMessage(error).toLowerCase();
    const errorCode = this.extractErrorCode(error);
    
    return (
      errorCode === 4001 ||
      errorCode === -32000 ||
      errorCode === -32002 ||
      this.ERROR_PATTERNS.USER_REJECTED.some(pattern => pattern.test(errorMessage))
    );
  }

  public static isTimeout(error: any): boolean {
    const errorMessage = this.extractErrorMessage(error).toLowerCase();
    return this.ERROR_PATTERNS.TIMEOUT.some(pattern => pattern.test(errorMessage));
  }

  public static isWalletNotInstalled(error: any): boolean {
    const errorMessage = this.extractErrorMessage(error).toLowerCase();
    return this.ERROR_PATTERNS.NOT_INSTALLED.some(pattern => pattern.test(errorMessage));
  }

  public static isNetworkError(error: any): boolean {
    const errorMessage = this.extractErrorMessage(error).toLowerCase();
    return this.ERROR_PATTERNS.NETWORK_ERROR.some(pattern => pattern.test(errorMessage));
  }

  // Recovery suggestions based on error type
  public static getRecoverySteps(errorType: WalletError['type'], walletName?: string): string[] {
    const wallet = walletName || 'wallet';

    switch (errorType) {
      case 'USER_REJECTED':
        return [
          `1. Click "Connect" again`,
          `2. When ${wallet} popup appears, click "Connect" or "Approve"`,
          `3. Make sure you're connecting the correct account`,
        ];

      case 'TIMEOUT':
        return [
          `1. Make sure ${wallet} extension is unlocked`,
          `2. Check that ${wallet} is running and responsive`,
          `3. Try refreshing the page and connecting again`,
          `4. Disable other wallet extensions temporarily`,
        ];

      case 'NOT_INSTALLED':
        return [
          `1. Install ${wallet} from their official website`,
          `2. Create or import your wallet`,
          `3. Return to this page and try connecting again`,
        ];

      case 'NETWORK_ERROR':
        return [
          `1. Check your internet connection`,
          `2. Try switching to a different network`,
          `3. Disable VPN if using one`,
          `4. Clear browser cache and try again`,
        ];

      case 'ACCOUNT_LOCKED':
        return [
          `1. Open your ${wallet} extension`,
          `2. Enter your password to unlock`,
          `3. Return to this page and try connecting`,
        ];

      case 'WRONG_NETWORK':
        return [
          `1. Open your ${wallet} extension`,
          `2. Click on the network selector`,
          `3. Choose the correct network`,
          `4. Try connecting again`,
        ];

      default:
        return [
          `1. Make sure ${wallet} is installed and unlocked`,
          `2. Check your internet connection`,
          `3. Try refreshing the page`,
          `4. Contact support if the problem persists`,
        ];
    }
  }
} 