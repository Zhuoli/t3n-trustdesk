/**
 * 01 — Auth / handshake
 * Stub: prints demo DIDs. Live: T3N handshake + authenticate → did:t3n:…
 */
import { bootstrapT3n } from "./lib/t3n.js";

async function main() {
  console.log("=== TrustDesk · 01-auth ===\n");
  const session = await bootstrapT3n();
  console.log(JSON.stringify(session, null, 2));
  console.log(
    "\nNext: npm run agent:register  (or npm run demo for offline MVP)",
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
