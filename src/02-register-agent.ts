/**
 * 02 — Register agent identity
 * Stub: records a dedicated agent DID under the tenant.
 * Live morning path: call ADK agent registration after SSO key exists.
 */
import { writeFileSync } from "node:fs";
import { bootstrapT3n } from "./lib/t3n.js";

async function main() {
  console.log("=== TrustDesk · 02-register-agent ===\n");
  const session = await bootstrapT3n();

  const record = {
    registeredAt: new Date().toISOString(),
    tenantDid: session.tenantDid,
    agentDid: session.agentDid,
    agentName: "trustdesk-support",
    capabilities: [
      "summarize_ticket",
      "apply_refund_policy",
      "tee_audit_log",
    ],
    mode: session.mode,
    note:
      session.mode === "stub"
        ? "Placeholder registration. After SSO, replace with ADK register call and save the returned agent DID."
        : "Live session — confirm agent DID against dashboard / docs register API.",
  };

  writeFileSync(".t3n-session.json", JSON.stringify(record, null, 2));
  console.log(JSON.stringify(record, null, 2));
  console.log("\nWrote .t3n-session.json (gitignored).");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
