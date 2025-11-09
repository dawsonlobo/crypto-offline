import { useState, useEffect } from 'react';
import { Camera, ArrowLeft } from 'lucide-react';
import type { Transaction } from '../types/wallet';
import { shortenAddress } from '../utils/wallet';

interface SignTransactionProps {
  transaction: Transaction | null;
  onScanQR: () => void;
  onGenerateQR: () => void;
  onBack: () => void;
}

export default function SignTransaction({
  transaction,
  onScanQR,
  onGenerateQR,
  onBack
}: SignTransactionProps) {
  const [timeLeft, setTimeLeft] = useState(20);

  useEffect(() => {
    if (transaction && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [transaction, timeLeft]);

  if (!transaction) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-12 text-slate-800">Wallet Signer</h1>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-semibold text-center mb-8 text-slate-800">
              Sign Transaction
            </h2>

            <div className="flex flex-col items-center space-y-6">
              <button
                onClick={onScanQR}
                className="w-32 h-32 bg-blue-50 hover:bg-blue-100 rounded-2xl flex items-center justify-center transition shadow-md hover:shadow-lg"
              >
                <Camera className="w-16 h-16 text-blue-600" />
              </button>

              <p className="text-sm text-slate-600 text-center">
                Tap to scan transaction QR code
              </p>

              <button
                onClick={onBack}
                className="w-full bg-slate-100 text-slate-700 py-3 rounded-lg font-medium hover:bg-slate-200 transition flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Wallet
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-12 text-slate-800">Wallet Signer</h1>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-semibold text-center mb-6 text-slate-800">
            Sign Transaction
          </h2>

          <div className="space-y-4 mb-6">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Sender</p>
                  <p className="font-mono text-sm text-slate-800 font-medium">
                    {shortenAddress(transaction.senderAddress)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Receiver</p>
                  <p className="font-mono text-sm text-slate-800 font-medium">
                    {shortenAddress(transaction.receiverAddress)}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200">
                <p className="text-xs text-slate-500 mb-1">Sender Balance</p>
                <p className="text-sm font-semibold text-slate-800">
                  {
                  //todo: update these 
                  // transaction?.senderBalance 
                  0} {
                    // transaction.coin
                    "SOL"}{' '}
                  <span className="font-normal text-slate-600">
                    (${
                    // transaction.senderBalanceUSD
                    0})
                  </span>
                </p>
              </div>

              <div className="mt-3">
                <p className="text-xs text-slate-500 mb-1">Amount</p>
                <p className="text-lg font-bold text-blue-600">
                  {transaction.amount} {
                  // transaction.coin
                  "SOL"
                  }{' '}
                  <span className="text-sm font-normal text-slate-600">
                    (${
                    transaction.amount
                    })
                  </span>
                </p>
              </div>
            </div>

            <div className={`p-3 rounded-lg text-center font-medium ${
              timeLeft <= 5
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              {/* todo: add expiry logic */}
              Expires in: {timeLeft} seconds
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={onGenerateQR}
              disabled={timeLeft === 0}
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-medium hover:bg-blue-700 transition shadow-md hover:shadow-lg disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              Sign and Generate QR
            </button>

            <button
              onClick={onBack}
              className="w-full bg-slate-100 text-slate-700 py-3 rounded-lg font-medium hover:bg-slate-200 transition flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
