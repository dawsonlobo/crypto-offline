declare module "@noble/ed25519" {
  namespace etc {
    function concatBytes(...arrs: Uint8Array[]): Uint8Array;
    let sha512Sync: (...m: Uint8Array[]) => Uint8Array;
  }
}
