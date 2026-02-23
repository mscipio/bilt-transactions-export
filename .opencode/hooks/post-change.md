---
name: post-change
description: Auto-format code after file modifications
trigger: any(fs.write, fs.patch)
---

# Hook: Post-Change Auto-Format
## Version: 2.0.0

### I. PURPOSE

Automatically formats code after file modifications to maintain consistent style across the codebase. Ensures all code follows project formatting standards without requiring manual intervention.

### II. BEHAVIOR

Automatically formats code after file modifications to maintain consistent style. Runs after the pre-change hook has approved modifications.

### III. LOGIC

1. **Detect Language:** Identify the programming language from file extension
2. **Run Formatter:** Execute appropriate formatter:
   - TypeScript/JavaScript: Prettier
   - Python: Black
   - Go: gofmt
   - Rust: rustfmt
3. **Update File:** Apply formatting changes silently
4. **Log:** Record formatting applied for audit trail

### IV. TOOLS

| Language | Formatter | Config File |
|----------|-----------|-------------|
| TypeScript/JavaScript | Prettier | `.prettierrc` |
| Python | Black | `pyproject.toml` |
| Go | gofmt | (built-in) |
| Rust | rustfmt | `rustfmt.toml` |
| C/C++ | clang-format | `.clang-format` |

### V. CONFIGURATION

| Option | Default | Description |
|--------|---------|-------------|
| `enabled` | `true` | Enable/disable auto-formatting |
| `format_on_save` | `true` | Format when file is saved |
| `show_notification` | `false` | Show notification when formatting |

### VI. INTEGRATION

**Affects:**
- `celebrimbor`: After code changes
- `vaire`: After documentation changes
- Any agent with write permissions

**Related Hooks:**
- `pre-change`: Must approve before this hook runs

### VII. ERROR HANDLING

| Error | Action |
|-------|--------|
| Formatter not found | Skip formatting, log warning |
| Config file missing | Use default settings |
| Parse error | Skip file, log error |
| Permission denied | Skip file, notify user |

### VIII. EXAMPLES

**TypeScript file formatted:**
```
[post-change] Formatted src/auth.ts with Prettier
 - 12 lines changed
 - Applied .prettierrc configuration
```

**Python file formatted:**
```
[post-change] Formatted src/api.py with Black
 - 8 lines changed
 - Applied pyproject.toml configuration
```
