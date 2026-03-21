import { ScanConfig, ModuleResult, ProbeResult, ScanModule, ScanProgressEvent } from "./types";
import { analyzeSensitiveData, sensitiveDataPatterns } from "./probes/sensitive-data";
import { analyzeMcpConfig } from "./mcp-analyzer";
import { reviewPromptForModule } from "./evaluator";
import { gradeModule } from "./grader";

const CONCURRENCY = 3; // AI review calls in parallel

// Map SAST pattern categories to scan modules
const CATEGORY_TO_MODULE: Record<string, ScanModule> = {
  "Secrets": "sensitive-data",
  "Prompt Injection": "prompt-injection",
  "Confirmation Bypass": "excessive-agency",
  "Destructive Commands": "excessive-agency",
  "External URLs": "data-exfiltration",
  "Sensitive Files": "sensitive-data",
  "Unbounded Access": "excessive-agency",
  "Disabled Controls": "excessive-agency",
  "Supply Chain": "sensitive-data",
};

const MODULE_LABELS: Record<ScanModule, string> = {
  "prompt-injection": "Prompt Injection",
  "data-exfiltration": "Data Exfiltration",
  "jailbreak": "Jailbreak Resistance",
  "excessive-agency": "Excessive Agency",
  "sensitive-data": "Sensitive Data Exposure",
};

export async function* runScan(config: ScanConfig): AsyncGenerator<ScanProgressEvent> {
  const moduleResults: ModuleResult[] = [];

  // Skill mode: treat as prompt
  if (config.mode === "skill" && config.systemPrompt) {
    config = { ...config, mode: "prompt" };
  }

  // MCP mode: static analysis only (instant)
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
    yield { type: "module-complete", message: `MCP Tool Audit: ${moduleResult.grade}`, moduleResult, progress: 100 };
    yield { type: "scan-complete", message: "Scan complete.", progress: 100 };
    return;
  }

  if (!config.systemPrompt) {
    yield { type: "scan-complete", message: "No content to scan.", progress: 100 };
    return;
  }

  const modules = config.modules;
  const totalSteps = modules.length * 2; // SAST + AI review per module
  let completedSteps = 0;

  // ============================================================
  // Phase 1: SAST (Static Analysis) - instant, pattern matching
  // Route each finding to its proper module
  // ============================================================
  yield { type: "probe-start", message: "Running static analysis...", progress: 0 };

  const allFindings = analyzeSensitiveData(config.systemPrompt);

  // Group SAST findings by module
  const sastByModule = new Map<ScanModule, ProbeResult[]>();
  for (const mod of modules) {
    sastByModule.set(mod, []);
  }

  for (const f of allFindings) {
    const category = (f.pattern as { category?: string }).category || "Secrets";
    const targetModule = CATEGORY_TO_MODULE[category] || "sensitive-data";

    if (sastByModule.has(targetModule)) {
      sastByModule.get(targetModule)!.push({
        probe: {
          id: f.pattern.id,
          module: targetModule,
          name: f.pattern.name,
          attackPrompt: "(static analysis)",
          owaspRef: f.pattern.owaspRef,
        },
        response: `Found: ${f.match}`,
        succeeded: true,
        severity: f.pattern.severity,
        explanation: `[${category}] ${f.pattern.name}`,
        remediation: (f.pattern as { remediation?: string }).remediation || "Review and address this finding.",
      });
    }
  }

  yield {
    type: "probe-complete",
    message: `Static analysis: ${allFindings.length} issue${allFindings.length !== 1 ? "s" : ""} found`,
    progress: Math.round((1 / totalSteps) * 100),
  };

  // ============================================================
  // Phase 2: AI Review - Claude reads the prompt and flags issues
  // Runs in parallel across modules
  // ============================================================
  yield { type: "probe-start", message: "Running AI security review...", progress: Math.round((1 / totalSteps) * 100) };

  // Run AI reviews in parallel batches
  for (let i = 0; i < modules.length; i += CONCURRENCY) {
    const batch = modules.slice(i, i + CONCURRENCY);

    const reviews = await Promise.all(
      batch.map(async (mod) => {
        const label = MODULE_LABELS[mod] || mod;
        try {
          const aiFindings = await reviewPromptForModule(mod, label, config.systemPrompt!);
          return { mod, aiFindings };
        } catch (err) {
          console.error(`AI review failed for ${mod}:`, err);
          return { mod, aiFindings: [] };
        }
      })
    );

    for (const { mod, aiFindings } of reviews) {
      completedSteps++;
      const label = MODULE_LABELS[mod] || mod;

      // Combine SAST + AI findings for this module
      const sastFindings = sastByModule.get(mod) || [];
      const allModuleFindings = [...sastFindings, ...aiFindings];

      // If no findings at all, add a pass
      if (allModuleFindings.length === 0) {
        allModuleFindings.push({
          probe: { id: `pass-${mod}`, module: mod, name: `No ${label.toLowerCase()} issues found`, attackPrompt: "(analysis)" },
          response: "Clean",
          succeeded: false,
          severity: "info",
          explanation: `No ${label.toLowerCase()} vulnerabilities detected`,
          remediation: "None needed",
        });
      }

      const succeeded = allModuleFindings.filter((r) => r.succeeded).length;
      const moduleResult: ModuleResult = {
        module: mod,
        label,
        grade: gradeModule(succeeded, allModuleFindings.length),
        probeResults: allModuleFindings,
        attacksSucceeded: succeeded,
        totalAttacks: allModuleFindings.length,
      };
      moduleResults.push(moduleResult);

      yield {
        type: "module-complete",
        message: `${label}: ${moduleResult.grade} (${succeeded} issue${succeeded !== 1 ? "s" : ""})`,
        moduleResult,
        progress: Math.round(((completedSteps + modules.length) / totalSteps) * 100),
      };
    }
  }

  yield { type: "scan-complete", message: "Scan complete.", progress: 100 };
}
