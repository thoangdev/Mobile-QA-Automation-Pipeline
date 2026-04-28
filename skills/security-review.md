# Skill: Security Review

## Purpose

Assess code, configurations, and pipeline steps for security risks and compliance with best practices.

## When to Use

- Before each release
- When new dependencies or integrations are added
- After MobSF or dependency scan results

## Inputs

- Security scan reports
- Dependency audit logs
- Pipeline configs

## Outputs

- Security review reports
- Remediation recommendations

## Constraints

- Must block release on unresolved critical vulnerabilities
- No unreviewed changes to secrets or sensitive configs

## Safety/Performance Considerations

- Ensure all findings are triaged and tracked
- Document all reviews and actions for auditability

## Best Practices

### Severity handling

- Critical findings are release blockers. Do not reduce this threshold.
- Medium and low findings are non-blocking. Triage them into the security backlog and review on a regular cadence. Do not ignore them.

### Binary scanning

- Always scan the production (release) build. Debug variants have different permissions, flags, and signing that produce misleading scan results.
- Confirm the binary under review is the same artifact being released.

### Secrets hygiene

- No credentials, tokens, API keys, or webhook URLs may appear in source code, test scripts, logs, or CI output.
- All sensitive values must flow through `.env` locally and GitHub Secrets in CI. The `Env` object in `config/env.ts` is the single permitted read point in this codebase.
- App binaries are excluded from version control via `.gitignore`. Enforce this — binaries in git history are hard to remove and slow down clones permanently.

### Dependency auditing

- Run `npm audit` regularly, not only at release time. New CVEs are published continuously.
- Do not approve PRs introducing dependencies with known high or critical CVEs without a documented exception and a remediation timeline.

### CI artifact retention

- MobSF scan reports are uploaded as CI artifacts (30-day retention). These are the auditable record of each scan — do not skip the upload step.
- The MobSF workflow step is conditionally skipped when secrets are not configured. This is intentional — do not remove the condition, and do not treat a skipped step as equivalent to a passing scan.

See [BEST_PRACTICES.md](../BEST_PRACTICES.md) for the full reference.
