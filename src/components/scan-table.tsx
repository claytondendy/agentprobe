import Link from "next/link";
import { ScanResult } from "@/lib/types";
import { GradeBadge } from "./grade-badge";

export function ScanTable({ scans }: { scans: ScanResult[] }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b-[0.5px] border-hairline">
            <th className="py-4 pr-8 text-[10px] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Agent Identity</th>
            <th className="py-4 pr-8 text-[10px] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Mode</th>
            <th className="py-4 pr-8 text-[10px] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Status</th>
            <th className="py-4 pr-8 text-[10px] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Grade</th>
            <th className="py-4 pl-8 text-right text-[10px] font-bold uppercase tracking-[0.05em] text-on-surface-variant"></th>
          </tr>
        </thead>
        <tbody className="divide-y-[0.5px] divide-hairline">
          {scans.map((scan) => (
            <tr key={scan.id} className="group hover:bg-surface-container-low transition-colors">
              <td className="py-6 pr-8">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-sm bg-charcoal flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-white text-xs">smart_toy</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-charcoal">{scan.config.name}</div>
                    <div className="text-[10px] text-on-surface-variant">{scan.config.mode} scan</div>
                  </div>
                </div>
              </td>
              <td className="py-6 pr-8 text-xs text-on-surface-variant capitalize">{scan.config.mode}</td>
              <td className="py-6 pr-8">
                <span className={`text-xs font-medium capitalize ${scan.status === "complete" ? "text-emerald-600" : scan.status === "running" ? "text-amber-600" : "text-red-600"}`}>
                  {scan.status}
                </span>
              </td>
              <td className="py-6 pr-8"><GradeBadge grade={scan.overallGrade} /></td>
              <td className="py-6 pl-8 text-right">
                <Link href={`/scan/${scan.id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-charcoal hairline-border rounded-sm hover:bg-charcoal hover:text-white transition-all">
                  View Results
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_forward</span>
                </Link>
              </td>
            </tr>
          ))}
          {scans.length === 0 && (
            <tr>
              <td colSpan={5} className="py-12 text-center text-on-surface-variant text-sm">
                No scans yet. Start your first scan to see results here.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
