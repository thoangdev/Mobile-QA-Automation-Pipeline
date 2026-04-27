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
