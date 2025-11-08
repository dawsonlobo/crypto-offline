import { useState } from 'react';
import { X, Eye, EyeOff, Copy, Check } from 'lucide-react';
import { copyToClipboard } from '../utils/wallet';

interface PrivateKeyModalProps {
  privateKey: string;
  onClose: () => void;
}

export default function PrivateKeyModal({ privateKey, onClose }: PrivateKeyModalProps) {
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(privateKey);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-slate-800">Private Key</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-lg transition"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">
            Never share your private key with anyone. Anyone with access to your private key can control your funds.
          </p>
        </div>

        <div className="mb-6">
          <div className="relative">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 font-mono text-sm break-all">
              {showKey ? privateKey : '•'.repeat(64)}
            </div>
            <div className="absolute top-2 right-2 flex gap-1">
              <button
                onClick={() => setShowKey(!showKey)}
                className="p-2 hover:bg-slate-200 rounded-lg transition bg-white shadow-sm"
                title={showKey ? 'Hide' : 'Show'}
              >
                {showKey ? (
                  <EyeOff className="w-4 h-4 text-slate-600" />
                ) : (
                  <Eye className="w-4 h-4 text-slate-600" />
                )}
              </button>
              <button
                onClick={handleCopy}
                className="p-2 hover:bg-slate-200 rounded-lg transition bg-white shadow-sm"
                title="Copy"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 text-slate-600" />
                )}
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}
