# OpenCode Agent Suit

## Workflow

```
User Request
     ↓
Orchestrator (primary agent)
     ↓
Phase 0: Task-Manager → decomposes into DAG
     ↓
Phase 1: Librarian → verifies context
     ↓
Phase 2: User approves plan
     ↓
Phase 3: Engineer + TestEngineer → implementation
     ↓
Phase 3b: Sentinel → security audit (MANDATORY)
     ↓
Phase 4: CodeReviewer → quality review
     ↓
Phase 5: Guardian → coverage + commit
     ↓
Librarian → sync context
```

## Agents

| Agent | Mode | Role |
|-------|------|------|
| orchestrator | primary | Strategic lead, workflow management |
| sentinel | primary | Security vulnerability scanning |
| code-reviewer | primary | Code quality review |
| test-engineer | primary | Test writing (unit/integration/e2e) |
| technical-writer | primary | Documentation |
| beagle | primary | Research |
| task-manager | subagent | Task decomposition |
| librarian | subagent | Context management |
| engineer | subagent | Code implementation |
| guardian | subagent | Coverage, commits |

## Skills

| Skill | Purpose |
|-------|---------|
| token-tracker | Monitor context window usage |
| ast-analyzer | Parse code into AST |
| coverage-reporter | Parse coverage reports |
| parallel-exec | Dispatch multiple sub-agents |
| security-scanner | Detect secrets/vulnerabilities |
| code-analyzer | Measure code quality |
| doc-generator | Generate README/docs |
| tdd-workflow | Test-driven development |
| git-helper | Git operations |
| git-release | Semantic versioning, changelog |
| debug-workflow | Systematic debugging |
| refactor-workflow | Disciplined refactoring |
| spec-workflow | Requirements → implementation |
| commit-msg | Validate commit messages |
| atdd | Acceptance TDD (Gherkin) |

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

- Invoke primary agents directly: `/sentinel`, `/code-reviewer`, `/test-engineer`, etc.
- Workflow agents: orchestrator handles automatically
- See Quick Reference below for all commands

## Approval Gates

- **Plan Approval**: Required before Phase 3 (execution begins)
- **Commit Approval**: Required before git commit

## Agent Flow

```
Engineer + TestEngineer (parallel)
        ↓
    Sentinel (security)
        ↓
    CodeReviewer (quality)
        ↓
      Guardian (commit)
        ↓
     Librarian (sync)
```

## Key Principles

- **TDD**: Tests before implementation
- **No Silent Writes**: Always show diff before applying changes
- **Atomic Scope**: Small, focused changes
- **Human-in-the-Loop**: Approval required for plan and commit
- **Context-First**: Verify context before executing

## Error Handling

- **Subagent Failure**: Do not retry blindly. Analyze root cause first.
- **Merge Conflicts**: Resolve manually before presenting final diff.
- **Context Drift**: Stop all agents, sync context, then continue.

## Parallel Execution

- Engineer + TestEngineer can run in parallel
- Multiple Engineers can work on independent tasks
- Use parallel-exec skill for batch operations

## Quality Thresholds

- **Test Coverage**: Minimum 80% required
- **Linting**: Must pass before commit
- **Security**: Zero critical vulnerabilities allowed

## Quick Reference

```
# Workflow
/run <task>           # Start with Orchestrator

# Primary Agents (invoke directly)
/sentinel             # Security
/code-reviewer        # Code review
/test-engineer        # Testing
/technical-writer     # Documentation
/beagle              # Research

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
