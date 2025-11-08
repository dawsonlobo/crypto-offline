import { useState } from 'react';
import { Copy, Check, LogOut, Key, FileSignature } from 'lucide-react';
import { shortenAddress, copyToClipboard } from '../utils/wallet';
import type { WalletInfo } from '../types/wallet';

interface WelcomeProps {
  wallet: WalletInfo;
  onSignTransaction: () => void;
  onViewPrivateKey: () => void;
  onLogout: () => void;
}

export default function Welcome({ wallet, onSignTransaction, onViewPrivateKey, onLogout }: WelcomeProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(wallet?.address || "NA");
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-12 text-slate-800">Wallet Signer</h1>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-center mb-8 text-slate-800">
            Welcome
          </h2>

          <div className="mb-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs text-slate-500 mb-1">Wallet Address</p>
                <p className="font-mono text-slate-800 font-medium">
                  {shortenAddress(wallet.address || "NA")}
                </p>
              </div>
              <button
                onClick={handleCopy}
                className="ml-3 p-2 hover:bg-slate-200 rounded-lg transition"
                title="Copy address"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : (
                  <Copy className="w-5 h-5 text-slate-600" />
                )}
              </button>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-200">
              <p className="text-xs text-slate-500">Balance</p>
              <p className="text-lg font-semibold text-slate-800">
                {wallet.balance} {wallet.coin}{' '}
                <span className="text-sm font-normal text-slate-600">
                  (${wallet.balanceUSD})
                </span>
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={onSignTransaction}
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-medium hover:bg-blue-700 transition shadow-md hover:shadow-lg flex items-center justify-center gap-3"
            >
              <FileSignature className="w-5 h-5" />
              Sign Transaction
            </button>

            <button
              onClick={onViewPrivateKey}
              className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 py-4 rounded-lg font-medium transition shadow-sm hover:shadow-md flex items-center justify-center gap-3"
            >
              <Key className="w-5 h-5" />
              View Private Key
            </button>

            <button
              onClick={onLogout}
              className="w-full bg-slate-100 text-slate-700 py-3 rounded-lg font-medium hover:bg-slate-200 transition flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
