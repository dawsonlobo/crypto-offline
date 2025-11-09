import * as ed from "@noble/ed25519";
import { sha512 } from "@noble/hashes/sha512";

// Assign SHA-512 (needed for noble-ed25519 >= v3)
ed.utils.sha512 = async (...msgs: Uint8Array[]): Promise<Uint8Array> => {
  const totalLength = msgs.reduce((len, cur) => len + cur.length, 0);
  const merged = new Uint8Array(totalLength);
  let offset = 0;
  for (const msg of msgs) {
    merged.set(msg, offset);
    offset += msg.length;
  }
  return sha512(merged);
};

/**
 * Compute the public key for a private key.
 */
export async function getPublicKey(privateKey: Uint8Array): Promise<Uint8Array> {
  return ed.getPublicKeyAsync(privateKey);
}