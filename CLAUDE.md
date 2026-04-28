

# CLAUDE.md

## Project Summary

**Mobile Quality Engineering Pipeline** is an enterprise-grade mobile testing framework. It unifies functional, API, visual, security, and accessibility validation into a single CI/CD pipeline—mirroring the quality gates and automation practices of production mobile app release pipelines at scale.

---

## Tech Stack Overview

![Mobile QA Tech Stack](https://i.ibb.co/MD8bXWNh/mobile-qa-tech-stack.png)

| Layer                     | Tool                  |
| ------------------------- | --------------------- |
| Smoke Testing             | Appium + WebdriverIO  |
| Regression Testing        | Appium + WebdriverIO  |
| API Testing & Performance | Postman + Newman      |
| Visual Regression         | Percy                 |
| Security Scanning         | MobSF                 |
| Accessibility Testing     | Axe + mobile-a11y     |
| Cloud Device Testing      | BrowserStack          |
| CI/CD                     | GitHub Actions        |
| Notifications             | Slack / Discord       |
| Language                  | TypeScript            |

---

## Why This Project Exists

Most portfolio automation projects stop at basic Appium tests. This project demonstrates how real engineering teams validate mobile apps across every quality dimension before a release:

- Functional testing (smoke + regression, unified via Appium)
- API validation and performance benchmarking
- Visual regression detection
- Security scanning
- Accessibility compliance
- CI/CD automation with real device cloud execution

This mirrors production release pipelines used by companies shipping iOS and Android apps at scale.

---

## Architecture Overview

```
Developer Push / Pull Request
	↓
GitHub Actions Trigger
	↓
Prerequisites Check (env, secrets)
	↓
MobSF Security Scan
	↓
Postman API Tests (Newman)
	↓
Appium Smoke Tests (@smoke)
	↓
Appium Regression Tests  ──┬── Percy Visual Snapshots
													 └── Axe Accessibility Checks
	↓
Upload & Aggregate Reports
	↓
```

---

## Repository Structure

- `/agents/` — role definitions and boundaries
- `/skills/` — reusable capabilities (analysis, design, review)
- `/commands/` — developer workflow docs (setup, run, test, lint, build, deploy)
- `/appium/` — Appium configs, helpers, screen objects, and tests
- `/api-tests/` — Postman collections and environments
- `/percy/` — Percy visual regression scripts
- `/security/` — MobSF configs and scan artifacts
- `/reports/` — Aggregated test and scan reports
- `/scripts/` — Automation scripts for CI/CD and integrations
- `/config/` — Environment and shared config
- `/types/` — TypeScript type definitions
- `/apps/` — App binaries (gitignored)

---

## Coding Standards

- All automation and scripts in TypeScript
- Linting and formatting enforced via ESLint/Prettier
- Modular, reusable test flows and helpers
- No hardcoded secrets—use environment variables and GitHub Secrets
- Descriptive, consistent naming for scripts, tests, and configs

---

## Testing Standards

- All test types (smoke, regression, API, visual, security, accessibility) must be automated
- Smoke tests: <5 min, critical flows only, fail-fast
- Regression: end-to-end, high-risk workflows, real devices
- API: contract, schema, SLA, negative, multi-env
- Security: block on critical, warn on medium/low
- Accessibility: block on WCAG 2.1 AA in primary flows
- All tests must be CI-executable and report artifacts

---

## Security Standards

- No secrets in code or logs
- All sensitive data via .env and GitHub Secrets
- Security scan (MobSF) must pass before release
- Reports must be retained and auditable
- Only approved dependencies; regular audit required

---

## Agent & Skill Model

- Agents are stateless, domain-focused, and use only approved skills
- Explicit handoffs between agents (no hidden dependencies)
- No agent may bypass security or test standards
- All code and config changes must be reviewable
- Skills are atomic, reusable, and not role-specific
- Agents invoke skills as needed, not vice versa
- Commands are deterministic, repeatable workflows

---

## Best Practices

- Keep smoke and regression clearly separated
- One spec file per feature area
- Tests must be independent and non-duplicative
- Prefer accessibility IDs over XPath for selectors
- All selectors defined in screen objects, not specs
- Every screen object extends `BasePage` and declares an `anchor`
- No credentials or secrets in code, logs, or reports
- All sensitive values flow through `.env` and GitHub Secrets
- API tests validate schema, SLAs, and error codes—not just status
- Visual diffs and accessibility violations in primary flows are blocking
- All MobSF and test reports are uploaded as CI artifacts

---

## Onboarding & Getting Started

- See [GETTING_STARTED.md](GETTING_STARTED.md) for setup and prerequisites
- See [BEST_PRACTICES.md](BEST_PRACTICES.md) for test design and stability guidelines
- Review `/skills/` and `/agents/` for role and capability definitions
- Use `/commands/` for workflow instructions (setup, run, test, lint, build, deploy)

---

## Rules for Future Code Generation

- All new code must align with the standards above
- No direct code or config changes outside agent/skill/command boundaries
- All new scripts, tests, and configs must be documented
- No duplication of logic between validation layers
- All new features must be justified by requirements analysis
- Security and test coverage must be maintained or improved with each change
