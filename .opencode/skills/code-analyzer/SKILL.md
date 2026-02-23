---
name: code-analyzer
description: Analyzes code quality, complexity, patterns, and maintainability metrics
compatibility: opencode
---

# Code Analyzer
## Version: 2.0.0

## Overview

Analyzes code quality through objective metrics including cyclomatic complexity, function length, code smells, and maintainability. Provides quantitative data for code reviews.

**Core Principle:** Objective metrics complement subjective review.

---

## When to Use

- During code reviews to provide objective quality metrics
- When identifying refactoring candidates
- For measuring code quality trends over time
- Before approving pull requests
- When auditing existing codebases

---

## Capabilities

### 1. Complexity Analysis

Measure cyclomatic complexity per function:
- Count independent paths through code
- Identify overly complex functions
- Suggest simplification opportunities

### 2. Size Metrics

Calculate lines of code metrics:
- Lines per function
- Lines per class
- Lines per file
- Total project size

### 3. Duplication Detection

Identify repeated code patterns:
- Exact duplicates
- Similar code blocks
- Copy-paste candidates

### 4. Naming Analysis

Check naming consistency:
- Variable naming patterns
- Function naming conventions
- Class naming standards

### 5. Coupling Analysis

Analyze import dependencies:
- Circular references
- Excessive imports
- Dependency depth

---

## Metrics Analyzed

| Metric | Description | Threshold | Action |
|--------|-------------|-----------|--------|
| **Cyclomatic Complexity** | Number of independent paths through code | < 10 per function | Refactor if exceeded |
| **Function Length** | Lines of code per function | < 50 lines | Split if exceeded |
| **Class Size** | Lines of code per class | < 300 lines | Extract if exceeded |
| **Duplication** | Percentage of duplicated code | < 5% | DRY if exceeded |
| **Coupling** | Number of dependencies | Context-dependent | Review if high |
| **Cohesion** | Relatedness of class members | High | Refactor if low |

---

## Code Smells Detected

### Critical Smells

| Smell | Detection | Severity |
|-------|-----------|----------|
| God Class | Class > 300 lines | High |
| God Function | Function > 50 lines | High |
| Deep Nesting | > 4 levels of indentation | High |
| Long Parameter List | > 4 parameters | Medium |

### Design Smells

| Smell | Detection | Severity |
|-------|-----------|----------|
| Feature Envy | Method uses another class more | Medium |
| Data Clumps | Same parameters appear together | Medium |
| Primitive Obsession | Overuse of primitives | Low |
| Missing Abstraction | Complex logic without class | Medium |

### Maintainability Smells

| Smell | Detection | Severity |
|-------|-----------|----------|
| Dead Code | Unreachable code | Medium |
| Magic Numbers | Unnamed constants | Low |
| Duplicate Code | Similar code blocks | High |
| Inconsistent Naming | Mixed naming conventions | Low |

---

## Output Format

### Quality Report

```markdown
### 📊 Code Quality Report

**Overall Score:** 78/100

**Metrics Summary:**
| Metric | Value | Threshold | Status |
|--------|-------|-----------|--------|
| Cyclomatic Complexity (avg) | 8.2 | < 10 | ✅ |
| Function Length (avg) | 24 | < 50 | ✅ |
| Class Size (avg) | 180 | < 300 | ✅ |
| Duplication | 3.2% | < 5% | ✅ |
| Test Coverage | 82% | > 80% | ✅ |

**Code Smells Found:**
| Smell | Count | Severity |
|-------|-------|----------|
| Long Function | 3 | Medium |
| Deep Nesting | 2 | High |
| Magic Numbers | 5 | Low |

**Files Needing Attention:**
1. `src/services/auth.ts` - Complexity: 15 (threshold: 10)
2. `src/utils/helpers.ts` - Duplication: 12%
```

### Complexity Analysis

```markdown
### 🔍 Complexity Analysis: src/services/auth.ts

**Overall Complexity:** 15 (High)

**Function Breakdown:**
| Function | Complexity | Lines | Status |
|----------|------------|-------|--------|
| `login()` | 3 | 15 | ✅ Good |
| `handleOAuth()` | 12 | 85 | ❌ Refactor |
| `refreshToken()` | 4 | 20 | ✅ Good |
| `validateSession()` | 2 | 10 | ✅ Good |

**Recommendations:**
1. Split `handleOAuth()` into smaller functions
2. Extract error handling to separate method
3. Reduce nesting in OAuth flow
```

---

## Integration

**Used by:**
- **finrod**: Essential for objective quality metrics during review
- **celebrimbor**: Essential for self-assessment during implementation
- **mandos**: For identifying refactoring tasks

**Related Skills:**
- `ast-analyzer`: For accurate code structure analysis
- `refactor-workflow`: For addressing detected code smells

---

## Configuration

```json
{
  "codeAnalyzer": {
    "thresholds": {
      "complexity": 10,
      "functionLength": 50,
      "classSize": 300,
      "duplication": 5
    },
    "exclude": [
      "**/*.test.ts",
      "**/*.spec.ts",
      "**/node_modules/**"
    ],
    "smells": {
      "godClass": true,
      "longFunction": true,
      "deepNesting": true,
      "duplication": true
    }
  }
}
```

---

## Error Handling

| Situation | Action |
|-----------|--------|
| Parse error | Skip file, report issue |
| File too large | Analyze in chunks |
| Unsupported language | Report limitation |
| No metrics available | Return partial results |
