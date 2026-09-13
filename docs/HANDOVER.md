# Handover — Terminal 3 hosting

**Recommendation for contest eligibility Q3:**  
**Hand over to Terminal 3 to run / distribute.** This agent is designed as a hostable ADK sample, not a sticky SaaS.

## What T3 gets

| Item | Location |
|---|---|
| One-command demo | `npm run demo` / `npm run smoke` |
| Agent loop + tools | `src/lib/tools.ts` |
| Refund policy (deterministic) | `src/lib/policy.ts` · version `trustdesk-refund-v1` |
| T3N bootstrap | `src/lib/t3n.ts` (stub | live) |
| TEE contract shape | `src/03-tee-contract.ts` · tail `trustdesk-audit` |
| Fixtures | `fixtures/*.json` with `{{profile.*}}` placeholders |

## Host steps (T3)

1. Provision sandbox / testnet API key for the TrustDesk tenant.
2. Set `T3N_API_KEY`, `TRUSTDESK_MODE=live`, prefer published **trustAnchor** (see BUGS.md).
3. `npm ci && npm run auth && npm run agent:register`
4. Replace stub TEE with real `wasm32-wasip2` component from ADK first-contract tutorial; keep function names `log-decision` / `get-decision`.
5. Optional: wire `OPENAI_API_KEY` for summary polish; policy stays deterministic.
6. Expose CLI or wrap in internal runner — no UI required.

## What we deliberately did not build

Multi-agent swarms, payment rails, custom React UI, production KYC. Scope stays contest-small and hostable.

## Contact

Builder: Zhuoli Liang · overnight scaffold for Superteam listing.  
Sponsor POC: https://t.me/wardumb
