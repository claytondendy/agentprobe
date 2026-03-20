"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

const sidebarItems = [
  { href: "#", icon: "dashboard", label: "Overview" },
  { href: "#", icon: "security", label: "Live Feed", active: true },
  { href: "#", icon: "history_edu", label: "Audit Rail" },
  { href: "#", icon: "assessment", label: "Reports" },
  { href: "#", icon: "verified_user", label: "Security Settings" },
];

export function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col py-6 gap-2 h-[calc(100vh-4rem)] w-64 border-r-[0.5px] border-hairline bg-surface sticky top-16">
      <div className="px-6 mb-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Active Scan</span>
        </div>
        <p className="text-xs font-semibold text-charcoal">AgentProbe v1.0</p>
      </div>
      <nav className="flex flex-col px-3 gap-1">
        {sidebarItems.map((item) => (
          <span
            key={item.label}
            className={
              item.active
                ? "bg-white text-charcoal shadow-sm border-[0.5px] border-hairline rounded-md px-4 py-2 flex items-center gap-3"
                : "text-slate-500 px-4 py-2 hover:bg-slate-100 transition-all rounded-md flex items-center gap-3 cursor-pointer"
            }
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="text-sm font-medium">{item.label}</span>
          </span>
        ))}
      </nav>
    </aside>
  );
}
