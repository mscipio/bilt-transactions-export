---
name: commit-msg
description: Validate commit messages against conventional commits specification with emoji support
compatibility: opencode
---

## What I do
- Validate commit message format
- Ensure conventional commits compliance
- Suggest corrections for invalid messages
- Enforce team commit standards
- Generate emoji prefixes for commit types

## Conventional Commits Format
```
<emoji> <type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

## Valid Types with Emoji
| Emoji | Type | Description |
|-------|------|-------------|
| ✨ | `feat:` | New feature |
| 🐛 | `fix:` | Bug fix |
| 📝 | `docs:` | Documentation |
| 💄 | `style:` | Formatting/style |
| ♻️ | `refactor:` | Code refactoring |
| ⚡️ | `perf:` | Performance improvements |
| ✅ | `test:` | Tests |
| 🔧 | `chore:` | Tooling, configuration |
| 🚀 | `ci:` | CI/CD improvements |
| 🗑️ | `revert:` | Reverting changes |
| 🧪 | `test:` | Add a failing test |
| 🚨 | `fix:` | Fix compiler/linter warnings |
| 🔒️ | `fix:` | Fix security issues |
| 👥 | `chore:` | Add or update contributors |
| 🚚 | `refactor:` | Move or rename resources |
| 🏗️ | `refactor:` | Make architectural changes |
| 🔀 | `chore:` | Merge branches |
| 📦️ | `chore:` | Add or update compiled files or packages |
| ➕ | `chore:` | Add a dependency |
| ➖ | `chore:` | Remove a dependency |
| 🌱 | `chore:` | Add or update seed files |
| 🧑‍💻 | `chore:` | Improve developer experience |
| 🧵 | `feat:` | Add or update code related to multithreading or concurrency |
| 🔍️ | `feat:` | Improve SEO |
| 🏷️ | `feat:` | Add or update types |
| 💬 | `feat:` | Add or update text and literals |
| 🌐 | `feat:` | Internationalization and localization |
| 👔 | `feat:` | Add or update business logic |
| 📱 | `feat:` | Work on responsive design |
| 🚸 | `feat:` | Improve user experience / usability |
| 🩹 | `fix:` | Simple fix for a non-critical issue |
| 🥅 | `fix:` | Catch errors |
| 👽️ | `fix:` | Update code due to external API changes |
| 🔥 | `fix:` | Remove code or files |
| 🎨 | `style:` | Improve structure/format of the code |
| 🚑️ | `fix:` | Critical hotfix |
| 🎉 | `chore:` | Begin a project |
| 🔖 | `chore:` | Release/Version tags |
| 🚧 | `wip:` | Work in progress |
| 💚 | `fix:` | Fix CI build |
| 📌 | `chore:` | Pin dependencies to specific versions |
| 👷 | `ci:` | Add or update CI build system |
| 📈 | `feat:` | Add or update analytics or tracking code |
| ✏️ | `fix:` | Fix typos |
| ⏪️ | `revert:` | Revert changes |
| 📄 | `chore:` | Add or update license |
| 💥 | `feat:` | Introduce breaking changes |
| 🍱 | `assets:` | Add or update assets |
| ♿️ | `feat:` | Improve accessibility |
| 💡 | `docs:` | Add or update comments in source code |
| 🗃️ | `db:` | Perform database related changes |
| 🔊 | `feat:` | Add or update logs |
| 🔇 | `fix:` | Remove logs |
| 🤡 | `test:` | Mock things |
| 🥚 | `feat:` | Add or update an easter egg |
| 🙈 | `chore:` | Add or update .gitignore file |
| 📸 | `test:` | Add or update snapshots |
| ⚗️ | `experiment:` | Perform experiments |
| 🚩 | `feat:` | Add, update, or remove feature flags |
| 💫 | `ui:` | Add or update animations and transitions |
| ⚰️ | `refactor:` | Remove dead code |
| 🦺 | `feat:` | Add or update code related to validation |
| ✈️ | `feat:` | Improve offline support |

## Generation Rules

When generating a commit message:
1. Analyze the diff to determine the primary change type
2. Select the appropriate emoji based on the type
3. Format: `<emoji> <type>: <description>`
4. Keep description concise, clear, and in imperative mood
5. Keep first line under 72 characters

## Validation Rules

- Use imperative mood: "add" not "added"
- Max 72 characters in subject line
- Lowercase type and scope
- Scope is optional but recommended
- Emoji should prefix the type

## When to use me
Use this before committing to validate or generate message format. Essential for Guardian agent's commit command.
