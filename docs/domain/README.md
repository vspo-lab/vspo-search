# Domain Specification

Project-specific domain knowledge is consolidated here.

## Structure

| File | Content |
| --- | --- |
| `transcript-search.md` | Transcript search system requirements and architecture |
| `transcript-search-ui.md` | Transcript search UI/UX specification |
| `voice-collection.md` | Voice collection system requirements |
| `glossary.md` | Glossary (ubiquitous language) |
| `decisions.md` | Decision log (why we chose this specification) |

## Creation & Update Flow

1. Initial specification: `/domain-spec-kickoff`
2. Specification evolution during implementation: `/domain-doc-evolution`
3. When specification changes occur, update `docs/domain` first, then modify code

## Policy

- This directory is the Single Source of Truth for domain knowledge
- Entity definitions follow Zod Schema First (`docs/web-frontend/typescript.md`)
- Record important specification decisions with rationale in `decisions.md`
- Mark undecided items as `TBD` and record next actions in `decisions.md`

## Related

- `docs/plan/` - Feature-level specification documents (Spec-Driven Development)
