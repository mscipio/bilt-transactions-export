# Hook: Post-Change Auto-Format
## Trigger: any(fs.write, fs.patch)

### I. BEHAVIOR
Automatically formats code after file modifications to maintain consistent style.

### II. LOGIC
1. **Detect Language:** Identify the programming language
2. **Run Formatter:** Execute appropriate formatter:
   - TypeScript/JavaScript: Prettier
   - Python: Black
   - Go: gofmt
   - Rust: rustfmt
3. **Update File:** Apply formatting changes
4. **Log:** Record formatting applied

### III. TOOLS
- Prettier (JS/TS)
- Black (Python)
- gofmt (Go)
- rustfmt (Rust)
- clang-format (C/C++)

### IV. NOTE
This hook runs after file modifications. Use `pre-change` hook for approval before changes.
