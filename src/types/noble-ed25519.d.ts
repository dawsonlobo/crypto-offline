// src/types/noble-ed25519.d.ts

declare module "@noble/ed25519" {
  export namespace utils {
    /**
     * SHA-512 hash function override (required in v3+)
     */
    let sha512: (...msgs: Uint8Array[]) => Promise<Uint8Array>;
  }

  /**
   * Compute a public key from a private key (async)
   */
  export function getPublicKeyAsync(privateKey: Uint8Array): Promise<Uint8Array>;

  /**
   * Sign a message using Ed25519 (async)
   */
  export function signAsync(message: Uint8Array, privateKey: Uint8Array): Promise<Uint8Array>;

  /**
   * Verify a signature (async)
   */
  export function verifyAsync(
    signature: Uint8Array,
    message: Uint8Array,
    publicKey: Uint8Array
  ): Promise<boolean>;
}
