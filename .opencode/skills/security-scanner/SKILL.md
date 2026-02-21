---
name: security-scanner
description: Scans code for security vulnerabilities, hardcoded secrets, and unsafe patterns
compatibility: opencode
---

## What I do
- Detect hardcoded API keys, passwords, tokens, and secrets
- Find common vulnerability patterns (SQL injection, XSS, command injection)
- Identify unsafe dependencies with known CVEs
- Check for insecure coding patterns (weak crypto, hardcoded credentials)

## Detection Categories
- **Secrets:** API keys, tokens, passwords in code
- **Injection:** SQL injection, command injection, XSS vectors
- **Crypto:** Weak encryption, hardcoded IVs, weak random
- **Dependencies:** Known CVEs in package.json, requirements.txt

## When to use me
Use this before any code review to ensure no security issues slip through. Essential for Sentinel agent workflow.
