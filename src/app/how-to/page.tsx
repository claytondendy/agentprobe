"use client";
import { useState } from "react";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import Link from "next/link";

type Tab = "agent" | "skill" | "mcp";

const tabs: { id: Tab; icon: string; label: string }[] = [
  { id: "agent", icon: "terminal", label: "Agent Scanner" },
  { id: "skill", icon: "auto_fix_high", label: "Skill Scanner" },
  { id: "mcp", icon: "hub", label: "MCP Scanner" },
];

export default function HowToPage() {
  const [active, setActive] = useState<Tab>("agent");

  return (
    <>
      <Nav />
      <main className="pt-16 min-h-screen">
        <section className="px-8 pt-24 pb-32 max-w-4xl mx-auto">
          <h1 className="font-headline text-4xl font-extrabold tracking-tighter text-charcoal mb-4">How It Works</h1>
          <p className="text-lg text-on-surface-variant font-light mb-10">
            Find your agent's instructions, paste them in, and see what an attacker would see.
          </p>

          {/* Tab selector */}
          <div className="flex gap-2 mb-10 border-b border-hairline">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-bold transition-colors border-b-2 -mb-[1px] ${
                  active === tab.id
                    ? "text-charcoal border-charcoal"
                    : "text-on-surface-variant border-transparent hover:text-charcoal"
                }`}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Agent Scanner */}
          {active === "agent" && (
            <div>
              <div className="mb-8">
                <h2 className="font-headline text-xl font-bold text-charcoal mb-2">What is a system prompt?</h2>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  A system prompt is the hidden instructions that tell an AI agent how to behave. It defines the agent's personality, rules, restrictions, and capabilities. The user never sees it, but it controls everything the agent says and does. Every AI agent has one.
                </p>
              </div>

              <h2 className="font-headline text-xl font-bold text-charcoal mb-4">Find yours by platform</h2>
              <div className="space-y-3 mb-8">

                <Card title="Claude Code" icon="terminal">
                  <P>File: <Code>CLAUDE.md</Code> in your project root, or <Code>~/.claude/CLAUDE.md</Code> for global instructions.</P>
                  <P>This file is loaded every time Claude Code starts. Copy the entire contents.</P>
                  <Cmd>cat CLAUDE.md | pbcopy</Cmd>
                </Card>

                <Card title="Claude Desktop" icon="chat">
                  <P>Claude Desktop doesn't use a file-based system prompt. Instead, it uses <B>Projects</B> with custom instructions.</P>
                  <P>Open Claude Desktop, click on your <B>Project</B>, then click the <B>project name</B> at the top to view its instructions. Copy the full text from the instructions panel.</P>
                  <P>If you're not using Projects, there's no system prompt to test.</P>
                </Card>

                <Card title="ChatGPT / Custom GPTs" icon="smart_toy">
                  <P>Location: <B>chatgpt.com</B> &gt; <B>Explore GPTs</B> &gt; select your GPT &gt; <B>Edit</B> &gt; <B>Configure</B> tab.</P>
                  <P>Copy everything in the <B>Instructions</B> text box.</P>
                  <P>For ChatGPT's personal "Custom Instructions," go to <B>Settings</B> &gt; <B>Personalization</B> &gt; <B>Custom Instructions</B> and copy both fields.</P>
                </Card>

                <Card title="OpenAI Codex / API" icon="code">
                  <P>Search your codebase for where you call the API. The system prompt is the string in the <Code>system</Code> role.</P>
                  <CmdBlock lines={[
                    "// OpenAI / Codex",
                    'messages: [{ role: "system", content: "You are..." }]',
                    "",
                    "// Anthropic API",
                    'system: "You are..."',
                  ]} />
                  <P>Copy the full string value. It might be inline, in a variable, or loaded from a file.</P>
                </Card>

                <Card title="Google Gemini / AI Studio" icon="diamond">
                  <P>In <B>AI Studio</B> (aistudio.google.com), open your prompt and copy the <B>System Instructions</B> field at the top.</P>
                  <P>For Gemini API calls, search your code for the <Code>system_instruction</Code> parameter.</P>
                  <CmdBlock lines={[
                    "// Gemini API",
                    'system_instruction: "You are..."',
                  ]} />
                </Card>

                <Card title="Bot frameworks (Botpress, Voiceflow, Dialogflow, etc.)" icon="support_agent">
                  <P>Open your bot's settings panel. Look for fields labeled "system message," "agent instructions," "persona," or "AI prompt." Copy the full text.</P>
                </Card>
              </div>

              <Link href="/scan/new?mode=prompt" className="inline-flex items-center gap-2 bg-charcoal text-white px-6 py-2.5 text-xs font-bold rounded-sm uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all">
                Scan an Agent
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
              </Link>
            </div>
          )}

          {/* Skill Scanner */}
          {active === "skill" && (
            <div>
              <div className="mb-8">
                <h2 className="font-headline text-xl font-bold text-charcoal mb-2">What is a skill?</h2>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  A skill (also called a plugin, action, or extension) is a reusable set of instructions that gives an AI agent a specific capability. Skills are often triggered by slash commands like <Code>/deploy</Code> or <Code>/review</Code>. Because skills often have access to powerful tools (shell execution, file writing, API calls), a compromised skill can do real damage.
                </p>
              </div>

              <h2 className="font-headline text-xl font-bold text-charcoal mb-4">Find yours by platform</h2>
              <div className="space-y-3 mb-8">

                <Card title="Claude Code skills" icon="terminal">
                  <P>Files: <Code>~/.claude/skills/&lt;skill-name&gt;/*.md</Code> (global) or <Code>.claude/skills/</Code> (per-project).</P>
                  <P>Each skill is a markdown file. Copy the full contents including the frontmatter (<Code>---</Code> block at the top).</P>
                  <CmdBlock lines={[
                    "# List all your skills",
                    "ls ~/.claude/skills/",
                    "",
                    "# Copy a specific skill",
                    "cat ~/.claude/skills/my-skill/my-skill.md | pbcopy",
                  ]} />
                </Card>

                <Card title="Claude Desktop" icon="chat">
                  <P>Claude Desktop does not have a skills system. Skills are a Claude Code feature. If you use Claude Desktop with MCP servers, use the <B>MCP Scanner</B> tab instead.</P>
                </Card>

                <Card title="ChatGPT / GPT Actions" icon="smart_toy">
                  <P>Location: <B>chatgpt.com</B> &gt; your GPT &gt; <B>Edit</B> &gt; <B>Configure</B> &gt; scroll to <B>Actions</B>.</P>
                  <P>Copy the action schema (the OpenAPI JSON or YAML that defines what the action does, its endpoints, and parameters).</P>
                </Card>

                <Card title="OpenAI Codex tasks" icon="code">
                  <P>Codex task definitions live in your repository's <Code>codex.md</Code> or <Code>AGENTS.md</Code> files.</P>
                  <P>Copy the full file contents. These define how Codex interprets and executes tasks.</P>
                </Card>

                <Card title="Google Gemini extensions" icon="diamond">
                  <P>In Gemini, extensions are configured through the API via <Code>tools</Code> definitions or in AI Studio under <B>Extensions</B>.</P>
                  <P>Copy the extension configuration including the function declarations and descriptions.</P>
                </Card>

                <Card title="GitHub Copilot Extensions / LangChain / CrewAI" icon="build">
                  <P>Find the tool or agent definition in your code. Copy the full definition including description, parameters, role, goal, and any instruction text.</P>
                </Card>
              </div>

              <Link href="/scan/new?mode=skill" className="inline-flex items-center gap-2 bg-charcoal text-white px-6 py-2.5 text-xs font-bold rounded-sm uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all">
                Scan a Skill
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
              </Link>
            </div>
          )}

          {/* MCP Scanner */}
          {active === "mcp" && (
            <div>
              <div className="mb-8">
                <h2 className="font-headline text-xl font-bold text-charcoal mb-2">What is MCP?</h2>
                <p className="text-sm text-on-surface-variant leading-relaxed mb-3">
                  MCP (Model Context Protocol) is how AI agents connect to external tools. When you give an agent access to your email, file system, database, or any other service, that connection exposes a list of tools the agent can call. The risk: a prompt injection attack can trick the agent into calling these tools in unintended ways.
                </p>
              </div>

              <div className="mb-8">
                <h2 className="font-headline text-xl font-bold text-charcoal mb-2">What AgentProbe needs</h2>
                <p className="text-sm text-on-surface-variant leading-relaxed mb-3">
                  A JSON array listing the tools your agent can access. Each tool needs a <Code>name</Code> and <Code>description</Code>. AgentProbe flags dangerous capabilities, risky tool combinations, and excessive permissions.
                </p>
                <CmdBlock lines={[
                  '[',
                  '  { "name": "send_email", "description": "Send email to any address" },',
                  '  { "name": "read_file", "description": "Read any file from disk" },',
                  '  { "name": "execute_sql", "description": "Run SQL queries" }',
                  ']',
                ]} green />
              </div>

              <h2 className="font-headline text-xl font-bold text-charcoal mb-4">Find yours by platform</h2>
              <div className="space-y-3 mb-8">

                <Card title="Claude Code" icon="terminal">
                  <P>Config: <Code>~/.claude/settings.json</Code> (look for <Code>mcpServers</Code>).</P>
                  <P>To list all available tools, type <Code>/mcp</Code> in a Claude Code session. Then ask Claude:</P>
                  <CmdBlock lines={['List every MCP tool you have access to as a JSON array.', 'For each tool, include "name" and "description". Output only the JSON.']} green />
                  <P>Copy the JSON response and paste it into AgentProbe.</P>
                </Card>

                <Card title="Claude Desktop" icon="chat">
                  <Step n={1} title="Find your config file">
                    <P>macOS: <Code>~/Library/Application Support/Claude/claude_desktop_config.json</Code></P>
                    <P>Windows: <Code>%APPDATA%\Claude\claude_desktop_config.json</Code></P>
                    <Cmd>cat ~/Library/Application\ Support/Claude/claude_desktop_config.json</Cmd>
                  </Step>
                  <Step n={2} title="Understand what's in it">
                    <P>The config lists your MCP <B>servers</B> (like "filesystem" or "slack"), not individual tools. It looks like this:</P>
                    <CmdBlock lines={[
                      '{',
                      '  "mcpServers": {',
                      '    "filesystem": { "command": "npx", "args": ["@modelcontextprotocol/server-filesystem"] },',
                      '    "slack": { "command": "npx", "args": ["@anthropic/mcp-server-slack"] }',
                      '  }',
                      '}',
                    ]} green />
                  </Step>
                  <Step n={3} title="Get the tool list">
                    <P>Open Claude Desktop and type:</P>
                    <CmdBlock lines={['List every tool you have access to as a JSON array.', 'For each tool, include "name" and "description". Output only the JSON.']} green />
                    <P>Copy the JSON response and paste it into AgentProbe.</P>
                    <P><B>Alternative:</B> Check the npm package README for each server. For example, <Code>@modelcontextprotocol/server-filesystem</Code> exposes tools like <Code>read_file</Code>, <Code>write_file</Code>, <Code>list_directory</Code>.</P>
                  </Step>
                </Card>

                <Card title="ChatGPT / GPT Actions" icon="smart_toy">
                  <P>GPT Actions use OpenAPI schemas, not MCP. To scan them:</P>
                  <P>Go to your GPT &gt; <B>Edit</B> &gt; <B>Configure</B> &gt; <B>Actions</B>. Copy the OpenAPI schema and convert each endpoint to a JSON object with <Code>name</Code> and <Code>description</Code>.</P>
                  <P>Alternatively, use the <B>Skill Scanner</B> tab and paste the raw OpenAPI schema directly.</P>
                </Card>

                <Card title="OpenAI / Codex function calling" icon="code">
                  <P>Search your code for the <Code>tools</Code> or <Code>functions</Code> parameter in your API call. Copy the full array.</P>
                  <CmdBlock lines={[
                    "// Find this in your code and copy the tools array",
                    "const response = await openai.chat.completions.create({",
                    '  model: "gpt-4",',
                    "  tools: [  // <-- copy this entire array",
                    '    { type: "function", function: { name: "send_email", ... } },',
                    '    { type: "function", function: { name: "read_file", ... } },',
                    "  ]",
                    "});",
                  ]} />
                </Card>

                <Card title="Google Gemini function calling" icon="diamond">
                  <P>In Gemini API calls, tools are defined in the <Code>tools</Code> parameter with <Code>function_declarations</Code>.</P>
                  <CmdBlock lines={[
                    "tools: [{",
                    "  function_declarations: [",
                    '    { name: "search_db", description: "Search the database" },',
                    '    { name: "send_notification", description: "Send push notification" }',
                    "  ]",
                    "}]",
                  ]} />
                  <P>Copy the <Code>function_declarations</Code> array as JSON and paste it into AgentProbe.</P>
                </Card>

                <Card title="Any agent framework (LangChain, CrewAI, AutoGen)" icon="build">
                  <P>Export your tool registry as JSON. AgentProbe needs a JSON array where each object has <Code>name</Code> and <Code>description</Code>.</P>
                </Card>
              </div>

              <div className="mb-8">
                <h2 className="font-headline text-xl font-bold text-charcoal mb-3">What the MCP Scanner looks for</h2>
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

              <Link href="/scan/new?mode=mcp" className="inline-flex items-center gap-2 bg-charcoal text-white px-6 py-2.5 text-xs font-bold rounded-sm uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all">
                Scan Your Tools
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
              </Link>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}

// Reusable components for the how-to cards
function Card({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="bg-white hairline-border rounded-sm p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="material-symbols-outlined text-charcoal" style={{ fontSize: 18 }}>{icon}</span>
        <span className="text-sm font-bold text-charcoal">{title}</span>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-on-surface-variant leading-relaxed">{children}</p>;
}

function B({ children }: { children: React.ReactNode }) {
  return <span className="font-semibold text-charcoal">{children}</span>;
}

function Code({ children }: { children: React.ReactNode }) {
  return <span className="font-mono bg-slate-100 px-1 text-xs">{children}</span>;
}

function Cmd({ children }: { children: string }) {
  return <div className="bg-charcoal rounded-sm px-3 py-2 font-mono text-xs text-slate-300">{children}</div>;
}

function CmdBlock({ lines, green }: { lines: string[]; green?: boolean }) {
  return (
    <div className="bg-charcoal rounded-sm px-3 py-2 font-mono text-xs overflow-x-auto">
      {lines.map((line, i) => (
        <div key={i} className={line === "" ? "h-2" : green ? "text-emerald-400" : "text-slate-300"}>{line || "\u00A0"}</div>
      ))}
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <p className="text-xs font-semibold text-charcoal mb-1">Step {n}: {title}</p>
      <div className="space-y-2 ml-2">{children}</div>
    </div>
  );
}
