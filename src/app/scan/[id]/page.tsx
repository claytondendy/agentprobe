"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { GradeBadge } from "@/components/grade-badge";
import { FindingCard } from "@/components/finding-card";
import { ScanResult } from "@/lib/types";

export default function ScanResultsPage() {
  const { id } = useParams<{ id: string }>();
  const [scan, setScan] = useState<ScanResult | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const poll = async () => {
      const res = await fetch(`/api/scan/${id}`);
      if (!res.ok) {
        setNotFound(true);
        return;
      }
      const data = await res.json();
      setScan(data);
      if (data.status === "running") {
        setTimeout(poll, 2000);
      }
    };
    poll();
  }, [id]);

  if (notFound) {
    return (
      <>
        <Nav />
        <div className="flex pt-16 min-h-screen items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 48 }}>search_off</span>
            <p className="text-sm text-on-surface-variant">Scan not found. It may have expired after a server restart.</p>
            <Link href="/scan/new" className="px-6 py-2.5 bg-charcoal text-white text-xs font-bold rounded-sm uppercase tracking-widest">
              New Scan
            </Link>
          </div>
        </div>
      </>
    );
  }

  if (!scan) {
    return (
      <>
        <Nav />
        <div className="flex pt-16 min-h-screen items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-hairline border-t-charcoal rounded-full animate-spin" />
            <p className="text-sm text-on-surface-variant">Loading results...</p>
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
      <main className="pt-16 min-h-screen">
        <section className="px-8 pt-24 pb-32 max-w-4xl mx-auto">
          <header className="mb-8">
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

          <div className="flex flex-col gap-2">
            {scan.moduleResults.map((result) => (
              <FindingCard key={result.module} result={result} />
            ))}
          </div>

          <footer className="mt-12 flex justify-end items-center gap-4">
            <Link href="/scan/new"
              className="px-10 py-2.5 bg-charcoal text-white text-xs font-bold rounded-sm hover:opacity-90 active:scale-95 transition-all uppercase tracking-[0.15em] flex items-center gap-2">
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
              New Scan
            </Link>
          </footer>
        </section>
      </main>
      <Footer />
    </>
  );
}
