# Skill: Test Planning

## Purpose

Define, organize, and prioritize test cases and validation strategies for all pipeline layers.

## When to Use

- At the start of each release cycle
- When new features or validation layers are added

## Inputs

- Requirements and acceptance criteria
- Risk assessments
- Historical test results

## Outputs

- Test plans
- Test case lists
- Coverage reports

## Constraints

- Must cover all critical flows and risk areas
- No redundant or unmaintainable test cases

## Safety/Performance Considerations

- Optimize for fast feedback and reliability
- Review plans for gaps and overlaps before execution

## Best Practices

### Smoke vs. regression scope

- Smoke tests cover only the flows that, if broken, make the app unusable. They must complete in under 5 minutes and are tagged `@smoke`. Any failure blocks the pipeline immediately.
- Regression tests cover deeper workflows, edge cases, and error states. They run on real devices via BrowserStack with up to 2 automatic retries for network flakiness.
- Define this scope split at planning time for every new feature — it is much harder to untangle after specs are written.

### Test independence

- Every test must be runnable in isolation and in any order. Plan for `resetApp()` in `beforeEach` as the default. Do not design tests that depend on prior state.
- One spec file per feature area. A file should read like a user story, not a technical checklist.

### No duplicate coverage

- Smoke and regression suites must not assert the same things. Smoke validates that the critical path works; regression validates that it works correctly across all paths.
- API tests validate the API contract (schemas, SLAs, error codes). They do not duplicate end-to-end validation already covered by Appium.

### Screen object first

- Plan for screen objects to be written and validated in Appium Inspector before any specs are written against them. Spec work should not begin until selectors are confirmed.
- Placeholder selectors are acceptable during early development but must be tracked and removed before a spec enters the regression suite.

### Accessibility coverage

- Identify primary flows (login, onboarding, checkout, core navigation) at planning time. WCAG 2.1 AA compliance in these flows is a blocking gate.
- Secondary flows are non-blocking — surface violations as warnings, not release blockers.

See [BEST_PRACTICES.md](../BEST_PRACTICES.md) for the full reference.
