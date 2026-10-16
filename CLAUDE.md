# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Domino Tracker frontend: a Next.js 16 (App Router) app for tracking domino players, teams, matches, "wars" (best-of series between two teams), and seasons. It is a pure client for a separate backend API (see `lib/api/api.ts`); there is no backend code in this repo.

## Commands

- `npm run dev` — start dev server (uses `--webpack`, not Turbopack)
- `npm run build` — production build
- `npm run start` — run production build
- `npm run lint` — ESLint (flat config via `eslint.config.mjs`, extends `eslint-config-next`)

There is no test suite configured in this repo.

## Architecture

### Data flow: server page → prefetch → client component

Routes under `app/*/page.tsx` are server components. Each one creates a `QueryClient`, calls `queryClient.prefetchQuery` for the data the page needs, and wraps a `*Client` component (in `app/components/<feature>/`) in a `HydrationBoundary`. The `*Client` component is `'use client'` and re-fetches the same query keys with `useQuery`, picking up the prefetched/hydrated cache. When adding a new page, follow this pair pattern (e.g. `app/players/page.tsx` + `app/components/players/players-client.tsx`) rather than fetching directly in a client component with no prefetch.

React Query's `QueryClientProvider` is set up once in `providers/query-provider.tsx` and mounted in the root layout (`app/layout.tsx`), which also renders the persistent `Sidebar`, `Header`, and a global `sonner` `Toaster` used for success/error feedback on mutations.

### API layer

All HTTP calls live in `lib/api/api.ts` as plain async functions (no client class/wrapper). `API_URL` is currently hardcoded to `http://localhost:5166` (not an env var) — update this constant directly if the backend URL changes. Functions throw `Error` on non-ok responses, often trying to extract a backend `message`/`title` from the JSON error body first. Types for request/response shapes live in `lib/types/types.ts` and are imported into `api.ts`.

When adding a new endpoint, add a function here following the existing naming (`getX`, `createX`) and add/extend types in `lib/types/types.ts`.

### Season filtering

`lib/store/season-store.ts` is a Zustand store (persisted to localStorage as `season-filter`) holding `selectedSeasonIds: number[]`. An empty array means "all seasons". `app/components/season-selector.tsx` (rendered in `Sidebar`) lets the user pick seasons and calls `initializeDefault` once seasons load, defaulting to whichever season is currently active by date.

Any stats/listing query that should respect the season filter reads `selectedSeasonIds` from this store and includes it both in the React Query `queryKey` and as an argument to the corresponding `api.ts` function (which serializes it via `withSeasonIds`/`seasonIds` query params). Follow this pattern for any new season-aware query — see `players-client.tsx` for an example combining `selectedSeasonIds` with `useQuery`.

### Matches, wars, and "play" flow

- A **match** is one game between `teamA` and `teamB`, of type `Fixed` (same two teams) or `Rotating`.
- A **war** is a saved set of matches (`createWar(matchIds)`) between the same two teams for a day; `createTodayWar`/`getWars`/`getWarById` manage these.
- The `/play` → `/match` flow: `play-client.tsx` lets the user pick teams/type, then navigates to `/match` passing `teamA`, `teamB`, and `type` as JSON-stringified search params (see `match-client.tsx` parsing `searchParams.get("teamA")` with `JSON.parse`). `match-client.tsx` then creates matches, tracks same-day match history via `getMatchHistory`, and optionally bundles the day's matches into a war.

### UI components

- `components/ui/*` are shadcn/radix-ui primitives (configured via `components.json`, style `radix-maia`, icon library `hugeicons`, base color `neutral`). Use the `shadcn` CLI conventions (aliases `@/components`, `@/lib`, `@/components/ui`, `@/hooks`) when adding new primitives rather than hand-rolling them.
- `app/components/<feature>/` holds feature-specific client components (players, teams, match, wars, manage, play, home).
- Player avatars are resolved by nickname via `getPlayerAvatar` in `lib/helpers.ts` → `/public/players/<nickname-lowercased>.png`; adding a player requires a matching image file.
- Path alias `@/*` maps to the repo root (see `tsconfig.json`).

### Language

UI copy and toast messages are in Spanish; keep new user-facing strings consistent with this.
