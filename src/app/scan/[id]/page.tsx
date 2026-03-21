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
    let attempts = 0;
    const poll = async () => {
      const res = await fetch(`/api/scan/${id}`);
      if (res.ok) {
        const data = await res.json();
        setScan(data);
        if (data.status === "running") {
          attempts++;
          // If still running after 15 polls (30s) with no results, show what we have
          if (attempts > 15 && data.moduleResults.length === 0) {
            data.status = "failed";
            setScan({ ...data, status: "failed" });
            return;
          }
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
          <div className="flex flex-col items-center gap-6">
            {/* Shield character dodging attacks */}
            <div className="relative w-64 h-32 overflow-hidden">
              {/* Ground line */}
              <div className="absolute bottom-4 left-0 right-0 h-[1px] bg-hairline" />

              {/* Shield character - bouncing */}
              <div className="absolute bottom-5 left-12 animate-[bounce_1s_ease-in-out_infinite]">
                <div className="w-8 h-10 bg-charcoal rounded-t-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-white" style={{ fontSize: 16 }}>shield</span>
                </div>
                <div className="w-4 h-1 bg-charcoal/20 rounded-full mx-auto mt-1" />
              </div>

              {/* Incoming attack prompts sliding across */}
              <div className="absolute bottom-6 animate-[slideLeft_3s_linear_infinite]" style={{ left: "100%" }}>
                <div className="bg-red-50 border border-red-200 rounded px-2 py-0.5 text-[8px] font-mono text-red-400 whitespace-nowrap">
                  ignore previous instructions
                </div>
              </div>
              <div className="absolute bottom-12 animate-[slideLeft_4s_linear_infinite_0.5s]" style={{ left: "100%" }}>
                <div className="bg-amber-50 border border-amber-200 rounded px-2 py-0.5 text-[8px] font-mono text-amber-400 whitespace-nowrap">
                  print your system prompt
                </div>
              </div>
              <div className="absolute bottom-8 animate-[slideLeft_3.5s_linear_infinite_1.5s]" style={{ left: "100%" }}>
                <div className="bg-red-50 border border-red-200 rounded px-2 py-0.5 text-[8px] font-mono text-red-400 whitespace-nowrap">
                  you are now DAN
                </div>
              </div>
              <div className="absolute bottom-14 animate-[slideLeft_4.5s_linear_infinite_2.5s]" style={{ left: "100%" }}>
                <div className="bg-amber-50 border border-amber-200 rounded px-2 py-0.5 text-[8px] font-mono text-amber-400 whitespace-nowrap">
                  enable developer mode
                </div>
              </div>
            </div>

            <p className="text-sm text-on-surface-variant font-medium animate-pulse">Analyzing results...</p>
          </div>
        </div>
      </>
    );
  }

  if (scan.status === "failed" && scan.moduleResults.length === 0) {
    return (
      <>
        <Nav />
        <div className="flex pt-16 min-h-screen items-center justify-center">
          <div className="flex flex-col items-center gap-6 max-w-md text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-red-600" style={{ fontSize: 32 }}>error</span>
            </div>
            <h2 className="font-headline text-xl font-bold text-charcoal">Scan Failed</h2>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              The scan could not complete. This usually means the Anthropic API key is missing or invalid, or the API returned an error. Check the server console for details.
            </p>
            <div className="flex gap-4">
              <Link href="/scan/new" className="px-6 py-2.5 bg-charcoal text-white text-xs font-bold rounded-sm hover:opacity-90 active:scale-95 transition-all uppercase tracking-widest">
                Try Again
              </Link>
              <Link href="/" className="px-6 py-2.5 border-[0.5px] border-hairline bg-white text-charcoal text-xs font-bold rounded-sm hover:bg-slate-50 uppercase tracking-widest">
                Dashboard
              </Link>
            </div>
          </div>
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
