import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

export default function SecurityPolicyPage() {
  return (
    <>
      <Nav />
      <main className="pt-16 min-h-screen">
        <section className="px-8 pt-24 pb-32 max-w-3xl mx-auto">
          <h1 className="font-headline text-4xl font-extrabold tracking-tighter text-charcoal mb-2">Security Policy</h1>
          <p className="text-sm text-on-surface-variant mb-12">Last updated: March 2026</p>

          <div className="space-y-8 text-on-surface-variant leading-relaxed">
            <div>
              <h2 className="font-headline text-xl font-bold text-charcoal mb-3">Responsible use</h2>
              <p>
                AgentProbe is a defensive security tool designed to help AI builders test their own agents before deployment. It is intended for authorized security testing, penetration testing engagements, and security research. Do not use AgentProbe to attack AI agents you do not own or have explicit authorization to test.
              </p>
            </div>

            <div>
              <h2 className="font-headline text-xl font-bold text-charcoal mb-3">Architecture</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>All scans run server-side via API routes. System prompts are never exposed to the client beyond what the user submitted.</li>
                <li>The Anthropic API key is stored as a server-side environment variable and is never transmitted to the browser.</li>
                <li>Scan results are held in server memory (no database) and do not persist across server restarts.</li>
                <li>No authentication system is implemented in the MVP. If deploying publicly, add authentication to prevent unauthorized API usage.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-headline text-xl font-bold text-charcoal mb-3">Attack probes</h2>
              <p>
                AgentProbe includes a library of adversarial prompts designed to test common AI agent vulnerabilities. These probes are well-documented in academic literature and security research. They are included solely for defensive testing purposes. The probe library covers:
              </p>
              <ul className="list-disc pl-6 space-y-1 mt-3">
                <li>Direct and indirect prompt injection</li>
                <li>System prompt extraction via role-play, translation, and encoding tricks</li>
                <li>Jailbreak techniques (DAN, developer mode, fictional scenarios)</li>
                <li>Privilege escalation and unauthorized action requests</li>
                <li>Static analysis for hardcoded secrets and sensitive data patterns</li>
              </ul>
            </div>

            <div>
              <h2 className="font-headline text-xl font-bold text-charcoal mb-3">Vulnerability disclosure</h2>
              <p>
                If you discover a security vulnerability in AgentProbe itself, please report it responsibly via the project's GitHub repository.
              </p>
            </div>

            <div>
              <h2 className="font-headline text-xl font-bold text-charcoal mb-3">Limitations</h2>
              <p>
                AgentProbe tests a subset of known attack vectors. A passing scan does not guarantee an agent is fully secure. New attack techniques emerge regularly. Use AgentProbe as one layer of a defense-in-depth strategy, alongside manual red teaming, code review, and runtime monitoring.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
