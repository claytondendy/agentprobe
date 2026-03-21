import Link from "next/link";
import { ScanResult, ScanMode } from "@/lib/types";
import { GradeBadge } from "./grade-badge";

const modeLabels: Record<ScanMode, string> = {
  prompt: "Agent Scanner",
  skill: "Skill Scanner",
  mcp: "MCP Scanner",
  redteam: "Live Red Team",
};

const modeIcons: Record<ScanMode, string> = {
  prompt: "terminal",
  skill: "auto_fix_high",
  mcp: "hub",
  redteam: "security",
};

export function ScanTable({ scans }: { scans: ScanResult[] }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b-[0.5px] border-hairline">
            <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Agent</th>
            <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Mode</th>
            <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Status</th>
            <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Vulnerabilities</th>
            <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Passed</th>
            <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Total Tests</th>
            <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Grade</th>
            <th className="py-4 px-6"></th>
          </tr>
        </thead>
        <tbody className="divide-y-[0.5px] divide-hairline">
          {scans.map((scan) => {
            const isRunning = scan.status === "running";
            const vulnCount = scan.criticalFailures + scan.warnings;
            return (
              <tr key={scan.id} className="group hover:bg-surface-container-low transition-colors">
                <td className="py-6 px-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-sm bg-charcoal flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-white" style={{ fontSize: 16 }}>{modeIcons[scan.config.mode] || "smart_toy"}</span>
                    </div>
                    <span className="text-sm font-semibold text-charcoal">{scan.config.name}</span>
                  </div>
                </td>
                <td className="py-6 px-6 text-xs text-on-surface-variant">{modeLabels[scan.config.mode] || scan.config.mode}</td>
                <td className="py-6 px-6">
                  {isRunning ? (
                    <div>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        <span className="text-xs font-medium text-amber-600">{scan.progress}%</span>
                      </div>
                      <div className="w-20 h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${scan.progress}%` }} />
                      </div>
                    </div>
                  ) : scan.status === "complete" ? (
                    <span className="text-xs font-medium text-emerald-600">Complete</span>
                  ) : (
                    <span className="text-xs font-medium text-red-600">Failed</span>
                  )}
                </td>
                <td className="py-6 px-6">
                  {vulnCount > 0 ? (
                    <span className="text-xs font-bold text-red-600">{vulnCount}</span>
                  ) : isRunning ? (
                    <span className="text-xs text-on-surface-variant">0</span>
                  ) : (
                    <span className="text-xs font-medium text-emerald-600">0</span>
                  )}
                </td>
                <td className="py-6 px-6">
                  <span className="text-xs text-charcoal">{scan.passed}</span>
                </td>
                <td className="py-6 px-6">
                  <span className="text-xs text-charcoal">{scan.totalTests}</span>
                </td>
                <td className="py-6 px-6">
                  {isRunning ? (
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                      <span className="text-[10px] text-on-surface-variant">...</span>
                    </div>
                  ) : (
                    <GradeBadge grade={scan.overallGrade} />
                  )}
                </td>
                <td className="py-6 px-6 text-right">
                  <Link href={isRunning ? `/scan/${scan.id}/progress` : `/scan/${scan.id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-charcoal hairline-border rounded-sm hover:bg-charcoal hover:text-white transition-all whitespace-nowrap">
                    {isRunning ? "View Progress" : "View Results"}
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_forward</span>
                  </Link>
                </td>
              </tr>
            );
          })}
          {scans.length === 0 && (
            <tr>
              <td colSpan={8} className="py-12 text-center text-on-surface-variant text-sm">
                No scans yet. Start your first scan to see results here.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
