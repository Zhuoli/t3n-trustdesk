# ADK / docs issues found (actionable)

> Judging values honest docs feedback. Add repros as we hit live SSO.

## BUG-001 — Quickstart may omit required `trustAnchor`

- **Where:** Published quickstart / `T3nClient` constructor
- **Symptom:** `handshake()` / client construction throws when `trustAnchor` (`expected_peer_ids`, `rtmr3_allowlist`) is required but undocumented in the snippet
- **Exact live error (2026-09-13 PT / 2026-09-13 21:53 UTC):** with `TRUSTDESK_MODE=live`, valid `T3N_API_KEY` in `.env`, and `@terminal3/t3n-sdk@5.2.0` loaded, bootstrap failed before handshake with:

  > `T3nClient: \`trustAnchor\` is required and must be either a TrustAnchor ({ expected_peer_ids, rtmr3_allowlist }) that pins the node's DKG attestation, or the explicit opt-out { unsafe_trust_server: true }. The unsafe option disables attestation verification (local dev / mock-signer nodes only) — never use it against a real node.`

- **Impact:** New builders forced toward `unsafe_trust_server: true`, which defeats the attestation story
- **Ask:** Publish testnet trust-anchor values next to the quickstart, or make sandbox default to a documented safe anchor
- **Our mitigation:** Live bootstrap documents the gap; `T3N_UNSAFE_TRUST=1` is debug-only and **not** the submission narrative. Stub demo remains the screenshot-worthy offline proof until published anchors exist.
- **Repro:**
  1. Claim sandbox key at https://go.terminal3.io/adk-community
  2. `npm install && npm install @terminal3/t3n-sdk@5.2.0`
  3. Set `T3N_API_KEY` + `TRUSTDESK_MODE=live` (do **not** set `T3N_UNSAFE_TRUST`)
  4. `npm run auth` → fails with the message above

## BUG-002 — Environment naming drift (`sandbox` vs `testnet`)

- **Where:** Marketing pages say “sandbox”; SDK `setEnvironment` examples use `"testnet" | "production"`
- **Symptom:** Confusion when copying snippets across product page vs docs
- **Ask:** Single canonical env name in all entrypoints (or alias both)
- **Our mitigation:** Code uses `setEnvironment("testnet")` per SDK reference

## BUG-003 — Optional (to confirm on live key) — `getUsage()` / credits display

- **Where:** Post-auth credits check in product quickstart
- **Symptom:** Community reports of balance retrieval failing intermittently
- **Ask:** Document expected shape + empty-credits behavior for new claims
- **Status:** Blocked behind BUG-001 — live auth did not complete without trustAnchor / unsafe opt-out, so credits path was not reached on 2026-09-13

## BUG-004 — Placeholder resolution examples sparse for support-desk agents

- **Where:** Docs on `{{profile.}}` confidential markers
- **Ask:** One end-to-end support-ticket example showing host-visible placeholders vs enclave-resolved values
- **Our mitigation:** Fixtures ship with `{{profile.display_name}}` / `{{profile.email}}` and `redactForHost()`
