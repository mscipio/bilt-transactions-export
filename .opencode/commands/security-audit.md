---
description: Security audit - scan for secrets, vulnerabilities, dependencies. Use --quick for fast scan of changed files only.
agent: gandalf
---

# Command: security-audit
## Version: 2.0.0

## Purpose

Scan codebase for security issues. Supports quick scan (changed files) and full audit (entire codebase). Essential for security gates before commits.

## Agent Assignment

**Agent:** gandalf
**Why:** gandalf is the security specialist responsible for vulnerability detection.

## Usage

```bash
opencode security-audit          # Full audit
opencode security-audit --quick  # Quick scan of changed files
```

## Execution Logic

### Quick Scan (--quick)

1. **IDENTIFY:** Get changed files from git
2. **SCAN:** Check for hardcoded secrets, unsafe patterns
3. **REPORT:** Immediate feedback on findings

### Full Audit

1. **SECRETS:** Scan for API keys, tokens, passwords
2. **VULNERABILITIES:** Check for SQLi, XSS, command injection
3. **DEPENDENCIES:** Check for known CVEs
4. **REPORT:** Generate comprehensive security report

## Skills Used

- `security-scanner`: For automated vulnerability and secret detection
- `ast-analyzer`: For code tracing during full audit

## Severity Levels

| Level | Description | Action |
|-------|-------------|--------|
| **Critical** | Active vulnerability, exposed secrets | Block immediately |
| **High** | Significant security risk | Fix before merge |
| **Medium** | Potential issue | Address soon |
| **Low** | Minor concern | Document and schedule |

## Expected Output

```markdown
### 🔒 Security Review: [Feature/File Name]

**Verdict:** ✅ SEC-CLEARED / ❌ SECURITY ISSUES FOUND

**Mode:** Quick / Full
**Files Scanned:** [N]

#### Critical Issues (Block)
- **[File:Line]** [Issue description]
  - **Risk:** [Description of security risk]
  - **Fix:** [Specific recommendation]

#### High Issues (Fix Before Merge)
- **[File:Line]** [Issue description]
  - **Risk:** [Description of security risk]
  - **Fix:** [Specific recommendation]

#### Medium Issues (Review)
- **[File:Line]** [Issue description]
  - **Recommendation:** [Suggestion]

#### Low Issues (Document)
- **[File:Line]** [Issue description]

#### Summary
[Overall security assessment]

**Issues Found:** Critical: [N], High: [N], Medium: [N], Low: [N]
**Recommendation:** [Next steps]
```

## Rules

- **Zero critical vulnerabilities allowed:** Block commits if critical issues found
- **Document all findings:** Keep audit trail
- **Suggest fixes:** Don't just identify problems

## Error Handling

- **No files to scan:** "No files to scan. Stage changes first or run without --quick."
- **Scan timeout:** "Scan timed out. Try --quick for faster results."
