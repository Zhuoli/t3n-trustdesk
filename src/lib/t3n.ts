import "dotenv/config";
import { randomBytes } from "node:crypto";

export type TrustDeskMode = "stub" | "live";

export interface T3nSession {
  mode: TrustDeskMode;
  tenantDid: string;
  agentDid: string;
  address: string;
  creditsHint: string;
}

function hexDid(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const base = h.toString(16).padStart(8, "0");
  return `did:t3n:${(base + "a1b2c3d4e5f60718293a4b5c6d7e8f901234").slice(0, 40)}`;
}

export function resolveMode(): TrustDeskMode {
  const forced = process.env.TRUSTDESK_MODE?.toLowerCase();
  if (forced === "stub" || forced === "live") return forced;
  return process.env.T3N_API_KEY ? "live" : "stub";
}

export async function bootstrapT3n(): Promise<T3nSession> {
  const mode = resolveMode();

  if (mode === "live") {
    return bootstrapLive();
  }

  const tenantDid = hexDid("trustdesk-tenant-stub");
  const agentDid = hexDid("trustdesk-agent-stub");
  return {
    mode: "stub",
    tenantDid,
    agentDid,
    address: "0xSTUB000000000000000000000000000000000001",
    creditsHint: "stub — set T3N_API_KEY + TRUSTDESK_MODE=live after SSO claim",
  };
}

async function bootstrapLive(): Promise<T3nSession> {
  const key = process.env.T3N_API_KEY;
  if (!key) {
    throw new Error("TRUSTDESK_MODE=live requires T3N_API_KEY");
  }

  try {
    const sdk = await import("@terminal3/t3n-sdk");
    const {
      T3nClient,
      setEnvironment,
      loadWasmComponent,
      eth_get_address,
      metamask_sign,
      createEthAuthInput,
    } = sdk as Record<string, any>;

    setEnvironment("testnet");
    const wasmComponent = await loadWasmComponent();
    const address = eth_get_address(key);
    const t3n = new T3nClient({
      wasmComponent,
      handlers: { EthSign: metamask_sign(address, undefined, key) },
      ...(process.env.T3N_UNSAFE_TRUST === "1"
        ? { unsafe_trust_server: true }
        : {}),
    });

    await t3n.handshake();
    const did = await t3n.authenticate(createEthAuthInput(address));
    const tenantDid = String(did?.value ?? did);

    return {
      mode: "live",
      tenantDid,
      agentDid: tenantDid,
      address,
      creditsHint: "live session — check getUsage() for balance",
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(
      `Live T3N bootstrap failed (${msg}). Run with TRUSTDESK_MODE=stub for offline demo, or fix SSO key / trustAnchor. See docs/BUGS.md.`,
    );
  }
}

export function newAuditId(): string {
  return `aud_${randomBytes(8).toString("hex")}`;
}
