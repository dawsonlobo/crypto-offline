import {
  Connection,
  clusterApiUrl,
  PublicKey,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

export async function getBalance(publicAddress: string) {
  try {
    // Connect to Solana Devnet
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    // Replace this with your wallet address
    const publicKey = new PublicKey(publicAddress);

    // Fetch balance in lamports
    const balanceLamports = await connection.getBalance(publicKey);

    // Convert to SOL
    const balanceSOL = balanceLamports / LAMPORTS_PER_SOL;

    return balanceSOL;

    // console.log(`💰 Balance for ${publicKey.toBase58()} = ${balanceSOL} SOL`);
  } catch (error) {
    console.error("Error fetching balance:", error);
  }
}

export async function generateTransactionOnline(
  senderAddress: string,
  receiverAddress: string,
  amount: number
) {
  try {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    // Step 1: Fetch recent blockhash
    const { blockhash } = await connection.getLatestBlockhash();

    if (!blockhash) {
      throw new Error("Failed to fetch blockhash");
    }
    
    return {
      senderAddress,
      receiverAddress,
      amount,
      expiry: 1000,
      blockhash,
    };
  } catch (error) {
    return {
        message: `Error generateTransactionOnline:${error}`
    }
    // console.error("Error generateTransactionOnline:", error);
  }
}
