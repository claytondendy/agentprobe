import Link from "next/link";
import { ScanResult } from "@/lib/types";
import { GradeBadge } from "./grade-badge";

export function ScanTable({ scans }: { scans: ScanResult[] }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b-[0.5px] border-hairline">
            <th className="py-4 text-[10px] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Agent Identity</th>
            <th className="py-4 text-[10px] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Mode</th>
            <th className="py-4 text-[10px] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Status</th>
            <th className="py-4 text-[10px] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Grade</th>
            <th className="py-4 text-right text-[10px] font-bold uppercase tracking-[0.05em] text-on-surface-variant">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y-[0.5px] divide-hairline">
          {scans.map((scan) => (
            <tr key={scan.id} className="group hover:bg-surface-container-low transition-colors">
              <td className="py-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-sm bg-charcoal flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-xs">smart_toy</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-charcoal">{scan.config.name}</div>
                    <div className="text-[10px] text-on-surface-variant">{scan.config.mode} scan</div>
                  </div>
                </div>
              </td>
              <td className="py-6 text-xs text-on-surface-variant capitalize">{scan.config.mode}</td>
              <td className="py-6 text-xs text-on-surface-variant capitalize">{scan.status}</td>
              <td className="py-6"><GradeBadge grade={scan.overallGrade} /></td>
              <td className="py-6 text-right">
                <Link href={`/scan/${scan.id}`} className="text-xs font-bold text-charcoal hover:underline">
                  View
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
