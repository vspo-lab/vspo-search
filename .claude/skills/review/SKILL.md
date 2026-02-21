---
name: review
description: Perform code reviews. Use for requests like "review this" or "code review."
allowed-tools: Read, Grep, Glob, Bash(git diff:*), Bash(git log:*), Bash(git show:*)
---

# /review Command

Review code diffs or specified files based on project conventions, and provide issues with proposed fixes.

## Usage

- `/review` - Review unstaged changes from `git diff`
- `/review --staged` - Review staged changes
- `/review <file>` - Review a specific file
- `/review <commit>` - Review the diff of a specific commit

## Procedure

1. **Identify the target**: Run `git diff` / `git diff --staged` / `git show` / file reads based on arguments.
2. **Check conventions**: Read relevant documents under `docs/` and understand the latest conventions.
3. **Run checks by category**: Apply the review criteria below in order.
4. **Report results**: For each issue, provide severity, file location, and a proposed fix.

---

## Review Criteria

### 1. Layering and Dependency Direction (Clean Architecture)

**Reference**: `docs/backend/server-architecture.md`

Key checks: Domain imports no external packages, UseCase avoids Infra dependencies, business logic stays out of Infra, DTOs hidden from Domain.

### 2. Result-based Error Handling

**Reference**: `docs/web-frontend/error-handling.md`

Key checks: `Result` type used instead of `try-catch`, `wrap` used for async library calls, errors from `@vspo/errors`, clear error messages stating what failed and why.

### 3. Zod Schema First / TypeScript

**Reference**: `docs/web-frontend/typescript.md`

Key checks: Zod schemas as source of truth, types derived with `z.infer<typeof schema>`, no `any` or `as` casts, Branded Types for identifier safety.

### 4. Domain Modeling

**Reference**: `docs/backend/domain-modeling.md`

Key checks: domain rules encapsulated in domain objects, invariants validated in constructors, naming aligned with domain terminology, no raw primitives for domain concepts.

### 5. Frontend Structure (Container / Presentational)

**Reference**: `docs/web-frontend/architecture.md`

Key checks: feature-based module structure, Container/Presentational separation, Next.js App Router conventions, appropriate Server/Client Component boundaries.

### 6. Naming Conventions

**Reference**: `docs/backend/domain-modeling.md`, `docs/backend/server-architecture.md`

Key checks: method names avoid repeating layer names, naming consistent across directories, file/variable names follow project conventions.

### 7. Test Quality

**Reference**: `docs/web-frontend/unit-testing.md`

Key checks: tests added for new code, Vitest used, tests independent from internal implementation, Arrange/Act/Assert clearly separated, minimal mock/stub usage.

### 8. Security

**Reference**: `docs/security/lint.md`

Key checks: user input validated, XSS/injection mitigations in place, no hardcoded sensitive information, no OWASP Top 10 vulnerabilities.

---

## Output Format

Report each issue in the following format. Skip criteria with no issues.

```
## Review Results

### [Severity: High] Issue Summary

**File**: `path/to/file.ts:line`
**Category**: Layering and Dependency Direction

**Issue**: Specific description of the problem

**Proposed Fix**:
```ts
// code after the fix
```

**Reference**: `docs/backend/server-architecture.md` > dependency rules
```

### Severity Scale

| Severity | Criteria |
|---|---|
| **High** | Architecture violations, lack of type safety, data integrity risk, security issues |
| **Medium** | Missing tests, naming convention violations, Result type not used |
| **Low** | Code style issues, improvement suggestions, readability improvements |

## Reference Documents

- `docs/backend/server-architecture.md` - Layering and dependency conventions
- `docs/backend/domain-modeling.md` - Domain modeling and naming
- `docs/web-frontend/error-handling.md` - Result-based error handling
- `docs/web-frontend/typescript.md` - TypeScript / Zod Schema First
- `docs/web-frontend/architecture.md` - Frontend architecture
- `docs/web-frontend/unit-testing.md` - Testing strategy
- `docs/security/lint.md` - Security linting and review checklist
- `docs/backend/datetime-handling.md` - Date and time handling (UTC/JST)
