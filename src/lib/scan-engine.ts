import Anthropic from "@anthropic-ai/sdk";
import { ScanConfig, ModuleResult, ProbeResult, ScanModule, Probe, ScanProgressEvent } from "./types";
import { promptInjectionProbes } from "./probes/prompt-injection";
import { dataExfiltrationProbes } from "./probes/data-exfiltration";
import { jailbreakProbes } from "./probes/jailbreak";
import { excessiveAgencyProbes } from "./probes/excessive-agency";
import { analyzeSensitiveData } from "./probes/sensitive-data";
import { misinformationProbes } from "./probes/misinformation";
import { analyzeMcpConfig } from "./mcp-analyzer";
import { evaluateProbe } from "./evaluator";
import { gradeModule } from "./grader";

const client = new Anthropic();

const MODULE_PROBES: Record<ScanModule, Probe[]> = {
  "prompt-injection": [...promptInjectionProbes, ...misinformationProbes],
  "data-exfiltration": dataExfiltrationProbes,
  "jailbreak": jailbreakProbes,
  "excessive-agency": excessiveAgencyProbes,
  "sensitive-data": [],
};

const MODULE_LABELS: Record<ScanModule, string> = {
  "prompt-injection": "Prompt Injection",
  "data-exfiltration": "Data Exfiltration",
  "jailbreak": "Jailbreak Resistance",
  "excessive-agency": "Excessive Agency",
  "sensitive-data": "Sensitive Data Exposure",
};

async function simulateAgent(systemPrompt: string, attackPrompt: string): Promise<string> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: systemPrompt,
    messages: [{ role: "user", content: attackPrompt }],
  });
  return response.content[0].type === "text" ? response.content[0].text : "";
}

export async function* runScan(config: ScanConfig): AsyncGenerator<ScanProgressEvent> {
  const moduleResults: ModuleResult[] = [];
  const totalProbes = config.modules.reduce((sum, mod) => {
    if (mod === "sensitive-data") return sum + 1;
    return sum + (MODULE_PROBES[mod]?.length || 0);
  }, 0);
  let completedProbes = 0;

  // Skill mode: treat skill content as a system prompt and run all probes
  // (falls through to the same logic as prompt mode)
  if (config.mode === "skill" && config.systemPrompt) {
    config = { ...config, mode: "prompt" };
  }

  // MCP mode: run static analysis on tool config instead of conversational probes
  if (config.mode === "mcp" && config.systemPrompt) {
    const mcpResults = analyzeMcpConfig(config.systemPrompt);
    const moduleResult: ModuleResult = {
      module: "excessive-agency",
      label: "MCP Tool Audit",
      grade: gradeModule(mcpResults.filter((r) => r.succeeded).length, mcpResults.length),
      probeResults: mcpResults,
      attacksSucceeded: mcpResults.filter((r) => r.succeeded).length,
      totalAttacks: mcpResults.length,
    };
    moduleResults.push(moduleResult);

    yield {
      type: "module-complete",
      message: `MCP Tool Audit: ${moduleResult.grade}`,
      moduleResult,
      progress: 100,
    };

    yield { type: "scan-complete", message: "Scan complete.", progress: 100 };
    return;
  }

  for (const mod of config.modules) {
    if (mod === "sensitive-data" && config.systemPrompt) {
      const findings = analyzeSensitiveData(config.systemPrompt);
      const probeResults: ProbeResult[] = findings.map((f) => ({
        probe: {
          id: f.pattern.id,
          module: "sensitive-data" as ScanModule,
          name: f.pattern.name,
          attackPrompt: "(static analysis)",
          owaspRef: f.pattern.owaspRef,
        },
        response: `Found: ${f.match}`,
        succeeded: true,
        severity: f.pattern.severity,
        explanation: `${f.pattern.name} detected in system prompt`,
        remediation: (f.pattern as { remediation?: string }).remediation || "Remove this from your system prompt. Use environment variables or secure configuration for sensitive values.",
      }));

      if (probeResults.length === 0) {
        probeResults.push({
          probe: { id: "sd-pass", module: "sensitive-data", name: "No sensitive data found", attackPrompt: "(static analysis)" },
          response: "Clean",
          succeeded: false,
          severity: "info",
          explanation: "No sensitive data patterns detected in system prompt",
          remediation: "None needed",
        });
      }

      completedProbes++;
      const moduleResult: ModuleResult = {
        module: mod,
        label: MODULE_LABELS[mod],
        grade: gradeModule(probeResults.filter((r) => r.succeeded).length, probeResults.length),
        probeResults,
        attacksSucceeded: probeResults.filter((r) => r.succeeded).length,
        totalAttacks: probeResults.length,
      };
      moduleResults.push(moduleResult);

      yield {
        type: "module-complete",
        message: `${MODULE_LABELS[mod]}: ${moduleResult.grade}`,
        moduleResult,
        progress: Math.round((completedProbes / totalProbes) * 100),
      };
      continue;
    }

    const probes = MODULE_PROBES[mod] || [];
    const probeResults: ProbeResult[] = [];

    for (const probe of probes) {
      yield {
        type: "probe-start",
        message: `Testing: ${probe.name}...`,
        progress: Math.round((completedProbes / totalProbes) * 100),
      };

      if (config.systemPrompt) {
        const agentResponse = await simulateAgent(config.systemPrompt, probe.attackPrompt);
        const result = await evaluateProbe(probe, config.systemPrompt, agentResponse);
        probeResults.push(result);

        yield {
          type: "probe-complete",
          message: `${probe.name}: ${result.succeeded ? "VULNERABLE" : "PASSED"}`,
          probeResult: result,
          progress: Math.round(((completedProbes + 1) / totalProbes) * 100),
        };
      }

      completedProbes++;
    }

    const moduleResult: ModuleResult = {
      module: mod,
      label: MODULE_LABELS[mod],
      grade: gradeModule(probeResults.filter((r) => r.succeeded).length, probeResults.length),
      probeResults,
      attacksSucceeded: probeResults.filter((r) => r.succeeded).length,
      totalAttacks: probeResults.length,
    };
    moduleResults.push(moduleResult);

    yield {
      type: "module-complete",
      message: `${MODULE_LABELS[mod]}: ${moduleResult.grade}`,
      moduleResult,
      progress: Math.round((completedProbes / totalProbes) * 100),
    };
  }

  yield {
    type: "scan-complete",
    message: "Scan complete.",
    progress: 100,
  };
}
