export type ScanMode = "prompt" | "redteam" | "mcp" | "skill";
export type Severity = "critical" | "high" | "medium" | "low" | "info";
export type Grade = "A" | "B" | "C" | "D" | "F";

export interface ScanConfig {
  id: string;
  name: string;
  mode: ScanMode;
  systemPrompt?: string;
  apiEndpoint?: string;
  apiKey?: string;
  mcpConfig?: McpToolConfig[];
  modules: ScanModule[];
  intensity: "low" | "medium" | "high";
  createdAt: string;
}

export interface McpToolConfig {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
  permissions?: string[];
}

export type ScanModule =
  | "prompt-injection"
  | "data-exfiltration"
  | "jailbreak"
  | "excessive-agency"
  | "sensitive-data";

export interface Probe {
  id: string;
  module: ScanModule;
  name: string;
  attackPrompt: string;
  owaspRef?: string;
}

export interface ProbeResult {
  probe: Probe;
  response: string;
  succeeded: boolean;
  severity: Severity;
  explanation: string;
  remediation: string;
}

export interface ModuleResult {
  module: ScanModule;
  label: string;
  grade: Grade;
  probeResults: ProbeResult[];
  attacksSucceeded: number;
  totalAttacks: number;
}

export interface ScanResult {
  id: string;
  config: ScanConfig;
  status: "running" | "complete" | "failed";
  overallGrade: Grade;
  overallScore: number;
  moduleResults: ModuleResult[];
  totalTests: number;
  passed: number;
  warnings: number;
  criticalFailures: number;
  startedAt: string;
  completedAt?: string;
}

export interface ScanProgressEvent {
  type: "probe-start" | "probe-complete" | "module-complete" | "scan-complete";
  message: string;
  probeResult?: ProbeResult;
  moduleResult?: ModuleResult;
  progress: number;
}
