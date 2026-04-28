# Skill: API Design

## Purpose

Define, document, and evolve backend API contracts to support automated testing and integrations.

## When to Use

- When new endpoints or integrations are needed
- During test planning for API validation

## Inputs

- Requirements documents
- Existing API specs

## Outputs

- API specifications (OpenAPI, Postman collections, etc.)
- Change logs

## Constraints

- APIs must be versioned and backward compatible
- No breaking changes without review

## Safety/Performance Considerations

- Validate against security and performance requirements
- Document all changes for traceability

## Best Practices

### Design for testability

- Every API endpoint must be testable against a seeded, isolated staging environment. If an endpoint cannot be tested without hitting production data or third-party systems, the design needs to be reconsidered.
- Staging and production environments are configured in separate Postman environment files (`staging.postman_environment.json`, `production.postman_environment.json`). Base URLs belong there — not hardcoded inside collection requests.

### Validate contracts, not just status

- API tests must assert on response schema and field types, not just HTTP status codes. A 200 with a missing or wrong-typed field is a contract violation and a bug.
- Define explicit SLAs (response time thresholds) in requirements and assert against them in the Newman collection.

### Separate concerns from UI validation

- API tests validate what the API guarantees: endpoints, schemas, SLAs, and error codes. They do not re-test business logic already covered by the Appium regression suite. Duplication creates false confidence and maintenance burden.

### Credentials and secrets

- No API keys, tokens, or passwords appear in Postman collection files or environment files committed to version control. Use Postman environment variable references that are populated from `.env` or GitHub Secrets at runtime.
- The `Env` object in `config/env.ts` is the single permitted read point for all secrets used by integration scripts.

### Breaking changes

- Treat any change to an endpoint's path, method, required parameters, or response schema as a breaking change. Coordinate with QA to update the Newman collection before the change ships.
- Add a changelog entry for every API change so the test collection history is traceable.

See [BEST_PRACTICES.md](../BEST_PRACTICES.md) for the full reference.
