/** Support ticket input — PII fields use T3N placeholder markers in live mode. */
export interface SupportTicket {
  ticketId: string;
  /** Member display name or {{profile.display_name}} placeholder */
  memberLabel: string;
  /** Email or {{profile.email}} placeholder — never log raw in live path */
  contact: string;
  orderId: string;
  amountUsd: number;
  currency: string;
  purchasedAt: string;
  reason: string;
  body: string;
  priorRefunds30d: number;
}

export type RefundDecision =
  | "approve_full"
  | "approve_partial"
  | "deny"
  | "escalate";

export interface PolicyResult {
  decision: RefundDecision;
  refundAmountUsd: number;
  reasons: string[];
  policyVersion: string;
}

export interface AgentDecision {
  ticketId: string;
  summary: string;
  policy: PolicyResult;
  audit: AuditEntry;
  agentDid: string;
  mode: "stub" | "live";
}

export interface AuditEntry {
  id: string;
  at: string;
  action: "ticket.decide";
  ticketId: string;
  decision: RefundDecision;
  refundAmountUsd: number;
  contractTail: string;
  notes: string;
}

export interface ToolContext {
  agentDid: string;
  mode: "stub" | "live";
  auditLog: AuditEntry[];
}

export interface Tool<TIn, TOut> {
  name: string;
  description: string;
  run: (input: TIn, ctx: ToolContext) => Promise<TOut>;
}
