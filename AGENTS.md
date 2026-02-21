<!-- Do not restructure or delete sections. Update individual values in-place when they change. -->
# Agent Guide

## Project Overview
vspo-search is a transcript search system for VTuber content, built as a pnpm monorepo on Cloudflare Workers + Containers.

## Core Principles
- Write all documentation and code comments in English.
- Dependency direction: Infra -> UseCase -> Domain (Clean Architecture).
- Use Result-based error handling from `@vspo/errors`; prefer `wrap` for fallible async calls. No try-catch.
- Schema-first TypeScript: derive types from Zod schemas, never duplicate.

## Commands
```bash
pnpm install                          # setup
pnpm --filter @vspo/transcriptor dev  # local dev
./scripts/post-edit-check.sh          # run after every edit (build + lint + type-check + security)
```

## Architecture
- Domain docs live in `docs/`. Read them before making architectural decisions.
- Commit format: `<type>(<scope>): <subject>` — see skills/commit-rules for scopes and full convention.

## Maintenance Notes
<!-- This section is permanent. Do not delete. -->
- `pnpm security-scan` requires Docker (Trivy + Semgrep). Skip if Docker is unavailable.
