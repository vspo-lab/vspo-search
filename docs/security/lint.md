# Security Scanning

## Tools

| Tool | Purpose | CI Job |
|------|---------|--------|
| **Trivy** (filesystem) | Dependency, Dockerfile, and IaC vulnerability scan | `trivy-fs` |
| **Trivy** (container) | Docker image vulnerability scan | `trivy-container` |
| **Semgrep** | Static Application Security Testing (SAST) | `semgrep` |

## Local Development

Run security scans locally via Docker (no local tool installation required):

```bash
# Filesystem scan + Semgrep
pnpm security-scan

# Include Docker image scan
pnpm security-scan:docker
```

## Suppression Files

- `.trivyignore` - CVE IDs to suppress in Trivy scans
- `.semgrepignore` - File patterns to exclude from Semgrep analysis

## Post-Edit Check

After completing modifications, run all checks including security scan:

```bash
./scripts/post-edit-check.sh
```

This runs: `pnpm build`, `pnpm biome`, `pnpm knip`, `pnpm type-check`, `pnpm security-scan`
