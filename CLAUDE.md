
# CLAUDE.md

## Project Summary

**Mobile Quality Engineering Pipeline** is an enterprise-grade mobile testing framework. It unifies functional, API, visual, security, and accessibility validation into a single CI/CD pipeline—mirroring the quality gates and automation practices of production mobile app release pipelines at scale.

## Current Repository Status
- README-only starter repo
- No source code or configuration files yet
- All plans, standards, and structure are derived from the README

## Planned Architecture
- Modular structure for each validation layer: smoke, regression, API, visual, security, accessibility
- CI/CD orchestrated via GitHub Actions
- Device cloud execution (BrowserStack)
- TypeScript as the primary language
- Clear separation of scripts, configs, and test assets

## Coding Standards
- All automation and scripts in TypeScript
- Linting and formatting enforced via ESLint/Prettier (to be defined)
- Modular, reusable test flows and helpers
- No hardcoded secrets—use environment variables and GitHub Secrets
- Descriptive, consistent naming for scripts, tests, and configs

## Testing Standards
- All test types (smoke, regression, API, visual, security, accessibility) must be automated
- Smoke tests: <5 min, critical flows only, fail-fast
- Regression: end-to-end, high-risk workflows, real devices
- API: contract, schema, SLA, negative, multi-env
- Security: block on critical, warn on medium/low
- Accessibility: block on WCAG 2.1 AA in primary flows
- All tests must be CI-executable and report artifacts

## Security Standards
- No secrets in code or logs
- All sensitive data via .env and GitHub Secrets
- Security scan (MobSF) must pass before release
- Reports must be retained and auditable
- Only approved dependencies; regular audit required

## Agent Behavior Rules
- Agents must be stateless and focused on their domain
- Explicit handoffs between agents (no hidden dependencies)
- No agent may bypass security or test standards
- All code and config changes must be reviewable
- Agents must use only approved skills and commands

## Tool and Skill Usage Guidelines
- Skills are atomic, reusable, and not role-specific
- Agents invoke skills as needed, not vice versa
- Commands are deterministic, repeatable workflows
- No skill or command may alter `.claude/` unless explicitly required

## File Structure Overview
- `/agents/` — role definitions and boundaries
- `/skills/` — reusable capabilities (analysis, design, review)
- `/commands/` — developer workflow docs (setup, run, test, lint, build, deploy)
- `.claude/` — only if required for advanced config (not present by default)

## Rules for Future Code Generation
- All new code must align with the standards above
- No direct code or config changes outside agent/skill/command boundaries
- All new scripts, tests, and configs must be documented
- No duplication of logic between validation layers
- All new features must be justified by requirements analysis
- Security and test coverage must be maintained or improved with each change
