import type { PolicyResult, SupportTicket } from "./types.js";

export const POLICY_VERSION = "trustdesk-refund-v1";

/**
 * Deterministic, testable refund rules — no network.
 * Designed so T3 can swap for a TEE contract later without changing the agent loop.
 */
export function evaluateRefund(ticket: SupportTicket): PolicyResult {
  const reasons: string[] = [];
  const purchased = Date.parse(ticket.purchasedAt);
  const ageDays = Number.isFinite(purchased)
    ? (Date.now() - purchased) / (1000 * 60 * 60 * 24)
    : Infinity;

  if (ticket.amountUsd <= 0) {
    return {
      decision: "deny",
      refundAmountUsd: 0,
      reasons: ["invalid_amount"],
      policyVersion: POLICY_VERSION,
    };
  }

  if (ticket.priorRefunds30d >= 2) {
    reasons.push("refund_abuse_window");
    return {
      decision: "escalate",
      refundAmountUsd: 0,
      reasons,
      policyVersion: POLICY_VERSION,
    };
  }

  if (ageDays > 30) {
    reasons.push("outside_30d_window");
    return {
      decision: "deny",
      refundAmountUsd: 0,
      reasons,
      policyVersion: POLICY_VERSION,
    };
  }

  const defective =
    /defective|broken|not as described|damaged|never arrived|not received/i.test(
      `${ticket.reason} ${ticket.body}`,
    );
  const changeOfMind = /change of mind|don't want|no longer need/i.test(
    `${ticket.reason} ${ticket.body}`,
  );

  if (defective && ageDays <= 14) {
    reasons.push("defective_within_14d");
    return {
      decision: "approve_full",
      refundAmountUsd: ticket.amountUsd,
      reasons,
      policyVersion: POLICY_VERSION,
    };
  }

  if (defective && ageDays <= 30) {
    const partial = Math.round(ticket.amountUsd * 0.5 * 100) / 100;
    reasons.push("defective_14_to_30d_partial");
    return {
      decision: "approve_partial",
      refundAmountUsd: partial,
      reasons,
      policyVersion: POLICY_VERSION,
    };
  }

  if (changeOfMind && ageDays <= 7 && ticket.amountUsd <= 50) {
    reasons.push("change_of_mind_low_value_7d");
    return {
      decision: "approve_full",
      refundAmountUsd: ticket.amountUsd,
      reasons,
      policyVersion: POLICY_VERSION,
    };
  }

  if (changeOfMind) {
    reasons.push("change_of_mind_not_eligible");
    return {
      decision: "deny",
      refundAmountUsd: 0,
      reasons,
      policyVersion: POLICY_VERSION,
    };
  }

  reasons.push("ambiguous_needs_human");
  return {
    decision: "escalate",
    refundAmountUsd: 0,
    reasons,
    policyVersion: POLICY_VERSION,
  };
}
