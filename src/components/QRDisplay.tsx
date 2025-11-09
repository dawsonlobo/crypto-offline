import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import type { Transaction } from '../types/wallet';

interface QRDisplayProps {
  transaction: Transaction;
  onProceed: () => void;
  onBack: () => void;
}

export default function QRDisplay({ transaction, onProceed, onBack }: QRDisplayProps) {
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-12 text-slate-800">Wallet Signer</h1>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-semibold text-center mb-6 text-slate-800">
            Sign Transaction
          </h2>

          <div className="flex flex-col items-center space-y-6">
            <div className="w-64 h-64 bg-white border-4 border-slate-200 rounded-2xl flex items-center justify-center shadow-inner">
              <svg
                width="240"
                height="240"
                viewBox="0 0 29 29"
                xmlns="http://www.w3.org/2000/svg"
                className="qr-code"
              >
                <rect width="29" height="29" fill="#ffffff" />
                {generateQRPattern().map((rect, i) => (
                  <rect
                    key={i}
                    x={rect.x}
                    y={rect.y}
                    width="1"
                    height="1"
                    fill="#000000"
                  />
                ))}
              </svg>
            </div>

            <div className="text-center space-y-2">
              <p className="text-sm text-slate-600 max-w-xs">
                Please scan the QR code and sign the transaction offline
              </p>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
                timeLeft <= 10
                  ? 'bg-red-50 text-red-700'
                  : 'bg-blue-50 text-blue-700'
              }`}>
                <span className="text-xs">Expires in:</span>
                <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
              </div>
            </div>

            <div className="w-full space-y-3">
              <button
                onClick={onProceed}
                className="w-full bg-green-600 text-white py-4 rounded-lg font-medium hover:bg-green-700 transition shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Transaction Signed
              </button>

              <button
                onClick={onBack}
                className="w-full bg-slate-100 text-slate-700 py-3 rounded-lg font-medium hover:bg-slate-200 transition flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function generateQRPattern() {
  const positions: { x: number; y: number }[] = [];

  const hash = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return hash;
  };

  const seed = hash(Date.now().toString());
  let random = seed;

  const pseudoRandom = () => {
    random = (random * 9301 + 49297) % 233280;
    return random / 233280;
  };

  for (let y = 0; y < 29; y++) {
    for (let x = 0; x < 29; x++) {
      if (
        (x < 7 && y < 7) ||
        (x > 21 && y < 7) ||
        (x < 7 && y > 21) ||
        (x === 6 || y === 6) ||
        (x === 22 || y === 22)
      ) {
        if (
          (x < 7 && y < 7 && (x === 0 || x === 6 || y === 0 || y === 6 || (x >= 2 && x <= 4 && y >= 2 && y <= 4))) ||
          (x > 21 && y < 7 && (x === 22 || x === 28 || y === 0 || y === 6 || (x >= 24 && x <= 26 && y >= 2 && y <= 4))) ||
          (x < 7 && y > 21 && (x === 0 || x === 6 || y === 22 || y === 28 || (x >= 2 && x <= 4 && y >= 24 && y <= 26)))
        ) {
          positions.push({ x, y });
        }
      } else if (pseudoRandom() > 0.5) {
        positions.push({ x, y });
      }
    }
  }

  return positions;
}
