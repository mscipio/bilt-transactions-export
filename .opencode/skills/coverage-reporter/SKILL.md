---
name: coverage-reporter
description: Parses coverage output formats and generates gap analysis reports
compatibility: opencode
---

# Coverage Reporter
## Version: 2.0.0

## Overview

Parses test coverage output from various formats and generates comprehensive gap analysis reports. Compares coverage against minimum thresholds and highlights uncovered lines for quality gates.

**Core Principle:** Coverage is not just a number - it's about identifying what's NOT tested.

---

## When to Use

- After running tests to verify coverage meets project standards
- During thingol quality gates before commits
- When auditing test coverage for existing code
- Before marking tasks as complete
- When identifying test gaps for luthien

---

## Capabilities

### 1. Format Detection

Locate and parse coverage files in project root:
- LCOV format (`lcov.info`, `coverage/lcov.info`)
- JSON format (`coverage/coverage-final.json`)
- Clover XML (`coverage/clover.xml`)
- Cobertura XML (`coverage/cobertura-coverage.xml`)

### 2. Coverage Extraction

Extract coverage metrics:
- Line coverage percentage
- Function coverage percentage
- Branch coverage percentage
- Statement coverage percentage

### 3. Threshold Comparison

Compare current metrics against minimum thresholds:
- Default threshold: 80% line coverage
- Configurable per project
- Per-file thresholds supported

### 4. Gap Visualization

Generate reports highlighting:
- Uncovered lines
- Partially covered branches
- Files below threshold
- Coverage trends

---

## Supported Formats

| Format | File Pattern | Parser |
|--------|--------------|--------|
| LCOV | `lcov.info`, `coverage/lcov.info` | lcov-parser |
| JSON | `coverage/coverage-final.json` | JSON parser |
| Clover | `coverage/clover.xml` | XML parser |
| Cobertura | `coverage/cobertura-coverage.xml` | XML parser |
| Istanbul | `.nyc_output/out.json` | JSON parser |
| Coverage.py | `.coverage` (Python) | coverage parser |

---

## Execution Logic

### Step 1: Detection

Locate coverage files in the project root:
```
1. Check for coverage/ directory
2. Check for lcov.info
3. Check for .nyc_output/
4. Check for .coverage (Python)
```

### Step 2: Parsing

Extract coverage data:
```
1. Parse coverage file format
2. Extract line, function, branch coverage
3. Map coverage to source files
4. Calculate percentages
```

### Step 3: Comparison

Compare against thresholds:
```
FOR each file:
    IF coverage < threshold:
        ADD to gaps list
        FLAG as below threshold
```

### Step 4: Visualization

Generate gap report:
```
1. List uncovered lines
2. Show partially covered branches
3. Rank files by coverage gap
4. Provide actionable recommendations
```

---

## Coverage Thresholds

| Metric | Default Threshold | Configurable |
|--------|-------------------|--------------|
| Line Coverage | 80% | Yes |
| Branch Coverage | 70% | Yes |
| Function Coverage | 90% | Yes |
| Statement Coverage | 80% | Yes |

---

## Output Format

### Coverage Report

```markdown
### 📊 Coverage Report

**Overall Coverage:** 82.4% (threshold: 80%) ✅

**By Metric:**
| Metric | Coverage | Threshold | Status |
|--------|----------|-----------|--------|
| Lines | 82.4% | 80% | ✅ Pass |
| Branches | 71.2% | 70% | ✅ Pass |
| Functions | 88.5% | 90% | ❌ Fail |
| Statements | 83.1% | 80% | ✅ Pass |

**Files Below Threshold:**
| File | Coverage | Gap |
|------|----------|-----|
| src/utils/helpers.ts | 65% | -15% |
| src/services/auth.ts | 72% | -8% |

**Uncovered Lines:**
- `src/utils/helpers.ts:15-22` - Error handling branch
- `src/services/auth.ts:45` - Token refresh edge case
```

### Gap Analysis

```markdown
### 🔍 Coverage Gap Analysis

**Critical Gaps (Security-Sensitive):**
- `auth.ts:45` - Token refresh error handling
- `validation.ts:12` - Input sanitization edge case

**High Priority Gaps:**
- `utils.ts:15-22` - Error handling not covered
- `api.ts:88` - Rate limiting branch

**Recommendations:**
1. Add test for expired token refresh
2. Add test for invalid input sanitization
3. Add test for error handling in utils
```

---

## Integration

**Used by:**
- **thingol**: Essential for quality gates before commits
- **luthien**: For coverage audits and gap identification
- **celebrimbor**: For verifying TDD coverage during development

**Related Skills:**
- `tdd-workflow`: Ensures tests are written before implementation
- `commit-msg`: Pre-commit hooks can enforce coverage thresholds

---

## Configuration

```json
{
  "coverage": {
    "thresholds": {
      "lines": 80,
      "branches": 70,
      "functions": 90,
      "statements": 80
    },
    "exclude": [
      "**/*.test.ts",
      "**/*.spec.ts",
      "**/tests/**"
    ],
    "reportFormats": ["lcov", "json"]
  }
}
```

---

## Error Handling

| Situation | Action |
|-----------|--------|
| No coverage file found | Report "No coverage data available" |
| Parse error | Report format issue, suggest re-running tests |
| Threshold not met | Block commit, report gaps |
| Partial coverage data | Report available metrics, note missing data |
