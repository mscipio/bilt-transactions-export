---
name: security-scanner
description: Scans code for security vulnerabilities, hardcoded secrets, and unsafe patterns
compatibility: opencode
---

# Security Scanner
## Version: 2.0.0

## Overview

Scans codebase for security vulnerabilities, hardcoded secrets, and unsafe coding patterns. Provides automated detection of common security issues before code review.

**Core Principle:** Security issues should be caught before code review, not after deployment.

---

## When to Use

- Before any code review to ensure no security issues slip through
- During Sentinel agent workflow for security audits
- As part of pre-commit hooks for security validation
- When auditing existing code for vulnerabilities

---

## Capabilities

### 1. Secret Detection

Detect hardcoded sensitive data:
- API keys and tokens
- Passwords and credentials
- Private keys and certificates
- OAuth secrets

### 2. Vulnerability Scanning

Find common vulnerability patterns:
- SQL injection vectors
- Command injection risks
- XSS vulnerabilities
- Path traversal issues

### 3. Dependency Audit

Identify unsafe dependencies:
- Known CVEs in packages
- Outdated packages with security patches
- Deprecated packages with vulnerabilities

### 4. Pattern Analysis

Check for insecure coding patterns:
- Weak cryptography
- Missing validation
- Insecure configurations

---

## Detection Categories

### Critical Severity

| Category | Patterns Detected | Example |
|----------|-------------------|---------|
| **Secrets** | API keys, tokens, passwords in code | `const API_KEY = "sk-1234567890"` |
| **SQL Injection** | Unsanitized SQL queries | `"SELECT * FROM users WHERE id = " + userId` |
| **Command Injection** | User input in shell commands | `exec(userInput)` |

### High Severity

| Category | Patterns Detected | Example |
|----------|-------------------|---------|
| **XSS** | Unsanitized HTML output | `element.innerHTML = userInput` |
| **Path Traversal** | User input in file paths | `fs.readFile(userPath)` |
| **Weak Crypto** | Insecure algorithms | `md5(password)` |

### Medium Severity

| Category | Patterns Detected | Example |
|----------|-------------------|---------|
| **Missing Validation** | No input sanitization | Missing validation middleware |
| **Insecure Config** | Debug mode enabled | `DEBUG = true` in production |
| **Missing Auth** | Unprotected endpoints | No auth middleware |

---

## Common Patterns Detected

### Hardcoded Secrets

```javascript
// CRITICAL - Hardcoded API key
const API_KEY = "sk-1234567890abcdef";

// CRITICAL - Hardcoded password
const DB_PASSWORD = "admin123";

// CRITICAL - Private key in code
const PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----";
```

### Injection Vulnerabilities

```javascript
// CRITICAL - SQL Injection
const query = "SELECT * FROM users WHERE id = " + userId;

// CRITICAL - Command Injection
exec(`ls ${userInput}`);

// HIGH - XSS
element.innerHTML = userInput;
```

### Weak Cryptography

```javascript
// HIGH - Weak hashing
const hash = md5(password);

// HIGH - Weak encryption
const encrypted = des.encrypt(data, key);

// MEDIUM - Weak random
const token = Math.random().toString();
```

---

## Scan Output Format

```markdown
### 🔒 Security Review: [Feature/File Name]

**Verdict:** ✅ SEC-CLEARED / ❌ SECURITY ISSUES FOUND

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

**Files Scanned:** [N]
**Issues Found:** Critical: [N], High: [N], Medium: [N], Low: [N]
```

---

## Severity Levels

| Level | Definition | Action |
|-------|------------|--------|
| **Critical** | Active vulnerability, exposed secrets | Block immediately |
| **High** | Significant security risk | Fix before merge |
| **Medium** | Potential issue | Address soon |
| **Low** | Minor concern | Document and schedule |

---

## Integration

**Used by:**
- **Sentinel**: Essential for security audit workflow
- **Guardian**: Pre-commit security validation
- **pre-commit hook**: Security validation before commits

**Related Skills:**
- `ast-analyzer`: For accurate code structure analysis during scans
- `code-analyzer`: For general code quality metrics

---

## Configuration

```json
{
  "securityScanner": {
    "severity": {
      "blockOn": ["critical", "high"],
      "warnOn": ["medium", "low"]
    },
    "patterns": {
      "secrets": true,
      "injection": true,
      "xss": true,
      "crypto": true
    },
    "exclude": [
      "**/*.test.ts",
      "**/test/**"
    ]
  }
}
```

---

## False Positive Handling

| Situation | Action |
|-----------|--------|
| Test file with fake secrets | Exclude test directories |
| Example code with placeholders | Document as intentional |
| Environment variable defaults | Verify it's a fallback, not hardcoded |

---

## Error Handling

| Situation | Action |
|-----------|--------|
| Scan timeout | Report timeout, suggest --quick mode |
| Parse error | Skip file, report issue |
| Large file | Scan in chunks |
