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

const th = "py-4 px-5 text-[10px] font-bold uppercase tracking-[0.05em] text-on-surface-variant text-center border-r-[0.5px] border-hairline last:border-r-0";
const td = "py-5 px-5 text-center border-r-[0.5px] border-hairline last:border-r-0";

export function ScanTable({ scans }: { scans: ScanResult[] }) {
  return (
    <div className="w-full overflow-x-auto border border-hairline rounded-sm">
      <table className="w-full text-left border-collapse table-fixed">
        <thead>
          <tr className="border-b-[0.5px] border-hairline bg-surface">
            <th className={`${th} !text-left`} style={{ width: "20%" }}>Agent</th>
            <th className={th} style={{ width: "11.5%" }}>Mode</th>
            <th className={th} style={{ width: "11.5%" }}>Status</th>
            <th className={th} style={{ width: "11.5%" }}>Vulnerabilities</th>
            <th className={th} style={{ width: "11.5%" }}>Passed</th>
            <th className={th} style={{ width: "11.5%" }}>Total Tests</th>
            <th className={th} style={{ width: "11.5%" }}>Grade</th>
            <th className={`${th} !border-r-0`} style={{ width: "11%" }}>Results</th>
          </tr>
        </thead>
        <tbody className="divide-y-[0.5px] divide-hairline">
          {scans.map((scan) => {
            const isRunning = scan.status === "running";
            const vulnCount = scan.criticalFailures + scan.warnings;
            return (
              <tr key={scan.id} className="group hover:bg-surface-container-low transition-colors">
                <td className={`${td} !text-left`}>
                  <div className="flex items-center space-x-3">
                    <div className="w-7 h-7 rounded-sm bg-charcoal flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-white" style={{ fontSize: 14 }}>{modeIcons[scan.config.mode] || "smart_toy"}</span>
                    </div>
                    <span className="text-sm font-semibold text-charcoal truncate">{scan.config.name}</span>
                  </div>
                </td>
                <td className={td}>
                  <span className="text-xs text-on-surface-variant">{modeLabels[scan.config.mode] || scan.config.mode}</span>
                </td>
                <td className={td}>
                  {isRunning ? (
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        <span className="text-xs font-medium text-amber-600">{scan.progress}%</span>
                      </div>
                      <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${scan.progress}%` }} />
                      </div>
                    </div>
                  ) : scan.status === "complete" ? (
                    <span className="text-xs font-medium text-emerald-600">Complete</span>
                  ) : (
                    <span className="text-xs font-medium text-red-600">Failed</span>
                  )}
                </td>
                <td className={td}>
                  {vulnCount > 0 ? (
                    <span className="text-sm font-bold text-red-600">{vulnCount}</span>
                  ) : (
                    <span className="text-sm text-on-surface-variant">0</span>
                  )}
                </td>
                <td className={td}>
                  <span className="text-sm text-charcoal">{scan.passed}</span>
                </td>
                <td className={td}>
                  <span className="text-sm text-charcoal">{scan.totalTests}</span>
                </td>
                <td className={td}>
                  <div className="flex justify-center">
                    {isRunning ? (
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                        <span className="text-[10px] text-on-surface-variant">...</span>
                      </div>
                    ) : (
                      <GradeBadge grade={scan.overallGrade} />
                    )}
                  </div>
                </td>
                <td className={`${td} !border-r-0`}>
                  <Link href={isRunning ? `/scan/${scan.id}/progress` : `/scan/${scan.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-charcoal hairline-border rounded-sm hover:bg-charcoal hover:text-white transition-all whitespace-nowrap">
                    {isRunning ? "Progress" : "Results"}
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
