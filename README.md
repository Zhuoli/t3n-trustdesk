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

Crowded field. Differentiation is **ops hygiene**, not another chatbot:

1. **Useful** — enterprise refund desk with deterministic, testable policy.
2. **Maintainable** — plain TS modules + thin CLI; no Next/Vite WASM maze.
3. **Distributable / hostable** — one-command demo + `docs/HANDOVER.md` so Terminal 3 can run it.
4. **Docs-honest** — `docs/BUGS.md` captures ADK gaps (trustAnchor, etc.).

PII fields in fixtures use T3N-style `{{profile.*}}` placeholders so the host path never needs raw email/name.

## Quick start (offline — no API key)

```bash
cd t3n-trustdesk
npm install
cp .env.example .env
npm run demo
npm run smoke
```

Expected: printed `AgentDecision` with `decision: "approve_full"` for the damaged-item fixture.

## License

MIT — built for Terminal 3 Network ADK community challenge.
