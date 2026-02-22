---
name: refactor
description: Refactor code while preserving behavior and architecture boundaries.
allowed-tools: Read, Write, Edit, MultiEdit, Grep, Glob, Bash(git status:*), Bash(git diff:*), Bash(git show:*), Bash(pnpm build:*), Bash(pnpm biome:*), Bash(pnpm knip:*), Bash(pnpm type-check:*), Bash(pnpm test:*), Bash(./scripts/post-edit-check.sh:*)
---

# /refactor Command

Refactor code to improve maintainability and simplicity without changing external behavior.

## Principles

Follow the architecture and modeling conventions defined in the project docs.

**References**:
- `docs/backend/server-architecture.md` - Layer boundaries, dependency direction, DIP
- `docs/backend/domain-modeling.md` - Aggregate boundaries, repository design, naming

Key rules:
- Respect one-way dependency direction: `Infra -> UseCase -> Domain`
- Keep UseCases as thin orchestrators; concentrate logic in Domain
- Remove unnecessary wrappers and sharing; prefer direct usage
- Add meaningful comments only where intent is non-obvious

## Execution Steps

1. Identify target scope and current behavior.
2. Refactor with behavior preservation as the first priority.
3. Remove redundant wrappers and unnecessary abstractions.
4. Re-check layer boundaries and dependency direction.
5. Add or update meaningful comments only where needed.
6. Run validation commands (`type-check`, `build`, tests, or `post-edit-check`) and report results.
