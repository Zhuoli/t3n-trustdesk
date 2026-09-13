# TrustDesk — Google Doc mirror

Paste into a public Google Doc for Superteam submission. Keep this file in sync.

## One-liner
TrustDesk is a Terminal 3 ADK agent that reviews support tickets for refund eligibility under a verifiable `did:t3n` identity, keeps PII behind `{{profile.*}}` placeholders, and writes a TEE-shaped audit decision JSON — built to be hosted by Terminal 3.

## How to run
```bash
npm install && npm run demo
```

## DIDs (fill after SSO)
- Tenant DID: `did:t3n:________`
- Agent DID: `did:t3n:________`

## Handover preference
**Hand over to Terminal 3 to run.** Details in repo `docs/HANDOVER.md`.

## Bugs filed
See repo `docs/BUGS.md` (trustAnchor gap, env naming drift, …).

## Links
- Repo: https://github.com/Zhuoli/t3n-trustdesk
- Listing: https://earn.superteam.fun/listing/t3n-agent-build-challenge/
- Claim: https://go.terminal3.io/adk-community
