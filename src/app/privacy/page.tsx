import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <main className="pt-16 min-h-screen">
        <section className="px-8 pt-24 pb-32 max-w-4xl mx-auto">
          <h1 className="font-headline text-4xl font-extrabold tracking-tighter text-charcoal mb-4">Privacy Policy</h1>
          <p className="text-sm text-on-surface-variant mb-12">Last updated: March 2026</p>

          <div className="space-y-8 text-on-surface-variant leading-relaxed">
            <div>
              <h2 className="font-headline text-xl font-bold text-charcoal mb-3">What we collect</h2>
              <p>
                When you run a scan, the system prompt you provide is sent to the Anthropic Claude API for analysis. System prompts are held in server memory only for the duration of the scan and are not persisted to any database or filesystem. Once the scan completes and you close the browser, the data is gone.
              </p>
            </div>

            <div>
              <h2 className="font-headline text-xl font-bold text-charcoal mb-3">What we do not collect</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>We do not collect personal information, email addresses, or account credentials.</li>
                <li>We do not use cookies or tracking pixels.</li>
                <li>We do not store scan results beyond the current server session.</li>
                <li>We do not share any data with third parties beyond the Anthropic API calls required to run scans.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-headline text-xl font-bold text-charcoal mb-3">Third-party services</h2>
              <p>
                AgentProbe uses the Anthropic Claude API to simulate AI agents and evaluate attack outcomes. System prompts and generated responses are transmitted to Anthropic's servers during scan execution. Anthropic's data handling is governed by their own privacy policy and API terms of service.
              </p>
            </div>

            <div>
              <h2 className="font-headline text-xl font-bold text-charcoal mb-3">Your responsibility</h2>
              <p>
                Do not paste system prompts containing real credentials, production API keys, or personally identifiable information into AgentProbe. Use test or placeholder values. AgentProbe is a security testing tool; treat it accordingly.
              </p>
            </div>

            <div>
              <h2 className="font-headline text-xl font-bold text-charcoal mb-3">Open source</h2>
              <p>
                AgentProbe is open source. You can inspect exactly what the application does with your data by reviewing the source code.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
