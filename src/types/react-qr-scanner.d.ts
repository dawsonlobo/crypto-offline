declare module 'react-qr-scanner' {
  import * as React from 'react';

  export interface QRScanResult {
    text?: string;
    [key: string]: unknown;
  }

  export interface QRScannerProps {
    /** Delay between scan attempts in milliseconds */
    delay?: number;

    /** Called when an error occurs during camera access or scanning */
    onError?: (error: Error) => void;

    /** Called when a valid QR code is detected */
    onScan?: (data: QRScanResult | null) => void;

    /** Style overrides for the container */
    style?: React.CSSProperties;

    /** Media constraints for selecting camera or resolution */
    constraints?: MediaStreamConstraints;

    /** Optional className for styling */
    className?: string;
  }

  export default class QrScanner extends React.Component<QRScannerProps> {}
}
