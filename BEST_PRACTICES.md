# Best Practices

Guidelines for getting the most out of this pipeline template. Following these keeps the suite fast, stable, and maintainable as it grows.

---

## Test Design

### Keep smoke and regression clearly separated

Smoke tests are a hard gate — they must finish in under 5 minutes and cover only the flows that, if broken, make the app unusable (login, core navigation, checkout). Tag them `@smoke` in the `describe` block title and put them under `appium/tests/smoke/`. Everything else is regression.

Do not add "just one more check" to a smoke spec. When smoke tests grow, they slow down and lose their value as a fast signal.

### One spec file per feature area

Group tests by user-facing feature (login, onboarding, search), not by technical layer. A spec file should read like a user story, not a technical checklist.

### Tests must be independent

Every test should be able to run in isolation and in any order. Use `resetApp()` in `beforeEach` to start from a clean state. Never rely on a previous test having navigated somewhere or left data behind.

### Avoid testing the same thing twice

Smoke tests cover the happy path. Regression tests cover edge cases, error states, and complex flows. Do not duplicate assertions between the two suites — it adds maintenance cost without adding coverage.

---

## Selectors

### Prefer accessibility IDs over XPath

Accessibility IDs (`~element-id`) are stable across OS versions and refactors. XPath is brittle, verbose, and breaks with minor layout changes. Use XPath only as a last resort.

```typescript
// Prefer this:
$('~login-button')

// Avoid this:
$('//android.widget.Button[@text="Log In"]')
```

### Work with your app team to add accessibility labels

If elements in your app don't have accessibility IDs, ask the development team to add them. This improves both testability and actual accessibility for screen reader users — a win on both counts.

### Define selectors once, in the screen object

Never write selectors directly in spec files. All element references belong in the screen object. If a selector changes, you update it in one place.

---

## Screen Objects

### Every screen extends `BasePage` and declares an `anchor`

The `anchor` is the single element whose visibility confirms the screen is fully loaded. Choose an element that appears only after the screen transition is complete — not a loading spinner, not a static header that persists across screens.

### Action methods hide interaction details from tests

Tests should read like user actions (`loginAs()`, `proceedToCheckout()`), not like Appium commands (`$('~btn').click()`). Keep all `waitForDisplayed`, `setValue`, and `click` calls inside the screen object.

### Return the next screen from navigation methods where it makes sense

This makes test flow readable and ensures the next screen is ready before assertions:

```typescript
// In CheckoutScreen:
async confirmOrder(): Promise<OrderConfirmationScreen> {
  await this.confirmButton.click();
  await OrderConfirmationScreen.waitForLoad();
  return OrderConfirmationScreen;
}
```

---

## Stability and Flakiness

### Never use arbitrary `sleep` or `pause` calls

Hard-coded waits are a smell. Use `waitForDisplayed`, `waitForEnabled`, or `waitUntil` with a timeout instead. The shared config sets a 30-second `waitforTimeout` that applies globally.

### Use `returnToHome()` in teardown for flows that leave side effects

For tests that complete a checkout or change account settings, use the `returnToHome()` helper in `afterEach` to reset navigation state without a full app restart when possible.

### The retry limit is 2 — fix flaky tests, don't rely on retries

Retries exist to absorb genuine network flakiness on BrowserStack, not to hide unstable test logic. If a test fails more than occasionally, investigate the root cause rather than raising the retry count.

---

## Environment and Secrets

### Never hardcode credentials, URLs, or tokens

All sensitive values go in `.env` locally and in GitHub Secrets for CI. The `Env` object in `config/env.ts` is the only place environment variables are read — use it, do not call `process.env` directly in test files or scripts.

### Keep `.env` out of version control

`.env` is in `.gitignore`. Never commit it. If you need to share configuration with a teammate, share the `.env.example` template and communicate the values through a secure channel.

### Run `validate:env` before starting a long pipeline run

```bash
npm run validate:env
```

