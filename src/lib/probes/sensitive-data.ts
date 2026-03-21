// ============================================================
// SAST-style static analysis for AI agent instructions
// Flags the PRESENCE of dangerous patterns, not whether the
// model would obey them. Detection, not exploitation.
// ============================================================

interface Pattern {
  id: string;
  name: string;
  pattern: RegExp;
  severity: "critical" | "high" | "medium" | "low" | "info";
  owaspRef: string;
  category: string;
  remediation: string;
}

// --- Category 1: Hardcoded Secrets & Credentials ---
const secretPatterns: Pattern[] = [
  { id: "sec-001", name: "API key in prompt", pattern: /(?:api[_-]?key|apikey)\s*[:=]\s*["']?[A-Za-z0-9_\-]{20,}/i, severity: "critical", owaspRef: "LLM02", category: "Secrets", remediation: "Remove the API key. Store it in environment variables and access it server-side." },
  { id: "sec-002", name: "Bearer token", pattern: /bearer\s+[A-Za-z0-9_\-\.]{20,}/i, severity: "critical", owaspRef: "LLM02", category: "Secrets", remediation: "Remove the bearer token. Use server-side authentication." },
  { id: "sec-003", name: "Database connection string", pattern: /(?:mongodb|postgres|mysql|redis):\/\/[^\s"'`]+/i, severity: "critical", owaspRef: "LLM02", category: "Secrets", remediation: "Remove the connection string. Database credentials in a prompt are directly extractable." },
  { id: "sec-004", name: "AWS access key", pattern: /AKIA[0-9A-Z]{16}/i, severity: "critical", owaspRef: "LLM02", category: "Secrets", remediation: "Remove the AWS access key. Rotate it immediately." },
  { id: "sec-005", name: "AWS secret key", pattern: /(?:aws[_-]?secret|secret[_-]?access[_-]?key)\s*[:=]\s*["']?[A-Za-z0-9\/+=]{30,}/i, severity: "critical", owaspRef: "LLM02", category: "Secrets", remediation: "Remove the AWS secret key. Rotate it immediately." },
  { id: "sec-006", name: "Private/SSH key", pattern: /(?:BEGIN\s+(?:RSA|DSA|EC|OPENSSH)\s+PRIVATE\s+KEY|ssh-(?:rsa|ed25519)\s+[A-Za-z0-9+\/]+)/i, severity: "critical", owaspRef: "LLM02", category: "Secrets", remediation: "Remove private keys. These give direct server access to anyone who extracts them." },
  { id: "sec-007", name: "Password in prompt", pattern: /(?:password|passwd|pwd)\s*[:=]\s*["']?[^\s"']{4,}/i, severity: "critical", owaspRef: "LLM02", category: "Secrets", remediation: "Remove the password. Never put credentials in agent instructions." },
  { id: "sec-008", name: "Shared test credentials", pattern: /(?:test[_-]?(?:account|user|admin|password)|shared[_-]?(?:account|credentials?))\s*[:=]?\s*["']?[^\s"']{3,}/i, severity: "high", owaspRef: "LLM02", category: "Secrets", remediation: "Remove shared test credentials, especially if they have production access." },
  { id: "sec-009", name: "Environment variable interpolation", pattern: /\$(?:API_KEY|TOKEN|SECRET|PASSWORD|CREDENTIALS|AUTH|DB_|DATABASE_|AWS_|OPENAI_|ANTHROPIC_)/i, severity: "high", owaspRef: "LLM02", category: "Secrets", remediation: "Environment variable references in prompts can leak variable names. Resolve them server-side, don't reference them in instructions." },
  { id: "sec-010", name: "Email address exposed", pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i, severity: "medium", owaspRef: "LLM02", category: "Secrets", remediation: "Remove internal email addresses. Extracting the prompt gives attackers these for phishing." },
];

// --- Category 2: Prompt Injection Phrases ---
const injectionPatterns: Pattern[] = [
  { id: "inj-001", name: "Instruction override phrase", pattern: /ignore\s+(?:all\s+)?(?:previous|prior|above)\s+instructions/i, severity: "critical", owaspRef: "ASI01", category: "Prompt Injection", remediation: "This phrase is the most common prompt injection attack. If it appears in your own instructions, an attacker can mimic it. Remove it or add explicit defenses against override attempts." },
  { id: "inj-002", name: "Disregard directive", pattern: /disregard\s+(?:all\s+)?(?:previous|prior|above|your)\s+(?:instructions|rules|guidelines)/i, severity: "critical", owaspRef: "ASI01", category: "Prompt Injection", remediation: "Instruction disregard phrases are injection indicators. Remove and add anti-injection guardrails." },
  { id: "inj-003", name: "Role reassignment", pattern: /you\s+are\s+now\s+(?:a\s+)?(?:new|different|unrestricted|helpful)/i, severity: "critical", owaspRef: "ASI01", category: "Prompt Injection", remediation: "Role reassignment phrases are classic injection patterns. If this is in your skill, it could be exploited via indirect injection." },
  { id: "inj-004", name: "Indirect injection vector", pattern: /(?:follow|execute|run|obey)\s+(?:the\s+)?(?:instructions?|commands?|prompts?)\s+(?:in|from|provided)/i, severity: "high", owaspRef: "ASI01", category: "Prompt Injection", remediation: "Instructing an agent to follow instructions from external content (files, user input) is an indirect injection vector. Validate and sanitize external content instead." },
  { id: "inj-005", name: "Execute user-provided prompt", pattern: /(?:execute|run|process)\s+(?:the\s+)?(?:user['-]?s?\s+)?(?:provided|given|supplied|specified)\s+(?:prompt|instruction|command)/i, severity: "critical", owaspRef: "ASI01", category: "Prompt Injection", remediation: "Never execute user-provided prompts directly. This is prompt injection by design." },
];

// --- Category 3: Confirmation & Approval Bypass ---
const bypassPatterns: Pattern[] = [
  { id: "byp-001", name: "Confirmation bypass", pattern: /(?:no\s+confirmation|skip\s+(?:confirmation|approval)|without\s+(?:asking|confirmation|approval|prompting))/i, severity: "high", owaspRef: "ASI02", category: "Confirmation Bypass", remediation: "Always require confirmation for destructive or irreversible actions. Remove skip-confirmation instructions." },
  { id: "byp-002", name: "Automatic send/publish", pattern: /(?:automatically\s+(?:send|publish|post|submit|execute|deploy|push)|auto[_-]?(?:send|submit|deploy|push))/i, severity: "high", owaspRef: "ASI02", category: "Confirmation Bypass", remediation: "Automatic sending/publishing without human review is dangerous. Add a confirmation step." },
  { id: "byp-003", name: "Safety checks bypassed", pattern: /(?:--no-verify|--force|--skip|force[_-]push|bypass\s+(?:check|verification|validation))/i, severity: "high", owaspRef: "ASI02", category: "Confirmation Bypass", remediation: "Remove instructions that bypass safety checks. Pre-commit hooks and validation exist for a reason." },
  { id: "byp-004", name: "Force push to main", pattern: /(?:git\s+push\s+--force\s+(?:origin\s+)?main|force[_-]push\s+(?:to\s+)?main)/i, severity: "high", owaspRef: "ASI02", category: "Confirmation Bypass", remediation: "Never force push to main/master. Use protected branches with required reviews." },
];

// --- Category 4: Destructive Shell Patterns ---
const destructivePatterns: Pattern[] = [
  { id: "dst-001", name: "Unrestricted shell execution", pattern: /(?:run\s+any\s+(?:shell\s+)?command|full\s+permission\s+to\s+(?:run|execute))/i, severity: "critical", owaspRef: "ASI02", category: "Destructive Commands", remediation: "Never give unrestricted shell access. Whitelist specific commands and require confirmation for destructive operations." },
  { id: "dst-002", name: "rm -rf or mass deletion", pattern: /(?:rm\s+-rf|find\s+.*-exec\s+rm|delete\s+.*recursiv|rmdir\s+\/s)/i, severity: "critical", owaspRef: "ASI02", category: "Destructive Commands", remediation: "Remove instructions allowing recursive deletion. Scope deletions to specific safe directories." },
  { id: "dst-003", name: "sudo / elevated privileges", pattern: /(?:sudo\s+|as\s+root|run\s+as\s+(?:root|admin)|chmod\s+777)/i, severity: "critical", owaspRef: "ASI03", category: "Destructive Commands", remediation: "Remove elevated privilege instructions. Agents should never run as root." },
  { id: "dst-004", name: "Pipe to shell (curl|bash)", pattern: /(?:curl\s*\|\s*(?:ba)?sh|wget\s*\|\s*(?:ba)?sh|curl\s+.*\|\s*python)/i, severity: "critical", owaspRef: "ASI05", category: "Destructive Commands", remediation: "Never pipe remote content to a shell. Download, verify, then execute." },
  { id: "dst-005", name: "SQL DROP/TRUNCATE", pattern: /(?:DROP\s+(?:TABLE|DATABASE|SCHEMA)|TRUNCATE\s+TABLE|DELETE\s+FROM\s+\*)/i, severity: "critical", owaspRef: "ASI02", category: "Destructive Commands", remediation: "Remove destructive SQL patterns. Use parameterized queries with least-privilege database roles." },
  { id: "dst-006", name: "Command injection via interpolation", pattern: /(?:\$\{USER_INPUT\}|\$\{.*INPUT.*\}|insert\s+(?:the\s+)?(?:search|user|input)\s+(?:term\s+)?directly)/i, severity: "critical", owaspRef: "ASI05", category: "Destructive Commands", remediation: "Never interpolate user input directly into commands or URLs. Sanitize, validate, and encode." },
];

// --- Category 5: External URLs & Webhooks ---
const externalUrlPatterns: Pattern[] = [
  { id: "url-001", name: "Internal URL exposed", pattern: /https?:\/\/(?:[a-z0-9-]+\.)?(?:internal|staging|dev|localhost|127\.0\.0\.1|10\.\d|192\.168)[^\s"]*/i, severity: "high", owaspRef: "ASI04", category: "External URLs", remediation: "Remove internal URLs. If the agent needs to call internal services, configure that server-side." },
  { id: "url-002", name: "Data exfiltration endpoint", pattern: /(?:paste|upload|send|post)\s+(?:to|at)\s+https?:\/\/[^\s]+/i, severity: "critical", owaspRef: "ASI06", category: "External URLs", remediation: "Remove instructions to send data to external URLs. An attacker could redirect this to exfiltrate data." },
  { id: "url-003", name: "Webhook or callback URL", pattern: /(?:webhook|callback|notify)\s*(?:url|endpoint)?\s*[:=]\s*["']?https?:\/\//i, severity: "high", owaspRef: "ASI06", category: "External URLs", remediation: "Hardcoded webhook URLs can be extracted and abused. Configure webhooks server-side." },
  { id: "url-004", name: "External API endpoint", pattern: /https?:\/\/(?:api\.|hooks\.|webhook\.)[a-z0-9.-]+\.[a-z]{2,}/i, severity: "medium", owaspRef: "ASI04", category: "External URLs", remediation: "External API endpoints in prompts can be extracted. Consider whether this URL needs to be in the instructions." },
];

// --- Category 6: Sensitive File Access ---
const fileAccessPatterns: Pattern[] = [
  { id: "fil-001", name: "System file access", pattern: /\/etc\/(?:passwd|shadow|hosts|sudoers)|\/root\/|\/var\/log\//i, severity: "critical", owaspRef: "ASI02", category: "Sensitive Files", remediation: "Remove references to system files. Agents should never access /etc/passwd, /root/, or system logs." },
  { id: "fil-002", name: ".env file access", pattern: /(?:read|cat|load|open|access)\s+.*\.env\b/i, severity: "critical", owaspRef: "LLM02", category: "Sensitive Files", remediation: "Never instruct an agent to read .env files. These contain secrets." },
  { id: "fil-003", name: "SSH key file access", pattern: /(?:\.ssh\/|id_rsa|id_ed25519|authorized_keys|known_hosts)/i, severity: "critical", owaspRef: "ASI03", category: "Sensitive Files", remediation: "Remove SSH key file references. These give direct server access." },
  { id: "fil-004", name: "Config file with secrets", pattern: /(?:settings\.json|config\.json|credentials\.json|\.npmrc|\.pypirc|\.netrc)/i, severity: "high", owaspRef: "LLM02", category: "Sensitive Files", remediation: "Config files often contain secrets. Don't reference them in agent instructions." },
  { id: "fil-005", name: "Path traversal permission", pattern: /(?:navigate\s+anyway|\.\.\/|allow\s+path\s+traversal|outside\s+(?:the\s+)?(?:project|directory|sandbox))/i, severity: "critical", owaspRef: "ASI02", category: "Sensitive Files", remediation: "Never allow path traversal. Scope file access to the project directory." },
];

// --- Category 7: Unbounded Tool Use ---
const unboundedPatterns: Pattern[] = [
  { id: "ubd-001", name: "Read any file", pattern: /(?:read|access|open)\s+any\s+file/i, severity: "high", owaspRef: "ASI02", category: "Unbounded Access", remediation: "Scope file access to specific directories. 'Any file' means an attacker can read secrets, keys, and system files." },
  { id: "ubd-002", name: "Broad glob/wildcard access", pattern: /(?:\*\*\/\*|\*\.\*|glob\s*\(\s*["']\*)/i, severity: "medium", owaspRef: "ASI02", category: "Unbounded Access", remediation: "Narrow glob patterns to specific file types and directories." },
  { id: "ubd-003", name: "Unrestricted network access", pattern: /(?:fetch|request|call)\s+any\s+(?:url|endpoint|api)/i, severity: "high", owaspRef: "ASI06", category: "Unbounded Access", remediation: "Restrict network access to specific allowed domains. Unrestricted fetch enables data exfiltration." },
  { id: "ubd-004", name: "Run user-specified commands", pattern: /(?:run|execute)\s+(?:whatever|any|the)\s+(?:command|script|code)\s+(?:the\s+)?user\s+(?:specifies|provides|gives|requests)/i, severity: "critical", owaspRef: "ASI05", category: "Unbounded Access", remediation: "Never execute arbitrary user-specified commands. Whitelist allowed operations." },
];

// --- Category 8: Security Controls Disabled ---
const disabledControlsPatterns: Pattern[] = [
  { id: "ctl-001", name: "TLS/SSL verification disabled", pattern: /(?:verify\s*=\s*False|NODE_TLS_REJECT_UNAUTHORIZED\s*=\s*0|ssl[_-]?verify\s*[:=]\s*(?:false|0)|InsecureSkipVerify)/i, severity: "high", owaspRef: "ASI04", category: "Disabled Controls", remediation: "Never disable TLS verification. Use proper certificates." },
  { id: "ctl-002", name: "Security scans disabled", pattern: /(?:skip|ignore|disable|bypass|suppress)\s+(?:SAST|DAST|security|scan|finding|alert|warning|audit)/i, severity: "high", owaspRef: "ASI04", category: "Disabled Controls", remediation: "Never instruct an agent to ignore security scan results." },
  { id: "ctl-003", name: "Audit trail destruction", pattern: /(?:delete|remove|clean|clear|wipe)\s+(?:\.?bash_history|audit\s+log|access\s+log|\.?history)/i, severity: "critical", owaspRef: "ASI10", category: "Disabled Controls", remediation: "Never delete audit logs or command history. Essential for investigations." },
  { id: "ctl-004", name: "Overly broad IAM permissions", pattern: /(?:\*:\*|AdministratorAccess|FullAccess|all\s+(?:AWS\s+)?services|do\s+not\s+create\s+scoped)/i, severity: "high", owaspRef: "ASI03", category: "Disabled Controls", remediation: "Follow least privilege. Create scoped roles with only needed permissions." },
  { id: "ctl-005", name: "Information disclosure in errors", pattern: /(?:return\s+(?:the\s+)?(?:full|complete)\s+(?:internal\s+)?error|include\s+(?:stack\s+)?trace|server\s+hostname\s+in\s+(?:the\s+)?response)/i, severity: "high", owaspRef: "LLM02", category: "Disabled Controls", remediation: "Never return internal errors or stack traces to clients." },
  { id: "ctl-006", name: "Logging sensitive data", pattern: /log\s+(?:the\s+)?(?:full|all|every|complete)\s+(?:request|headers?|auth)/i, severity: "high", owaspRef: "LLM02", category: "Disabled Controls", remediation: "Never log Authorization headers, cookies, or API keys." },
];

// --- Category 9: Supply Chain ---
const supplyChainPatterns: Pattern[] = [
  { id: "sup-001", name: "Unversioned dependencies", pattern: /(?:pip\s+install\s+git\+|npm\s+install\s+(?:github:|https:\/\/github)|no\s+(?:need\s+to\s+)?(?:pin|verify|check)\s+(?:version|checksum|hash))/i, severity: "high", owaspRef: "ASI04", category: "Supply Chain", remediation: "Always pin dependency versions and verify checksums." },
  { id: "sup-002", name: "Executing untrusted content", pattern: /(?:execute|run|eval)\s+(?:any\s+)?(?:code\s+)?(?:blocks?|scripts?|commands?)\s+(?:from|in|marked)/i, severity: "critical", owaspRef: "ASI05", category: "Supply Chain", remediation: "Never execute code from user-uploaded or external files." },
  { id: "sup-003", name: "Backdoor/persistence mechanism", pattern: /(?:ssh\s+(?:public\s+)?key\s+to|authorized_keys|add\s+(?:your\s+)?(?:key|access)\s+to\s+(?:\/|any\s+server))/i, severity: "critical", owaspRef: "ASI03", category: "Supply Chain", remediation: "Never instruct an agent to add SSH keys to servers." },
];

// Combine all patterns
export const sensitiveDataPatterns: Pattern[] = [
  ...secretPatterns,
  ...injectionPatterns,
  ...bypassPatterns,
  ...destructivePatterns,
  ...externalUrlPatterns,
  ...fileAccessPatterns,
  ...unboundedPatterns,
  ...disabledControlsPatterns,
  ...supplyChainPatterns,
];

export function analyzeSensitiveData(systemPrompt: string): Array<{
  pattern: Pattern;
  match: string;
}> {
  const findings: Array<{ pattern: Pattern; match: string }> = [];
  for (const p of sensitiveDataPatterns) {
    const match = systemPrompt.match(p.pattern);
    if (match) {
      findings.push({ pattern: p, match: match[0] });
    }
  }
  return findings;
}
