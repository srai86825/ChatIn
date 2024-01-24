import crypto from "crypto";

function encryptApiKey(apiKey, encryptionKey) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", encryptionKey, iv);
  const encrypted = cipher.update(apiKey, "utf8", "hex") + cipher.final("hex");
  return { iv: iv.toString("hex"), ciphertext: encrypted };
}

function decryptApiKey(encryptedData, encryptionKey) {
  const { iv, ciphertext } = encryptedData;
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    encryptionKey,
    Buffer.from(iv, "hex")
  );
  const decrypted =
    decipher.update(ciphertext, "hex", "utf8") + decipher.final("utf8");
  return decrypted;
}

export { decryptApiKey, encryptApiKey };
