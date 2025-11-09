import { mnemonicToSeedSync, validateMnemonic } from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english.js";
import { Keypair, PublicKey, PublicKeyInitData, Transaction, TransactionInstruction } from "@solana/web3.js";
import bs58 from "bs58";
import { RECOVERY_TYPE } from ".";
import { hmac } from "@noble/hashes/hmac";
import { sha512 } from "@noble/hashes/sha512";
import { getPublicKey } from "@/lib/ed25519";
import { Buffer } from "buffer";


const ED25519_CURVE = "ed25519 seed";
const HARDENED_OFFSET = 0x80000000;

function derivePath(path: string, seed: Uint8Array): Uint8Array {
  const segments = path
    .replace("m/", "")
    .split("/")
    .map((segment) => {
      const index = parseInt(segment.replace("'", ""));
      return segment.endsWith("'") ? index + HARDENED_OFFSET : index;
    });

  const curveBytes = new TextEncoder().encode(ED25519_CURVE);
  console.log(23);
  
  const key = hmac(sha512, curveBytes, seed);
  console.log(26);
  
  const masterKey = key.slice(0, 32);
  const chainCode = key.slice(32);

  let derivedKey = masterKey;
  let derivedChainCode = chainCode;

  for (const segment of segments) {
    const data = new Uint8Array(1 + 32 + 4);
    data[0] = 0;
    data.set(derivedKey, 1);
    const view = new DataView(data.buffer);
    view.setUint32(33, segment, false);
    console.log('36');
    
    const I = hmac(sha512, derivedChainCode, data);
    derivedKey = I.slice(0, 32);
    derivedChainCode = I.slice(32);
  }

  return derivedKey;
}

export function getPrivateKey(
  type: RECOVERY_TYPE,
  data: string,
  path = "m/44'/501'/0'/0'"
) {
  try {
    if (type === RECOVERY_TYPE.PHRASE) {
      if (!validateMnemonic(data, wordlist)) {
        throw new Error("Invalid mnemonic");
      }

      const seed = mnemonicToSeedSync(data);
      const derivedSeed = derivePath(path, seed);
      const keypair = Keypair.fromSeed(derivedSeed);

      console.log(`secretKeyUint8Array`);
      console.log(keypair.secretKey);
      

      return {
        address: keypair.publicKey.toBase58(),
        secretKeyBase58: bs58.encode(keypair.secretKey),
        secretKeyUint8Array: keypair.secretKey,
      };
    }
  } catch (err) {
    console.error("Error generating keypair:", err);
    return {};
  }
}

export async function signOffline(
  secretKey: Uint8Array,
  options: { skipValidation?: boolean },
  feePayer: string,
  recentBlockhash: string,
  instructions: {
    programId?: PublicKeyInitData;
    solAmount: number;
    keys: { pubkey: string; isSigner: boolean; isWritable: boolean }[];
  }[]
) {
  console.log('----------------');
  console.log(secretKey?.[0]);
  console.log(JSON.stringify(instructions));
  
  
  const signer = await fromSecretKey(secretKey, options);
  // Reconstruct transaction and instructions
  const tx = new Transaction({
    feePayer: new PublicKey(feePayer),
    recentBlockhash: recentBlockhash,
  });

  console.log('transaction created');
  

  for (const ix of instructions) {
    const programId = new PublicKey(ix?.programId|| "11111111111111111111111111111111");
    const keys = ix.keys.map(
      (k: { pubkey: string; isSigner: boolean; isWritable: boolean }) => ({
        pubkey: new PublicKey(k.pubkey),
        isSigner: k.isSigner,
        isWritable: k.isWritable,
      })
    );
    console.log('fetching data from sol');
    
    const dataFromSolAmount = createSystemTransferData(ix.solAmount)
    console.log('fetched amount')
    
    const data = Buffer.from(dataFromSolAmount, "base64");
    tx.add(new TransactionInstruction({ programId, keys, data }));
  }

  console.log('proceeding to sign');
  

  // sign the transaction locally using private key
  tx.sign(signer); // fully sign (if feePayer is the signer)


  console.log('signing done');
  

  // serialize the signed transaction (ready to send)
  const signed = tx.serialize(); // returns Buffer
  const signedBase64 = signed.toString("base64");
  console.log('returning signedbase64');
  
  return signedBase64;
}

async function fromSecretKey(
  secretKey: Uint8Array,
  options?: { skipValidation?: boolean }
) {
  if (secretKey.byteLength !== 64) {
    throw new Error("bad secret key size");
  }
  
  const publicKey = secretKey.slice(32, 64);
  if (!options || !options.skipValidation) {
    const privateScalar = secretKey.slice(0, 32);
    const computedPublicKey = await getPublicKey(privateScalar);
    // console.log("--------------------------------");
    // console.log(computedPublicKey);
    // console.log(publicKey);
    
    
    for (let ii = 0; ii < 32; ii++) {
      if (publicKey[ii] !== computedPublicKey[ii]) {
        throw new Error("provided secretKey is invalid");
      }
    }
  }
  return new Keypair({ publicKey, secretKey });
}


function createSystemTransferData(solAmount: number) {
  // 1. System Program transfer instruction index = 2
  const instructionIndex = 2;

  // 2. Convert SOL → lamports (1 SOL = 1e9 lamports)
  const lamports = BigInt(Math.round(solAmount * 1_000_000_000));

  // 3. Create an 12-byte buffer:
  //    [4 bytes instruction index (LE)] + [8 bytes lamports amount (LE)]
  console.log('creating12byte');
  
  const buffer = Buffer.alloc(12);

  console.log('done!');
  
  buffer.writeUInt32LE(instructionIndex, 0); // write 2 -> 0x02000000
  buffer.writeBigUInt64LE(lamports, 4);      // write amount

  // 4. Return base64-encoded version (same format Solana JSON RPC uses)
  return buffer.toString("base64");
}