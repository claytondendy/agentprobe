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
            Find your agent's instructions, paste them in, and see what an attacker would see.
          </p>

          {/* Agent Scanner */}
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-charcoal" style={{ fontSize: 28 }}>terminal</span>
              <h2 className="font-headline text-2xl font-bold text-charcoal tracking-tighter">Agent Scanner</h2>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-bold text-charcoal mb-2">What is a system prompt?</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                A system prompt is the hidden instructions that tell an AI agent how to behave. It defines the agent's personality, rules, restrictions, and capabilities. Every AI agent has one, whether it's a customer service bot, a coding assistant, or an internal tool. The user never sees it, but it controls everything the agent says and does.
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-bold text-charcoal mb-2">Where to find yours</h3>
              <div className="space-y-3">
                <div className="bg-white hairline-border rounded-sm p-4">
                  <div className="text-sm font-bold text-charcoal mb-1">Claude Code</div>
                  <p className="text-xs text-on-surface-variant mb-2">Open the <span className="font-mono bg-slate-100 px-1">CLAUDE.md</span> file in your project root. This is your system prompt. Copy the entire file contents.</p>
                  <div className="bg-charcoal rounded-sm px-3 py-2 font-mono text-xs text-slate-300">cat CLAUDE.md | pbcopy</div>
                </div>

                <div className="bg-white hairline-border rounded-sm p-4">
                  <div className="text-sm font-bold text-charcoal mb-1">ChatGPT Custom GPTs</div>
                  <p className="text-xs text-on-surface-variant mb-2">Go to <span className="font-semibold">Explore GPTs</span>, click your GPT, click <span className="font-semibold">Edit</span>, then copy the text in the <span className="font-semibold">Instructions</span> field. That's your system prompt.</p>
                </div>

                <div className="bg-white hairline-border rounded-sm p-4">
                  <div className="text-sm font-bold text-charcoal mb-1">OpenAI / Anthropic API</div>
                  <p className="text-xs text-on-surface-variant mb-2">In your code, find where you call the API. The system prompt is the <span className="font-mono bg-slate-100 px-1">system</span> field in your messages array or the <span className="font-mono bg-slate-100 px-1">system</span> parameter.</p>
                  <div className="bg-charcoal rounded-sm px-3 py-2 font-mono text-xs text-slate-300 overflow-x-auto">
                    <span className="text-slate-500">// OpenAI</span><br/>
                    messages: [{"{"} role: <span className="text-emerald-400">"system"</span>, content: <span className="text-emerald-400">"You are..."</span> {"}"}]<br/><br/>
                    <span className="text-slate-500">// Anthropic</span><br/>
                    system: <span className="text-emerald-400">"You are..."</span>
                  </div>
                </div>

                <div className="bg-white hairline-border rounded-sm p-4">
                  <div className="text-sm font-bold text-charcoal mb-1">Bot frameworks (Botpress, Voiceflow, Dialogflow, etc.)</div>
                  <p className="text-xs text-on-surface-variant">Look for "system message," "agent instructions," "persona," or "prompt" in your bot's settings or configuration panel. Copy the full text.</p>
                </div>
              </div>
            </div>

            <Link href="/scan/new?mode=prompt" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-charcoal hover:underline">
              Scan an agent
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
            </Link>
          </div>

          {/* Skill Scanner */}
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-charcoal" style={{ fontSize: 28 }}>auto_fix_high</span>
              <h2 className="font-headline text-2xl font-bold text-charcoal tracking-tighter">Skill Scanner</h2>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-bold text-charcoal mb-2">What is a skill?</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                A skill (also called a plugin, action, or extension) is a reusable set of instructions that gives an AI agent a specific capability. Skills are often triggered by slash commands like <span className="font-mono bg-slate-100 px-1">/deploy</span> or <span className="font-mono bg-slate-100 px-1">/review</span>. They typically define what tools the agent can use, what steps to follow, and what constraints to respect. Because skills often have access to powerful tools (shell execution, file writing, API calls), a compromised skill can do real damage.
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-bold text-charcoal mb-2">Where to find yours</h3>
              <div className="space-y-3">
                <div className="bg-white hairline-border rounded-sm p-4">
                  <div className="text-sm font-bold text-charcoal mb-1">Claude Code skills</div>
                  <p className="text-xs text-on-surface-variant mb-2">Skills are markdown files, usually in <span className="font-mono bg-slate-100 px-1">~/.claude/skills/</span> or a project's <span className="font-mono bg-slate-100 px-1">.claude/skills/</span> directory. Open the <span className="font-mono bg-slate-100 px-1">.md</span> file and copy the full contents.</p>
                  <div className="bg-charcoal rounded-sm px-3 py-2 font-mono text-xs text-slate-300">cat ~/.claude/skills/my-skill/skill.md | pbcopy</div>
                </div>

                <div className="bg-white hairline-border rounded-sm p-4">
                  <div className="text-sm font-bold text-charcoal mb-1">OpenAI GPT Actions</div>
                  <p className="text-xs text-on-surface-variant">In your Custom GPT editor, go to <span className="font-semibold">Configure</span>, then scroll to <span className="font-semibold">Actions</span>. Copy the action schema (the JSON or YAML that defines what the action does).</p>
                </div>

                <div className="bg-white hairline-border rounded-sm p-4">
                  <div className="text-sm font-bold text-charcoal mb-1">GitHub Copilot Extensions / LangChain tools</div>
                  <p className="text-xs text-on-surface-variant">Find the tool or extension definition in your code. It's usually a function with a description, parameters, and execution logic. Copy the full definition including the description string.</p>
                </div>

                <div className="bg-white hairline-border rounded-sm p-4">
                  <div className="text-sm font-bold text-charcoal mb-1">CrewAI / AutoGen / custom frameworks</div>
                  <p className="text-xs text-on-surface-variant">Find your agent definition file. Copy the role, goal, backstory, tools list, and any instruction text. The full agent configuration is what you want to test.</p>
                </div>
              </div>
            </div>

            <Link href="/scan/new?mode=skill" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-charcoal hover:underline">
              Scan a skill
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
            </Link>
          </div>

          {/* MCP Scanner */}
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-charcoal" style={{ fontSize: 28 }}>hub</span>
              <h2 className="font-headline text-2xl font-bold text-charcoal tracking-tighter">MCP Scanner</h2>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-bold text-charcoal mb-2">What is an MCP tool configuration?</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                MCP (Model Context Protocol) is the standard for connecting AI agents to external tools, databases, and APIs. An MCP tool configuration is the JSON that describes what tools your agent has access to: their names, descriptions, and parameters. The security risk isn't the tools themselves; it's that a prompt injection attack can trick the agent into calling these tools in unintended ways. An agent with access to <span className="font-mono bg-slate-100 px-1">send_email</span> and <span className="font-mono bg-slate-100 px-1">read_file</span> can be exploited to exfiltrate data.
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-bold text-charcoal mb-2">Where to find yours</h3>
              <div className="space-y-3">
                <div className="bg-white hairline-border rounded-sm p-4">
                  <div className="text-sm font-bold text-charcoal mb-1">Claude Desktop / Claude Code</div>
                  <p className="text-xs text-on-surface-variant mb-2">Your MCP servers are defined in <span className="font-mono bg-slate-100 px-1">claude_desktop_config.json</span>. The tool definitions come from each server. To extract them, check the server's source code for the tool list, or look at what tools appear when the agent connects.</p>
                </div>

                <div className="bg-white hairline-border rounded-sm p-4">
                  <div className="text-sm font-bold text-charcoal mb-1">OpenAI function calling</div>
                  <p className="text-xs text-on-surface-variant mb-2">In your API call, find the <span className="font-mono bg-slate-100 px-1">tools</span> or <span className="font-mono bg-slate-100 px-1">functions</span> array. Copy the full JSON array.</p>
                  <div className="bg-charcoal rounded-sm px-3 py-2 font-mono text-xs text-slate-300 overflow-x-auto">
                    tools: [{"{"} type: <span className="text-emerald-400">"function"</span>, function: {"{"} name: <span className="text-emerald-400">"send_email"</span>, ... {"}"} {"}"}]
                  </div>
                </div>

                <div className="bg-white hairline-border rounded-sm p-4">
                  <div className="text-sm font-bold text-charcoal mb-1">Any agent framework</div>
                  <p className="text-xs text-on-surface-variant mb-2">Export your tool registry as JSON. AgentProbe needs a JSON array where each object has <span className="font-mono bg-slate-100 px-1">name</span>, <span className="font-mono bg-slate-100 px-1">description</span>, and optionally <span className="font-mono bg-slate-100 px-1">parameters</span>.</p>
                  <div className="bg-charcoal rounded-sm px-3 py-2 font-mono text-xs text-emerald-400 overflow-x-auto whitespace-pre">{"[\n  { \"name\": \"send_email\", \"description\": \"Send email to any address\" },\n  { \"name\": \"read_file\", \"description\": \"Read any file from disk\" }\n]"}</div>
                </div>
              </div>
            </div>

            <Link href="/scan/new?mode=mcp" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-charcoal hover:underline">
              Scan your tools
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
            </Link>
          </div>

          {/* CTA */}
          <div className="border-t border-hairline pt-12 text-center">
            <p className="text-sm text-on-surface-variant mb-6">Not sure which scanner to use? Start with Agent Scanner.</p>
            <Link href="/scan/new"
              className="inline-flex items-center gap-2 bg-charcoal text-white px-8 py-3 text-sm font-bold rounded-sm hover:opacity-90 active:scale-95 transition-all uppercase tracking-widest">
              Start Scanning
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
