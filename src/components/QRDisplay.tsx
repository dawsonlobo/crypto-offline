import { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle } from "lucide-react";
import type { Transaction } from "../types/wallet";
import * as QRCode from "qrcode";

interface QRDisplayProps {
  transaction: Transaction;
  onProceed: () => void;
  onBack: () => void;
}

export default function QRDisplay({
  transaction,
  onProceed,
  onBack,
}: QRDisplayProps) {
  const [timeLeft, setTimeLeft] = useState(60);
  const [qrData, setQrData] = useState("");

  // 🧩 QR Code generation
  useEffect(() => {
    console.log("transaction:", transaction);
    if (!transaction) return;

    try {
      const json = JSON.stringify(transaction);

      QRCode.toString(json, { type: "svg" }, (err, pathOnly) => {
        if (err) {
          console.error("QR generation failed:", err);
          return;
        }

        // 🔧 FIX: Wrap the <path> output inside a visible <svg> container
        const svgWrapped = `
          <svg xmlns="http://www.w3.org/2000/svg"
               width="256"
               height="256"
               viewBox="0 0 256 256"
               shape-rendering="crispEdges">
            <rect width="256" height="256" fill="white"/>
            ${pathOnly}
          </svg>
        `;
        setQrData(svgWrapped);
      });
    } catch (e) {
      console.error("Transaction not serializable:", e);
    }
  }, [transaction]);

  // ⏱ Countdown logic
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-12 text-slate-800">
          Wallet Signer
        </h1>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-semibold text-center mb-6 text-slate-800">
            Sign Transaction
          </h2>

          <div className="flex flex-col items-center space-y-6">
            <div className="w-64 h-64 bg-white border-4 border-slate-200 rounded-2xl flex items-center justify-center shadow-inner">
              {qrData ? (
                <div
                  dangerouslySetInnerHTML={{ __html: qrData }}
                  className="qr-code"
                />
              ) : (
                <span className="text-slate-400 text-sm">Generating QR...</span>
              )}
            </div>

            <div className="text-center space-y-2">
              <p className="text-sm text-slate-600 max-w-xs">
                Please scan the QR code and sign the transaction offline
              </p>
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
                  timeLeft <= 10
                    ? "bg-red-50 text-red-700"
                    : "bg-blue-50 text-blue-700"
                }`}
              >
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
