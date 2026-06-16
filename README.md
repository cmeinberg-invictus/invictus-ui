# Verena by Invictus AI

Initial SPA scaffold for a three-panel AI workspace:

- Left: navigation + recents
- Center: activity conversation/chat
- Right: background tasks + related artifacts

## Tech Stack

- Vite
- React + TypeScript
- React Router
- Tailwind CSS
- Vitest + Testing Library
- ESLint + Prettier

## Getting Started

### Prerequisites

- Node.js 20+ recommended
- npm 10+

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Build

```bash
npm run preview
```

### Lint and Test

```bash
npm run lint
npm run test
```

## Available Scripts

- `npm run dev` - start local dev server
- `npm run build` - type-check and build production assets
- `npm run preview` - preview production build locally
- `npm run lint` - run ESLint
- `npm run test` - run Vitest once
- `npm run test:watch` - run Vitest in watch mode
- `npm run format` - check formatting with Prettier
- `npm run format:write` - apply Prettier formatting

## Routing

- `/` - Home
- `/activities` - Activities list
- `/activities/:activityId` - Activity chat view
- `/artifacts` - Artifacts list
- `/artifacts/:artifactId` - Artifact detail
- `/settings` - User/settings page
- `*` - Not found

## Project Structure

```text
src/
  app/
    layout/           # App shell, left nav, right panel
    AppProviders.tsx  # Theme + app state providers
    router.tsx        # Route definitions
  components/ui/      # Reusable UI primitives
  data/               # Local mock seed data
  features/
    chat/             # Chat view/composer
    tasks/            # Background tasks panel
  lib/                # Shared utilities
  pages/              # Route-level screens
  store/              # App state context
  styles/             # Tokens and global styles
  test/               # Test setup
  types/              # Domain types
```

## Design and UX Notes

- Theme support: light and dark via `data-theme`
- Tokenized styles in `src/styles/tokens.css`
- URL-driven state for route context and right-panel visibility
- Mock-first implementation with local in-memory state

## Tests Included

- Deep-link restore for activity route
- Shell/navigation presence and accessibility basics
- Composer send flow
- Theme toggle behavior

## Repository Notes

- Product UI standards live in `docs/standards/product-ui-quality-standards.md`
- Agent guidance is in `AGENTS.md` and `CLAUDE.md`
