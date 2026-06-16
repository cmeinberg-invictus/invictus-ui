# Agent Instructions

This repository follows the product UI quality standard defined in:

- `docs/standards/product-ui-quality-standards.md`

Before making changes related to frontend, UI, UX, accessibility, routing, navigation, design-system components, testing, content, or product flows, read and follow that standard.

## Core Requirements

All relevant work must satisfy the applicable sections of the standard, especially:

- Design System
- Information Architecture and Routing
- Accessibility
- Content and Terminology
- Testing Strategy
- Performance, Reliability, and Observability
- Roles, Permissions, and Security UX
- Definition of Done

## Working Rules

When implementing UI or frontend changes:

1. Prefer existing design-system tokens, components, and patterns.
2. Do not introduce one-off UI unless there is a clear product reason.
3. Keep routes meaningful, stable, shareable, and restorable.
4. Preserve browser back and forward behavior.
5. Ensure meaningful SPA state is reflected in the URL when relevant.
6. Support responsive layouts across supported viewport sizes.
7. Support both light and dark themes.
8. Meet WCAG 2.2 AA accessibility expectations.
9. Include loading, empty, error, success, and permission states where relevant.
10. Add or update tests for critical behavior.
11. Update documentation when adding reusable components, patterns, routes, or standards.

## Before Finishing a Task

Before considering a task complete, check the relevant Definition of Done sections in:

- `docs/standards/product-ui-quality-standards.md`

If a requirement cannot be met, document the exception clearly in the implementation notes or PR description.