---
name: tdd-patterns
description: TDD and refactoring patterns based on t-wada practices. Activate on test file edits or `/tdd`.
allowed-tools: Read, Write, Edit, MultiEdit, Grep, Glob, Bash(git status:*), Bash(git diff:*), Bash(pnpm test:*), Bash(pnpm type-check:*), Bash(pnpm build:*)
---

# TDD Pattern Guidelines

Apply this skill when editing test files or when `/tdd` is explicitly requested.

## References

- `docs/common/RELIABLE_CODE_DESIGN.md` - Design principles, Extract/Sprout patterns, progressive test strictness, t-wada priority order
- `docs/web-frontend/unit-testing.md` - Table-driven test patterns (Vitest), mock patterns, test naming conventions

## Core Rules

- Use table-driven tests by default
- Include normal, error, and boundary-value cases
- Follow Red -> Green -> Refactor cycle
- Keep feedback cycles short and deterministic

## Patterns

### Extract Pattern (Improve Existing Code)

Extract testable pure functions from hard-to-test code. See `docs/common/RELIABLE_CODE_DESIGN.md` for detailed steps and examples.

### Sprout Pattern (New Code)

Write tests first for new code. See `docs/common/RELIABLE_CODE_DESIGN.md` for detailed steps and examples.

## Priority Order (t-wada)

1. Version control: keep changes traceable in git
2. Automation: maintain runnable quality gates
3. Testing: raise coverage incrementally with useful tests
