import { sha512 } from "@noble/hashes/sha512";
import { utf8ToBytes } from "@noble/hashes/utils";

const msg = utf8ToBytes("hello world");

console.log("SHA-512:", Buffer.from(sha512(msg)).toString("hex"));
