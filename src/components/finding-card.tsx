"use client";
import { useState } from "react";
import { ModuleResult } from "@/lib/types";
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
            {result.attacksSucceeded > 0 ? `${result.attacksSucceeded} failed` : "All passed"}
          </span>
          <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 18 }}>
            {expanded ? "expand_less" : "expand_more"}
          </span>
        </div>
      </div>

      {expanded && (
        <div className="border-t-[0.5px] border-hairline">
          {/* Failures */}
          {failures.map((pr, i) => (
            <div key={i} className="px-4 py-3 border-b-[0.5px] border-hairline last:border-b-0 bg-red-50/30">
              <div className="flex items-start gap-2 mb-2">
                <span className={`text-[8px] uppercase font-bold tracking-wide px-1.5 py-0.5 rounded-[2px] flex-shrink-0 mt-0.5 ${
                  pr.severity === "critical" ? "bg-red-100 text-red-700" : pr.severity === "high" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-on-surface-variant"
                }`}>
                  {pr.severity}
                </span>
                <span className="text-sm font-semibold text-charcoal">{pr.explanation}</span>
              </div>

              {pr.probe.attackPrompt !== "(static analysis)" && (
                <div className="ml-[42px] mb-2">
                  <div className="text-[9px] uppercase font-bold tracking-wide text-on-surface-variant mb-1">Attack</div>
                  <div className="bg-charcoal rounded-sm px-3 py-2 font-mono text-xs text-emerald-400 overflow-x-auto">{pr.probe.attackPrompt}</div>
                </div>
              )}

              {pr.response && pr.response !== `Found: ${pr.response.replace("Found: ", "")}` && pr.probe.attackPrompt !== "(static analysis)" && (
                <div className="ml-[42px] mb-2">
                  <div className="text-[9px] uppercase font-bold tracking-wide text-on-surface-variant mb-1">Response</div>
                  <div className="bg-white border-[0.5px] border-hairline rounded-sm px-3 py-2 font-mono text-xs text-on-surface-variant overflow-x-auto max-h-24 overflow-y-auto">{pr.response}</div>
                </div>
              )}

              {pr.probe.attackPrompt === "(static analysis)" && (
                <div className="ml-[42px] mb-2">
                  <div className="font-mono text-xs text-red-600 bg-red-50 rounded-sm px-3 py-1.5 inline-block">{pr.response}</div>
                </div>
              )}

              <div className="ml-[42px]">
                <div className="flex items-start gap-1.5 text-xs text-on-surface-variant">
                  <span className="material-symbols-outlined flex-shrink-0" style={{ fontSize: 14 }}>lightbulb</span>
                  <span>{pr.remediation}</span>
                </div>
              </div>
            </div>
          ))}

          {/* Passes summary */}
          {passes.length > 0 && (
            <div className="px-4 py-2 bg-emerald-50/30">
              <span className="text-xs text-emerald-600 font-medium">{passes.length} probe{passes.length > 1 ? "s" : ""} passed</span>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
