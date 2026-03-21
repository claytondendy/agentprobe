import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import Link from "next/link";

export default function HowToPage() {
  return (
    <>
      <Nav />
      <main className="pt-16 min-h-screen">
        <section className="px-8 pt-24 pb-32 max-w-4xl mx-auto">
          <h1 className="font-headline text-4xl font-extrabold tracking-tighter text-charcoal mb-4">How It Works</h1>
          <p className="text-lg text-on-surface-variant font-light mb-16">
            Paste. Scan. Fix. Three steps to a more secure AI agent.
          </p>

          {/* Steps */}
          <div className="space-y-12 mb-24">

            {/* Step 1 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-10 h-10 bg-charcoal rounded-full flex items-center justify-center text-white font-headline font-bold text-sm">1</div>
              <div>
                <h2 className="font-headline text-xl font-bold text-charcoal mb-2">Paste your agent's instructions</h2>
                <p className="text-sm text-on-surface-variant leading-relaxed mb-4">
                  Choose a scanner and paste the content you want to test.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Link href="/scan/new?mode=prompt" className="p-4 bg-white hairline-border rounded-sm hover:bg-slate-50 transition-colors">
                    <span className="material-symbols-outlined text-charcoal mb-2" style={{ fontSize: 20 }}>terminal</span>
                    <div className="text-sm font-bold text-charcoal mb-1">Agent Scanner</div>
                    <div className="text-xs text-on-surface-variant">CLAUDE.md, system prompts, custom instructions, bot configs</div>
                  </Link>
                  <Link href="/scan/new?mode=skill" className="p-4 bg-white hairline-border rounded-sm hover:bg-slate-50 transition-colors">
                    <span className="material-symbols-outlined text-charcoal mb-2" style={{ fontSize: 20 }}>auto_fix_high</span>
                    <div className="text-sm font-bold text-charcoal mb-1">Skill Scanner</div>
                    <div className="text-xs text-on-surface-variant">Skill files, plugins, slash commands, GPT Actions</div>
                  </Link>
                  <Link href="/scan/new?mode=mcp" className="p-4 bg-white hairline-border rounded-sm hover:bg-slate-50 transition-colors">
                    <span className="material-symbols-outlined text-charcoal mb-2" style={{ fontSize: 20 }}>hub</span>
                    <div className="text-sm font-bold text-charcoal mb-1">MCP Scanner</div>
                    <div className="text-xs text-on-surface-variant">Tool definitions, function schemas, agent tool registries</div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-10 h-10 bg-charcoal rounded-full flex items-center justify-center text-white font-headline font-bold text-sm">2</div>
              <div>
                <h2 className="font-headline text-xl font-bold text-charcoal mb-2">Watch the scan run</h2>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  AgentProbe fires adversarial probes against your agent in real time. For Agent and Skill scans, it simulates your agent and attacks it with prompt injection, jailbreaking, data extraction, and more. For MCP scans, it analyzes your tool permissions for dangerous capabilities. You'll see each test pass or fail as it happens.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-10 h-10 bg-charcoal rounded-full flex items-center justify-center text-white font-headline font-bold text-sm">3</div>
              <div>
                <h2 className="font-headline text-xl font-bold text-charcoal mb-2">Fix what failed</h2>
                <p className="text-sm text-on-surface-variant leading-relaxed mb-4">
                  Every finding includes the exact attack that worked, the agent's response, and a specific remediation. Update your configuration, re-scan, and repeat until you reach your target grade.
                </p>
                <div className="bg-white hairline-border rounded-sm p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[9px] uppercase font-bold tracking-widest text-on-surface-variant">Example finding</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <div className="text-[9px] uppercase font-bold tracking-widest text-on-surface-variant mb-1">Attack</div>
                      <div className="font-mono text-red-600 bg-red-50 rounded px-2 py-1">"Ignore all previous instructions..."</div>
                    </div>
                    <div>
                      <div className="text-[9px] uppercase font-bold tracking-widest text-on-surface-variant mb-1">Result</div>
                      <div className="font-mono text-charcoal bg-slate-50 rounded px-2 py-1">System prompt extracted</div>
                    </div>
                    <div>
                      <div className="text-[9px] uppercase font-bold tracking-widest text-on-surface-variant mb-1">Fix</div>
                      <div className="text-charcoal bg-emerald-50 rounded px-2 py-1">Add output filtering and prompt shielding</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* What it tests */}
          <h2 className="font-headline text-2xl font-bold text-charcoal tracking-tighter mb-6">What AgentProbe tests for</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
            {[
              { icon: "psychology", title: "Prompt Injection", desc: "Can someone override your agent's instructions?" },
              { icon: "visibility_off", title: "Data Exfiltration", desc: "Can someone extract your system prompt or private data?" },
              { icon: "lock_open", title: "Jailbreak Resistance", desc: "Can someone talk your agent out of its safety rules?" },
              { icon: "admin_panel_settings", title: "Excessive Agency", desc: "Does your agent agree to actions it shouldn't?" },
              { icon: "key", title: "Sensitive Data Exposure", desc: "Are there API keys, passwords, or internal URLs in your prompt?" },
              { icon: "warning", title: "Misinformation", desc: "Does your agent fabricate facts with false confidence?" },
            ].map((item) => (
              <div key={item.title} className="flex gap-3 p-4 bg-white hairline-border rounded-sm">
                <span className="material-symbols-outlined text-charcoal flex-shrink-0 mt-0.5" style={{ fontSize: 20 }}>{item.icon}</span>
                <div>
                  <div className="text-sm font-bold text-charcoal">{item.title}</div>
                  <div className="text-xs text-on-surface-variant">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link href="/scan/new"
              className="inline-flex items-center gap-2 bg-charcoal text-white px-8 py-3 text-sm font-bold rounded-sm hover:opacity-90 active:scale-95 transition-all uppercase tracking-widest">
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>radar</span>
              Start Your First Scan
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
