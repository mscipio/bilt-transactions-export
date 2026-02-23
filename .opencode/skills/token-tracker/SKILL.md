---
name: token-tracker
description: Monitors context window usage and prevents token overflow during agent orchestration
compatibility: opencode
---

# Token Tracker
## Version: 2.0.0

## Overview

Monitors context window usage to prevent token overflow during complex multi-agent workflows. Calculates token counts before passing context to agents and warns when approaching model limits.

**Core Principle:** Prevent context overflow before it happens, not after.

---

## When to Use

- Before dispatching subagents with large context
- During long-running orchestration sessions
- When processing large files or multiple context snippets
- Before complex multi-step operations
- When aggregating multiple file contents

---

## Capabilities

- **Token Counting:** Calculate token count of context snippets before passing to agents
- **Threshold Warning:** Warn when prompts exceed 80% of model's context limit
- **Compression Suggestions:** Suggest context compression strategies when approaching limits
- **Budget Tracking:** Track cumulative token usage across session

---

## Model Context Limits

| Model | Context Window | 80% Threshold |
|-------|---------------|---------------|
| GPT-4 | 8,192 tokens | 6,553 tokens |
| GPT-4-32k | 32,768 tokens | 26,214 tokens |
| GPT-4-Turbo | 128,000 tokens | 102,400 tokens |
| Claude 3 Opus | 200,000 tokens | 160,000 tokens |
| Claude 3 Sonnet | 200,000 tokens | 160,000 tokens |

---

## Execution Logic

### Step 1: Calculate Token Count

Before passing context to an agent:
1. Count tokens in `context_snippet`
2. Count tokens in `file_content` (if any)
3. Add overhead for system prompt (~500 tokens)
4. Calculate total estimated usage

### Step 2: Threshold Check

```
IF total_tokens > 80% of context_limit:
    TRIGGER TOKEN_WARNING
    SUGGEST compression strategies
ELSE:
    PROCEED with dispatch
```

### Step 3: Compression Strategies

When approaching limits, suggest:

| Strategy | When to Use | Effect |
|----------|-------------|--------|
| **Symbol Extraction** | Large files | Extract only function/class signatures |
| **Summary Mode** | Multiple files | Summarize each file in 2-3 sentences |
| **Diff Only** | Code review | Include only changed lines, not full file |
| **Reference Links** | Documentation | Link to files instead of including content |
| **Chunking** | Very large files | Process in multiple passes |

### Step 4: Session Budget Tracking

Log token usage for the session:
- Total tokens used
- Tokens per agent dispatch
- Remaining budget
- Peak usage

---

## Token Estimation Formula

```
estimated_tokens = (
    system_prompt_tokens +
    context_snippet_tokens +
    file_content_tokens +
    response_buffer_tokens (typically 1000-2000)
)
```

---

## Warning Levels

| Level | Threshold | Action |
|-------|-----------|--------|
| **Green** | < 60% | Proceed normally |
| **Yellow** | 60-80% | Log warning, consider compression |
| **Orange** | 80-90% | Require compression before proceeding |
| **Red** | > 90% | Block dispatch, mandatory compression |

---

## Example Usage

### Scenario: Dispatching celebrimbor with Large Context

```
1. Calculate: context_snippet = 15,000 tokens
2. Calculate: file_content (3 files) = 8,000 tokens
3. Calculate: system_prompt = 500 tokens
4. Total: 23,500 tokens

5. Check: GPT-4 limit = 8,192 tokens
6. Result: 23,500 > 6,553 (80% threshold)

7. Action: TOKEN_WARNING
   - Suggest: Extract symbols only (reduces to ~3,000 tokens)
   - Suggest: Summarize 2 of 3 files (reduces by ~5,000 tokens)
```

---

## Integration

**Used by:**
- **feanor**: Before dispatching subagents with context
- **melian**: When loading large context files
- **mandos**: When creating task breakdowns with context
- **parallel-exec**: When dispatching multiple agents simultaneously

**Related Skills:**
- `ast-analyzer`: Can extract symbols to reduce context size
- `code-analyzer`: Can summarize code metrics instead of full content

---

## Output Format

```markdown
### 📊 Token Usage Report

**Status:** [Green/Yellow/Orange/Red]
**Current Usage:** X / Y tokens (Z%)
**Remaining Budget:** W tokens

**Breakdown:**
- Context snippet: X tokens
- File content: Y tokens
- System prompt: Z tokens

**Recommendations:**
- [Compression strategy 1]
- [Compression strategy 2]
```
