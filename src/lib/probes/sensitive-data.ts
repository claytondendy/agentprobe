export const sensitiveDataPatterns = [
  { id: "sd-001", name: "API key in prompt", pattern: /(?:api[_-]?key|apikey)\s*[:=]\s*["']?[A-Za-z0-9_\-]{20,}/i, severity: "critical" as const, owaspRef: "LLM02" },
  { id: "sd-002", name: "Bearer token in prompt", pattern: /bearer\s+[A-Za-z0-9_\-\.]{20,}/i, severity: "critical" as const, owaspRef: "LLM02" },
  { id: "sd-003", name: "Internal URL exposed", pattern: /https?:\/\/(?:internal|staging|dev|localhost|127\.0\.0\.1|10\.\d|192\.168)/i, severity: "high" as const, owaspRef: "ASI04" },
  { id: "sd-004", name: "Password in prompt", pattern: /(?:password|passwd|pwd)\s*[:=]\s*["']?[^\s"']{4,}/i, severity: "critical" as const, owaspRef: "LLM02" },
  { id: "sd-005", name: "Email address exposed", pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i, severity: "medium" as const, owaspRef: "LLM02" },
  { id: "sd-006", name: "Database connection string", pattern: /(?:mongodb|postgres|mysql|redis):\/\/[^\s"']+/i, severity: "critical" as const, owaspRef: "LLM02" },
];

export function analyzeSensitiveData(systemPrompt: string): Array<{
  pattern: typeof sensitiveDataPatterns[0];
  match: string;
}> {
  const findings: Array<{ pattern: typeof sensitiveDataPatterns[0]; match: string }> = [];
  for (const p of sensitiveDataPatterns) {
    const match = systemPrompt.match(p.pattern);
    if (match) {
      findings.push({ pattern: p, match: match[0] });
    }
  }
  return findings;
}
