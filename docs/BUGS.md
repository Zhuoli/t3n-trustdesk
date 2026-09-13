# ADK / docs issues found (actionable)

> Judging values honest docs feedback. Add repros as we hit live SSO.

## BUG-001 — Quickstart may omit required `trustAnchor`

- **Where:** Published quickstart / `T3nClient` constructor
- **Symptom:** `handshake()` throws when `trustAnchor` (`expected_peer_ids`, `rtmr3_allowlist`) is required but undocumented in the snippet
- **Impact:** New builders forced toward `unsafe_trust_server: true`, which defeats the attestation story
- **Ask:** Publish testnet trust-anchor values next to the quickstart, or make sandbox default to a documented safe anchor
- **Our mitigation:** Live bootstrap documents the gap; `T3N_UNSAFE_TRUST=1` is debug-only and not the submission narrative

## BUG-002 — Environment naming drift (`sandbox` vs `testnet`)

- **Where:** Marketing pages say “sandbox”; SDK `setEnvironment` examples use `"testnet" | "production"`
- **Symptom:** Confusion when copying snippets across product page vs docs
- **Ask:** Single canonical env name in all entrypoints (or alias both)
- **Our mitigation:** Code uses `setEnvironment("testnet")` per SDK reference

## BUG-003 — Optional (to confirm on live key) — `getUsage()` / credits display

- **Where:** Post-auth credits check in product quickstart
- **Symptom:** Community reports of balance retrieval failing intermittently
- **Ask:** Document expected shape + empty-credits behavior for new claims
- **Status:** Pending morning SSO verification — will update with exact error

## BUG-004 — Placeholder resolution examples sparse for support-desk agents

- **Where:** Docs on `{{profile.}}` confidential markers
- **Ask:** One end-to-end support-ticket example showing host-visible placeholders vs enclave-resolved values
- **Our mitigation:** Fixtures ship with `{{profile.display_name}}` / `{{profile.email}}` and `redactForHost()`
