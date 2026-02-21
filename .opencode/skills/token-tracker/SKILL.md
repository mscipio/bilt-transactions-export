---
name: token-tracker
description: Monitors context window usage and prevents token overflow during agent orchestration
compatibility: opencode
---

## What Calculate token count of I do
- context snippets before passing to agents
- Warn when prompts exceed 80% of model's context limit
- Suggest context compression strategies when approaching limits

## Execution Logic
1. Calculate token count of `context_snippet` + `file_content` before passing to an agent
2. If prompt exceeds 80% of model's context limit, interrupt with a TOKEN_WARNING
3. Suggest `summarize_module` to compress context before proceeding

## When to use me
Use this when running complex multi-agent workflows to prevent context overflow.
