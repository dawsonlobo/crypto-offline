export type Cryptocurrency = 'BTC' | 'ETH' | 'SOL' | 'ADA';

export type AccessMethod = 'phrase' | 'keystore' | 'privateKey';

export interface WalletInfo {
  secretKey: Uint8Array<ArrayBufferLike>;
  address: string;
  coin: Cryptocurrency;
  balance?: number;
  balanceUSD?: number;
}

export interface Transaction {
  senderAddress: string;
  receiverAddress: string;
  amount: number;
  expiry: number;
  blockhash: string;
  signedTx:string
}
