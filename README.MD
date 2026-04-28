
![Mobile QA Tech Stack](https://i.ibb.co/MD8bXWNh/mobile-qa-tech-stack.png)

# Mobile Quality Engineering Pipeline

Enterprise style mobile testing framework that combines multiple validation layers functional, API, visual, security, and accessibility into a single CI/CD pipeline.

**New here?** Start with the [Getting Started guide](GETTING_STARTED.md) for step-by-step setup and onboarding. See [Best Practices](BEST_PRACTICES.md) for guidelines on writing stable, maintainable tests.

---

## Tech Stack

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

Functional testing (smoke + regression, unified via Appium)
API validation and performance benchmarking
Visual regression detection
Security scanning
Accessibility compliance
CI/CD automation with real device cloud execution

This mirrors production release pipelines used by companies shipping iOS and Android apps at scale.

---

## Architecture Overview

```txt
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
Slack/Discord Notification
```

---

## Core Features

### Smoke Testing (Appium + WebdriverIO)

Fast validation of critical flows — must complete in under 5 minutes. Smoke tests are tagged `@smoke` and run as a subset of the same Appium suite:

- App launch and deep linking
- Login / logout
- Onboarding
- Navigation
- Checkout and payment flow

### Regression Testing (Appium)

Deep validation of complex workflows, run as the full Appium suite (all tests excluding `@smoke`):

- User onboarding and profile updates
- Settings persistence
- Search and filters
- Offline behavior and edge cases
- Push notification handling

### Visual Regression Testing (Percy)

- Screenshot comparison across builds
- Detects unintended UI changes
- Integrates directly into Appium/WebdriverIO flows
- Review and approve diffs in the Percy dashboard

### API Validation & Performance (Postman/Newman)

- Authentication, CRUD, and contract validation
- Status code, schema, and negative testing
- Response time and latency assertions against SLAs
- Multi-environment support (staging, production)

### Security Testing (MobSF)

- Hardcoded secrets and API key exposure
- Insecure permissions and debuggable builds
- Weak encryption and SSL/certificate issues

### Accessibility Testing (Axe + mobile-a11y)

- WCAG 2.1 AA compliance checks
- Color contrast and touch target validation
- Screen reader label coverage
- Integrated into the regression suite — failures surfaced alongside functional failures

### CI/CD Automation

- Triggered on pull requests and pushes to `main`
- Scheduled nightly regression runs
- Retry logic for flaky tests (up to 2 retries per spec)
- Report artifacts stored per-run in GitHub Actions
- Automated Slack/Discord notifications on completion

---

## Folder Structure

```txt
mobile-quality-pipeline/
│
├── .github/
│   └── workflows/
│       └── mobile-pipeline.yml
│
├── apps/
│   ├── android/
│   │   └── *.apk          (any single .apk — filename doesn't matter)
│   └── ios/
│       └── *.ipa          (any single .ipa — filename doesn't matter)
│
├── appium/
│   ├── config/
│   │   ├── android.conf.ts
│   │   ├── ios.conf.ts
│   │   └── shared.conf.ts
│   ├── screens/
│   │   ├── LoginScreen.ts
│   │   ├── HomeScreen.ts
│   │   └── SettingsScreen.ts
│   └── tests/
│       ├── smoke/           # (optional) smoke tests, or use tags
│       │   ├── login.spec.ts
│       │   └── checkout.spec.ts
│       └── regression/
│           ├── onboarding.spec.ts
│           ├── settings.spec.ts
│           └── ...
│
├── api-tests/
│   ├── collections/
│   │   └── mobile-api.postman_collection.json
│   └── environments/
│       ├── staging.postman_environment.json
│       └── production.postman_environment.json
│
├── percy/
│   └── snapshots.ts
│
├── security/
│   └── mobsf/
│       └── scan-config.json
│
├── accessibility/
│   └── axe-config.ts
│
├── scripts/
│   ├── upload-browserstack.ts
│   ├── run-mobsf.ts
│   ├── run-newman.ts
│   ├── send-slack-notification.ts
│   └── send-discord-notification.ts
│
├── reports/
│   ├── appium/
│   ├── api/
│   ├── percy/
│   └── security/
│
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

---

## Prerequisites

| Requirement | Version / Notes |
| --- | --- |
| Node.js | 20+ (LTS recommended) |
| Java (JDK) | 17+ (required by Appium) |
| Android SDK | API 33+ with `adb` on PATH |
| Xcode | 15+ with iOS Simulator (macOS only) |
| Newman CLI | `npm install -g newman` |
| MobSF | Self-hosted Docker or cloud instance |
| BrowserStack | Account with App Automate enabled |

---

## Setup Guide

### 1. Clone Repository

```bash
git clone https://github.com/yourname/mobile-quality-pipeline.git
cd mobile-quality-pipeline
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Install Newman

```bash
npm install -g newman
```

### 4. Setup Environment Variables

```bash
cp .env.example .env
```

Fill in `.env`:

```env
# BrowserStack
BROWSERSTACK_USERNAME=
BROWSERSTACK_ACCESS_KEY=

# MobSF
MOBSF_URL=
MOBSF_API_KEY=

# Percy Visual Testing
PERCY_TOKEN=

# Notifications
SLACK_WEBHOOK=
DISCORD_WEBHOOK=

# Environment target (staging | production)
TEST_ENV=staging
```

---

## GitHub Secrets

Configure all of the following in **Settings → Secrets → Actions**:

| Secret                   | Purpose                          |
| ------------------------ | -------------------------------- |
| `BROWSERSTACK_USERNAME`  | BrowserStack authentication      |
| `BROWSERSTACK_ACCESS_KEY`| BrowserStack authentication      |
| `MOBSF_URL`              | MobSF instance endpoint          |
| `MOBSF_API_KEY`          | MobSF API authentication         |
| `PERCY_TOKEN`            | Percy visual snapshot upload     |
| `SLACK_WEBHOOK`          | Slack notification endpoint      |
| `DISCORD_WEBHOOK`        | Discord notification endpoint    |

---

## Available Commands

```bash
npm run test:smoke          # Appium smoke tests (tagged)
npm run test:regression     # Appium regression suite
npm run test:api            # Newman API tests
npm run test:visual         # Percy visual snapshots
npm run test:a11y           # Axe accessibility checks
npm run scan:mobsf          # MobSF security scan
npm run pipeline            # Full sequential pipeline
```

### package.json Scripts

```json
{
  "scripts": {
    "test:smoke":      "wdio run appium/config/android.conf.ts --grep @smoke",
    "test:regression": "wdio run appium/config/android.conf.ts",
    "test:api":        "newman run api-tests/collections/mobile-api.postman_collection.json --environment api-tests/environments/staging.postman_environment.json",
    "test:visual":     "percy exec -- wdio run appium/config/android.conf.ts",
    "test:a11y":       "node accessibility/axe-config.ts",
    "scan:mobsf":      "ts-node scripts/run-mobsf.ts",
    "notify:slack":    "ts-node scripts/send-slack-notification.ts",
    "notify:discord":  "ts-node scripts/send-discord-notification.ts",
    "pipeline":        "npm run scan:mobsf && npm run test:api && npm run test:smoke && npm run test:regression"
  }
}
```

---

## GitHub Actions Workflow

```yaml
name: Mobile QA Pipeline

on:
  pull_request:
  push:
    branches:
      - main
  schedule:
    - cron: "0 2 * * *"   # nightly regression run at 02:00 UTC

jobs:
  quality-pipeline:
    runs-on: ubuntu-latest
    timeout-minutes: 60

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run MobSF Scan
        env:
          MOBSF_URL: ${{ secrets.MOBSF_URL }}
          MOBSF_API_KEY: ${{ secrets.MOBSF_API_KEY }}
        run: npm run scan:mobsf

      - name: Run API Tests
        run: npm run test:api

      - name: Run Appium Smoke Tests
        run: npm run test:smoke

      - name: Run Appium Regression Tests
        env:
          BROWSERSTACK_USERNAME: ${{ secrets.BROWSERSTACK_USERNAME }}
          BROWSERSTACK_ACCESS_KEY: ${{ secrets.BROWSERSTACK_ACCESS_KEY }}
          PERCY_TOKEN: ${{ secrets.PERCY_TOKEN }}
        run: npm run test:regression

      - name: Run Accessibility Checks
        run: npm run test:a11y

      - name: Upload Reports
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: qa-reports-${{ github.run_number }}
          path: reports/
          retention-days: 30

      - name: Notify Team
        if: always()
        env:
          SLACK_WEBHOOK: ${{ secrets.SLACK_WEBHOOK }}
        run: npm run notify:slack
```

---

## Pipeline Workflow

### Step 1 — Security Scan

```bash
npm run scan:mobsf
```

Uploads APK/IPA to MobSF and asserts zero critical findings before continuing.

### Step 2 — API Validation

```bash
npm run test:api
```

Runs the Postman collection with Newman, validating contracts, schemas, and SLAs against the target environment.

### Step 3 — Smoke Tests (Appium)

```bash
npm run test:smoke
```

Runs only Appium tests tagged as `@smoke` for fast validation of critical flows. Pipeline fails fast here if core UX is broken.

### Step 4 — Regression Tests + Visual Snapshots

```bash
npm run test:regression
```

Full Appium suite with Percy capturing visual snapshots at key screen transitions.

### Step 5 — Accessibility Checks

```bash
npm run test:a11y
```

Axe scans for WCAG 2.1 AA violations across the app's primary flows.

### Step 6 — Notify

Slack/Discord receives a structured summary on every run (pass or fail):

```txt
Build #124 | main | 2026-04-27

Security:   0 Critical  2 Medium
API:        14 Passed   1 Failed
Smoke:      8 Passed    0 Failed
Regression: 42 Passed   2 Failed
Visual:     35 Approved 0 Diffs
A11y:       0 Violations

Reports: github.com/.../actions/runs/124
```

---

## Test Rules

### Smoke Tests (Appium)

- Must run in under 5 minutes
- Critical flows only — no complex validations
- Any failure blocks the pipeline immediately

### Regression Tests (Appium)

- Full end-to-end validations on real devices via BrowserStack
- High-risk workflows only — not exhaustive UI coverage
- Up to 2 automatic retries for network-flaky specs

### API Tests

- Validate business-critical endpoints
- Always run against a seeded, isolated staging environment
- Never duplicate frontend validation logic

### Security Tests

- Block release on any critical vulnerability
- Warn (non-blocking) for medium and low findings

### Accessibility Tests

- Block release on WCAG 2.1 AA Level violations in primary flows
- Warn on AA Level violations in secondary flows

---

## BrowserStack Device Matrix

| Platform | Device          | OS Version  |
| -------- | --------------- | ----------- |
| Android  | Google Pixel 8  | Android 14  |
| Android  | Samsung S24     | Android 14  |
| iOS      | iPhone 15 Pro   | iOS 17      |
| iOS      | iPhone 14       | iOS 16      |

---

## Estimated Monthly Cost (Startup)

Running this pipeline for a 5–10 engineer team with moderate test volume:

| Service                          | Free Tier?        | Typical Cost (USD)               |
| -------------------------------- | ----------------- | -------------------------------- |
| BrowserStack App Automate        | No                | $169/mo (1 parallel)             |
| Percy                            | Yes               | $99/mo (Starter, 5k snapshots)   |
| MobSF                            | Yes (self-hosted) | $0 self-hosted / $49+ cloud      |
| Postman/Newman                   | Yes               | $0 CLI / $19+/mo team            |
| GitHub Actions                   | Yes               | $0-$20/mo; $0.008/min thereafter |
| Cloud VM (MobSF, reporting, etc) | No                | $20-$50/mo                       |
| Slack/Discord                    | Yes               | $0 (webhook-based notifications) |

**Estimated total:**

- **Lean (self-hosted, minimal cloud):** ~$200–$250/month
- **With cloud MobSF, higher Percy usage, more CI minutes:** ~$350–$400/month

---

## Why This Stands Out

Typical QA portfolios show Selenium, basic API tests, and simple scripted automation.

This project demonstrates:

- Mobile automation maturity (Appium + WebdriverIO for all functional flows)
- Security awareness built into the release gate
- Visual regression as a first-class check
- Accessibility compliance integrated at the pipeline level
- CI/CD orchestration with real device cloud execution
- Multi-layer validation strategy that mirrors production release pipelines

Relevant roles:

- QA Lead / QA Manager
- SDET
- Mobile QA Engineer
- Quality Architect
- Platform QA Engineer
- AI product QA / Quality Engineering roles

---

## Future Improvements

- **Firebase Crashlytics integration** — correlate test failures with production crash rates
- **AI-assisted test generation** — use Claude/GPT to generate Appium test specs from user story descriptions, reducing manual authoring time
- **Test data factory** — centralized seed/teardown layer so each spec starts from a known state without manual database resets
- **Detox integration** — add a grey-box layer for React Native apps to complement Appium's black-box coverage
- **SARIF security report upload** — pipe MobSF findings into GitHub's Security tab via the SARIF format for native code scanning UX
- **Slack interactive approvals** — let engineers approve Percy visual diffs directly from the Slack notification without opening the dashboard

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes following [Conventional Commits](https://www.conventionalcommits.org/)
4. Open a pull request — the pipeline will run automatically against your branch

---

## License

MIT
