import { useState } from "react";
import CoinSelect from "./components/CoinSelect";
import WalletAccess from "./components/WalletAccess";
import Welcome from "./components/Welcome";
import SignTransaction from "./components/SignTransaction";
import QRDisplay from "./components/QRDisplay";
import PrivateKeyModal from "./components/PrivateKeyModal";
import type { Cryptocurrency, WalletInfo, Transaction } from "./types/wallet";
import { getPrivateKey, signOffline } from "./functions/solana";
import QRScannerModal from "./components/QRScannerModal"; // ⬅️ import your modal
import { RECOVERY_TYPE } from "./functions";

type AppState =
  | { stage: "coin-select" }
  | { stage: "wallet-access"; coin: Cryptocurrency }
  | { stage: "welcome"; wallet: WalletInfo }
  | {
      stage: "sign-transaction";
      wallet: WalletInfo;
      transaction: Transaction | null;
    }
  | { stage: "qr-display"; wallet: WalletInfo; transaction: Transaction };

function App() {
  const [state, setState] = useState<AppState>({ stage: "coin-select" });
  // const [wallet, setWallet] = useState<WalletInfo>({ stage: 'coin-select' });
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [showScanner, setShowScanner] = useState(false); // ⬅️ add this

  const handleCoinSelect = (coin: Cryptocurrency) => {
    setState({ stage: "wallet-access", coin });
  };

  const handleWalletAccess = (method: RECOVERY_TYPE, value: string) => {
    if (state.stage !== "wallet-access") return;

    // const wallet = getMockWalletInfo(state.coin, method);
    const wallet = getPrivateKey(method, value);

    if (wallet?.secretKeyUint8Array === undefined) {
      alert("Unable to fetch wallet info");
      return;
    }

    setState({
      stage: "welcome",
      wallet: {
        address: wallet?.address || "NA",
        privateKey: wallet.secretKeyBase58,
        secretKey: wallet.secretKeyUint8Array,
        coin: "ETH",
        balance: 0,
        balanceUSD: 0,
      },
    });
  };

  const handleSignTransaction = () => {
    if (state.stage !== "welcome") return;
    setState({
      stage: "sign-transaction",
      wallet: state.wallet,
      transaction: null,
    });
  };

  // old code
  // const handleScanQR = () => {
  //   if (state.stage !== 'sign-transaction') return;

  //   const mockTransaction: Transaction = {
  //     sender: state.wallet.address,
  //     receiver: 'sf3ab8d9e2f1c4a5b6c7d8e9f0a1b2c3d4e5f6a7b212y',
  //     senderBalance: state.wallet.balance ||0,
  //     senderBalanceUSD: state.wallet.balanceUSD ||0,
  //     amount: 0.001,
  //     amountUSD: 10,
  //     coin: state.wallet.coin,
  //     expiresIn: 20
  //   };

  //   setState({ stage: 'sign-transaction', wallet: state.wallet, transaction: mockTransaction });
  // };

  // new code
  const handleScanQR = () => {
    // Allow opening the scanner only from sign-transaction stage

    if (state.stage !== "sign-transaction") return;
    setShowScanner(true);
  };

  const handleQRResult = async (qrData: string) => {
    if (state.stage !== "sign-transaction") return;

    // 1) Close the scanner
    setShowScanner(false);

    // 2) Parse the QR payload.
    // Expecting JSON text that matches your Transaction shape.
    try {
      const qrArray = qrData?.split(",");
      const splittedArray = qrArray?.[0]?.split("_");
      if (
        splittedArray?.[0] !== state.wallet?.address?.slice(0, 5) ||
        splittedArray?.[1] !== state.wallet?.address?.slice(-5) 
      ) {
                throw new Error("Invalid Sender");
      }
      const parsed = {
        senderAddress: state.wallet?.address,
        receiverAddress: qrArray?.[1],
        amount: Number(qrArray?.[2]),
        expiry: Number(qrArray?.[3]),
        blockhash: qrArray?.[4],
      };
      /*
      {
      senderAddress,
      receiverAddress,
      amount,
      expiry: 1000,
      blockhash,
    }
      */

      // Optional: validate minimally
      if (
        !parsed?.senderAddress ||
        !parsed?.receiverAddress ||
        !parsed?.amount ||
        !parsed?.expiry ||
        !parsed?.blockhash
      ) {
        throw new Error("Missing required fields");
      }

      if (state.stage !== "sign-transaction") {
        throw new Error("Unable to find wallet");
      }

      // todo: if blockhash expired stop it

      const signedData = await signOffline(
        state.wallet.secretKey,
        { skipValidation: false },
        parsed?.senderAddress,
        parsed?.blockhash,
        [
          {
            programId: "11111111111111111111111111111111",
            keys: [
              {
                pubkey: parsed?.senderAddress,
                isSigner: true,
                isWritable: true,
              },
              {
                pubkey: parsed?.receiverAddress,
                isSigner: false,
                isWritable: true,
              },
            ],
            solAmount: parsed.amount,
          },
        ]
      );

      console.log("building tx");

      // 3) Build a Transaction object that your SignTransaction expects
      const tx: Transaction = {
        senderAddress: parsed?.senderAddress,
        receiverAddress: parsed?.receiverAddress,
        amount: parsed?.amount,
        expiry: parsed?.expiry,
        blockhash: parsed?.blockhash,
        signedTx: signedData,
      };
      console.log("152");
      console.log(tx);

      if (state.stage === "sign-transaction") {
        setState({
          stage: "sign-transaction",
          wallet: state.wallet,
          transaction: tx,
        });
      }
    } catch (error) {
      alert(
        `Invalid QR code data. Make sure it contains a valid JSON Transaction. ${error}`
      );
    }
  };

  const handleGenerateQR = () => {
    if (state.stage !== "sign-transaction" || !state.transaction) return;
    setState({
      stage: "qr-display",
      wallet: state.wallet,
      transaction: state.transaction,
    });
  };

  const handleQRProceed = () => {
    if (state.stage !== "qr-display") return;
    setState({ stage: "welcome", wallet: state.wallet });
  };

  const handleBackFromSign = () => {
    if (state.stage !== "sign-transaction") return;
    setState({ stage: "welcome", wallet: state.wallet });
  };

  const handleBackFromQR = () => {
    if (state.stage !== "qr-display") return;
    setState({
      stage: "sign-transaction",
      wallet: state.wallet,
      transaction: state.transaction,
    });
  };

  const handleBackFromAccess = () => {
    setState({ stage: "coin-select" });
  };

  const handleLogout = () => {
    setState({ stage: "coin-select" });
  };

  const handleViewPrivateKey = () => {
    setShowPrivateKey(true);
  };


  if (state.stage === "coin-select") {
    return <CoinSelect onSelect={handleCoinSelect} />;
  }

  if (state.stage === "wallet-access") {
    return (
      <WalletAccess
        coin={state.coin}
        onAccess={handleWalletAccess}
        onBack={handleBackFromAccess}
      />
    );
  }

  if (state.stage === "welcome") {
    return (
      <>
        <Welcome
          wallet={state.wallet}
          onSignTransaction={handleSignTransaction}
          onViewPrivateKey={handleViewPrivateKey}
          onLogout={handleLogout}
        />
        {showPrivateKey && (
          <PrivateKeyModal
            privateKey={state.wallet.privateKey}
            onClose={() => setShowPrivateKey(false)}
          />
        )}
      </>
    );
  }
  if (showScanner) {
    return (
      <QRScannerModal
        onClose={() => setShowScanner(false)}
        onScanResult={handleQRResult}
      />
    );
  }

  if (state.stage === "sign-transaction") {
    return (
      <SignTransaction
        transaction={state.transaction}
        onScanQR={handleScanQR}
        onGenerateQR={handleGenerateQR}
        onBack={handleBackFromSign}
      />
    );
  }

  if (state.stage === "qr-display") {
    return (
      <QRDisplay
        transaction={state.transaction}
        onProceed={handleQRProceed}
        onBack={handleBackFromQR}
      />
    );
  }

  // ✅ Add the modal here — below all "if" returns but before the final null
  return null;
}

export default App;
