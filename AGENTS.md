# Agent notes (Codex / Claude / Cursor)

This repo is a **thin T3N ADK agent**, not a multi-agent swarm.

- Entry: `src/04-run-ticket.ts` → `runTrustDeskAgent` in `src/lib/tools.ts`
- Tools: `summarize_ticket`, `apply_refund_policy`, `tee_audit_log`
- Secrets: only `T3N_API_KEY` / optional `OPENAI_API_KEY` via `.env` — never commit
- Offline default: `TRUSTDESK_MODE=stub`
- Live SDK: `@terminal3/t3n-sdk@5.2.0` (optionalDependency)
- Docs hub: https://docs.terminal3.io/developers/adk/get-started/quickstart
- Prefer editing `policy.ts` for business rules; keep the agent loop boring

When filing ADK issues, append to `docs/BUGS.md` with repro + expected vs actual.
