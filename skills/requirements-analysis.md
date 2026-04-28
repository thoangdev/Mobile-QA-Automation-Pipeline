# Skill: Requirements Analysis

## Purpose

Translate business objectives and stakeholder needs into actionable, testable requirements for the mobile QA pipeline.

## When to Use

- At project kickoff
- When new features or validation layers are proposed
- During backlog refinement

## Inputs

- Business goals
- Stakeholder feedback
- Regulatory requirements

## Outputs

- Requirements documents
- Acceptance criteria

## Constraints

- Requirements must be clear, measurable, and testable
- No ambiguous or duplicate requirements

## Safety/Performance Considerations

- Ensure requirements do not conflict with security or test standards
- Review for completeness before handoff to engineering

## Best Practices

### Make requirements directly testable

- Every acceptance criterion must be verifiable by a passing or failing automated test. Criteria like "the app should feel responsive" cannot be automated — rewrite them with measurable thresholds (e.g. "API responses must return within 500ms under normal load").
- API SLAs must be stated numerically so Newman can assert against them.

### Define smoke vs. regression scope per feature

- For each new feature, explicitly identify which flows are critical path (smoke) and which are deeper validations (regression). This prevents smoke tests from growing beyond their 5-minute budget.
- Document the scope split in the acceptance criteria so QA and frontend agents can implement it without ambiguity.

### Accessibility is a first-class requirement

- Every new screen or flow must include explicit accessibility requirements. WCAG 2.1 AA compliance in primary flows is a release gate.
- Accessibility labels for new UI elements must be specified in development acceptance criteria — not left to the engineer's discretion or added after the screen ships.

### Flag security-sensitive features early

- Any feature involving authentication, permissions, sensitive data, or external transmission must be flagged for security review during requirements analysis — before implementation begins.
- Compliance constraints (data residency, session handling, audit logging) belong in requirements, not in post-hoc code review.

### Do not prescribe implementation

- Requirements define what must be validated and to what standard — not which selectors to use, which endpoints to call, or how tests are structured. Implementation belongs to the engineering and QA agents.
- Overly specific requirements create brittleness: when implementation changes, requirements that prescribe the how become incorrect rather than the tests being updated.

See [BEST_PRACTICES.md](../BEST_PRACTICES.md) for the full reference.
