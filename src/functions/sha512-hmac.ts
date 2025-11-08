// src/crypto/sha512-hmac.ts
// Dependency-free SHA-512 and HMAC-SHA-512 using Web Crypto (browser & Node 18+)

// Use Web Crypto in both browser and Node
const subtle: SubtleCrypto = (globalThis.crypto?.subtle ??
  // @ts-ignore - Node 18+: crypto.webcrypto.subtle
  (await import('node:crypto')).webcrypto.subtle
) as SubtleCrypto;

function toBytes(input: Uint8Array | string): Uint8Array {
  if (input instanceof Uint8Array) return input;
  return new TextEncoder().encode(input);
}

export async function sha512(message: Uint8Array | string): Promise<Uint8Array> {
  const data = toBytes(message);
  const digest = await subtle.digest('SHA-512', data);
  return new Uint8Array(digest);
}

export async function hmacSha512(
  key: Uint8Array | string,
  data: Uint8Array | string
): Promise<Uint8Array> {
  const k = toBytes(key);
  const d = toBytes(data);
  const cryptoKey = await subtle.importKey(
    'raw',
    k,
    { name: 'HMAC', hash: 'SHA-512' },
    false,
    ['sign']
  );
  const sig = await subtle.sign('HMAC', cryptoKey, d);
  return new Uint8Array(sig);
}
