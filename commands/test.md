# Command: test

## Purpose

Run individual test suites for smoke, regression, API, visual, accessibility, or security validation.

## Preconditions

- All setup steps completed
- .env and secrets configured

## Steps

1. Use the appropriate npm script for the desired test type:
   - `npm run test:smoke`
   - `npm run test:regression`
   - `npm run test:api`
   - `npm run test:visual`
   - `npm run test:a11y`
   - `npm run scan:mobsf`
2. Review output and reports for pass/fail status

## Expected Output

- Test results for the selected suite
- Reports generated in the `reports/` directory

## Failure Handling

- Output clear error messages and next steps
- TODO: Add test result summary and artifact upload automation
