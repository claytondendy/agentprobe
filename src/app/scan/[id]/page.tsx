"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Sidebar } from "@/components/sidebar";
import { GradeBadge } from "@/components/grade-badge";
import { FindingCard } from "@/components/finding-card";
import { ScanResult } from "@/lib/types";

export default function ScanResultsPage() {
  const { id } = useParams<{ id: string }>();
  const [scan, setScan] = useState<ScanResult | null>(null);

  useEffect(() => {
    const poll = async () => {
      const res = await fetch(`/api/scan/${id}`);
      if (res.ok) {
        const data = await res.json();
        setScan(data);
        if (data.status === "running") {
          setTimeout(poll, 2000);
        }
      }
    };
    poll();
  }, [id]);

  if (!scan) {
    return (
      <>
        <Nav />
        <div className="flex pt-16 min-h-screen items-center justify-center">
          <p className="text-on-surface-variant">Loading scan results...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Nav />
      <div className="flex pt-16">
        <Sidebar />
        <main className="flex-1 bg-surface min-h-screen px-8 py-16 md:px-16 lg:px-24">
          <header className="mb-16 max-w-5xl">
            <div className="flex items-center gap-8">
              <GradeBadge grade={scan.overallGrade} size="lg" />
              <div>
                <h1 className="text-4xl font-extrabold text-charcoal tracking-tighter mb-2 font-headline">
                  {scan.config.name}
                </h1>
                <div className="flex flex-wrap gap-4 items-center">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{scan.totalTests} tests run</span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">{scan.passed} passed</span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500">{scan.warnings} warnings</span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-red-600">{scan.criticalFailures} critical failures</span>
                </div>
              </div>
            </div>
          </header>

          <div className="max-w-5xl flex flex-col gap-4">
            {scan.moduleResults.map((result) => (
              <FindingCard key={result.module} result={result} />
            ))}
          </div>

          <footer className="mt-24 max-w-5xl flex justify-end items-center gap-4">
            <Link href="/scan/new"
              className="px-10 py-2.5 bg-charcoal text-white text-xs font-bold rounded-sm hover:opacity-90 active:scale-95 transition-all uppercase tracking-[0.15em] flex items-center gap-2">
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
              New Scan
            </Link>
          </footer>
        </main>
      </div>
      <Footer />
    </>
  );
}
