import * as ed from "@noble/ed25519";
import { sha512 } from "@noble/hashes/sha512";

/**
 * Ensure noble-ed25519 has a working SHA-512 hash backend.
 * Must be called (or imported) before using ed25519 anywhere else.
 */
if (!ed.utils.sha512) {
  ed.utils.sha512 = async (...msgs: Uint8Array[]): Promise<Uint8Array> => {
    // Merge all Uint8Arrays into one buffer
    const total = msgs.reduce((sum, m) => sum + m.length, 0);
    const merged = new Uint8Array(total);
    let offset = 0;
    for (const m of msgs) {
      merged.set(m, offset);
      offset += m.length;
    }
    return sha512(merged);
  };
}

export { ed };
