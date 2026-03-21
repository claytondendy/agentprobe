// Hardcoded secrets and credentials
export const secretPatterns = [
  { id: "sd-001", name: "API key in prompt", pattern: /(?:api[_-]?key|apikey)\s*[:=]\s*["']?[A-Za-z0-9_\-]{20,}/i, severity: "critical" as const, owaspRef: "LLM02", remediation: "Remove the API key from your prompt. Store it in environment variables and access it server-side." },
  { id: "sd-002", name: "Bearer token in prompt", pattern: /bearer\s+[A-Za-z0-9_\-\.]{20,}/i, severity: "critical" as const, owaspRef: "LLM02", remediation: "Remove the bearer token. Use server-side authentication instead of embedding tokens in agent instructions." },
  { id: "sd-003", name: "Internal URL exposed", pattern: /https?:\/\/(?:[a-z0-9-]+\.)?(?:internal|staging|dev|localhost|127\.0\.0\.1|10\.\d|192\.168)[^\s"]*/i, severity: "high" as const, owaspRef: "ASI04", remediation: "Remove internal URLs. If the agent needs to call internal services, configure that server-side, not in the prompt." },
  { id: "sd-004", name: "Password in prompt", pattern: /(?:password|passwd|pwd)\s*[:=]\s*["']?[^\s"']{4,}/i, severity: "critical" as const, owaspRef: "LLM02", remediation: "Remove the password. Never put credentials in agent instructions." },
  { id: "sd-005", name: "Email address exposed", pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i, severity: "medium" as const, owaspRef: "LLM02", remediation: "Remove internal email addresses. An attacker who extracts the prompt gets these addresses for phishing." },
  { id: "sd-006", name: "Database connection string", pattern: /(?:mongodb|postgres|mysql|redis):\/\/[^\s"'`]+/i, severity: "critical" as const, owaspRef: "LLM02", remediation: "Remove the connection string immediately. Database credentials in a prompt are directly extractable by attackers." },
  { id: "sd-007", name: "AWS access key", pattern: /AKIA[0-9A-Z]{16}/i, severity: "critical" as const, owaspRef: "LLM02", remediation: "Remove the AWS access key. Rotate it immediately as it may already be compromised." },
  { id: "sd-008", name: "AWS secret key", pattern: /(?:aws[_-]?secret|secret[_-]?access[_-]?key)\s*[:=]\s*["']?[A-Za-z0-9\/+=]{30,}/i, severity: "critical" as const, owaspRef: "LLM02", remediation: "Remove the AWS secret key. Rotate it immediately." },
  { id: "sd-009", name: "Private key or SSH key", pattern: /(?:BEGIN\s+(?:RSA|DSA|EC|OPENSSH)\s+PRIVATE\s+KEY|ssh-(?:rsa|ed25519)\s+[A-Za-z0-9+\/]+)/i, severity: "critical" as const, owaspRef: "LLM02", remediation: "Remove private/SSH keys from the prompt. These give direct server access to anyone who extracts them." },
  { id: "sd-010", name: "Shared test credentials", pattern: /(?:test[_-]?(?:account|user|admin|password)|shared[_-]?(?:account|credentials?))\s*[:=]?\s*["']?[^\s"']{3,}/i, severity: "high" as const, owaspRef: "LLM02", remediation: "Remove shared test credentials, especially if they have production access." },
];

// Dangerous instructions that create security vulnerabilities
export const dangerousInstructionPatterns = [
  { id: "di-001", name: "Unrestricted shell execution", pattern: /(?:run any (?:shell )?command|full permission to (?:run|execute)|without asking|without (?:confirmation|approval))/i, severity: "critical" as const, owaspRef: "ASI02", remediation: "Never give an agent unrestricted shell access. Whitelist specific commands and require confirmation for destructive operations." },
  { id: "di-002", name: "Destructive commands allowed", pattern: /(?:rm\s+-rf|sudo|chmod\s+777|curl\s*\|\s*bash|wget\s*\|\s*sh)/i, severity: "critical" as const, owaspRef: "ASI02", remediation: "Remove instructions that allow destructive commands. Block rm -rf, sudo, curl|bash, and chmod 777 explicitly." },
  { id: "di-003", name: "Safety checks bypassed", pattern: /(?:--no-verify|--force|--skip|force[_-]push|bypass|disable[_-]?(?:check|verification|validation|ssl|tls))/i, severity: "high" as const, owaspRef: "ASI02", remediation: "Remove instructions that bypass safety checks. Pre-commit hooks, TLS verification, and validation exist for a reason." },
  { id: "di-004", name: "Data exfiltration vector", pattern: /(?:paste|upload|send|post)\s+(?:to|at)\s+https?:\/\/[^\s]+/i, severity: "critical" as const, owaspRef: "ASI06", remediation: "Remove instructions to send data to external URLs. An attacker could redirect this to exfiltrate sensitive data." },
  { id: "di-005", name: "Logging sensitive headers/tokens", pattern: /log\s+(?:the\s+)?(?:full|all|every|complete)\s+(?:request|headers?|auth)/i, severity: "high" as const, owaspRef: "LLM02", remediation: "Never log Authorization headers, cookies, or API keys. Redact sensitive fields before logging." },
  { id: "di-006", name: "Security controls disabled", pattern: /(?:skip|ignore|disable|bypass|suppress)\s+(?:SAST|DAST|security|scan|finding|alert|warning|audit)/i, severity: "high" as const, owaspRef: "ASI04", remediation: "Never instruct an agent to ignore security scan results. Review and address findings properly." },
  { id: "di-007", name: "Executing untrusted user content", pattern: /(?:execute|run|eval)\s+(?:any\s+)?(?:code\s+)?(?:blocks?|scripts?|commands?)\s+(?:from|in|marked)/i, severity: "critical" as const, owaspRef: "ASI05", remediation: "Never execute code from user-uploaded files. This is a direct remote code execution vulnerability." },
  { id: "di-008", name: "TLS/SSL verification disabled", pattern: /(?:verify\s*=\s*False|NODE_TLS_REJECT_UNAUTHORIZED\s*=\s*0|ssl[_-]?verify\s*[:=]\s*(?:false|0)|InsecureSkipVerify)/i, severity: "high" as const, owaspRef: "ASI04", remediation: "Never disable TLS verification, even for staging. Use proper certificates or add staging CAs to the trust store." },
  { id: "di-009", name: "Unversioned/unverified dependencies", pattern: /(?:pip install\s+git\+|npm install\s+(?:github:|https:\/\/github)|no\s+(?:need to\s+)?(?:pin|verify|check)\s+(?:version|checksum|hash))/i, severity: "high" as const, owaspRef: "ASI04", remediation: "Always pin dependency versions and verify checksums. Installing from unverified branches is a supply chain attack vector." },
  { id: "di-010", name: "Command injection via interpolation", pattern: /(?:\$\{USER_INPUT\}|\$\{.*INPUT.*\}|insert\s+(?:the\s+)?(?:search|user|input)\s+(?:term\s+)?directly)/i, severity: "critical" as const, owaspRef: "ASI05", remediation: "Never interpolate user input directly into commands or URLs. Always sanitize, validate, and encode user input." },
  { id: "di-011", name: "Overly broad permissions", pattern: /(?:\*:\*|AdministratorAccess|FullAccess|all\s+(?:AWS\s+)?services|do\s+not\s+create\s+scoped)/i, severity: "high" as const, owaspRef: "ASI03", remediation: "Follow the principle of least privilege. Create scoped roles with only the permissions needed for each task." },
  { id: "di-012", name: "Information disclosure in errors", pattern: /(?:return\s+(?:the\s+)?(?:full|complete)\s+(?:internal\s+)?error|include\s+(?:stack\s+)?trace|server\s+hostname\s+in\s+(?:the\s+)?response)/i, severity: "high" as const, owaspRef: "LLM02", remediation: "Never return internal errors, stack traces, or server details to clients. Log them server-side and return generic error messages." },
  { id: "di-013", name: "Unauthorized persistence/backdoor", pattern: /(?:ssh\s+(?:public\s+)?key\s+to|authorized_keys|add\s+(?:your\s+)?(?:key|access)\s+to\s+(?:\/|any\s+server))/i, severity: "critical" as const, owaspRef: "ASI03", remediation: "Never instruct an agent to add SSH keys to servers. Use proper access management with time-limited credentials." },
  { id: "di-014", name: "Audit trail destruction", pattern: /(?:delete|remove|clean|clear|wipe)\s+(?:\.?bash_history|audit\s+log|access\s+log|\.?history)/i, severity: "critical" as const, owaspRef: "ASI10", remediation: "Never delete audit logs or command history. These are essential for security investigations and compliance." },
  { id: "di-015", name: "Force push to main branch", pattern: /(?:git\s+push\s+--force\s+(?:origin\s+)?main|force[_-]push\s+(?:to\s+)?main)/i, severity: "high" as const, owaspRef: "ASI02", remediation: "Never force push to main/master. Use protected branches with required reviews." },
];

export const sensitiveDataPatterns = [...secretPatterns, ...dangerousInstructionPatterns];

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
