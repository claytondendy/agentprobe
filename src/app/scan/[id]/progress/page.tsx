"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Sidebar } from "@/components/sidebar";
import { ProgressRing } from "@/components/progress-ring";
import { TerminalFeed } from "@/components/terminal-feed";

export default function ScanProgressPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [messages, setMessages] = useState<string[]>(["Initializing scan engine..."]);

  useEffect(() => {
    const eventSource = new EventSource(`/api/scan/${id}/stream`);
    eventSource.onmessage = (event) => {
      if (event.data === "[DONE]") {
        eventSource.close();
        router.push(`/scan/${id}`);
        return;
      }
      try {
        const data = JSON.parse(event.data);
        setProgress(data.progress || 0);
        setMessages((prev) => [...prev, data.message]);
      } catch {
        // Skip malformed events
      }
    };
    eventSource.onerror = () => {
      eventSource.close();
      setMessages((prev) => [...prev, "Connection lost. Redirecting to results..."]);
      setTimeout(() => router.push(`/scan/${id}`), 2000);
    };
    return () => eventSource.close();
  }, [id, router]);

  return (
    <>
      <Nav />
      <div className="flex pt-16">
        <Sidebar />
        <main className="flex-1 bg-white min-h-screen p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-12 w-12 rounded-full border-2 border-hairline border-t-charcoal animate-[spin_3s_linear_infinite]" />
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-charcoal font-headline">Scanning in Progress</h1>
                <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wider mt-1">
                  {progress}% complete
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <div className="space-y-6">
                <div className="bg-white hairline-border rounded-sm p-8 flex flex-col items-center justify-center">
                  <ProgressRing progress={progress} />
                  <button onClick={() => router.push("/")}
                    className="mt-6 px-6 py-2 border border-hairline rounded-sm text-sm font-medium text-charcoal hover:bg-slate-50 transition-colors">
                    Cancel Scan
                  </button>
                </div>
              </div>
              <TerminalFeed messages={messages} />
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
