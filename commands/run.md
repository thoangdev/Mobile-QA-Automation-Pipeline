# Command: run

## Purpose

Execute the full CI/CD pipeline locally or in CI, mirroring the GitHub Actions workflow.

## Preconditions

- All setup steps completed
- .env and secrets configured

## Steps

1. Run `npm run pipeline` to execute all validation layers sequentially
2. Monitor output for failures or warnings
3. Review generated reports in the `reports/` directory

## Expected Output

- All tests and scans executed
- Reports generated for each validation layer
- Notifications sent if configured

## Failure Handling

- Pipeline halts on critical failures (security, smoke, accessibility)
- Output clear error messages and next steps
- TODO: Add local notification and report upload automation
