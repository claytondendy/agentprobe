import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import Link from "next/link";

const steps = [
  {
    num: "01",
    icon: "edit_note",
    title: "Choose your scan mode",
    desc: "Select Prompt Scanner to test a system prompt, MCP Audit to analyze tool permissions, or Skill Scanner to evaluate a Claude Code skill file.",
  },
  {
    num: "02",
    icon: "content_paste",
    title: "Paste your configuration",
    desc: "For Prompt Scanner, paste your agent's system prompt: this is the hidden instructions that tell the AI how to behave. Common examples include CLAUDE.md files (Claude Code), Custom Instructions (ChatGPT), system messages in API calls, or any bot configuration prompt. For MCP Audit, paste the JSON tool definitions from your MCP server. For Skill Scanner, paste the skill's full markdown content.",
  },
  {
    num: "03",
    icon: "tune",
    title: "Select security modules",
    desc: "Toggle which attack categories to test: prompt injection, data exfiltration, jailbreak resistance, excessive agency, and sensitive data exposure. All are enabled by default.",
  },
  {
    num: "04",
    icon: "play_arrow",
    title: "Run the scan",
    desc: "Hit Start Scan. AgentProbe simulates your agent, fires adversarial attacks against it, and evaluates each response in real time. Watch results stream in the live terminal.",
  },
  {
    num: "05",
    icon: "assessment",
    title: "Review your report",
    desc: "Each finding shows the attack that was used, the agent's response, a severity rating, the OWASP reference, and a specific remediation suggestion. Overall grade runs A through F.",
  },
  {
    num: "06",
    icon: "build",
    title: "Fix and re-test",
    desc: "Update your system prompt or tool configuration based on the remediation guidance, then run another scan to verify the fix. Repeat until you reach your target grade.",
  },
];

const modes = [
  {
    icon: "terminal",
    title: "Prompt Scanner",
    href: "/scan/new?mode=prompt",
    what: "Tests your AI agent's system prompt by simulating the agent and running adversarial attacks against it. A system prompt is the hidden instructions that define an agent's behavior, such as a CLAUDE.md file in Claude Code, Custom Instructions in ChatGPT, the 'system' role in LLM API calls, or any configuration prompt for a chatbot or AI-powered tool.",
    when: "Before deploying any AI agent. Run it when writing a new CLAUDE.md, configuring a ChatGPT Custom GPT, building a customer service bot, or setting up any LLM-powered product. Re-scan after every prompt change.",
    how: "Paste the full text of your system prompt (copy it from your CLAUDE.md, API code, or bot configuration). AgentProbe creates a temporary agent using that prompt, then fires 18+ adversarial probes across 5 categories. A separate Judge LLM evaluates whether each attack succeeded or failed.",
    finds: "Prompt injection vulnerabilities, system prompt leakage (attackers extracting your instructions), jailbreak susceptibility, unauthorized action compliance, and hardcoded secrets like API keys, passwords, database strings, and internal URLs.",
  },
  {
    icon: "hub",
    title: "MCP Audit",
    href: "/scan/new?mode=mcp",
    what: "Analyzes your MCP server's tool definitions for dangerous capabilities, excessive permissions, and risky tool combinations.",
    when: "Before connecting any MCP server to an AI agent. Especially important when agents have access to email, file systems, databases, or external APIs.",
    how: "Static analysis of your tool JSON: pattern matching for dangerous capabilities (send_email, delete_file, execute_code), detection of risky tool pairs (read + send = exfiltration), and permission surface assessment.",
    finds: "Over-permissioned tools, dangerous capability combinations, direct database access, external communication channels, and excessive tool counts that expand the attack surface.",
  },
  {
    icon: "auto_fix_high",
    title: "Skill Scanner",
    href: "/scan/new?mode=prompt",
    what: "Evaluates Claude Code skill files (.md) for security risks by treating the skill content as a system prompt and testing it for injection vulnerabilities and sensitive data exposure.",
    when: "Before deploying custom skills in Claude Code, especially skills that interact with external systems, handle credentials, or execute shell commands.",
    how: "The skill's markdown content is fed to the Prompt Scanner engine as a system prompt. All 5 attack modules run against it, testing whether an attacker could hijack the skill's behavior through crafted user input.",
    finds: "Skills that leak their own instructions, skills vulnerable to goal hijacking via user input, hardcoded credentials or internal paths in skill definitions, and skills that can be tricked into executing unintended actions.",
  },
];

export default function HowToPage() {
  return (
    <>
      <Nav />
      <main className="pt-16 min-h-screen">
        <section className="px-8 pt-24 pb-16 max-w-4xl mx-auto">
          <h1 className="font-headline text-4xl font-extrabold tracking-tighter text-charcoal mb-4">How to Use AgentProbe</h1>
          <p className="text-lg text-on-surface-variant font-light max-w-2xl mb-16">
            Six steps from paste to secure. No setup, no accounts, no configuration files.
          </p>

          {/* Steps */}
          <div className="space-y-6 mb-24">
            {steps.map((step) => (
              <div key={step.num} className="flex gap-6 items-start p-6 bg-white hairline-border rounded-sm">
                <div className="flex-shrink-0 w-12 h-12 bg-charcoal rounded-sm flex items-center justify-center">
                  <span className="material-symbols-outlined text-white" style={{ fontSize: 24 }}>{step.icon}</span>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{step.num}</span>
                    <h3 className="font-headline text-lg font-bold text-charcoal tracking-tight">{step.title}</h3>
                  </div>
                  <p className="text-sm text-on-surface-variant leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Scan Modes Deep Dive */}
          <h2 className="font-headline text-2xl font-bold text-charcoal tracking-tighter mb-8">Scan Modes Explained</h2>

          <div className="space-y-8 mb-16">
            {modes.map((mode) => (
              <div key={mode.title} className="bg-white hairline-border rounded-sm overflow-hidden">
                <div className="p-6 border-b-[0.5px] border-hairline flex items-center gap-4">
                  <span className="material-symbols-outlined text-charcoal" style={{ fontSize: 28 }}>{mode.icon}</span>
                  <h3 className="font-headline text-xl font-bold text-charcoal tracking-tight">{mode.title}</h3>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">What it does</h4>
                    <p className="text-sm text-charcoal leading-relaxed">{mode.what}</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">When to use it</h4>
                    <p className="text-sm text-charcoal leading-relaxed">{mode.when}</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">How it works</h4>
                    <p className="text-sm text-charcoal leading-relaxed">{mode.how}</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">What it finds</h4>
                    <p className="text-sm text-charcoal leading-relaxed">{mode.finds}</p>
                  </div>
                </div>
                <div className="px-6 pb-6">
                  <Link href={mode.href} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-charcoal hover:underline">
                    Try {mode.title}
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
