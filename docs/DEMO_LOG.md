# Demo log (redacted)

Captured 2026-09-13 ~14:53 PT (2026-09-13 21:53 UTC). Secrets redacted. No API key material.

## Live auth attempt (`TRUSTDESK_MODE=live`)

```text
=== TrustDesk · 01-auth ===

Error: Live T3N bootstrap failed (T3nClient: `trustAnchor` is required and must be either a TrustAnchor ({ expected_peer_ids, rtmr3_allowlist }) that pins the node's DKG attestation, or the explicit opt-out { unsafe_trust_server: true }. The unsafe option disables attestation verification (local dev / mock-signer nodes only) — never use it against a real node.). Run with TRUSTDESK_MODE=stub for offline demo, or fix SSO key / trustAnchor. See docs/BUGS.md.
```

- Result: **failed** on required `trustAnchor` (BUG-001)
- Did **not** use `T3N_UNSAFE_TRUST=1` for the submitted story
- Claimed SSO DID prefix (from claim flow, not live handshake): `did:t3n:9a2958b8d3…`

## Stub demo (`TRUSTDESK_MODE=stub npm run demo`) — screenshot-worthy

```text
=== TrustDesk · hello demo (04-run-ticket) ===

Mode: stub
Agent DID: did:t3n:4990ccd2a1b2c3d4e5f60718293a4b5c6d7e8f90
Tools: summarize_ticket, apply_refund_policy, tee_audit_log
Fixture: fixtures/sample-ticket.json

--- decision ---
{
  "ticketId": "TCK-10042",
  "summary": "Ticket TCK-10042: member requests review of order ORD-77821 ($49 USD). Reason: Item arrived damaged. Body: The package was crushed on arrival and the device is defective. I would like a full refund. Order ORD-77821.",
  "policy": {
    "decision": "approve_full",
    "refundAmountUsd": 49,
    "reasons": [
      "defective_within_14d"
    ],
    "policyVersion": "trustdesk-refund-v1"
  },
  "audit": {
    "id": "aud_01ea0401922f1f19",
    "at": "2026-09-13T21:53:07.029Z",
    "action": "ticket.decide",
    "ticketId": "TCK-10042",
    "decision": "approve_full",
    "refundAmountUsd": 49,
    "contractTail": "trustdesk-audit",
    "notes": "stub TEE invoke — replace with tenant.contracts.register + executeAndDecode after SSO"
  },
  "agentDid": "did:t3n:4990ccd2a1b2c3d4e5f60718293a4b5c6d7e8f90",
  "mode": "stub"
}

✓ TrustDesk agent loop completed.
  (stub mode — claim key at https://go.terminal3.io/adk-community then TRUSTDESK_MODE=live)
```
