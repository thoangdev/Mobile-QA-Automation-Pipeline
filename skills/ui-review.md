# Skill: UI Review

## Purpose

Evaluate mobile app UI for usability, accessibility, and visual consistency as part of automated and manual review.

## When to Use

- During visual regression and accessibility test planning
- When new UI flows or screens are added

## Inputs

- UI/UX designs
- Automated test results (Percy, Axe)

## Outputs

- UI review reports
- Recommendations for improvement

## Constraints

- Must align with accessibility and visual standards
- No subjective or undocumented feedback

## Safety/Performance Considerations

- Ensure reviews do not block the critical path unless issues are severe
- Document all findings for traceability

## Best Practices

### Selector strategy

- Prefer accessibility IDs (`~element-id`) over XPath. Accessibility IDs are stable across OS versions and refactors; XPath breaks with minor layout changes.
- If an element lacks an accessibility ID, flag it to the development team. Adding labels improves both test stability and real-world accessibility for screen reader users.
- All selectors must be defined in screen objects — never in spec files.

### Percy visual review

- Capture snapshots only at fully settled screen states — after load is complete and animations have finished. Mid-transition snapshots create noise and false positives.
- Do not snapshot every screen. Focus on screens with complex layouts, data-driven content, or a history of regressions. Excessive snapshotting increases cost and review fatigue.
- Every Percy diff must be explicitly approved or rejected before a PR is merged. An unreviewed diff is an unreviewed change.

### Accessibility standards

- WCAG 2.1 AA compliance in primary flows (login, onboarding, checkout, core navigation) is a blocking release gate.
- Violations in secondary flows are non-blocking warnings — surface them in the report but do not block the pipeline.
- Accessibility labels for new screens must be part of development acceptance criteria, not added retroactively.

### Screen object quality

- Every screen object extends `BasePage` and declares an `anchor` element that confirms the screen is fully loaded.
- Action methods must encapsulate all Appium interactions. Spec files call actions by name, not by raw element locators.
- Screen objects are written and validated in Appium Inspector before specs are written against them.

See [BEST_PRACTICES.md](../BEST_PRACTICES.md) for the full reference.
