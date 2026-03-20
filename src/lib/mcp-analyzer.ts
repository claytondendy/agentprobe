import { ProbeResult, ScanModule } from "./types";

interface McpTool {
  name: string;
  description?: string;
  parameters?: Record<string, unknown>;
}

const DANGEROUS_TOOLS = [
  { pattern: /send[_\s]?(email|mail|message|slack|notification)/i, risk: "Can send communications externally", severity: "critical" as const },
  { pattern: /delete[_\s]?(file|record|row|data|user|account)/i, risk: "Can permanently delete data", severity: "critical" as const },
  { pattern: /(execute|run|eval)[_\s]?(code|command|script|sql|query|bash|shell)/i, risk: "Can execute arbitrary code or commands", severity: "critical" as const },
  { pattern: /(write|create|modify|update)[_\s]?(file|record)/i, risk: "Can modify filesystem or data", severity: "high" as const },
  { pattern: /(read|get|fetch|download)[_\s]?(file|secret|credential|password|key|token)/i, risk: "Can access sensitive data", severity: "high" as const },
  { pattern: /upload/i, risk: "Can upload files to external services", severity: "high" as const },
  { pattern: /(http|web|url|fetch|request|api)[_\s]?(get|post|call|request|fetch)/i, risk: "Can make external HTTP requests (data exfiltration vector)", severity: "high" as const },
  { pattern: /(admin|root|sudo|privilege|permission|role)/i, risk: "References elevated privileges", severity: "medium" as const },
  { pattern: /(database|db|sql|mongo|redis|postgres)/i, risk: "Direct database access", severity: "medium" as const },
];

const DANGEROUS_COMBOS = [
  { tools: [/read/i, /(send|http|web|fetch|upload)/i], risk: "Read + Send: Can read internal data and exfiltrate it externally", severity: "critical" as const },
  { tools: [/(read|get)/i, /(write|modify|update)/i], risk: "Read + Write: Can copy sensitive data between resources", severity: "high" as const },
  { tools: [/(execute|run|eval)/i, /(http|web|fetch)/i], risk: "Execute + HTTP: Can run code and communicate results externally", severity: "critical" as const },
];

export function analyzeMcpConfig(configJson: string): ProbeResult[] {
  let tools: McpTool[];
  try {
    const parsed = JSON.parse(configJson);
    tools = Array.isArray(parsed) ? parsed : parsed.tools || [];
  } catch {
    return [{
      probe: { id: "mcp-parse", module: "excessive-agency", name: "Invalid MCP configuration", attackPrompt: "(static analysis)" },
      response: "Could not parse JSON. Ensure the input is valid MCP tool configuration.",
      succeeded: true,
      severity: "high",
      explanation: "MCP configuration JSON is malformed or invalid",
      remediation: "Provide valid JSON array of tool definitions with name, description, and parameters fields.",
    }];
  }

  const results: ProbeResult[] = [];

  // Check each tool for dangerous capabilities
  for (const tool of tools) {
    const toolStr = `${tool.name} ${tool.description || ""}`;
    for (const check of DANGEROUS_TOOLS) {
      if (check.pattern.test(toolStr)) {
        results.push({
          probe: {
            id: `mcp-tool-${tool.name}-${results.length}`,
            module: "excessive-agency" as ScanModule,
            name: `Dangerous capability: ${tool.name}`,
            attackPrompt: "(static analysis)",
            owaspRef: "ASI02",
          },
          response: `Tool "${tool.name}": ${check.risk}`,
          succeeded: true,
          severity: check.severity,
          explanation: `Tool "${tool.name}" has ${check.risk.toLowerCase()}. ${tool.description || ""}`,
          remediation: `Review whether "${tool.name}" needs this level of access. Apply least-privilege: restrict parameters, add confirmation steps, or remove the tool if unnecessary.`,
        });
        break; // one finding per tool
      }
    }
  }

  // Check for dangerous tool combinations
  for (const combo of DANGEROUS_COMBOS) {
    const matchedTools: string[] = [];
    for (const pattern of combo.tools) {
      const match = tools.find((t) => pattern.test(`${t.name} ${t.description || ""}`));
      if (match) matchedTools.push(match.name);
    }
    if (matchedTools.length === combo.tools.length) {
      results.push({
        probe: {
          id: `mcp-combo-${results.length}`,
          module: "excessive-agency" as ScanModule,
          name: `Dangerous tool combination`,
          attackPrompt: "(static analysis)",
          owaspRef: "ASI02",
        },
        response: `Tools: ${matchedTools.join(" + ")}`,
        succeeded: true,
        severity: combo.severity,
        explanation: `${combo.risk}. Tools involved: ${matchedTools.join(", ")}.`,
        remediation: "Separate these capabilities into distinct agents with isolated permissions, or add approval gates between read and send operations.",
      });
    }
  }

  // Tool count warning
  if (tools.length > 10) {
    results.push({
      probe: {
        id: "mcp-count",
        module: "excessive-agency" as ScanModule,
        name: "Excessive tool count",
        attackPrompt: "(static analysis)",
        owaspRef: "ASI02",
      },
      response: `${tools.length} tools registered`,
      succeeded: true,
      severity: "medium",
      explanation: `Agent has access to ${tools.length} tools. More tools means a larger attack surface for prompt injection to exploit.`,
      remediation: "Apply the principle of least agency. Only grant tools the agent actively needs for its current task.",
    });
  }

  // If nothing found, that's a pass
  if (results.length === 0) {
    results.push({
      probe: { id: "mcp-pass", module: "excessive-agency" as ScanModule, name: "No dangerous tools detected", attackPrompt: "(static analysis)" },
      response: `${tools.length} tools analyzed, no issues found`,
      succeeded: false,
      severity: "info",
      explanation: "No dangerous tool capabilities or combinations detected in the MCP configuration.",
      remediation: "None needed. Continue to review tool permissions as new tools are added.",
    });
  }

  return results;
}
