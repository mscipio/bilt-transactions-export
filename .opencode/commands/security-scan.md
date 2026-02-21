---
description: Quick security scan - detect secrets and vulnerabilities in changed files
agent: sentinel
---

# Command: security-scan
## Role: Quick Security Scan
## Version: 1.0.0

### I. PURPOSE
Quick security scan of changed files for immediate feedback.

### II. EXECUTION LOGIC
1. **SCAN:** Run security checks on changed files
2. **DETECT:** Find hardcoded secrets, unsafe patterns
3. **REPORT:** Report findings immediately

### III. SKILLS
- Use `security-scanner` skill

### IV. EXPECTED OUTPUT
Security findings or "No issues found"
