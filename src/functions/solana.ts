import { mnemonicToSeedSync, validateMnemonic } from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english.js";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import { RECOVERY_TYPE } from ".";
import { hmac } from "@noble/hashes/hmac";
import { sha512 } from "@noble/hashes/sha512";

const ED25519_CURVE = "ed25519 seed";
const HARDENED_OFFSET = 0x80000000;

function derivePath(path: string, seed: Uint8Array): Uint8Array {
  const segments = path
    .replace("m/", "")
    .split("/")
    .map(segment => {
      const index = parseInt(segment.replace("'", ""));
      return segment.endsWith("'") ? index + HARDENED_OFFSET : index;
    });

  const curveBytes = new TextEncoder().encode(ED25519_CURVE);
  const key = hmac(sha512, curveBytes, seed);
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