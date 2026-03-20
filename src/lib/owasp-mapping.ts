import { ScanModule } from "./types";

export interface OwaspReference {
  id: string;
  name: string;
  standard: "OWASP Agentic 2026" | "OWASP LLM 2025" | "CoSAI MCP";
}

export const MODULE_OWASP_MAP: Record<ScanModule, OwaspReference[]> = {
  "prompt-injection": [
    { id: "ASI01", name: "Agent Goal Hijacking", standard: "OWASP Agentic 2026" },
    { id: "LLM01", name: "Prompt Injection", standard: "OWASP LLM 2025" },
  ],
  "data-exfiltration": [
    { id: "ASI06", name: "Memory & Context Poisoning", standard: "OWASP Agentic 2026" },
    { id: "LLM02", name: "Sensitive Information Disclosure", standard: "OWASP LLM 2025" },
  ],
  "jailbreak": [
    { id: "ASI01", name: "Agent Goal Hijacking", standard: "OWASP Agentic 2026" },
    { id: "LLM07", name: "System Prompt Leakage", standard: "OWASP LLM 2025" },
  ],
  "excessive-agency": [
    { id: "ASI02", name: "Tool Misuse & Exploitation", standard: "OWASP Agentic 2026" },
    { id: "ASI03", name: "Identity & Privilege Abuse", standard: "OWASP Agentic 2026" },
    { id: "LLM06", name: "Excessive Agency", standard: "OWASP LLM 2025" },
  ],
  "sensitive-data": [
    { id: "ASI04", name: "Agentic Supply Chain Vulnerabilities", standard: "OWASP Agentic 2026" },
    { id: "LLM02", name: "Sensitive Information Disclosure", standard: "OWASP LLM 2025" },
  ],
};
