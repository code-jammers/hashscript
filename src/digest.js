import crypto from "crypto";
export function digest(hmac, text) {
  return crypto.createHmac("sha256", hmac).update(text).digest("hex");
}
