"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { ScanTable } from "@/components/scan-table";
import { ScanResult } from "@/lib/types";

const modeCards = [
  { num: "01", icon: "terminal", title: "Prompt Scanner", desc: "Proactive sanitization of system prompts and user inputs to mitigate jailbreak attempts.", cta: "Configure Engine", href: "/scan/new?mode=prompt" },
  { num: "02", icon: "security", title: "Live Red Team", desc: "Automated adversarial attacks simulating advanced persistent threats against live agents.", cta: "Deploy Agents", href: "/scan/new?mode=redteam" },
  { num: "03", icon: "hub", title: "MCP Audit", desc: "Deep inspection of Model Context Protocol endpoints and resource permission escalation.", cta: "Inspect Registry", href: "/scan/new?mode=mcp" },
];

export default function Dashboard() {
  const [scans, setScans] = useState<ScanResult[]>([]);

  useEffect(() => {
    fetch("/api/scan").then((r) => r.json()).then(setScans).catch(() => {});
  }, []);

  return (
    <>
      <Nav />
      <main className="pt-16 min-h-screen">
        <section className="px-8 pt-24 pb-32 max-w-7xl mx-auto flex flex-col md:flex-row items-end justify-between gap-12">
          <div className="max-w-2xl">
            <h1 className="font-headline text-5xl md:text-6xl font-extrabold tracking-tighter text-charcoal leading-[1.05]">
              Secure your AI agents .
            </h1>
            <p className="mt-8 text-lg text-on-surface-variant leading-relaxed font-light max-w-lg">
              Autonomous security probing for LLM-powered workflows. Detecting prompt injections, data leaks, and MCP vulnerabilities in milliseconds.
            </p>
          </div>
        </section>

        <section className="px-8 max-w-7xl mx-auto mb-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {modeCards.map((card) => (
              <Link key={card.num} href={card.href} className="group relative p-8 bg-transparent hairline-border rounded-sm hover:bg-charcoal transition-all duration-300 cursor-pointer overflow-hidden">
                <div className="flex justify-between items-start mb-12">
                  <span className="material-symbols-outlined text-charcoal group-hover:text-white transition-colors" style={{ fontSize: 32 }}>{card.icon}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant group-hover:text-slate-400">{card.num}</span>
                </div>
                <h3 className="font-headline text-xl font-bold text-charcoal group-hover:text-white mb-2 transition-colors">{card.title}</h3>
                <p className="text-sm text-on-surface-variant group-hover:text-slate-300 transition-colors leading-relaxed">{card.desc}</p>
                <div className="mt-8 flex items-center space-x-2 text-charcoal group-hover:text-white transition-colors">
                  <span className="text-xs font-bold uppercase tracking-tighter">{card.cta}</span>
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="px-8 max-w-7xl mx-auto pb-32">
          <div className="flex items-center justify-between mb-12">
            <h2 className="font-headline text-2xl font-bold text-charcoal tracking-tighter">Recent Scans</h2>
          </div>
          <ScanTable scans={scans} />
        </section>
      </main>
      <Footer />
    </>
  );
}
