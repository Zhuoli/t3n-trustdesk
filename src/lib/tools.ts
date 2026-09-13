import { evaluateRefund } from "./policy.js";
import { newAuditId } from "./t3n.js";
import type {
  AgentDecision,
  AuditEntry,
  PolicyResult,
  SupportTicket,
  Tool,
  ToolContext,
} from "./types.js";

export function redactForHost(ticket: SupportTicket): SupportTicket {
  const looksPlaceholder = (s: string) => s.includes("{{profile.");
  return {
    ...ticket,
    memberLabel: looksPlaceholder(ticket.memberLabel)
      ? ticket.memberLabel
      : "[REDACTED_NAME]",
    contact: looksPlaceholder(ticket.contact)
      ? ticket.contact
      : "[REDACTED_CONTACT]",
  };
}

export const summarizeTicketTool: Tool<SupportTicket, string> = {
  name: "summarize_ticket",
  description:
    "Produce a short support summary. Prefer deterministic stub; optional LLM if OPENAI_API_KEY set.",
  async run(ticket) {
    if (process.env.OPENAI_API_KEY) {
      try {
        return await llmSummarize(ticket);
      } catch {
        // fall through to deterministic
      }
    }
    const preview = ticket.body.replace(/\s+/g, " ").slice(0, 140);
    return `Ticket ${ticket.ticketId}: member requests review of order ${ticket.orderId} ($${ticket.amountUsd} ${ticket.currency}). Reason: ${ticket.reason}. Body: ${preview}${ticket.body.length > 140 ? "…" : ""}`;
  },
};

async function llmSummarize(ticket: SupportTicket): Promise<string> {
  const base = process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1";
  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
  const res = await fetch(`${base}/chat/completions`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "Summarize the support ticket in 2 sentences for an agent that will decide refund eligibility. No PII restatement.",
        },
        {
          role: "user",
          content: JSON.stringify({
            ticketId: ticket.ticketId,
            orderId: ticket.orderId,
            amountUsd: ticket.amountUsd,
            reason: ticket.reason,
            body: ticket.body,
          }),
        },
      ],
    }),
  });
  if (!res.ok) throw new Error(`LLM ${res.status}`);
  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("empty LLM summary");
  return text;
}

export const applyPolicyTool: Tool<SupportTicket, PolicyResult> = {
  name: "apply_refund_policy",
  description: "Run deterministic TrustDesk refund policy v1.",
  async run(ticket) {
    return evaluateRefund(ticket);
  },
};

export const teeAuditTool: Tool<
  { ticket: SupportTicket; policy: PolicyResult },
  AuditEntry
> = {
  name: "tee_audit_log",
  description:
    "Stub/live TEE contract invoke that appends an audit trail entry and returns structured decision metadata.",
  async run({ ticket, policy }, ctx) {
    const entry: AuditEntry = {
      id: newAuditId(),
      at: new Date().toISOString(),
      action: "ticket.decide",
      ticketId: ticket.ticketId,
      decision: policy.decision,
      refundAmountUsd: policy.refundAmountUsd,
      contractTail: "trustdesk-audit",
      notes:
        ctx.mode === "stub"
          ? "stub TEE invoke — replace with tenant.contracts.register + executeAndDecode after SSO"
          : "live TEE path reserved — wire 03-tee-contract.ts",
    };
    ctx.auditLog.push(entry);
    return entry;
  },
};

export async function runTrustDeskAgent(
  ticket: SupportTicket,
  ctx: ToolContext,
): Promise<AgentDecision> {
  const hostSafe = redactForHost(ticket);
  const summary = await summarizeTicketTool.run(hostSafe, ctx);
  const policy = await applyPolicyTool.run(ticket, ctx);
  const audit = await teeAuditTool.run({ ticket: hostSafe, policy }, ctx);

  return {
    ticketId: ticket.ticketId,
    summary,
    policy,
    audit,
    agentDid: ctx.agentDid,
    mode: ctx.mode,
  };
}

export const TOOL_CATALOG = [
  summarizeTicketTool,
  applyPolicyTool,
  teeAuditTool,
].map((t) => ({ name: t.name, description: t.description }));
