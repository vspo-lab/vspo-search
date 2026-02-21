# Language Rule (Highest Priority)

- Write all documentation and code comments in English.

# Repository Guidelines

## Project Overview

`vspo-search` is a transcript search system for VTuber content.
The current monorepo centers on transcript extraction with Cloudflare Workers + Containers.

## Current Project Structure

```text
services/
└── transcriptor/      # Cloudflare Worker + Container (yt-dlp wrapper)

packages/
├── dayjs/             # Shared date/time utilities
├── errors/            # Shared Result-based error handling
└── logger/            # Shared logger utilities

docs/
├── backend/           # Backend architecture and modeling conventions
├── design/            # Design docs and guidelines
├── domain/            # Domain requirements and product behavior
├── security/          # Security linting guidance
└── web-frontend/      # Frontend architecture/coding/testing conventions
```

## Key Documentation

- `docs/domain/transcript-search.md` - Domain requirements for transcript search
- `docs/domain/transcript-search-ui.md` - UI-focused domain notes
- `docs/backend/server-architecture.md` - Clean Architecture boundaries
- `docs/backend/domain-modeling.md` - Domain modeling and naming guidance
- `docs/backend/datetime-handling.md` - UTC/JST date-time handling policy
- `docs/backend/api-design.md` - API design principles
- `docs/web-frontend/error-handling.md` - Result-based error handling patterns
- `docs/web-frontend/typescript.md` - TypeScript and schema-first policy
- `docs/security/lint.md` - Security scanning and linting expectations

## Coding Style and Architecture Rules

### 1. Simplicity First

- Remove dead code and unused exports.
- Prefer straightforward implementations over early abstractions.
- Extract shared logic only when a pattern is reused repeatedly.

### 2. Respect Layer Boundaries

- Follow one-way dependency direction: `Infra -> UseCase -> Domain`.
- Do not leak infrastructure concerns into domain logic.

### 3. Use Result-Based Error Handling

- Use `Result` style error handling from `@vspo/errors`.
- Prefer `wrap` for async calls that can fail.
- Avoid `try-catch` as the default application-level pattern.

### 4. TypeScript + Schema First

- Treat schemas as the source of truth.
- Derive types from schemas instead of duplicating type definitions.

## Development Workflow

### Common Commands

```bash
# Install dependencies
pnpm install

# Run transcriptor locally
pnpm --filter @vspo/transcriptor dev

# Deploy transcriptor
pnpm --filter @vspo/transcriptor deploy

# Workspace checks
pnpm build
pnpm biome
pnpm knip
pnpm type-check
```

### Post-Edit Check

```bash
./scripts/post-edit-check.sh
```

Current script behavior:
- `pnpm build`
- `pnpm biome`
- `pnpm knip`
- `pnpm type-check`
- `pnpm security-scan`

### Security Scan Notes

- `pnpm security-scan` runs Trivy and Semgrep via Docker images.
- Ensure Docker is available before running full security checks.

## Commit Message Convention

Use Angular-style commit messages. See `docs/common/commit-conventions.md` for full rules, types, and examples.

```text
<type>(<scope>): <subject>
```

Recommended scopes for this repository:
- `transcriptor`
- `errors`
- `dayjs`
- `logger`
- `docs`
- `domain`
- `usecase`
- `infra`
