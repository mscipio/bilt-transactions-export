# OpenCode Agent Suit - Agent Instructions

> **Purpose:** This file is loaded by opencode.json as agent instructions.
> For project overview, see root AGENTS.md.

## Workflow

```
User Request
     ↓
feanor (primary agent)
     ↓
Phase 0: Brainstorming (research + adversarial analysis)
     ↓
Phase 1: Writing Plans (granular tasks via mandos)
     ↓
Phase 1b: Plan Review (quality gate)
     ↓
Phase 2: Git Worktrees (isolated workspace)
     ↓
Phase 3: Subagent-Driven Development (TDD implementation)
     ↓
Phase 3a: luthien (coverage audit + edge cases)
     ↓
Phase 3b: gandalf (security audit - MANDATORY)
     ↓
Phase 4: finrod (two-stage review)
     ↓
Phase 5: thingol (coverage + commit)
     ↓
Finishing Branch (merge/PR/cleanup)
     ↓
melian (sync context)
```

## Agents

| Agent | Mode | Role |
|-------|------|------|
| feanor | primary | Strategic lead, workflow management, git push & branch management |
| gandalf | primary | Security vulnerability scanning (ONLY) |
| finrod | primary | Code quality review (NOT security - that's gandalf) |
| luthien | primary | Coverage audits, edge case testing, E2E tests |
| vaire | primary | Documentation |
| ulmo | primary | Research |
| mandos | subagent | Task decomposition |
| melian | subagent | Context management |
| celebrimbor | subagent | Code implementation with TDD (unit tests ONLY) |
| thingol | subagent | Coverage enforcement, commits |

### Ownership Clarifications

- **Security:** gandalf ONLY (finrod does NOT check security)
- **Coverage:** thingol enforces thresholds; luthien identifies gaps and writes tests
- **Unit Tests:** celebrimbor owns TDD cycle for unit tests
- **E2E Tests:** luthien owns E2E and edge case tests
- **Iteration Limits:** Maximum 3 cycles for reviews, fixes, and plan revisions

### Naming Conventions

- **File names:** lowercase (e.g., `mandos.md`)
- **YAML `name` field:** lowercase (e.g., `name: mandos`)
- **Prose references:** lowercase for readability (e.g., "The mandos agent...")
- **Dispatch/tool calls:** lowercase (e.g., `task(subagent_type="mandos")`)

| Agent | YAML Name | Display Name |
|-------|-----------|--------------|
| feanor | `feanor` | The feanor |
| gandalf | `gandalf` | The gandalf |
| finrod | `finrod` | The finrod |
| luthien | `luthien` | The luthien |
| vaire | `vaire` | The vaire |
| ulmo | `ulmo` | The ulmo |
| mandos | `mandos` | The mandos |
| melian | `melian` | The melian |
| celebrimbor | `celebrimbor` | The celebrimbor |
| thingol | `thingol` | The thingol |

### Tool Availability

| Tool | Available To |
|------|--------------|
| `codesearch` | ulmo, gandalf (Exa Code API for library docs) |
| `websearch` | ulmo (general web search) |
| `webfetch` | gandalf, ulmo (fetch specific URLs) |
| `read` | All agents |
| `glob` | All agents |
| `grep` | All agents |

## Skills (20)

### Workflow Skills (7)

| Skill | Purpose |
|-------|---------|
| brainstorming | Iterative design with research and adversarial analysis |
| writing-plans | Granular implementation plans (2-5 min steps) |
| plan-review | Quality gate before execution |
| using-git-worktrees | Isolated workspace creation |
| subagent-driven-development | Task execution with two-stage review |
| finishing-a-development-branch | Merge/PR/cleanup workflow |
| fast-path | Simplified workflow for simple tasks |

### Quality Skills (5)

| Skill | Purpose |
|-------|---------|
| tdd-workflow | Test-driven development with Iron Law |
| systematic-debugging | 4-phase root cause investigation |
| code-analyzer | Objective quality metrics |
| refactor-workflow | Disciplined refactoring |
| atdd | Acceptance TDD (Gherkin) |

### Utility Skills (8)

| Skill | Purpose |
|-------|---------|
| parallel-exec | Concurrent subagent execution |
| token-tracker | Context window monitoring |
| coverage-reporter | Test coverage reports |
| git-operations | Git operations, versioning, changelog |
| security-scanner | Detect secrets/vulnerabilities |
| doc-generator | Generate README/docs |
| ast-analyzer | Parse code into AST |
| commit-msg | Validate commit messages |

## Hooks

| Hook | Trigger | Purpose |
|------|---------|---------|
| pre-change | Before write/edit | Human approval for file changes |
| post-change | After file write | Auto-format code |
| pre-commit | Before git commit | Quality gate (tests, lint) |
| post-checkout | After git checkout | Detect context drift |
| post-sync | After task complete | Sync context |
| on-error | Subagent crash | Error diagnostics |

## Usage

- Invoke primary agents directly: `/gandalf`, `/finrod`, `/luthien`, etc.
- Workflow agents: feanor handles automatically
- See Quick Reference below for all commands

## Approval Gates

- **Plan Approval**: Required before Phase 3 (execution begins)
- **Commit Approval**: Required before thingol commits (Phase 5)
- **Push Approval**: Required before feanor pushes to remote

## Agent Flow

```
celebrimbor (TDD implementation)
        ↓
    luthien (coverage audit + edge cases)
        ↓
    gandalf (security)
        ↓
    finrod (quality)
        ↓
      thingol (commit)
        ↓
    feanor (push)
        ↓
     melian (sync)
```

## Key Principles

- **TDD**: Tests before implementation
- **No Silent Writes**: Always show diff before applying changes
- **Atomic Scope**: Small, focused changes
- **Human-in-the-Loop**: Approval required for plan and commit
- **Context-First**: Verify context before executing

## Decision Points

### Fast-Path vs. Full Workflow

| Criteria | Fast-Path | Full Workflow |
|----------|-----------|---------------|
| Files affected | ≤3 files | 4+ files |
| Time estimate | <30 minutes | >30 minutes |
| Architecture | No decisions needed | Design required |
| Dependencies | None new | New deps possible |
| Security | Not sensitive | May be sensitive |

**Default:** Use full workflow. Only use fast-path when ALL criteria are met.

### Parallel Execution

**CAN parallelize:**
- Independent file modifications
- Separate feature modules
- Non-overlapping tests

**MUST sequential:**
- celebrimbor → luthien (coverage audit)
- luthien → gandalf (security)
- gandalf → finrod (quality)
- finrod → thingol (commit)

### When to Escalate

| Situation | Action |
|-----------|--------|
| 3+ review cycles failed | Escalate to feanor |
| Security issue found | Stop, fix, re-scan |
| Context drift detected | Stop, sync, verify |
| Merge conflict | Manual resolution required |
| User rejects design | Return to Phase 0 |

### Issue Type → Return Agent Mapping

| Issue Type | Return To | Rationale |
|------------|-----------|-----------|
| Spec compliance | celebrimbor | Implementation doesn't match requirements |
| Code quality | celebrimbor | Code structure/naming issues |
| Security vulnerability | celebrimbor | Security issues require code changes |
| Coverage below threshold | luthien | luthien writes additional tests |
| Test failure | celebrimbor | celebrimbor owns fixing their tests |
| Documentation drift | vaire | vaire updates docs |
| Context drift | melian | melian syncs context |

**Maximum 3 cycles per issue type.** After 3 failures, escalate to feanor.

## Error Handling

- **Subagent Failure**: Do not retry blindly. Analyze root cause first.
- **Merge Conflicts**: Resolve manually before presenting final diff.
- **Context Drift**: Stop all agents, sync context, then continue.

## Parallel Execution

- Multiple celebrimbors can work on independent tasks
- Use parallel-exec skill for batch operations
- luthien runs AFTER celebrimbor completes (sequential, not parallel)

## Quality Thresholds

- **Test Coverage**: Minimum 80% required
- **Linting**: Must pass before commit
- **Security**: Zero critical vulnerabilities allowed

## Quick Reference

```
# Workflow
/run <task>           # Start with feanor

# Primary Agents (invoke directly)
/gandalf             # Security
/finrod              # Code review
/luthien             # Testing
/vaire               # Documentation
/ulmo                # Research

# Context Management
/init-context         # Initialize context
/sync-context        # Sync context
/detect-drift        # Check external changes
/explain-context     # Query context vault
/revert-milestone    # Rollback to previous state

# Quality & Security
/security-scan       # Quick security scan
/audit              # Full security audit
/code-review        # Code quality review

# Git Operations
/commit              # Create commit (thingol)
/push                # Push to remote (feanor)
/branch              # Manage branches (feanor)

# Development
/refactor            # Refactor code
/debug               # Debug issues
/migrate            # Migrate libraries

# Test & Docs
/run-tests          # Run test suite
/tests              # Generate tests
/docs               # Generate docs

# Release & Maintenance
/generate-release   # Create release
/chores            # Update deps, format
```
