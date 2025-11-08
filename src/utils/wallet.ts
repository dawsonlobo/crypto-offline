import type { Cryptocurrency, WalletInfo } from '../types/wallet';

export const generateMockAddress = (coin: Cryptocurrency): string => {
  const prefixes = {
    BTC: '1',
    ETH: '0x',
    SOL: '',
    ADA: 'addr1'
  };

  const randomChars = Math.random().toString(36).substring(2, 15);
  return `${prefixes[coin]}${randomChars}`;
};

export const shortenAddress = (address: string): string => {
  if (address.length < 10) return address;
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};

export const getMockWalletInfo = (coin: Cryptocurrency, accessMethod: string): WalletInfo => {
  return {
    address: generateMockAddress(coin),
    coin,
    balance: 0.001,
    balanceUSD: 10
  };
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    return false;
  }
};
