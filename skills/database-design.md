# Skill: Database Design

## Purpose

Design and document data models and test data management strategies for backend and test automation needs.

## When to Use

- When new data storage or test data requirements arise
- During test data factory planning

## Inputs

- Requirements documents
- Existing data models

## Outputs

- Database schemas
- Test data management plans

## Constraints

- Must support test isolation and repeatability
- No production data exposure in tests

## Safety/Performance Considerations

- Ensure data privacy and compliance
- Optimize for test speed and reliability

## Best Practices

### Test data isolation

- API tests always run against a seeded, isolated staging environment with a known, consistent seed state. Tests must not depend on data left by a previous test run or by concurrent activity on the environment.
- Each test or test suite should be able to set up and tear down its own data, or rely on a known fixture that is reset before the run. Shared mutable state between tests causes intermittent failures that are difficult to diagnose.

### No production data in tests

- Test credentials (`TEST_USERNAME`, `TEST_PASSWORD`) are dedicated test accounts — never real user accounts or production data. These values flow through `.env` locally and GitHub Secrets in CI.
- No personally identifiable information, payment data, or regulated data may appear in test fixtures, seed scripts, or reports. Use synthetic data that matches the shape of real data without being real.

### Seed strategy

- Design seeds to be idempotent — running a seed script twice should produce the same result as running it once. This makes environment resets reliable.
- Seed data should cover the minimum state required for the test suite to run: valid user accounts, the data structures each test flow depends on, and any reference data the API requires.

### Future: test data factory

- A centralized test data factory (planned as a future improvement) will provide typed, composable seed/teardown helpers so each spec can declare its preconditions explicitly rather than relying on implicit shared state. Design schemas to support this pattern: prefer discrete, independently addressable entities over deeply nested or tightly coupled data models.

See [BEST_PRACTICES.md](../BEST_PRACTICES.md) for the full reference.
