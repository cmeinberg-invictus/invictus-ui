# Claude Instructions

Follow the repository product UI quality standard:

- `docs/standards/product-ui-quality-standards.md`

This file is the source of truth for frontend, UI, accessibility, routing, testing, design-system, and product experience work.

## Default Behavior

When working on this repository:

- Read the relevant parts of `docs/standards/product-ui-quality-standards.md` before making UI-related changes.
- Use existing design-system tokens, components, and patterns whenever possible.
- Avoid creating new visual patterns, component variants, or route structures unless necessary.
- Prefer maintainable, accessible, tested implementations over quick one-off fixes.
- Keep product behavior predictable, responsive, deep-linkable, and accessible.

## UI and Design-System Rules

For UI work:

- Use approved design tokens for color, typography, spacing, radius, elevation, motion, focus, and theme values.
- Use existing components before creating new ones.
- New reusable components must include documented states, variants, accessibility behavior, and tests.
- Components must work in light and dark themes.
- Components must include keyboard and focus behavior where interactive.
- Do not hardcode design values when a token exists.

## Routing and Information Architecture Rules

For navigation, routes, tabs, filters, and SPA state:

- Meaningful destinations must have stable URLs.
- Shared URLs should restore the intended page, object, tab, filter, and state.
- Browser back and forward actions must behave predictably.
- Route names, page titles, headings, breadcrumbs, and navigation labels should use consistent terminology.
- Separate places from actions: navigation should go to durable locations; actions should trigger workflows or state changes.

## Accessibility Rules

Accessibility is required.

Implementations must meet WCAG 2.2 AA expectations where applicable, including:

- Keyboard navigation.
- Visible focus states.
- Semantic HTML.
- Accessible names and labels.
- Sufficient contrast in light and dark themes.
- Screen-reader-compatible status updates.
- Accessible form validation.
- Correct focus management for dialogs, menus, tabs, and dynamic views.

## Testing Rules

Add or update tests where relevant.

Prioritize:

1. Critical end-to-end flows.
2. Component and integration tests for forms and key pages.
3. Accessibility tests.
4. Routing and deep-linking tests.
5. Unit tests for business logic.
6. API contract or schema validation.
7. Smoke tests.

Do not remove or weaken tests unless there is a clear reason.

## Definition of Done

Before finishing, verify the relevant Definition of Done sections in:

- `docs/standards/product-ui-quality-standards.md`

If a requirement is not met, call it out explicitly and explain why.