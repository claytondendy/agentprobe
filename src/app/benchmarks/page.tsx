import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

const agenticRisks = [
  { id: "ASI01", name: "Agent Goal Hijacking", desc: "Attackers manipulate an agent's objectives through poisoned inputs like emails, documents, or web content.", modules: ["Prompt Injection", "Jailbreak Resistance", "Skill Scanner"] },
  { id: "ASI02", name: "Tool Misuse & Exploitation", desc: "An agent uses authorized capabilities in destructive or unintended ways.", modules: ["Excessive Agency", "MCP Scanner"] },
  { id: "ASI03", name: "Identity & Privilege Abuse", desc: "Agents inherit, escalate, or share elevated credentials inappropriately.", modules: ["Excessive Agency", "MCP Scanner"] },
  { id: "ASI04", name: "Agentic Supply Chain Vulnerabilities", desc: "Compromised tools, external MCP servers, or dynamic prompt templates create attack vectors.", modules: ["Sensitive Data Exposure", "MCP Scanner"] },
  { id: "ASI05", name: "Unexpected Code Execution", desc: "Unsafe execution of dynamically generated code poses remote code execution risks.", modules: ["MCP Scanner"] },
  { id: "ASI06", name: "Memory & Context Poisoning", desc: "Attackers corrupt RAG databases or agent memory to bias future decisions.", modules: ["Data Exfiltration"] },
  { id: "ASI07", name: "Insecure Inter-Agent Communication", desc: "Compromised agents send malicious instructions to peers.", modules: ["MCP Scanner"] },
  { id: "ASI08", name: "Cascading Failures", desc: "Single faults propagate across autonomous agents due to automation and high fan-out.", modules: [] },
  { id: "ASI09", name: "Human-Agent Trust Exploitation", desc: "Agents exploit authority bias to manipulate humans into authorizing risky operations.", modules: ["Jailbreak Resistance"] },
  { id: "ASI10", name: "Rogue Agents", desc: "Agents behave within configured policies but slowly drift to perform unintended actions.", modules: [] },
];

const llmRisks = [
  { id: "LLM01", name: "Prompt Injection", desc: "User input overrides system instructions.", modules: ["Prompt Injection", "Skill Scanner"] },
  { id: "LLM02", name: "Sensitive Information Disclosure", desc: "Models leak PII, secrets, or confidential data.", modules: ["Data Exfiltration", "Sensitive Data Exposure", "Skill Scanner"] },
  { id: "LLM03", name: "Supply Chain", desc: "Compromised third-party models or packages.", modules: ["MCP Scanner"] },
  { id: "LLM04", name: "Data and Model Poisoning", desc: "Attacker corrupts training data or retrieval context.", modules: [] },
  { id: "LLM05", name: "Improper Output Handling", desc: "Unsafe execution of model-generated content.", modules: ["MCP Scanner"] },
  { id: "LLM06", name: "Excessive Agency", desc: "Over-permissioned AI systems with unnecessary capabilities.", modules: ["Excessive Agency", "MCP Scanner"] },
  { id: "LLM07", name: "System Prompt Leakage", desc: "Exposing system prompts containing logic or secrets.", modules: ["Jailbreak Resistance", "Data Exfiltration", "Skill Scanner"] },
  { id: "LLM08", name: "Vector and Embedding Weaknesses", desc: "Exploiting semantic search and RAG architectures.", modules: [] },
  { id: "LLM09", name: "Misinformation", desc: "Trusting AI hallucinations without verification.", modules: [] },
  { id: "LLM10", name: "Unbounded Consumption", desc: "Financial denial-of-service via expensive loops.", modules: [] },
];

const cosaiCategories = [
  { name: "Identity and Access Control", coverage: ["MCP Scanner"] },
  { name: "Input Validation", coverage: ["Prompt Injection", "Skill Scanner"] },
  { name: "Data Protection", coverage: ["Data Exfiltration", "Sensitive Data Exposure"] },
  { name: "Network Security", coverage: [] },
  { name: "Supply Chain Integrity", coverage: ["MCP Scanner"] },
  { name: "Operational Visibility", coverage: [] },
  { name: "Protocol-level Authentication", coverage: ["MCP Scanner"] },
  { name: "Guardrails", coverage: ["Jailbreak Resistance", "Excessive Agency"] },
  { name: "Systems Security", coverage: [] },
  { name: "Enforcement Mechanisms", coverage: ["MCP Scanner"] },
  { name: "Traditional Security Concerns (AI-amplified)", coverage: ["Prompt Injection", "Data Exfiltration"] },
  { name: "Novel AI-Specific Attack Vectors", coverage: ["Prompt Injection", "Jailbreak Resistance", "MCP Scanner"] },
];

