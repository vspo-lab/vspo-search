---
name: commit-rules
description: Angular-style commit message rules. Apply when performing commits.
allowed-tools: Read, Grep, Glob, Bash(git status:*), Bash(git diff:*), Bash(git log:*), Bash(git add:*), Bash(git commit:*), Bash(./scripts/post-edit-check.sh:*)
---

# Commit Rules

Apply this skill when creating commits.

**Reference**: `docs/common/commit-conventions.md`

Read the reference document for the full commit convention, including type/scope definitions, formatting rules, and examples.

Format: `<type>(<scope>): <subject>`

## Pre-commit Check

Run the following before committing:

```bash
./scripts/post-edit-check.sh
```
