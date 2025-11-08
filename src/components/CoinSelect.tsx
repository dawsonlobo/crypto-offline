import { useState } from 'react';
import type { Cryptocurrency } from '../types/wallet';

interface CoinSelectProps {
  onSelect: (coin: Cryptocurrency) => void;
}

export default function CoinSelect({ onSelect }: CoinSelectProps) {
  const [selectedCoin, setSelectedCoin] = useState<Cryptocurrency>('BTC');

  const handleProceed = () => {
    onSelect(selectedCoin);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-12 text-slate-800">Wallet Signer</h1>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-semibold text-center mb-6 text-slate-800">
            Access your wallet
          </h2>

          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-700 mb-2 block">
                Select Coin
              </span>
              <select
                value={selectedCoin}
                onChange={(e) => setSelectedCoin(e.target.value as Cryptocurrency)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                <option value="BTC">Bitcoin (BTC)</option>
                <option value="ETH">Ethereum (ETH)</option>
                <option value="SOL">Solana (SOL)</option>
                <option value="ADA">Cardano (ADA)</option>
              </select>
            </label>

            <button
              onClick={handleProceed}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition shadow-md hover:shadow-lg"
            >
              Proceed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
