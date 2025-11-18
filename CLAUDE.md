# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Geekits is an all-in-one digital toolbox built with Next.js, TypeScript, and Material UI. It provides 30+ free utilities for image/video processing, AI chat, calculators, converters, and creative tools. The project supports both web deployment and native mobile apps via Capacitor (iOS & Android).

## Tech Stack

- **Framework**: Next.js 15 with TypeScript
- **UI**: Material UI v7 (MUI)
- **State Management**: React Contexts (see `src/contexts/`)
- **Mobile**: Capacitor 6 for iOS & Android
- **Backend**: Supabase for database and auth
- **I18n**: Custom i18n system supporting zh-CN, en-US, zh-HK, zh-TW
- **Testing**: Jest with React Testing Library

## Build & Development Commands

### Development
```bash
pnpm dev                 # Start Next.js dev server
pnpm dev:cap             # Start dev server for Capacitor build
```

### Building
```bash
pnpm build               # Build for web production
pnpm build:cap           # Build for Capacitor and sync mobile apps
pnpm local-build         # Local build without optimizations
```

### Docker
```bash
pnpm build:image         # Build Docker image
pnpm start:container     # Run Docker container on port 4000
```

### Testing
```bash
pnpm test                # Run all Jest tests
pnpm test:unit           # Run tests with verbose output
```

### Other
```bash
pnpm i18n:update         # Convert i18n Excel file to JSON
pnpm start               # Start production server on port 4000
```

## Architecture

### Directory Structure

```
src/
├── apps/           # Individual tool implementations (40+ tools)
├── components/     # Reusable React components
├── contexts/       # React context providers
├── data/           # Static data, i18n files, external apps
├── pages/          # Next.js pages and API routes
└── utils/          # Utility functions and helpers
```

### App System

Each tool lives in `src/apps/[app-name]/` with the following structure:

- **index.tsx**: Main React component for the tool
- **README.zh-CN.md**: Chinese documentation with frontmatter metadata
- **README.en-US.md**: English documentation with frontmatter metadata

Frontmatter metadata in README files:
```yaml
---
name: "Tool Name"
icon: "/icon/tool.png"
description: "Brief description"
status: "stable" | "beta" | "alpha"
channel: "life" | "ai" | "media" | "developer"
freeSize: true  # Optional: removes default centering
platform: ["web", "ios", "android"]  # Optional: defaults to all
---
```

### Dynamic App Loading

Apps are loaded dynamically using Webpack's `require.context`:

1. App metadata is extracted from README frontmatter using `gray-matter`
2. Apps are registered in `src/utils/appEntry.ts` for dynamic imports
3. The `getAllApps()` function in `src/utils/appData.ts` discovers all apps
4. Dynamic routing via `src/pages/app/[id].tsx` renders each tool

### I18n System

Translations are managed via Excel file workflow:

1. Edit `src/data/i18n.xlsx` with new translations
2. Run `pnpm i18n:update` to convert to JSON
3. Access translations via `translator()` utility from any locale context

Supported locales: zh-CN (default), en-US, zh-HK, zh-TW

### Dual Build System

The project supports two build modes controlled by `CAPACITOR_BUILD` env var:

**Web Mode** (default):
- i18n routing enabled
- Dynamic API routes
- Server-side rendering

**Capacitor Mode** (`CAPACITOR_BUILD=true`):
- Static export (`output: "export"`)
- No i18n routing
- Images unoptimized
- Base64-encoded icons

### State Management via Contexts

Six main context providers in `src/contexts/`:

- **account.ts**: User account state
- **action.ts**: Global actions and modal state
- **appBar.ts**: App bar visibility and configuration
- **colorMode.tsx**: Dark/light theme management
- **locale.ts**: Current locale state
- **sidebar.ts**: Sidebar open/close state

### Path Aliases

TypeScript paths configured in `tsconfig.json`:

- `@/components/*` → `src/components/*`
- `@/contexts/*` → `src/contexts/*`
- `@/data/*` → `src/data/*`
- `@/apps/*` → `src/apps/*`
- `@/types/*` → `types/*`
- `@/utils/*` → `src/utils/*`
- `@/hooks/*` → `src/hooks/*`

### Webpack Customizations

Custom loaders in `next.config.ts`:

- `.md` files → `raw-loader`
- `.ttf` files → `ttf-loader`
- `.svg` files → `@svgr/webpack` (imported as React components)

## Adding a New Tool

1. Create directory: `src/apps/[tool_name]/` (use snake_case)
2. Add `index.tsx` with React component
3. Create `README.zh-CN.md` and `README.en-US.md` with frontmatter
4. Register in `src/utils/appEntry.ts` following existing patterns
5. Add any tool-specific translations to `src/data/i18n.xlsx`
6. Run `pnpm i18n:update` if translations were added

## Environment Variables

Required for full functionality:

- `RESEND_API_KEY`: For sending feedback emails
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase public key
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `CAPACITOR_BUILD`: Set to "true" for mobile builds

## Important Notes

- TypeScript strict mode is disabled (`strict: false`)
- Production builds ignore TypeScript errors (`ignoreBuildErrors: true`)
- Package manager is locked to `pnpm@9.15.4`
- Node version requirement: `>=22.0.0`
- Mobile app bundle ID: `com.ygeeker.geekits`
