# TrustDesk — Google Doc mirror

Paste into a public Google Doc for Superteam submission. Keep this file in sync.

## One-liner
TrustDesk is a Terminal 3 ADK agent that reviews support tickets for refund eligibility under a verifiable `did:t3n` identity, keeps PII behind `{{profile.*}}` placeholders, and writes a TEE-shaped audit decision JSON — built to be hosted by Terminal 3.

## Architecture
See README diagram: summarize → policy → tee_audit → decision.

## How to run
```bash
npm install && npm run demo
```

Live path (after SSO): set `T3N_API_KEY` + `TRUSTDESK_MODE=live`, install `@terminal3/t3n-sdk@5.2.0`, then `npm run auth`. As of 2026-09-13, live bootstrap still requires a published `trustAnchor` (see `docs/BUGS.md` BUG-001). We do **not** submit `unsafe_trust_server` as the production story.

## DIDs
- Tenant DID (SSO claim prefix): `did:t3n:9a2958b8d3…`
- Agent DID: pending live handshake + `npm run agent:register` once trustAnchor is published; stub demo uses `did:t3n:4990ccd2…` offline
- Live handshake status: **blocked** on required `trustAnchor` (exact error in `docs/BUGS.md` / `docs/DEMO_LOG.md`)

## Handover preference
**Hand over to Terminal 3 to run.** Details in repo `docs/HANDOVER.md`.

## Bugs filed
See repo `docs/BUGS.md` (trustAnchor gap with live repro, env naming drift, …).

## Links
- Repo: https://github.com/Zhuoli/t3n-trustdesk
- Listing: https://earn.superteam.fun/listing/t3n-agent-build-challenge/
- Claim: https://go.terminal3.io/adk-community
