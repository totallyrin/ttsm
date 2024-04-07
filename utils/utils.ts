// test URL for localhost, dev env
// export const url = "ws://localhost:2911";
import {createHash} from "crypto";

// real URL with DNS hosting for remote connection
export const url = "wss://totallyrin.ddns.net:2911";

export async function hash(password) {
  const hash = createHash("sha256");
  hash.update(password);
  return hash.digest("hex");
}
