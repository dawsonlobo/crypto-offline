export type Cryptocurrency = 'BTC' | 'ETH' | 'SOL' | 'ADA';

// export type AccessMethod = 'phrase' | 'keystore' | 'privateKey';

export interface WalletInfo {
  // secretKey: string;
  address: string;
  coin: Cryptocurrency;
  balance?: number;
  balanceUSD?: number;
}

export interface Transaction {
  sender: string;
  receiver: string;
  senderBalance: number;
  senderBalanceUSD: number;
  amount: number;
  amountUSD: number;
  coin: Cryptocurrency;
  expiresIn: number;
}
