"use client";
import { useState } from "react";
import QrScanner from "react-qr-scanner";
import { X } from "lucide-react";

interface QRScannerModalProps {
  onClose: () => void;
  onScanResult: (data: string) => void;
}

export default function QRScannerModal({
  onClose,
  onScanResult,
}: QRScannerModalProps) {
  const [error, setError] = useState<string | null>(null);

  const previewStyle = {
    height: 300,
    width: "100%",
  };

  const handleScan = (data: { text?: string } | null) => {

    if (data?.text) {
      onScanResult(data.text);
    }
  };

  const handleError = (err: unknown) => {
    if (err instanceof Error) {
      console.error(err);
      setError(err.message);
    } else if (typeof err === "string") {
      console.error(err);
      setError(err);
    } else {
      console.error("Unknown camera error", err);
      setError("Camera error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5 text-slate-600" />
        </button>

        <div className="p-4 text-center">
          <h2 className="text-lg font-semibold text-slate-800 mb-2">
            Scan QR Code
          </h2>
          <p className="text-sm text-slate-500 mb-4">
            Align the QR code within the frame
          </p>

          <div className="overflow-hidden rounded-xl border border-slate-200">
            <QrScanner
              delay={300}
              onError={handleError}
              onScan={handleScan}
              style={previewStyle}
              constraints={{ video: { facingMode: "environment" } }}
            />
          </div>

          {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
        </div>
      </div>
    </div>
  );
}
