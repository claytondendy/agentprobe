"use client";
import { useState } from "react";
import { ModuleResult } from "@/lib/types";
import { GradeBadge } from "./grade-badge";
import { MODULE_OWASP_MAP } from "@/lib/owasp-mapping";

export function FindingCard({ result }: { result: ModuleResult }) {
  const [expanded, setExpanded] = useState(false);
  const owaspRefs = MODULE_OWASP_MAP[result.module] || [];

  return (
    <section className="bg-white hairline-border rounded-sm overflow-hidden transition-all">
      <div
        className="flex items-center justify-between p-6 cursor-pointer hover:bg-slate-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-6">
          <GradeBadge grade={result.grade} />
          <h3 className="text-lg font-bold text-charcoal tracking-tight">{result.label}</h3>
          {owaspRefs.map((ref) => (
            <span key={ref.id} className="text-[9px] uppercase font-bold tracking-[0.1em] px-2 py-0.5 bg-slate-100 text-on-surface-variant rounded-[2px]">
              {ref.id}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-8">
          <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
            {result.attacksSucceeded}/{result.totalAttacks} attacks succeeded
          </span>
          <span className="material-symbols-outlined text-charcoal">
            {expanded ? "expand_less" : "expand_more"}
          </span>
        </div>
      </div>
      {expanded && (
        <div className="px-8 pb-10 border-t-[0.5px] border-hairline pt-8 space-y-8">
          {result.probeResults.filter((r) => r.succeeded).map((pr, i) => (
            <div key={i}>
              <div className="flex items-start gap-3 mb-6">
                <span className="bg-red-50 text-red-600 text-[9px] uppercase font-bold tracking-[0.1em] px-2 py-0.5 border border-red-100 rounded-[2px]">
                  {pr.severity}
                </span>
                <h4 className="text-xl font-bold text-charcoal tracking-tight">{pr.explanation}</h4>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="space-y-3">
                  <p className="text-[9px] uppercase font-bold tracking-[0.1em] text-on-surface-variant">Attack Vector</p>
                  <div className="bg-charcoal rounded-sm p-5 font-mono text-sm text-emerald-400 leading-relaxed overflow-x-auto">
                    {pr.probe.attackPrompt}
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-[9px] uppercase font-bold tracking-[0.1em] text-on-surface-variant">Agent Response</p>
                  <div className="bg-slate-50 border-[0.5px] border-hairline rounded-sm p-5 font-mono text-sm text-on-surface-variant leading-relaxed">
                    {pr.response}
                  </div>
                </div>
              </div>
              <div className="bg-slate-50/50 p-6 rounded-sm border-l-2 border-red-500 border-t-[0.5px] border-r-[0.5px] border-b-[0.5px] border-hairline">
                <h5 className="text-[10px] font-bold text-charcoal uppercase tracking-widest mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">lightbulb</span>
                  Remediation
                </h5>
                <p className="text-sm text-on-surface-variant leading-relaxed">{pr.remediation}</p>
              </div>
            </div>
          ))}
          {result.probeResults.filter((r) => !r.succeeded).length > 0 && (
            <p className="text-sm text-emerald-600 font-medium">
              {result.probeResults.filter((r) => !r.succeeded).length} probe(s) passed successfully.
            </p>
          )}
        </div>
      )}
    </section>
  );
}
