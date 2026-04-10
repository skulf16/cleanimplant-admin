/**
 * WordPress phpass password verification (portable hashes: $P$)
 * Implemented from scratch — compatible with WordPress password hashing.
 */
import crypto from "crypto";

const ITOA64 = "./0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

function decode64(str: string, count: number): string {
  let output = "";
  let i = 0;
  do {
    let value = ITOA64.indexOf(str[i++]);
    output += String.fromCharCode(value & 0xff);
    if (i < str.length) value |= ITOA64.indexOf(str[i]) << 6;
    output += String.fromCharCode((value >> 6) & 0xff);
    if (i++ >= str.length) break;
    if (i < str.length) value |= ITOA64.indexOf(str[i]) << 12;
    output += String.fromCharCode((value >> 12) & 0xff);
    if (i++ >= str.length) break;
  } while (output.length < count);
  return output.substring(0, count);
}

function encode64(input: Buffer, count: number): string {
  let output = "";
  let i = 0;
  do {
    let value = input[i++];
    output += ITOA64[value & 0x3f];
    if (i < count) value |= input[i] << 8;
    output += ITOA64[(value >> 6) & 0x3f];
    if (i++ >= count) break;
    if (i < count) value |= input[i] << 16;
    output += ITOA64[(value >> 12) & 0x3f];
    if (i++ >= count) break;
    output += ITOA64[(value >> 18) & 0x3f];
  } while (i < count);
  return output;
}

function md5(data: Buffer | string): Buffer {
  return crypto.createHash("md5").update(data).digest();
}

export function checkWordPressPassword(password: string, hash: string): boolean {
  // Old MD5 hashes (32 hex chars) — some very old WP installs
  if (hash.length === 32 && /^[0-9a-f]+$/i.test(hash)) {
    return crypto.createHash("md5").update(password).digest("hex") === hash;
  }

  // Portable phpass hash: $P$ or $H$
  if (!hash.startsWith("$P$") && !hash.startsWith("$H$")) return false;

  const iterChar  = hash[3];
  const iterCount = Math.pow(2, ITOA64.indexOf(iterChar));
  const salt      = hash.substring(4, 12);

  let hashBuf = md5(Buffer.from(salt + password, "binary"));

  for (let i = 0; i < iterCount; i++) {
    hashBuf = md5(Buffer.concat([hashBuf, Buffer.from(password, "binary")]));
  }

  const computed = "$P$" + iterChar + salt + encode64(hashBuf, 16);
  return computed === hash;
}
