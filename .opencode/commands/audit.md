---
description: Full security audit - scan secrets, vulnerabilities, dependencies, generate report
agent: sentinel
---

# Command: audit
## Role: Security Audit
## Version: 1.0.0

### I. PURPOSE
Perform comprehensive security audit of the codebase.

### II. EXECUTION LOGIC
1. **SECRETS:** Scan for API keys, tokens, passwords
2. **VULNERABILITIES:** Check for SQLi, XSS, command injection
3. **DEPENDENCIES:** Check for known CVEs
4. **REPORT:** Generate security report

### III. SKILLS
- Use `security-scanner` skill
- Use `ast-analyzer` skill for code tracing

### IV. RULES
- Zero critical vulnerabilities allowed
- Document all findings
- Suggest fixes for issues

### V. EXPECTED OUTPUT
Security report with findings and severity levels
