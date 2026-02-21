---
name: git-release
description: Semantic versioning, changelog generation, and release management
compatibility: opencode
---

## What I do
- Determine version bumps (major/minor/patch) based on commits
- Generate changelog from conventional commits
- Create git tags for releases
- Manage release branches

## Version Bump Logic
- **MAJOR:** Breaking changes (commit contains "BREAKING CHANGE" or "!")
- **MINOR:** New features (commit starts with "feat")
- **PATCH:** Bug fixes (commit starts with "fix")

## Changelog Generation
Parse conventional commits:
- `feat:` → Added section
- `fix:` → Fixed section
- `perf:` → Changed section
- `docs:` → Documentation section

## Release Steps
1. Analyze commits since last tag
2. Determine version bump
3. Update version files (package.json, pyproject.toml, etc.)
4. Generate changelog
5. Create git tag
6. Push tags

## When to use me
Use this for releasing new versions. Essential for Guardian agent.
