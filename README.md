# TrustDesk Agent (T3N ADK Build Challenge)

**Confidential support-ticket agent** for [Terminal 3 Network](https://terminal3.io/products/agent-developer-kit): verifiable `did:t3n` identity, member-delegated ticket review **without the host seeing raw PII**, and a minimal TEE-shaped audit trail that returns structured refund decisions.

| Field | Value |
|---|---|
| Contest | [T3N Agent Build Challenge](https://earn.superteam.fun/listing/t3n-agent-build-challenge/) · 290 USDC |
| Sponsor POC | [@wardumb](https://t.me/wardumb) on Telegram |
| Claim sandbox key | https://go.terminal3.io/adk-community |
| Quickstart docs | https://docs.terminal3.io/developers/adk/get-started/quickstart |
| Runtime | Node 20+ · TypeScript ESM · `tsx` |
| Default mode | **stub** (offline hello demo) → flip to **live** after SSO |

---

## Why this submission

Crowded field (~125). Differentiation is **ops hygiene**, not another chatbot:

1. **Useful** — enterprise refund desk with deterministic, testable policy.
2. **Maintainable** — plain TS modules + thin CLI; no Next/Vite WASM maze.
3. **Distributable / hostable** — one-command demo + `docs/HANDOVER.md` so Terminal 3 can run it.
4. **Docs-honest** — `docs/BUGS.md` captures ADK gaps (trustAnchor, etc.).

```
ticket JSON ──► summarize_ticket ──► apply_refund_policy ──► tee_audit_log ──► decision JSON
                     │                      │                      │
                     └──────── agent loop (src/lib/tools.ts) ──────┘
```

PII fields in fixtures use T3N-style `{{profile.*}}` placeholders so the host path never needs raw email/name.

---

## Quick start (offline — no API key)

```bash
cd t3n-trustdesk
npm install
cp .env.example .env          # TRUSTDESK_MODE=stub by default
npm run demo                  # hello: fixture → decision JSON
npm run smoke                 # auth → register → tee → demo
```

Expected: printed `AgentDecision` with `decision: "approve_full"` for the damaged-item fixture.

Deny-path fixture:

```bash
npx tsx src/04-run-ticket.ts fixtures/sample-ticket-deny.json
```

### Docker (optional)

```bash
docker compose run --rm trustdesk
```

---

## Live path (after morning SSO)

1. Claim key + DID at https://go.terminal3.io/adk-community (DID shown once — save it).
2. Put key in `.env`:

```bash
T3N_API_KEY=0x...
TRUSTDESK_MODE=live
```

3. Install optional SDK if not already present:

```bash
npm install @terminal3/t3n-sdk@5.2.0
```

4. Run:

```bash
npm run auth              # handshake + print did:t3n:…
npm run agent:register
npm run tee               # contract descriptor / invoke shape
npm run demo
```

If `handshake()` fails on missing `trustAnchor`, see **BUGS.md**. Local debug only: `T3N_UNSAFE_TRUST=1` (do **not** submit that path as the production story).

---

## Scripts

| Script | Purpose |
|---|---|
| `npm run auth` | Bootstrap session (stub DIDs or live handshake) |
| `npm run agent:register` | Write `.t3n-session.json` agent record |
| `npm run tee` | Minimal TEE contract stub / invoke demo |
| `npm run demo` | End-to-end ticket → decision |
| `npm run smoke` | CI-friendly chain |
| `npm run typecheck` | `tsc --noEmit` |

---

## Mapping to contest criteria

| Criterion (listing / sponsor language) | Where TrustDesk shows it |
|---|---|
| Try new ADK docs / build a trusted agent | `src/01-auth.ts` … `04-run-ticket.ts` mirror quickstart → first contract → agent run |
| Verifiable agent identity (`did:t3n`) | `bootstrapT3n()` + register script; stub DID offline, live DID after SSO |
| Useful agent | Refund eligibility for support tickets with clear policy version |
| Confidential / member-delegated | `{{profile.*}}` placeholders + `redactForHost()` |
| TEE / auditability | `03-tee-contract.ts` + `tee_audit_log` tool |
| Ease of maintenance | No framework lock-in; policy unit-testable in `src/lib/policy.ts` |
| Distribute / host | Prefer **hand to Terminal 3** — see `docs/HANDOVER.md` |
| Time-to-submit / polish | One-command `npm run demo`; honest `BUGS.md` |
| Eligibility Q3 (continue vs hand over) | **Hand over to Terminal 3 to run** (startup program only if keeping ownership) |

---

## Repo layout

```text
t3n-trustdesk/
├── README.md
├── AGENTS.md
├── package.json              # type:module
├── docker-compose.yml
├── .env.example
├── src/
│   ├── 01-auth.ts
│   ├── 02-register-agent.ts
│   ├── 03-tee-contract.ts
│   ├── 04-run-ticket.ts
│   └── lib/{t3n,policy,tools,types}.ts
├── fixtures/
├── docs/{HANDOVER,BUGS,SCREENSHOTS,GOOGLE_DOC}.md
└── scripts/smoke.sh
```

---

## Live verification status (2026-09-13 PT)

| Check | Status |
|---|---|
| SSO claim + DID prefix | Done — `did:t3n:9a2958b8d3…` (key in local `.env`, gitignored) |
| `TRUSTDESK_MODE=live npm run auth` | **Blocked** — SDK requires `trustAnchor` (`expected_peer_ids`, `rtmr3_allowlist`); exact error in `docs/BUGS.md` BUG-001 |
| `T3N_UNSAFE_TRUST=1` | **Not used** for submitted narrative |
| Stub `npm run demo` | Pass — redacted log in `docs/DEMO_LOG.md` |
| Google Doc DID fields | Updated with claim prefix + honest live-blocked note |

## Submission checklist

- [x] SSO claim → save DID + `T3N_API_KEY` (local only)
- [ ] Live `npm run auth` succeeds with published trust anchor (not unsafe) — waiting on BUG-001 docs fix
- [x] Claimed DID prefix recorded in Google Doc (`docs/GOOGLE_DOC.md` mirror)
- [x] Demo output captured → `docs/DEMO_LOG.md` (stub; replace when live auth works)
- [x] Public GitHub + Google Doc links on Superteam Earn
- [x] Eligibility: email · DID · **hand over to T3**

---

## License

MIT — built for Terminal 3 Network ADK community challenge.