function RiskTable({ risks }: { risks: typeof agenticRisks }) {
  return (
    <div className="border border-hairline rounded-sm overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="bg-surface border-b border-hairline">
            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant w-20">ID</th>
            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Risk</th>
            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">AgentProbe Coverage</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-hairline">
          {risks.map((risk) => (
            <tr key={risk.id} className="hover:bg-surface-container-low transition-colors">
              <td className="px-4 py-3 font-mono text-xs font-bold text-charcoal">{risk.id}</td>
              <td className="px-4 py-3">
                <div className="font-semibold text-charcoal">{risk.name}</div>
                <div className="text-xs text-on-surface-variant mt-0.5">{risk.desc}</div>
              </td>
              <td className="px-4 py-3">
                {risk.modules.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {risk.modules.map((m) => (
                      <span key={m} className="text-[9px] uppercase font-bold tracking-wide px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-[2px]">{m}</span>
                    ))}
                  </div>
                ) : (
                  <span className="text-[9px] uppercase font-bold tracking-wide px-2 py-0.5 bg-slate-100 text-on-surface-variant rounded-[2px]">Planned</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function BenchmarksPage() {
  return (
    <>
      <Nav />
      <main className="pt-16 min-h-screen">
        <section className="px-8 pt-24 pb-16 max-w-5xl mx-auto">
          <h1 className="font-headline text-4xl font-extrabold tracking-tighter text-charcoal mb-4">Security Benchmarks</h1>
          <p className="text-lg text-on-surface-variant font-light max-w-2xl mb-16">
            AgentProbe scans are mapped to three industry-leading security standards for AI agents and LLM applications.
          </p>

          <div className="space-y-16">
            {/* OWASP Agentic */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="material-symbols-outlined text-charcoal" style={{ fontSize: 24 }}>shield</span>
                <h2 className="font-headline text-2xl font-bold text-charcoal tracking-tight">OWASP Top 10 for Agentic Applications (2026)</h2>
              </div>
              <p className="text-sm text-on-surface-variant mb-6 max-w-2xl">
                The definitive standard for autonomous AI agent security. Developed by 100+ industry experts, covering risks from goal hijacking to rogue agent drift. Released December 2025.
              </p>
              <RiskTable risks={agenticRisks} />
            </div>

            {/* OWASP LLM */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="material-symbols-outlined text-charcoal" style={{ fontSize: 24 }}>psychology</span>
                <h2 className="font-headline text-2xl font-bold text-charcoal tracking-tight">OWASP Top 10 for LLM Applications (2025)</h2>
              </div>
              <p className="text-sm text-on-surface-variant mb-6 max-w-2xl">
                The companion standard for the underlying language model. Covers prompt injection, information disclosure, excessive agency, and output handling vulnerabilities.
              </p>
              <RiskTable risks={llmRisks} />
            </div>

            {/* CoSAI MCP */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="material-symbols-outlined text-charcoal" style={{ fontSize: 24 }}>hub</span>
                <h2 className="font-headline text-2xl font-bold text-charcoal tracking-tight">CoSAI MCP Security Taxonomy (2026)</h2>
              </div>
              <p className="text-sm text-on-surface-variant mb-6 max-w-2xl">
                Released January 2026 by the Coalition for Secure AI (an OASIS Open project). Nearly 40 threats across 12 categories specific to Model Context Protocol deployments. AgentProbe's MCP Scanner mode maps directly to this taxonomy.
              </p>
              <div className="border border-hairline rounded-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-surface border-b border-hairline">
                      <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant w-12">#</th>
                      <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Category</th>
                      <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">AgentProbe Coverage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline">
                    {cosaiCategories.map((cat, i) => (
                      <tr key={cat.name} className="hover:bg-surface-container-low transition-colors">
                        <td className="px-4 py-3 font-mono text-xs text-on-surface-variant">{i + 1}</td>
                        <td className="px-4 py-3 font-semibold text-charcoal">{cat.name}</td>
                        <td className="px-4 py-3">
                          {cat.coverage.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5">
                              {cat.coverage.map((m) => (
                                <span key={m} className="text-[9px] uppercase font-bold tracking-wide px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-[2px]">{m}</span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-[9px] uppercase font-bold tracking-wide px-2 py-0.5 bg-slate-100 text-on-surface-variant rounded-[2px]">Planned</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
