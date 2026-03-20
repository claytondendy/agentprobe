"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Sidebar } from "@/components/sidebar";
import { ScanMode, ScanModule } from "@/lib/types";

const allModules: { id: ScanModule; label: string }[] = [
  { id: "prompt-injection", label: "Prompt Injection" },
  { id: "data-exfiltration", label: "Data Exfiltration" },
  { id: "jailbreak", label: "Jailbreak Resistance" },
  { id: "excessive-agency", label: "Excessive Agency" },
  { id: "sensitive-data", label: "Sensitive Data Exposure" },
];

export default function NewScanPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = (searchParams.get("mode") as ScanMode) || "prompt";

  const [name, setName] = useState("");
  const [mode, setMode] = useState<ScanMode>(initialMode);
  const [systemPrompt, setSystemPrompt] = useState("");
  const [apiEndpoint, setApiEndpoint] = useState("");
  const [intensity, setIntensity] = useState<"low" | "medium" | "high">("medium");
  const [modules, setModules] = useState<ScanModule[]>(allModules.map((m) => m.id));
  const [submitting, setSubmitting] = useState(false);

  const toggleModule = (id: ScanModule) => {
    setModules((prev) => prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch("/api/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, mode, systemPrompt, apiEndpoint, modules, intensity }),
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Failed to start scan");
      setSubmitting(false);
      return;
    }
    router.push(`/scan/${data.id}/progress`);
  };

  return (
    <>
      <Nav />
      <div className="flex pt-16">
        <Sidebar />
        <main className="flex-1 bg-surface min-h-screen p-8 md:p-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-charcoal mb-8 tracking-tight font-headline">New Scan Configuration</h1>
            <div className="bg-white hairline-border rounded-sm p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">Agent Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
                    className="w-full md:w-1/2 rounded-sm border-hairline shadow-sm focus:border-charcoal focus:ring-charcoal text-sm py-2 px-3" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-3">Scan Mode</label>
                  <div className="flex gap-6">
                    {(["prompt", "redteam", "mcp"] as ScanMode[]).map((m) => (
                      <label key={m} className="flex items-center">
                        <input type="radio" name="mode" checked={mode === m} onChange={() => setMode(m)}
                          className="h-4 w-4 border-hairline text-charcoal focus:ring-charcoal" />
                        <span className="ml-2 text-sm font-medium text-charcoal capitalize">{m === "redteam" ? "Live Red Team" : m === "mcp" ? "MCP Audit" : "Prompt Scanner"}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {mode === "prompt" && (
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">System Prompt</label>
                    <textarea value={systemPrompt} onChange={(e) => setSystemPrompt(e.target.value)} rows={8}
                      placeholder="Paste your AI agent's system prompt here..."
                      className="w-full rounded-sm border-hairline shadow-sm focus:border-charcoal focus:ring-charcoal text-sm py-2 px-3 font-mono" />
                  </div>
                )}

                {mode === "redteam" && (
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">API Endpoint (OpenAI-compatible)</label>
                    <input type="url" value={apiEndpoint} onChange={(e) => setApiEndpoint(e.target.value)}
                      placeholder="https://api.example.com/v1/chat/completions"
                      className="w-full md:w-2/3 rounded-sm border-hairline shadow-sm focus:border-charcoal focus:ring-charcoal text-sm py-2 px-3" />
                  </div>
                )}

                {mode === "mcp" && (
                  <div className="bg-slate-50 hairline-border rounded-sm p-6 text-center">
                    <span className="material-symbols-outlined text-on-surface-variant mb-2" style={{ fontSize: 32 }}>hub</span>
                    <p className="text-sm font-medium text-on-surface-variant">MCP Audit mode coming soon.</p>
                    <p className="text-xs text-on-surface-variant mt-1">Use Prompt Scanner to test your agent today.</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-3">Scan Intensity</label>
                  <div className="flex gap-6">
                    {(["low", "medium", "high"] as const).map((i) => (
                      <label key={i} className="flex items-center">
                        <input type="radio" name="intensity" checked={intensity === i} onChange={() => setIntensity(i)}
                          className="h-4 w-4 border-hairline text-charcoal focus:ring-charcoal" />
                        <span className="ml-2 text-sm font-medium text-charcoal capitalize">{i}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-4">Security Modules</label>
                  <div className="space-y-4">
                    {allModules.map((mod) => (
                      <label key={mod.id} className="flex items-center cursor-pointer">
                        <button type="button" onClick={() => toggleModule(mod.id)}
                          className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${modules.includes(mod.id) ? "bg-charcoal" : "bg-slate-200"}`}>
                          <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${modules.includes(mod.id) ? "translate-x-5" : "translate-x-0.5"} mt-0.5`} />
                        </button>
                        <span className="ml-3 text-sm font-medium text-charcoal">{mod.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <button type="submit" disabled={submitting}
                    className="bg-charcoal text-white px-6 py-2.5 text-xs font-bold rounded-sm active:scale-95 transition-transform uppercase tracking-widest disabled:opacity-50">
                    {submitting ? "Starting..." : "Start Scan"}
                  </button>
                  <button type="button" onClick={() => router.back()}
                    className="px-6 py-2.5 border-[0.5px] border-hairline bg-white text-charcoal text-xs font-bold rounded-sm hover:bg-slate-50 uppercase tracking-widest">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
