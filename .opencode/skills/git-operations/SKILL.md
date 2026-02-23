---
name: git-operations
description: Git operations, semantic versioning, changelog generation, and release management
compatibility: opencode
---

# Git Operations
## Version: 2.0.0

## What I Do

- Execute common git operations (add, commit, status, diff, log, branch)
- Determine version bumps (major/minor/patch) based on commits
- Generate changelog from conventional commits
- Create git tags for releases
- Help with merge conflict resolution

---

## Common Operations

| Operation | Command | Purpose |
|-----------|---------|---------|
| Status | `git status` | Check repository state |
| Stage | `git add .` | Stage all changes |
| Commit | `git commit -m "message"` | Commit with message |
| Diff | `git diff` | View changes |
| Log | `git log --oneline -10` | Recent commits |
| Branches | `git branch -a` | List all branches |
| Stash | `git stash` | Temporarily save changes |

---

## Semantic Versioning

### Version Bump Logic

| Commit Type | Version Bump | Example |
|-------------|--------------|---------|
| `BREAKING CHANGE` or `!` | MAJOR | 1.0.0 → 2.0.0 |
| `feat:` | MINOR | 1.0.0 → 1.1.0 |
| `fix:` | PATCH | 1.0.0 → 1.0.1 |

### Release Steps

1. Analyze commits since last tag
2. Determine version bump
3. Update version files (package.json, pyproject.toml, etc.)
4. Generate changelog
5. Create git tag
6. Push tags

---

## Changelog Generation

Parse conventional commits into sections:

| Commit Prefix | Changelog Section |
|---------------|-------------------|
| `feat:` | Added |
| `fix:` | Fixed |
| `perf:` | Changed |
| `docs:` | Documentation |
| `refactor:` | Changed |
| `test:` | Changed |
| `chore:` | (Omitted by default) |

### Changelog Format

```markdown
## [1.2.0] - 2026-02-21

### Added
- New authentication system

### Fixed
- Memory leak in rendering

### Changed
- Improved performance of search
```

---

## Merge Conflict Resolution

1. Identify conflicting files: `git status`
2. Open each file and locate conflict markers
3. Resolve by choosing/combining changes
4. Stage resolved files: `git add <file>`
5. Continue: `git rebase --continue` or `git commit`

---

## Tag Management

| Command | Purpose |
|---------|---------|
| `git tag -a v1.0.0 -m "Release 1.0.0"` | Create annotated tag |
| `git tag -l` | List all tags |
| `git tag -l "v1.*"` | List tags matching pattern |
| `git show v1.0.0` | Show tag details |
| `git push origin --tags` | Push all tags |
| `git push origin v1.0.0` | Push specific tag |
| `git tag -d v1.0.0` | Delete local tag |
| `git push origin --delete v1.0.0` | Delete remote tag |

---

## Integration

**Used by:**
- **Guardian**: For commits, releases, and changelog generation
- **Librarian**: For context tracking and commit analysis
- **Orchestrator**: For branch management and push operations

**Related Skills:**
- `commit-msg`: For commit message validation
- `coverage-reporter`: For pre-commit coverage checks
