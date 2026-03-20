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
  const [mcpConfig, setMcpConfig] = useState("");
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
      body: JSON.stringify({ name, mode, systemPrompt: mode === "mcp" ? mcpConfig : systemPrompt, apiEndpoint, modules, intensity }),

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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {([
                      { id: "prompt" as ScanMode, icon: "terminal", label: "Agent Scanner", desc: "CLAUDE.md files, system prompts, custom instructions, and agent configurations." },
                      { id: "skill" as ScanMode, icon: "auto_fix_high", label: "Skill Scanner", desc: "Skill files, plugin definitions, GPT Actions, and tool configurations from any AI platform." },
                      { id: "mcp" as ScanMode, icon: "hub", label: "MCP Scanner", desc: "MCP tool definitions, function calling schemas, and agent tool registries." },
                    ]).map((m) => (
                      <button key={m.id} type="button" onClick={() => setMode(m.id)}
                        className={`text-left p-4 rounded-sm transition-all ${mode === m.id ? "bg-charcoal text-white" : "bg-white hairline-border text-charcoal hover:bg-slate-50"}`}>
                        <span className={`material-symbols-outlined mb-2 ${mode === m.id ? "text-white" : "text-charcoal"}`} style={{ fontSize: 24 }}>{m.icon}</span>
                        <div className={`text-sm font-bold mb-1 ${mode === m.id ? "text-white" : "text-charcoal"}`}>{m.label}</div>
                        <div className={`text-xs leading-relaxed ${mode === m.id ? "text-slate-300" : "text-on-surface-variant"}`}>{m.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {mode === "prompt" && (
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">System Prompt</label>
                    <p className="text-xs text-on-surface-variant mb-3">
                      A system prompt is the hidden instructions that define how an AI agent behaves. Every AI agent has one. Common examples:
                    </p>
                    <ul className="text-xs text-on-surface-variant mb-3 list-disc pl-5 space-y-1">
                      <li><span className="font-semibold text-charcoal">CLAUDE.md</span> files in Claude Code projects (the instructions Claude follows when working in your repo)</li>
                      <li><span className="font-semibold text-charcoal">Custom Instructions</span> in ChatGPT (Settings &gt; Personalization &gt; Custom Instructions)</li>
                      <li><span className="font-semibold text-charcoal">System messages</span> in API calls (the "system" role in OpenAI, Anthropic, or other LLM API requests)</li>
                      <li><span className="font-semibold text-charcoal">Bot configuration prompts</span> for customer service agents, internal tools, or any AI-powered product</li>
                    </ul>
                    <p className="text-xs text-on-surface-variant mb-3">
                      Paste the full text of these instructions below. AgentProbe will simulate an agent running with this prompt and test whether attackers can override it, extract it, or exploit it.
                    </p>
                    <textarea value={systemPrompt} onChange={(e) => setSystemPrompt(e.target.value)} rows={8}
                      placeholder="Paste your AI agent's system prompt here..."
                      className="w-full rounded-sm border-hairline shadow-sm focus:border-charcoal focus:ring-charcoal text-sm py-2 px-3 font-mono" />
                  </div>
                )}

                {mode === "skill" && (
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">Skill File Content</label>
                    <p className="text-xs text-on-surface-variant mb-3">
                      Paste the full content of any AI agent skill, plugin, or tool definition. Skills are reusable instruction sets that extend an AI agent's capabilities, often invoked as slash commands (e.g., <span className="font-mono bg-slate-100 px-1">/commit</span>, <span className="font-mono bg-slate-100 px-1">/review-pr</span>, <span className="font-mono bg-slate-100 px-1">/deploy</span>). This works with skill files from any platform: Claude Code skills (.md), OpenAI GPT Actions, Copilot Extensions, LangChain tools, CrewAI agent definitions, or any structured agent configuration.
                    </p>
                    <p className="text-xs text-on-surface-variant mb-3">
                      AgentProbe treats the skill content as a system prompt and tests whether an attacker could hijack the skill's behavior, extract its instructions, or exploit its tool access through crafted user input.
                    </p>
                    <textarea value={systemPrompt} onChange={(e) => setSystemPrompt(e.target.value)} rows={10}
                      placeholder={"---\nname: my-skill\ndescription: A skill that does something useful\n---\n\n## Instructions\n\nYou are a specialized agent that...\n\n## Tools\n\nYou have access to: Bash, Read, Write..."}
                      className="w-full rounded-sm border-hairline shadow-sm focus:border-charcoal focus:ring-charcoal text-sm py-2 px-3 font-mono" />
                  </div>
                )}

                {mode === "redteam" && (
                  <div className="bg-slate-50 hairline-border rounded-sm p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 24 }}>security</span>
                      <span className="text-sm font-bold text-charcoal">Live Red Team</span>
                    </div>
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                      Live Red Team mode connects to a running AI agent via an OpenAI-compatible API endpoint and probes it directly, without needing the system prompt. This is the closest simulation to a real attacker. Coming in the next release.
                    </p>
                  </div>
                )}

                {mode === "mcp" && (
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">MCP Tool Configuration (JSON)</label>
                    <p className="text-xs text-on-surface-variant mb-3">
                      Paste the tool definitions from your MCP (Model Context Protocol) server. This is the JSON that describes what tools your AI agent has access to. AgentProbe analyzes each tool for dangerous capabilities, checks for risky tool combinations, and flags excessive permissions.
                    </p>
                    <p className="text-xs text-on-surface-variant mb-3 font-semibold">Where to find this:</p>
                    <ul className="text-xs text-on-surface-variant mb-3 list-disc pl-5 space-y-1">
                      <li>In your MCP server code, look for the tool definitions (usually a JSON array with name, description, and parameters)</li>
                      <li>In Claude Code, check your <span className="font-mono bg-slate-100 px-1">claude_desktop_config.json</span> or MCP server configuration</li>
                      <li>For OpenAI function calling, use your functions/tools array from the API request</li>
                      <li>For any agent framework, export the tool registry as JSON</li>
                    </ul>
                    <p className="text-xs text-on-surface-variant mb-3">
                      Format: a JSON array of objects, each with <span className="font-mono bg-slate-100 px-1">name</span>, <span className="font-mono bg-slate-100 px-1">description</span>, and <span className="font-mono bg-slate-100 px-1">parameters</span>.
                    </p>
                    <textarea value={mcpConfig} onChange={(e) => setMcpConfig(e.target.value)} rows={10}
                      placeholder={'[\n  {\n    "name": "send_email",\n    "description": "Send email to any address",\n    "parameters": { "to": "string", "subject": "string", "body": "string" }\n  },\n  {\n    "name": "read_file",\n    "description": "Read any file from the filesystem",\n    "parameters": { "path": "string" }\n  }\n]'}
                      className="w-full rounded-sm border-hairline shadow-sm focus:border-charcoal focus:ring-charcoal text-sm py-2 px-3 font-mono" />
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
