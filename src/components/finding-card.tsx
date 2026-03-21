"use client";
import { useState } from "react";
import { ModuleResult, ProbeResult } from "@/lib/types";
import { GradeBadge } from "./grade-badge";
import { MODULE_OWASP_MAP } from "@/lib/owasp-mapping";

export function FindingCard({ result }: { result: ModuleResult }) {
  const [expanded, setExpanded] = useState(result.attacksSucceeded > 0);
  const owaspRefs = MODULE_OWASP_MAP[result.module] || [];
  const failures = result.probeResults.filter((r) => r.succeeded);
  const passes = result.probeResults.filter((r) => !r.succeeded);

  return (
    <section className="bg-white hairline-border rounded-sm overflow-hidden">
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <GradeBadge grade={result.grade} />
          <h3 className="text-sm font-bold text-charcoal">{result.label}</h3>
          {owaspRefs.map((ref) => (
            <span key={ref.id} className="text-[8px] uppercase font-bold tracking-wide px-1.5 py-0.5 bg-slate-100 text-on-surface-variant rounded-[2px]">
              {ref.id}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <span className={`text-[10px] font-bold uppercase tracking-widest ${result.attacksSucceeded > 0 ? "text-red-600" : "text-emerald-600"}`}>
            {result.attacksSucceeded > 0 ? `${result.attacksSucceeded} issue${result.attacksSucceeded > 1 ? "s" : ""} found` : "All passed"}
          </span>
          <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 18 }}>
            {expanded ? "expand_less" : "expand_more"}
          </span>
        </div>
      </div>

      {expanded && (
        <div className="border-t-[0.5px] border-hairline">
          {failures.map((pr, i) => (
            <FindingRow key={i} pr={pr} />
          ))}
          {passes.length > 0 && (
            <div className="px-4 py-2 bg-emerald-50/30">
              <span className="text-xs text-emerald-600 font-medium">{passes.length} check{passes.length > 1 ? "s" : ""} passed</span>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function FindingRow({ pr }: { pr: ProbeResult }) {
  const [detail, setDetail] = useState(false);
  const isStatic = pr.probe.attackPrompt === "(static analysis)";

  // Extract category from explanation like "[Secrets] API key in prompt"
  const categoryMatch = pr.explanation.match(/^\[([^\]]+)\]\s*/);
  const category = categoryMatch ? categoryMatch[1] : null;
  const title = categoryMatch ? pr.explanation.replace(categoryMatch[0], "") : pr.explanation;

  return (
    <div className="border-b-[0.5px] border-hairline last:border-b-0">
      {/* Summary row - always visible */}
      <div className="px-4 py-3 bg-red-50/20">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            <span className={`text-[8px] uppercase font-bold tracking-wide px-1.5 py-0.5 rounded-[2px] flex-shrink-0 mt-0.5 ${
              pr.severity === "critical" ? "bg-red-100 text-red-700" : pr.severity === "high" ? "bg-amber-100 text-amber-700" : pr.severity === "medium" ? "bg-yellow-100 text-yellow-700" : "bg-slate-100 text-on-surface-variant"
            }`}>
              {pr.severity}
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-charcoal">{title}</span>
                {category && (
                  <span className="text-[8px] uppercase font-bold tracking-wide px-1.5 py-0.5 bg-slate-100 text-on-surface-variant rounded-[2px]">{category}</span>
                )}
              </div>
              {/* One-line what was found */}
              {isStatic && (
                <div className="font-mono text-xs text-red-600 mt-1 truncate">{pr.response}</div>
              )}
              {/* Remediation summary - always visible */}
              <div className="flex items-start gap-1.5 text-xs text-on-surface-variant mt-1.5">
                <span className="material-symbols-outlined flex-shrink-0 text-charcoal" style={{ fontSize: 14 }}>lightbulb</span>
                <span>{pr.remediation}</span>
              </div>
            </div>
          </div>
          {/* Detail toggle */}
          <button
            onClick={(e) => { e.stopPropagation(); setDetail(!detail); }}
            className="flex-shrink-0 text-[9px] uppercase font-bold tracking-wide text-on-surface-variant hover:text-charcoal transition-colors flex items-center gap-1 mt-0.5"
          >
            {detail ? "Less" : "Detail"}
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>{detail ? "expand_less" : "expand_more"}</span>
          </button>
        </div>
      </div>

      {/* Detail panel - drill down */}
      {detail && (
        <div className="px-4 py-3 bg-slate-50/50 border-t-[0.5px] border-hairline space-y-3">
          {/* What was detected */}
          <div>
            <div className="text-[9px] uppercase font-bold tracking-wide text-on-surface-variant mb-1">What was detected</div>
            {isStatic ? (
              <div className="font-mono text-xs text-red-600 bg-red-50 rounded-sm px-3 py-2">{pr.response}</div>
            ) : (
              <p className="text-xs text-charcoal leading-relaxed">{pr.explanation}</p>
            )}
          </div>

          {/* Why it matters */}
          <div>
            <div className="text-[9px] uppercase font-bold tracking-wide text-on-surface-variant mb-1">Why it matters</div>
            <p className="text-xs text-on-surface-variant leading-relaxed">{getWhyItMatters(pr)}</p>
          </div>

          {/* Attack vector (for non-static) */}
          {!isStatic && (
            <div>
              <div className="text-[9px] uppercase font-bold tracking-wide text-on-surface-variant mb-1">Attack used</div>
              <div className="bg-charcoal rounded-sm px-3 py-2 font-mono text-xs text-emerald-400 overflow-x-auto">{pr.probe.attackPrompt}</div>
            </div>
          )}

          {/* Agent response (for non-static) */}
          {!isStatic && pr.response && (
            <div>
              <div className="text-[9px] uppercase font-bold tracking-wide text-on-surface-variant mb-1">Agent response</div>
              <div className="bg-white border-[0.5px] border-hairline rounded-sm px-3 py-2 font-mono text-xs text-on-surface-variant overflow-x-auto max-h-32 overflow-y-auto">{pr.response}</div>
            </div>
          )}

          {/* How to fix */}
          <div>
            <div className="text-[9px] uppercase font-bold tracking-wide text-on-surface-variant mb-1">How to fix</div>
            <div className="bg-emerald-50 border border-emerald-100 rounded-sm px-3 py-2">
              <p className="text-xs text-charcoal leading-relaxed">{pr.remediation}</p>
            </div>
          </div>

          {/* OWASP reference */}
          {pr.probe.owaspRef && (
            <div className="flex items-center gap-2">
              <span className="text-[9px] uppercase font-bold tracking-wide text-on-surface-variant">Reference:</span>
              <span className="text-[9px] uppercase font-bold tracking-wide px-1.5 py-0.5 bg-slate-100 text-on-surface-variant rounded-[2px]">{pr.probe.owaspRef}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function getWhyItMatters(pr: ProbeResult): string {
  const cat = pr.explanation.match(/^\[([^\]]+)\]/)?.[1] || "";
  const mattersMap: Record<string, string> = {
    "Secrets": "If an attacker extracts your system prompt (which is often trivial), they get these credentials. Hardcoded secrets in prompts are the AI equivalent of committing passwords to a public repo.",
    "Prompt Injection": "These patterns make your agent vulnerable to having its behavior overridden by malicious input. An attacker can embed instructions in emails, documents, or user messages that hijack the agent's goals.",
    "Confirmation Bypass": "Without confirmation steps, an attacker who compromises the agent can trigger destructive or sensitive actions immediately. Human-in-the-loop is your last line of defense.",
    "Destructive Commands": "If the agent can execute these commands, a prompt injection attack could trigger data loss, system compromise, or service disruption. Destructive operations should always be scoped and confirmed.",
    "External URLs": "URLs in your prompt can be extracted and tell attackers where your internal services live, or be used as exfiltration endpoints. They also reveal your infrastructure topology.",
    "Sensitive Files": "References to sensitive files tell attackers exactly where to look. If the agent has file access, these paths become direct targets for data theft.",
    "Unbounded Access": "Unrestricted access to files, networks, or commands means any prompt injection can escalate to full system compromise. The agent's permissions become the attacker's permissions.",
    "Disabled Controls": "Disabling security controls removes the safety nets that catch both accidental and malicious activity. These controls exist because incidents happen.",
    "Supply Chain": "These patterns introduce code or access from untrusted sources. An attacker can compromise the supply chain to gain persistent access to your systems.",
  };
  return mattersMap[cat] || "This pattern creates a security vulnerability that could be exploited by an attacker who can influence the agent's input.";
}
