# GitHub Copilot Instructions

This repository follows the product UI quality standard defined in:

`docs/standards/product-ui-quality-standards.md`

Use that document as the source of truth for frontend, UI, accessibility, routing, testing, design-system, and product experience work.

## General Guidance

When suggesting or generating code:

- Prefer existing design-system tokens, components, and patterns.
- Avoid one-off UI, hardcoded styles, and duplicated component behavior.
- Keep implementations accessible, responsive, theme-aware, and maintainable.
- Support both light and dark themes where UI is affected.
- Use semantic HTML where applicable.
- Preserve predictable routing, browser history, and deep-linking behavior.
- Add or update tests for important behavior.
- Follow the relevant Definition of Done sections from the product UI quality standard.

## Design System

Use existing tokens for:

- Color
- Typography
- Spacing
- Radius
- Elevation
- Motion
- Focus states
- Breakpoints
- Theme values

Use existing components before creating new ones.

New reusable components should include:

- Clear variants
- Loading, empty, error, success, disabled, and focused states where relevant
- Keyboard behavior
- Focus behavior
- Accessible labels and semantics
- Light and dark theme support
- Tests
- Documentation when appropriate

## Accessibility

Generated UI should meet WCAG 2.2 AA expectations where applicable.

Prioritize:

- Keyboard navigation
- Visible focus states
- Semantic structure
- Accessible names and labels
- Sufficient contrast
- Screen-reader-compatible dynamic updates
- Accessible form validation
- Correct dialog, menu, tab, and focus management

## Routing and SPA State

For SPA work:

- Meaningful destinations should have stable URLs.
- Shared URLs should restore relevant page, object, tab, filter, pagination, and message state.
- Browser back and forward actions should behave predictably.
- Route names, page titles, headings, breadcrumbs, and navigation labels should use consistent terminology.
- Unauthorized or unavailable routes should provide helpful recovery paths.

## Testing

When generating tests, prioritize:

1. Critical user flows
2. Component and integration tests for forms and key pages
3. Accessibility tests
4. Routing and deep-linking tests
5. Unit tests for business logic
6. API contract or schema validation
7. Smoke tests

Do not suggest removing tests unless there is a clear replacement or reason.

## Completion Standard

A change is not complete unless it satisfies the relevant parts of:

`docs/standards/product-ui-quality-standards.md`

If a requirement cannot be satisfied, the exception should be documented.