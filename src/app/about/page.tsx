import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main className="pt-16 min-h-screen">
        <section className="px-8 pt-24 pb-32 max-w-3xl mx-auto">
          <h1 className="font-headline text-4xl font-extrabold tracking-tighter text-charcoal mb-8">About AgentProbe</h1>

          <div className="space-y-8 text-on-surface-variant leading-relaxed">
            <p className="text-lg font-light">
              A security scanner that finds vulnerabilities in AI agents before attackers do.
            </p>

            <div>
              <h2 className="font-headline text-xl font-bold text-charcoal mb-3">What it does</h2>
              <p>
                AgentProbe tests AI agents for security vulnerabilities by running adversarial probes against their system prompts. It simulates the attacks that real threat actors use: prompt injection, jailbreaking, data exfiltration, privilege escalation, and sensitive data exposure.
              </p>
            </div>

            <div>
              <h2 className="font-headline text-xl font-bold text-charcoal mb-3">How it works</h2>
              <p className="mb-4">
                Paste your AI agent's system prompt into AgentProbe. The scanner spins up a simulated agent with that prompt and fires a battery of adversarial attacks against it. A separate "Judge LLM" evaluates each response to determine whether the attack succeeded. Results are graded A through F and mapped to industry security standards.
              </p>
              <p>
                For static analysis, AgentProbe scans system prompts for hardcoded secrets, API keys, database connection strings, internal URLs, and other sensitive data that should never appear in agent instructions.
              </p>
            </div>

            <div>
              <h2 className="font-headline text-xl font-bold text-charcoal mb-3">Three scan modes</h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-charcoal mt-0.5" style={{ fontSize: 20 }}>terminal</span>
                  <div>
                    <span className="font-semibold text-charcoal">Agent Scanner</span> — Test CLAUDE.md files, system prompts, custom instructions, and agent configurations for injection, jailbreak, data leakage, and hardcoded secrets.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-charcoal mt-0.5" style={{ fontSize: 20 }}>auto_fix_high</span>
                  <div>
                    <span className="font-semibold text-charcoal">Skill Scanner</span> — Evaluate skill files, plugin definitions, slash commands, GPT Actions, and tool configurations from any AI platform for hijacking and instruction leakage.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-charcoal mt-0.5" style={{ fontSize: 20 }}>hub</span>
                  <div>
                    <span className="font-semibold text-charcoal">MCP Scanner</span> — Analyze MCP tool definitions, function calling schemas, and agent tool registries for dangerous capabilities, risky combinations, and excessive permissions.
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-headline text-xl font-bold text-charcoal mb-3">Built with</h2>
              <p>
                Next.js, TypeScript, Tailwind CSS, and the Anthropic Claude API. Scans are mapped to the OWASP Top 10 for Agentic Applications (2026), OWASP Top 10 for LLM Applications (2025), and the CoSAI MCP Security Taxonomy.
              </p>
            </div>

            <div>
              <h2 className="font-headline text-xl font-bold text-charcoal mb-3">Who made this</h2>
              <p>
                AgentProbe was built by Clayton Dendy as an open-source contribution to AI agent security tooling. Clayton is a cybersecurity professional specializing in GRC, CISO advisory, and AI security governance.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
