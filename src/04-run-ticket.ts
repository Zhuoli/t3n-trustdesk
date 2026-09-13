/**
 * 04 — MVP end-to-end: ticket JSON in → decision JSON out
 * Default fixture: fixtures/sample-ticket.json
 * Usage: npm run demo
 *        npx tsx src/04-run-ticket.ts fixtures/other.json
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { bootstrapT3n } from "./lib/t3n.js";
import { runTrustDeskAgent, TOOL_CATALOG } from "./lib/tools.js";
import type { SupportTicket } from "./lib/types.js";

async function main() {
  console.log("=== TrustDesk · hello demo (04-run-ticket) ===\n");

  const fixturePath = resolve(
    process.argv[2] ?? "fixtures/sample-ticket.json",
  );
  const ticket = JSON.parse(
    readFileSync(fixturePath, "utf8"),
  ) as SupportTicket;

  const session = await bootstrapT3n();
  console.log("Mode:", session.mode);
  console.log("Agent DID:", session.agentDid);
  console.log("Tools:", TOOL_CATALOG.map((t) => t.name).join(", "));
  console.log("Fixture:", fixturePath);
  console.log("");

  const ctx = {
    agentDid: session.agentDid,
    mode: session.mode,
    auditLog: [] as import("./lib/types.js").AuditEntry[],
  };

  const decision = await runTrustDeskAgent(ticket, ctx);

  console.log("--- decision ---");
  console.log(JSON.stringify(decision, null, 2));
  console.log("\n✓ TrustDesk agent loop completed.");
  if (session.mode === "stub") {
    console.log(
      "  (stub mode — claim key at https://go.terminal3.io/adk-community then TRUSTDESK_MODE=live)",
    );
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
