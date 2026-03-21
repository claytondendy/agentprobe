"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

interface ProbeEvent {
  type: string;
  message: string;
  progress: number;
  probeResult?: {
    succeeded: boolean;
    probe: { name: string; module: string; owaspRef?: string };
    severity: string;
  };
  moduleResult?: {
    label: string;
    grade: string;
    attacksSucceeded: number;
    totalAttacks: number;
  };
}

export default function ScanProgressPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [currentProbe, setCurrentProbe] = useState("Initializing scan engine...");
  const [events, setEvents] = useState<ProbeEvent[]>([]);
  const [probesRun, setProbesRun] = useState(0);
  const [passed, setPassed] = useState(0);
  const [failed, setFailed] = useState(0);

  useEffect(() => {
    const eventSource = new EventSource(`/api/scan/${id}/stream`);
    eventSource.onmessage = (event) => {
      if (event.data === "[DONE]") {
        eventSource.close();
        setCurrentProbe("Scan complete. Loading report...");
        setProgress(100);
        // Pre-fetch results, then navigate
        const waitForResults = async () => {
          for (let i = 0; i < 10; i++) {
            const res = await fetch(`/api/scan/${id}`);
            if (res.ok) {
              const data = await res.json();
              if (data.status !== "running") {
                router.replace(`/scan/${id}`);
                return;
              }
            }
            await new Promise((r) => setTimeout(r, 500));
          }
          router.replace(`/scan/${id}`);
        };
        waitForResults();
        return;
      }
      try {
        const data: ProbeEvent = JSON.parse(event.data);
        if (data.type === "error") {
          setCurrentProbe(`Error: ${data.message}`);
          eventSource.close();
          setTimeout(() => router.replace(`/scan/${id}`), 3000);
          return;
        }
        setProgress(data.progress || 0);
        setEvents((prev) => [...prev, data]);

        if (data.type === "probe-start") {
          setCurrentProbe(data.message);
        }
        if (data.type === "probe-complete") {
          setProbesRun((p) => p + 1);
          if (data.probeResult?.succeeded) setFailed((f) => f + 1);
          else setPassed((p) => p + 1);
          setCurrentProbe(data.message);
        }
        if (data.type === "module-complete") {
          setCurrentProbe(data.message);
        }
        if (data.type === "scan-complete") {
          setCurrentProbe("Scan complete. Loading results...");
        }
      } catch {
        // Skip malformed events
      }
    };
    eventSource.onerror = () => {
      eventSource.close();
      setCurrentProbe("Connection lost. Redirecting...");
      setTimeout(() => router.replace(`/scan/${id}`), 2000);
    };
    return () => eventSource.close();
  }, [id, router]);

  return (
    <>
      <Nav />
      <main className="pt-16 min-h-screen">
        <section className="px-8 pt-24 pb-32 max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-headline text-4xl font-extrabold tracking-tighter text-charcoal mb-2">Scanning</h1>
            <p className="text-sm text-on-surface-variant">{currentProbe}</p>
          </div>

          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-charcoal">{progress}%</span>
              <div className="flex gap-4">
                <span className="text-xs text-emerald-600 font-medium">{passed} passed</span>
                <span className="text-xs text-red-600 font-medium">{failed} failed</span>
              </div>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-charcoal rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Live activity log */}
          <div className="bg-charcoal rounded-sm overflow-hidden shadow-lg border border-hairline">
            <div className="bg-[#12122a] px-4 py-3 flex items-center justify-between border-b border-[#2a2a4a]">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${progress < 100 ? "bg-emerald-400 animate-pulse" : "bg-slate-500"}`} />
                <span className="text-xs font-medium text-white/80">Live Scan Activity</span>
              </div>
              <span className="text-xs text-white/40 font-mono">{probesRun} probes run</span>
            </div>
            <div className="p-4 h-[400px] overflow-y-auto font-mono text-xs leading-loose space-y-0.5" ref={(el) => { if (el) el.scrollTop = el.scrollHeight; }}>
              <p className="text-slate-500">$ agentprobe scan --all-modules</p>
              <p className="text-slate-400">Initializing scan engine...</p>

              {events.map((ev, i) => {
                if (ev.type === "probe-start") {
                  return <p key={i} className="text-slate-400">{ev.message}</p>;
                }
                if (ev.type === "probe-complete" && ev.probeResult) {
                  const succeeded = ev.probeResult.succeeded;
                  return (
                    <p key={i} className={succeeded ? "text-red-400 font-bold" : "text-emerald-400"}>
                      {succeeded ? "VULNERABLE" : "PASSED"}: {ev.probeResult.probe.name}
                      {ev.probeResult.probe.owaspRef && (
                        <span className="text-slate-500 ml-2">[{ev.probeResult.probe.owaspRef}]</span>
                      )}
                    </p>
                  );
                }
                if (ev.type === "module-complete" && ev.moduleResult) {
                  return (
                    <p key={i} className="text-white font-bold border-t border-[#2a2a4a] pt-2 mt-2">
                      Module: {ev.moduleResult.label} {"\u2192"} Grade {ev.moduleResult.grade} ({ev.moduleResult.attacksSucceeded}/{ev.moduleResult.totalAttacks} attacks succeeded)
                    </p>
                  );
                }
                if (ev.type === "scan-complete") {
                  return <p key={i} className="text-emerald-300 font-bold border-t border-[#2a2a4a] pt-2 mt-2">Scan complete. Generating report...</p>;
                }
                return null;
              })}

              {progress < 100 && (
                <p className="text-slate-500 animate-pulse">{">"} waiting...</p>
              )}
            </div>
          </div>

          {/* Cancel */}
          <div className="mt-6 flex justify-end">
            <button onClick={() => router.push("/")}
              className="px-6 py-2 border border-hairline rounded-sm text-xs font-bold text-charcoal hover:bg-slate-50 transition-colors uppercase tracking-widest">
              Cancel Scan
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