This catches missing secrets before CI spends 30 minutes running jobs that will fail at the last step.

---

## API Tests

### Always run API tests against a seeded, isolated staging environment

Never run API tests against production. Use the staging environment JSON, and ensure it has a known, consistent seed state so tests aren't affected by other activity on the environment.

### Validate schema, not just status codes

A 200 response with a missing or wrong-typed field is a bug. Use schema assertions in your Postman collection to catch structural regressions, not just HTTP status codes.

### Do not duplicate frontend validation in API tests

API tests should validate what the API contract guarantees — endpoints, schemas, SLAs, and error codes. They should not re-test business logic that your Appium suite already covers end-to-end.

---

## Security Scanning (MobSF)

### Block on critical, warn on medium and low

The pipeline is configured to block on critical findings. Do not lower this threshold. Medium and low findings should be reviewed and tracked, but they should not block every release — triage them and address them in a dedicated security backlog.

### Run the scan against the same binary you release

The security scan is only useful if it scans the production build. Do not scan a debug build or a development variant — those have different permissions and flags.

### Do not check app binaries into version control

Place your `.apk` and `.ipa` in `apps/android/` and `apps/ios/` locally. Both directories are in `.gitignore`. Large binaries in git history cause slow clones and are hard to remove cleanly.

---

## Visual Testing (Percy)

### Capture snapshots at stable, settled states

Take Percy snapshots after a screen is fully loaded and any animations have completed. Snapshots taken mid-transition produce noise and false diffs.

### Review and approve diffs before merging

Do not treat visual diffs as optional. An unreviewed visual diff is an unreviewed change. Establish a team norm: no merge until Percy diffs are explicitly approved or rejected.

### Do not snapshot every screen

Focus visual snapshots on screens with complex layouts, data-driven content, or a history of visual regressions. Snapshotting every screen increases Percy usage cost and creates review overhead with low signal.

---

## Accessibility Testing

### Block on WCAG 2.1 AA violations in primary flows

Primary flows are login, onboarding, checkout, and core navigation. These are non-negotiable. Any AA violation here must be fixed before the pipeline is considered green.

### Surface a11y failures alongside functional failures

Accessibility tests run inside the regression suite so that a11y regressions are visible in the same report as functional ones — not siloed in a separate job that gets ignored.

### Treat accessibility labels as a shared responsibility

When a new screen is added to the Appium suite, adding its accessibility labels to the axe config is part of the definition of done — not an afterthought.

---

## CI / GitHub Actions

### Do not merge a red pipeline

The pipeline runs on every pull request. A failed pipeline means something is broken. Do not merge with a failing check, even if you believe the failure is unrelated to your change — investigate first.

### Keep optional steps conditional, not commented out

The workflow uses `if:` conditions to skip steps when their required secrets are not configured. Do not comment out steps as a workaround — use the condition pattern already established in the workflow file.

### Use meaningful BrowserStack build names

The build name is set to `Build ${GITHUB_RUN_NUMBER}` automatically. If you need to add context (branch name, device matrix label), extend `Env.githubRefName` — do not hardcode strings into the capability.

### Treat report artifacts as the source of truth

After a CI run, the `qa-reports-<run-number>` artifact contains the authoritative output. The Slack/Discord notification is a summary, not a replacement. When investigating a failure, download the artifact.

---

## Adding New Test Coverage

### Write the screen object before the spec

Define the screen object, confirm its selectors work in Appium Inspector, then write the spec. Writing specs against undefined selectors leads to tests that never ran.

### One new screen = one PR

Keep screen object additions and their corresponding tests in the same PR. Do not open a PR with only a screen object and no tests, or tests that reference a screen object not yet merged.

### Document placeholder selectors clearly

If you add a screen object before the app has finalized its element IDs, mark placeholders explicitly:

```typescript
// PLACEHOLDER — replace with real accessibility ID once dev ships the screen
private get continueButton() { return $('~placeholder-continue'); }
```

Remove all placeholders before the spec is included in the regression suite.
