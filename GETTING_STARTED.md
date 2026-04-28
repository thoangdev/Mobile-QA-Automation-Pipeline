# Getting Started — New Tester Guide

This guide walks you through setting up the Mobile QA Automation Pipeline from scratch, running tests locally, and wiring up the CI pipeline. It assumes you are new to the repo but have basic command-line familiarity.

---

## What This Template Is

This is a **full-stack mobile QA pipeline template**. It ships with working test infrastructure across five validation layers:

| Layer | What it checks |
|---|---|
| Smoke tests | Critical user flows (login, checkout) pass on every build |
| Regression tests | Deeper flows (onboarding, search, settings) on real devices |
| API tests | Backend contracts, schemas, and response time SLAs |
| Visual regression | Pixel-level UI changes between builds |
| Security scan | Hardcoded secrets, insecure permissions, weak encryption in the binary |
| Accessibility | WCAG 2.1 AA compliance in primary flows |

Everything runs end-to-end in GitHub Actions. You adapt it to your app — swap in your selectors, credentials, and app binary, and the pipeline does the rest.

---

## Prerequisites

Install all of these before running any commands.

### Required for all test types

| Tool | Minimum version | Install |
|---|---|---|
| Node.js | 20 (LTS) | [nodejs.org](https://nodejs.org) |
| Git | Any recent | OS package manager |

### Required for Appium (functional / visual / accessibility tests)

| Tool | Minimum version | Notes |
|---|---|---|
| Java JDK | 17 | `java -version` to check |
| Android SDK | API 33+ | Includes `adb`; set `ANDROID_HOME` |
| Xcode | 15+ | macOS only; iOS Simulator |
| Appium 2 | 2.5+ | Installed via `npm install` — no global install needed |

**Android SDK setup (quick check):**
```bash
echo $ANDROID_HOME   # should print a path like /Users/you/Library/Android/sdk
adb devices          # should list devices or print an empty list
```

**Xcode (macOS only):**
```bash
xcode-select --install   # install command line tools if needed
xcrun simctl list        # should list available simulators
```

### Required for cloud device testing (BrowserStack)

- A BrowserStack account with **App Automate** enabled
- `BROWSERSTACK_USERNAME` and `BROWSERSTACK_ACCESS_KEY` from your account dashboard

> The workflow skips BrowserStack steps automatically if these secrets are not set — you can run API tests and a local security scan without a BrowserStack account.

### Required for each optional service

| Service | What it does | Required? |
|---|---|---|
| BrowserStack | Real device test execution | Optional (skipped in CI if missing) |
| MobSF | Security binary scanning | Optional (skipped in CI if missing) |
| Percy | Visual snapshot diffing | Optional |
| Slack / Discord webhook | Build notifications | Optional |

---

## 1. Clone the Repository

```bash
git clone https://github.com/YOUR_ORG/mobile-quality-pipeline.git
cd mobile-quality-pipeline
```

Then install all dependencies:

```bash
npm install
```

This installs Appium, WebdriverIO, Newman, Percy, TypeScript, and every other tool the pipeline needs. No global installs are required.

---

## 2. Configure Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

Open `.env` and fill in each section. The file is annotated — every key has a comment explaining what it is and where to get the value.

**Minimum required to run anything locally:**
```env
TEST_USERNAME=your-test-account@example.com
TEST_PASSWORD=YourTestPassword
TEST_ENV=staging
```

**Required to run BrowserStack tests:**
```env
BROWSERSTACK_USERNAME=your_username
BROWSERSTACK_ACCESS_KEY=your_key
```

**Required for security scanning (MobSF):**
```env
MOBSF_URL=http://localhost:8000    # or your hosted MobSF URL
MOBSF_API_KEY=your_api_key
```

**Required for visual testing (Percy):**
```env
PERCY_TOKEN=your_percy_token
```

**Required for build notifications:**
```env
SLACK_WEBHOOK=https://hooks.slack.com/...
DISCORD_WEBHOOK=https://discord.com/api/webhooks/...
```

After filling in your values, validate that all required keys are present:

```bash
npm run validate:env
```

If any required key is missing, the command prints exactly which ones and exits. Fix those before continuing.

---

## 3. Add Your App Binaries

The `apps/` directory is where you place the app files under test. Drop any `.apk` into `apps/android/` and any `.ipa` into `apps/ios/` — no specific filename is required, just one file per folder:

```
apps/
├── android/    ← e.g. MyApp-1.2.3.apk
└── ios/        ← e.g. MyApp-1.2.3.ipa
```

**For BrowserStack:** upload your binary first, then save the returned hash:

```bash
npm run upload:android    # finds the .apk in apps/android/ and uploads it → prints a bs:// hash
npm run upload:ios        # finds the .ipa in apps/ios/ and uploads it    → prints a bs:// hash
```

Set those hashes in `.env`:
```env
BS_ANDROID_APP_HASH=bs://xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
BS_IOS_APP_HASH=bs://xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**For local Appium (no BrowserStack):** set the `app` path directly in [appium/config/android.conf.ts](appium/config/android.conf.ts) or [appium/config/ios.conf.ts](appium/config/ios.conf.ts):

```typescript
capabilities: [{
  'appium:app': path.resolve('./apps/android/app.apk'),
  // ...
}]
```

---

## 4. Adapt Screen Objects to Your App

The screen objects in [appium/screens/](appium/screens/) use **placeholder accessibility IDs** that match a generic app. You must replace them with the real element identifiers from your app.

Every screen file contains comments like:
```typescript
// PLACEHOLDER selectors — replace '~*' accessibility IDs with real values from your app
```

**How to find the right selectors:**

Use Appium Inspector or `adb uiautomator` to inspect your app's element tree:
```bash
# Android — dump the UI hierarchy
adb shell uiautomator dump /sdcard/dump.xml && adb pull /sdcard/dump.xml ./dump.xml
```

Then open the XML to find `resource-id`, `content-desc`, or `text` attributes for each element.

**Example — updating LoginScreen:**

```typescript
// Before (placeholder):
private get usernameInput() { return $('~username-input'); }

// After (your app's real selector):
private get usernameInput() { return $('~com.yourapp:id/email_field'); }
```

Each screen follows the same pattern — extend [BasePage.ts](appium/screens/BasePage.ts) and define an `anchor` element that confirms the screen is loaded. See [LoginScreen.ts](appium/screens/LoginScreen.ts) as the reference implementation.

---

## 5. Update Test Credentials

Credentials flow from `.env` → `config/env.ts` → `appium/helpers/index.ts` → all spec files.

You only need to set `TEST_USERNAME` and `TEST_PASSWORD` in your `.env` file. Never hardcode credentials in spec files — the helpers pull from the environment automatically:

```typescript
import { loginAs, Credentials } from '../../helpers';

// Uses TEST_USERNAME / TEST_PASSWORD from .env:
await loginAs();

// Or pass explicit credentials for negative tests:
await LoginScreen.login(Credentials.invalid.username, Credentials.invalid.password);
```

---

## 6. Configure the API Test Collection

The Postman collection lives in [api-tests/collections/mobile-api.postman_collection.json](api-tests/collections/mobile-api.postman_collection.json).

Replace the placeholder requests with your app's API endpoints. Environment-specific base URLs are set in:
- [api-tests/environments/staging.postman_environment.json](api-tests/environments/staging.postman_environment.json)
- [api-tests/environments/production.postman_environment.json](api-tests/environments/production.postman_environment.json)

Update the `baseUrl` variable in each file to point to your staging and production API hosts.

---

## 7. Running Tests Locally

All commands are run from the repo root.

### Validate environment first

```bash
npm run validate:env
```

### Run individual test layers

```bash
npm run test:smoke       # Appium smoke tests — fast, critical flows only
npm run test:regression  # Appium regression suite — full coverage
npm run test:api         # Newman API tests against staging
npm run test:visual      # Percy visual snapshots (requires PERCY_TOKEN)
npm run test:a11y        # Axe accessibility checks
npm run scan:mobsf       # MobSF security scan (requires MOBSF_URL + MOBSF_API_KEY)
```

### Run the full pipeline in sequence

```bash
npm run pipeline
```

This runs `validate:env → scan:mobsf → test:api → test:smoke → test:regression` and exits on first failure.

### Linting and formatting

```bash
npm run lint          # Check TypeScript for lint errors
npm run lint:fix      # Auto-fix lint errors
npm run format        # Format all .ts, .json, .yml, .md files
npm run format:check  # Check formatting without writing
```

---

## 8. Setting Up CI (GitHub Actions)

The workflow file is at [.github/workflows/mobile-pipeline.yml](.github/workflows/mobile-pipeline.yml). It runs automatically on:
- Every pull request
- Every push to `main`
- Nightly at 02:00 UTC

### Required GitHub Secrets

Go to **Settings → Secrets and variables → Actions → New repository secret** and add each one:

| Secret | Required? | Where to get it |
|---|---|---|
| `TEST_USERNAME` | Yes | Your test account email |
| `TEST_PASSWORD` | Yes | Your test account password |
| `BROWSERSTACK_USERNAME` | Optional | BrowserStack dashboard |
| `BROWSERSTACK_ACCESS_KEY` | Optional | BrowserStack dashboard |
| `BS_ANDROID_APP_HASH` | Optional | Output of `npm run upload:android` |
| `BS_IOS_APP_HASH` | Optional | Output of `npm run upload:ios` |
| `MOBSF_URL` | Optional | Your MobSF instance URL |
| `MOBSF_API_KEY` | Optional | MobSF API key |
| `PERCY_TOKEN` | Optional | Percy project settings |
| `SLACK_WEBHOOK` | Optional | Slack app webhook URL |
| `DISCORD_WEBHOOK` | Optional | Discord channel webhook URL |

> **Tip:** Steps that depend on optional secrets are conditionally skipped. If `BROWSERSTACK_USERNAME` is not set, the smoke and regression steps are skipped automatically — CI still runs API tests and accessibility checks.

---

## 9. Understanding Reports

After each run, reports are written to the `reports/` directory and uploaded as GitHub Actions artifacts (retained for 30 days).

| Directory | Contents |
|---|---|
| `reports/appium/` | JUnit XML results from smoke and regression runs |
| `reports/api/` | Newman JSON/HTML output from API tests |
| `reports/percy/` | Percy snapshot metadata |
| `reports/security/` | MobSF scan JSON output |

**In CI:** open the workflow run in GitHub Actions → click **Artifacts** → download `qa-reports-<run-number>.zip`.

**Notifications:** if `SLACK_WEBHOOK` or `DISCORD_WEBHOOK` is set, the pipeline posts a structured summary to your channel on every run (pass or fail):

```
Build #42 | main | 2026-04-28

Security:   0 Critical  2 Medium
API:        14 Passed   1 Failed
Smoke:       8 Passed   0 Failed
Regression: 42 Passed   2 Failed
Visual:     35 Approved  0 Diffs
A11y:        0 Violations

Reports: github.com/.../actions/runs/42
```

---

## 10. Adding New Tests

### Adding a new screen

1. Create a new file in [appium/screens/](appium/screens/) extending `BasePage`
2. Define an `anchor` getter (the element that proves the screen is loaded)
3. Add action methods for each interaction your tests need

```typescript
import { BasePage } from './BasePage';

class CartScreen extends BasePage {
  private get checkoutButton() { return $('~checkout-button'); }
  protected get anchor()       { return this.checkoutButton; }

  async proceedToCheckout(): Promise<void> {
    await this.waitForLoad();
    await this.checkoutButton.click();
  }
}

export default new CartScreen();
```

### Adding a smoke test

Create a new spec in [appium/tests/smoke/](appium/tests/smoke/) and prefix the `describe` block with `@smoke`:

```typescript
describe('@smoke Cart', () => {
  it('should add item and proceed to checkout', async () => {
    // ...
  });
});
```

Smoke tests must complete in under 5 minutes total. Keep them focused on critical path only.

### Adding a regression test

Create a spec in [appium/tests/regression/](appium/tests/regression/). No `@smoke` tag needed — all specs in this folder run in the regression pass.

---

## Troubleshooting

### `EnvError: Required environment variable "X" is not set`

Run `npm run validate:env` to see the full list of missing keys. Copy `.env.example` to `.env` if you haven't already.

### Appium fails to connect / session not created

- Confirm your device or emulator is running: `adb devices` (Android) or check Simulator
- Confirm `ANDROID_HOME` is set and `adb` is on your PATH
- Check that the `appium:app` capability points to the correct file path

### BrowserStack tests are skipped in CI

This is expected when `BROWSERSTACK_USERNAME` or `BROWSERSTACK_ACCESS_KEY` secrets are not configured. The workflow skips those steps silently rather than failing.

### Percy snapshots not uploading

Confirm `PERCY_TOKEN` is set. Run `npm run test:visual` locally — Percy prints the project URL when the token is valid.

### MobSF scan fails with connection refused

MobSF must be running before the scan starts. For local use, run it via Docker:
```bash
docker run -it --rm -p 8000:8000 opensecurity/mobile-security-framework-mobsf:latest
```
Then set `MOBSF_URL=http://localhost:8000` in `.env`.

### `wdio: command not found`

Run `npm install` first. WebdriverIO is installed locally — use `npx wdio` or the `npm run` scripts, not a global `wdio` command.

### Tests fail with `anchor element not found`

The screen's `anchor` selector does not match an element in your app. Use Appium Inspector or `adb shell uiautomator dump` to find the correct selector and update the screen object.

---

## What to Customize vs. What to Leave Alone

| File / Directory | Action |
|---|---|
| `appium/screens/*.ts` | **Replace** all `~placeholder` selectors with your app's real element IDs |
| `.env` | **Fill in** every key; never commit this file |
| `api-tests/collections/` | **Replace** placeholder requests with your API endpoints |
| `api-tests/environments/` | **Update** `baseUrl` for staging and production |
| `appium/tests/smoke/` | **Add / modify** tests for your app's critical flows |
| `appium/tests/regression/` | **Add / modify** tests for your app's deeper flows |
| `security/mobsf/scan-config.json` | Tune severity thresholds if needed |
| `accessibility/axe-config.ts` | Tune WCAG rule set if needed |
| `appium/config/android.conf.ts` | Update device capabilities and BrowserStack device matrix |
| `appium/config/ios.conf.ts` | Update device capabilities and BrowserStack device matrix |
| `config/env.ts` | Only modify if you need to add new env vars |
| `.github/workflows/mobile-pipeline.yml` | Only modify to add new pipeline steps |
| `scripts/` | Only modify if you need custom reporting or upload logic |

---

## Next Steps

Once local tests are passing:

1. Push a branch and open a pull request — the pipeline runs automatically
2. Review the Actions run to confirm all steps execute as expected
3. Check Percy for any unexpected visual diffs
4. Check the Slack/Discord notification for the build summary
5. Onboard your team: each engineer needs read access to the BrowserStack and Percy dashboards to review test results

See the [README](README.MD) for full documentation on the tech stack, pipeline stages, device matrix, and estimated costs. See [Best Practices](BEST_PRACTICES.md) for guidelines on writing stable, maintainable tests.
