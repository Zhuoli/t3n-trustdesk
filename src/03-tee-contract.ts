/**
 * 03 — Minimal TEE contract stub
 * Shows the register/invoke shape T3 expects; overnight uses a local audit simulator.
 */
import { bootstrapT3n, newAuditId } from "./lib/t3n.js";

async function main() {
  console.log("=== TrustDesk · 03-tee-contract ===\n");
  const session = await bootstrapT3n();

  const contract = {
    tail: "trustdesk-audit",
    version: "0.1.0",
    mode: session.mode,
    tenantDid: session.tenantDid,
    contractId:
      session.mode === "stub" ? `stub_${newAuditId()}` : "<from register>",
    functions: ["log-decision", "get-decision"],
    notes: [
      "MVP logs structured refund decisions into an audit trail.",
      "PII stays behind {{profile.*}} placeholders resolved inside the enclave.",
      "Swap this stub for a wasm32-wasip2 component after SSO + first TEE tutorial.",
    ],
  };

  const invokeDemo = {
    function: "log-decision",
    input: {
      ticketId: "TCK-DEMO-001",
      decision: "approve_full",
      refundAmountUsd: 49.0,
    },
    output: {
      ok: true,
      auditId: newAuditId(),
      persisted: session.mode === "stub" ? "local-memory" : "tee-ledger",
    },
  };

  console.log("Contract descriptor:\n", JSON.stringify(contract, null, 2));
  console.log("\nSample invoke:\n", JSON.stringify(invokeDemo, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
