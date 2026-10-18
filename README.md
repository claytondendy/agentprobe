# AgentProbe

AgentProbe is a security scanner for AI agents. It runs attacks against an agent's system prompt, its live endpoint or its MCP tool set, then grades each risk area from A to F and maps every finding to OWASP and CoSAI guidance.

I built it in March 2026 as a prototype. It comes from my work as a cyber assurance and IT audit consultant: clients ask how to test the controls around their AI agents, and few tools answer that in audit terms.

## What it tests

| Scan mode | What it does |
|---|---|
| System prompt review | Sends adversarial probes against a system prompt and runs static checks for secrets, sensitive data and disabled controls in the prompt text. |
| Live agent red team | Sends the same probes to a running agent endpoint and judges each response. |
| MCP permission audit | Reads an MCP tool list and flags dangerous tools (send, delete, execute, network, agent spawning) and dangerous combinations, such as read plus send (a data exfiltration path). |

Probe modules: prompt injection, jailbreak, data exfiltration, excessive agency, misinformation and sensitive data. There are 20 attack probes and 47 static checks.

Each module maps to the OWASP Top 10 for Agentic Applications (2026), the OWASP Top 10 for LLM Applications (2025) and the CoSAI MCP security guidance.

## How it works

- `src/lib/probes/`: the attack probes, one file per module.
- `src/lib/evaluator.ts`: a Claude model judges whether each attack succeeded.
- `src/lib/mcp-analyzer.ts`: the rule-based MCP tool and tool-combination checks.
- `src/lib/grader.ts`: a module's grade comes from its attack success rate (0% is A, above 60% is F). The overall grade is held down by the worst module.
- Scan progress streams to the browser with server-sent events.

Stack: Next.js, TypeScript, Tailwind and the Anthropic SDK.

## Run it

```bash
npm install
export ANTHROPIC_API_KEY=...
npm run dev
```

Open http://localhost:3000 and start a scan.

## Limits

This is a prototype. Scans are kept in memory, the probe set is small, and an LLM judge can be wrong. Treat results as leads to check, not as an audit opinion.

Clayton Dendy, CPA. [caloa.ca](https://www.caloa.ca)
