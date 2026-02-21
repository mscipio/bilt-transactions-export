---
name: coverage-reporter
description: Parses coverage output formats and generates gap analysis reports
compatibility: opencode
---

## What I do
- Locate coverage files in project root (lcov, json, xml formats)
- Extract line, function, and branch coverage percentages
- Compare against minimum thresholds
- Generate markdown tables of uncovered lines

## Execution Logic
1. **Detection:** Locate coverage files in the project root (e.g., `/coverage`)
2. **Parsing:** Extract % of lines, functions, and branches covered
3. **Comparison:** Compare current metrics against `min_threshold` defined in config
4. **Visualization:** Generate a Markdown table highlighting "uncovered" lines in newly modified files

## When to use me
Use this after running tests to verify coverage meets project standards. Essential for Guardian quality gates.
