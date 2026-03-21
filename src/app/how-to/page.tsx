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
                  <p className="text-xs text-on-surface-variant mb-1">File: <span className="font-mono bg-slate-100 px-1">CLAUDE.md</span> in your project root (or <span className="font-mono bg-slate-100 px-1">~/.claude/CLAUDE.md</span> for global instructions)</p>
                  <p className="text-xs text-on-surface-variant mb-2">This file is loaded every time Claude Code starts a session. Open it and copy the entire contents.</p>
                  <div className="bg-charcoal rounded-sm px-3 py-2 font-mono text-xs text-slate-300">cat CLAUDE.md | pbcopy</div>
                </div>

                <div className="bg-white hairline-border rounded-sm p-4">
                  <div className="text-sm font-bold text-charcoal mb-1">ChatGPT Custom GPTs</div>
                  <p className="text-xs text-on-surface-variant mb-1">Location: <span className="font-semibold">chatgpt.com</span> &gt; <span className="font-semibold">Explore GPTs</span> &gt; select your GPT &gt; <span className="font-semibold">Edit</span> &gt; <span className="font-semibold">Configure</span> tab</p>
                  <p className="text-xs text-on-surface-variant">Copy everything in the <span className="font-semibold">Instructions</span> text box. That entire block of text is your system prompt.</p>
                </div>

                <div className="bg-white hairline-border rounded-sm p-4">
                  <div className="text-sm font-bold text-charcoal mb-1">OpenAI / Anthropic API</div>
                  <p className="text-xs text-on-surface-variant mb-2">Search your codebase for where you make API calls. The system prompt is the string passed as the <span className="font-mono bg-slate-100 px-1">system</span> role or parameter.</p>
                  <div className="bg-charcoal rounded-sm px-3 py-2 font-mono text-xs text-slate-300 overflow-x-auto mb-2">
                    <span className="text-slate-500">// OpenAI - look for this pattern in your code</span><br/>
                    messages: [{"{"} role: <span className="text-emerald-400">"system"</span>, content: <span className="text-emerald-400">"You are..."</span> {"}"}]<br/><br/>
                    <span className="text-slate-500">// Anthropic - look for this pattern</span><br/>
                    system: <span className="text-emerald-400">"You are..."</span>
                  </div>
                  <p className="text-xs text-on-surface-variant">Copy the full string value. It might be inline, in a variable, or loaded from a file.</p>
                </div>

                <div className="bg-white hairline-border rounded-sm p-4">
                  <div className="text-sm font-bold text-charcoal mb-1">Bot frameworks (Botpress, Voiceflow, Dialogflow, etc.)</div>
                  <p className="text-xs text-on-surface-variant">Open your bot's settings panel. Look for fields labeled "system message," "agent instructions," "persona," "prompt," or "AI configuration." Copy the full text from that field.</p>
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
                  <p className="text-xs text-on-surface-variant mb-1">Files: <span className="font-mono bg-slate-100 px-1">~/.claude/skills/&lt;skill-name&gt;/*.md</span> (global) or <span className="font-mono bg-slate-100 px-1">.claude/skills/</span> (per-project)</p>
                  <p className="text-xs text-on-surface-variant mb-2">Each skill is a markdown file. Open the <span className="font-mono bg-slate-100 px-1">.md</span> file and copy the entire contents, including the frontmatter (the <span className="font-mono bg-slate-100 px-1">---</span> block at the top with name and description).</p>
                  <div className="bg-charcoal rounded-sm px-3 py-2 font-mono text-xs text-slate-300 mb-2">
                    <span className="text-slate-500"># List all your skills</span><br/>
                    ls ~/.claude/skills/<br/><br/>
                    <span className="text-slate-500"># Copy a specific skill</span><br/>
                    cat ~/.claude/skills/my-skill/my-skill.md | pbcopy
                  </div>
                </div>

                <div className="bg-white hairline-border rounded-sm p-4">
                  <div className="text-sm font-bold text-charcoal mb-1">OpenAI GPT Actions</div>
                  <p className="text-xs text-on-surface-variant mb-1">Location: <span className="font-semibold">chatgpt.com</span> &gt; your GPT &gt; <span className="font-semibold">Edit</span> &gt; <span className="font-semibold">Configure</span> &gt; scroll to <span className="font-semibold">Actions</span></p>
                  <p className="text-xs text-on-surface-variant">Copy the action schema (the JSON or YAML that defines what the action does, its endpoints, and parameters).</p>
                </div>

                <div className="bg-white hairline-border rounded-sm p-4">
                  <div className="text-sm font-bold text-charcoal mb-1">GitHub Copilot Extensions / LangChain tools</div>
                  <p className="text-xs text-on-surface-variant">Find the tool or extension definition in your code. It's usually a function decorated with <span className="font-mono bg-slate-100 px-1">@tool</span> or an object with a description, parameters, and execution logic. Copy the full definition including the description string.</p>
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
              <h3 className="text-sm font-bold text-charcoal mb-2">What is MCP?</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed mb-3">
                MCP (Model Context Protocol) is how AI agents connect to external tools. When you give Claude access to your email, file system, database, or any other service, that connection is defined through MCP. Each MCP server exposes a list of tools the agent can call, like <span className="font-mono bg-slate-100 px-1">send_email</span>, <span className="font-mono bg-slate-100 px-1">read_file</span>, or <span className="font-mono bg-slate-100 px-1">run_query</span>.
              </p>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                The risk: if an attacker can inject a prompt into your agent (through a malicious email, document, or user message), they can trick the agent into calling these tools in unintended ways. An agent with access to both <span className="font-mono bg-slate-100 px-1">read_file</span> and <span className="font-mono bg-slate-100 px-1">send_email</span> could be exploited to read sensitive files and email them to an attacker. The MCP Scanner analyzes your tool configuration to flag these risks before they become real attacks.
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-bold text-charcoal mb-2">What AgentProbe needs</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed mb-3">
                A JSON array listing the tools your agent has access to. Each tool needs a <span className="font-mono bg-slate-100 px-1">name</span> and a <span className="font-mono bg-slate-100 px-1">description</span>. AgentProbe scans for dangerous capabilities (file deletion, code execution, external communication), risky tool combinations (read + send = data exfiltration), and excessive tool counts.
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-bold text-charcoal mb-2">Where to find your tool list</h3>
              <div className="space-y-3">

                <div className="bg-white hairline-border rounded-sm p-4">
                  <div className="text-sm font-bold text-charcoal mb-1">Claude Desktop</div>
                  <p className="text-xs text-on-surface-variant mb-1">Config file: <span className="font-mono bg-slate-100 px-1">~/Library/Application Support/Claude/claude_desktop_config.json</span> (macOS)</p>
                  <p className="text-xs text-on-surface-variant mb-2">This file lists your MCP servers, but not the individual tools. To get the tool list, you have two options:</p>
                  <p className="text-xs text-on-surface-variant mb-1"><span className="font-semibold">Option 1:</span> Open Claude Desktop, start a conversation, and ask: "What tools do you have access to? List each one with its name and what it does." Copy the response.</p>
                  <p className="text-xs text-on-surface-variant mb-2"><span className="font-semibold">Option 2:</span> Look at the source code of each MCP server listed in your config. The tools are defined in the server's code (usually in a <span className="font-mono bg-slate-100 px-1">tools</span> array or <span className="font-mono bg-slate-100 px-1">list_tools()</span> function).</p>
                  <div className="bg-charcoal rounded-sm px-3 py-2 font-mono text-xs text-slate-300 mb-2">
                    <span className="text-slate-500"># View your MCP server config</span><br/>
                    cat ~/Library/Application\ Support/Claude/claude_desktop_config.json
                  </div>
                </div>

                <div className="bg-white hairline-border rounded-sm p-4">
                  <div className="text-sm font-bold text-charcoal mb-1">Claude Code</div>
                  <p className="text-xs text-on-surface-variant mb-1">Config file: <span className="font-mono bg-slate-100 px-1">~/.claude/settings.json</span> (look for the <span className="font-mono bg-slate-100 px-1">mcpServers</span> section)</p>
                  <p className="text-xs text-on-surface-variant mb-2">To see what tools are available in your current session, run <span className="font-mono bg-slate-100 px-1">/mcp</span> in Claude Code. To get a JSON list you can paste into AgentProbe, ask Claude: "List all MCP tools available to you as a JSON array with name and description for each."</p>
                  <div className="bg-charcoal rounded-sm px-3 py-2 font-mono text-xs text-slate-300 mb-2">
                    <span className="text-slate-500"># View your MCP server config</span><br/>
                    cat ~/.claude/settings.json | python3 -m json.tool
                  </div>
                </div>

                <div className="bg-white hairline-border rounded-sm p-4">
                  <div className="text-sm font-bold text-charcoal mb-1">OpenAI function calling</div>
                  <p className="text-xs text-on-surface-variant mb-2">Search your code for the <span className="font-mono bg-slate-100 px-1">tools</span> or <span className="font-mono bg-slate-100 px-1">functions</span> parameter in your API call. Copy the full array.</p>
                  <div className="bg-charcoal rounded-sm px-3 py-2 font-mono text-xs text-slate-300 overflow-x-auto">
                    <span className="text-slate-500">// Find this in your code and copy the tools array</span><br/>
                    const response = await openai.chat.completions.create({"{"}<br/>
                    &nbsp;&nbsp;model: <span className="text-emerald-400">"gpt-4"</span>,<br/>
                    &nbsp;&nbsp;tools: [<span className="text-emerald-400"> &lt;-- copy this entire array</span><br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;{"{"} type: <span className="text-emerald-400">"function"</span>, function: {"{"} name: <span className="text-emerald-400">"send_email"</span>, ... {"}"} {"}"},<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;{"{"} type: <span className="text-emerald-400">"function"</span>, function: {"{"} name: <span className="text-emerald-400">"read_file"</span>, ... {"}"} {"}"},<br/>
                    &nbsp;&nbsp;]<br/>
                    {"}"});
                  </div>
                </div>

                <div className="bg-white hairline-border rounded-sm p-4">
                  <div className="text-sm font-bold text-charcoal mb-1">Any MCP server or agent framework</div>
                  <p className="text-xs text-on-surface-variant mb-2">If you built your own MCP server or use a framework like LangChain, CrewAI, or AutoGen, export your tool registry as JSON. AgentProbe needs this format:</p>
                  <div className="bg-charcoal rounded-sm px-3 py-2 font-mono text-xs text-emerald-400 overflow-x-auto whitespace-pre">{"[\n  {\n    \"name\": \"send_email\",\n    \"description\": \"Send an email to any address with subject and body\"\n  },\n  {\n    \"name\": \"read_file\",\n    \"description\": \"Read any file from the local filesystem\"\n  },\n  {\n    \"name\": \"execute_sql\",\n    \"description\": \"Run SQL queries against the production database\"\n  },\n  {\n    \"name\": \"web_fetch\",\n    \"description\": \"Make HTTP requests to any URL\"\n  }\n]"}</div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-bold text-charcoal mb-2">What the MCP Scanner looks for</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-white hairline-border rounded-sm p-3">
                  <div className="text-xs font-bold text-red-600 mb-1">Dangerous tools</div>
                  <p className="text-xs text-on-surface-variant">Tools that can send emails, delete files, execute code, or make external HTTP requests</p>
                </div>
                <div className="bg-white hairline-border rounded-sm p-3">
                  <div className="text-xs font-bold text-red-600 mb-1">Risky combinations</div>
                  <p className="text-xs text-on-surface-variant">read_file + send_email = data exfiltration. execute_code + web_fetch = remote code execution with exfil</p>
                </div>
                <div className="bg-white hairline-border rounded-sm p-3">
                  <div className="text-xs font-bold text-amber-600 mb-1">Excessive permissions</div>
                  <p className="text-xs text-on-surface-variant">Too many tools increases the attack surface. A customer service bot doesn't need database access</p>
                </div>
                <div className="bg-white hairline-border rounded-sm p-3">
                  <div className="text-xs font-bold text-amber-600 mb-1">Privilege escalation paths</div>
                  <p className="text-xs text-on-surface-variant">Tools that reference admin, root, or elevated permissions that an attacker could exploit</p>
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
