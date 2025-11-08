import { useState } from 'react';
import { KeyRound, Upload, FileKey } from 'lucide-react';
import type { Cryptocurrency, AccessMethod } from '../types/wallet';

interface WalletAccessProps {
  coin: Cryptocurrency;
  onAccess: (method: AccessMethod, value: string) => void;
  onBack: () => void;
}

export default function WalletAccess({ coin, onAccess, onBack }: WalletAccessProps) {
  const [showInput, setShowInput] = useState<AccessMethod | null>(null);
  const [inputValue, setInputValue] = useState('');

  const handleMethodSelect = (method: AccessMethod) => {
    setShowInput(method);
    setInputValue('');
  };

  const handleSubmit = () => {
    console.log(showInput);
    
    if (inputValue.trim()) {
      onAccess(showInput!, inputValue);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onAccess('keystore', file.name);
    }
  };

  if (showInput) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-12 text-slate-800">Wallet Signer</h1>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-semibold text-center mb-6 text-slate-800">
              {showInput === 'phrase' && 'Enter Recovery Phrase'}
              {showInput === 'keystore' && 'Upload Keystore File'}
              {showInput === 'privateKey' && 'Enter Private Key'}
            </h2>

            <div className="space-y-4">
              {showInput === 'keystore' ? (
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-500 transition">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="keystore-upload"
                    accept=".json"
                  />
                  <label htmlFor="keystore-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 mx-auto mb-3 text-slate-400" />
                    <p className="text-sm text-slate-600">Click to upload keystore file</p>
                  </label>
                </div>
              ) : (
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={
                    showInput === 'phrase'
                      ? 'Enter your 12 or 24 word recovery phrase'
                      : 'Enter your private key'
                  }
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                  rows={showInput === 'phrase' ? 4 : 2}
                />
              )}

              {showInput !== 'keystore' && (
                <button
                  onClick={handleSubmit}
                  disabled={!inputValue.trim()}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition shadow-md hover:shadow-lg disabled:bg-slate-300 disabled:cursor-not-allowed"
                >
                  Access Wallet
                </button>
              )}

              <button
                onClick={() => setShowInput(null)}
                className="w-full bg-slate-100 text-slate-700 py-3 rounded-lg font-medium hover:bg-slate-200 transition"
              >
                Back
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
            Access your wallet
          </h2>

          <div className="space-y-3">
            <button
              onClick={() => handleMethodSelect('phrase')}
              className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 py-4 rounded-lg font-medium transition shadow-sm hover:shadow-md flex items-center justify-center gap-3"
            >
              <FileKey className="w-5 h-5" />
              Enter Phrase
            </button>

            <button
              onClick={() => handleMethodSelect('keystore')}
              className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 py-4 rounded-lg font-medium transition shadow-sm hover:shadow-md flex items-center justify-center gap-3"
            >
              <Upload className="w-5 h-5" />
              Upload Keystore File
            </button>

            <button
              onClick={() => handleMethodSelect('privateKey')}
              className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 py-4 rounded-lg font-medium transition shadow-sm hover:shadow-md flex items-center justify-center gap-3"
            >
              <KeyRound className="w-5 h-5" />
              Enter Private Key
            </button>

            <button
              onClick={onBack}
              className="w-full bg-slate-100 text-slate-700 py-3 rounded-lg font-medium hover:bg-slate-200 transition mt-6"
            >
              Back to Coin Selection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
