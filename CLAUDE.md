# Halloween Calendar

Static single-page app: one horror movie per night of October (1–31), filterable by subgenre, decade and continent. No backend, no API — all data is local.

## Commands

```bash
npm run dev      # Vite dev server, http://localhost:5173
npm test         # Vitest (jsdom): data schema, scheduler, UI smoke tests
npm run build    # tsc --noEmit + vite build → dist/
```

Run `npm test` and `npm run build` before every commit.

## Stack

Vite 8 · React 18 · TypeScript 7 (strict, `noUnusedLocals`) · Tailwind CSS v4 via `@tailwindcss/vite` (no `tailwind.config.js`; theme tokens live in `@theme` in `src/index.css`) · `@radix-ui/react-dialog` · date-fns 4 · zod 4 (tests only).

## Layout

- `src/lib/types.ts` — `Movie`, `Filters`, and the canonical `SUBGENRES` / `CONTINENTS` lists + labels. Add a subgenre here first.
- `src/lib/filters.ts` — `matches()` (OR within a group, AND across groups, empty group = all) and URL query (de)serialization (`?sub=…&dec=…&cont=…`).
- `src/lib/schedule.ts` — `buildSchedule()`: pure, deterministic. Sorts by `intensity` ascending (month escalates toward Halloween), ties broken by a year-seeded FNV hash, picks 31 spread across the range, places fewer than 31 on evenly spaced days ending on Oct 31 (rest are `null` → "No match tonight"). `halloween-1978` is pinned to Oct 31 when it matches.
- `src/lib/dates.ts` — after October the calendar shows *next* year's October; today is only highlighted during October.
- `src/data/movies.json` — the curated dataset (~200 films). `src/data/index.ts` casts it to `Movie[]`; shape is enforced only by `src/data/movies.test.ts`.
- `src/components/` — `FilterPanel`, `Calendar` (Monday-first grid; single column list below `md`), `DayCell`, `MovieModal`, `Header`, `Intensity`.

## Conventions

- Dark-only Halloween theme. Use the theme color tokens (`night`, `crypt`, `tomb`, `fog`, `bone`, `ash`, `pumpkin`, `ember`, `blood`), not raw hex values, in components.
- Keep `schedule.ts` / `filters.ts` pure and React-free; UI state lives in `App.tsx` (filters + selected movie), no state library.
- Accessibility: day cells are `<button>`s with an `aria-label` of `October N: Title (Year)`; today carries `aria-current="date"` and `data-today` (tests rely on both).
- Respect `prefers-reduced-motion` for any new animation (see `index.css`).

## Movie data rules

- `id` = `kebab-title-YEAR`, unique; must end with `-${year}`.
- `continent` is geographic: Mexico, Central America and the Caribbean are **North America**. Co-productions use the primary production country only.
- `subgenres`: 1–3 values; the first one is shown as the badge on the calendar cell, so list the most characteristic first.
- `intensity`: 1 cozy · 2 spooky · 3 scary · 4 terrifying · 5 brutal. It drives the ordering of the month.
- `plot`: 2–3 spoiler-free sentences in original wording (60–400 chars); `whyWatch`: one line (≤160 chars).
- Tests require ≥8 films per subgenre, ≥5 per continent, every decade 1920s–2020s, and ≥100 films total — keep that coverage when removing entries.
- Facts were written from model knowledge, not verified against IMDb/Wikipedia; double-check year, director, runtime and country when editing an entry.

## Testing notes

- UI tests fake only `Date` (`vi.useFakeTimers({ toFake: ["Date"] })`) — faking all timers breaks user-event.
- Tests pin "today" to 2026-10-07; the unfiltered 2026 schedule puts *Halloween (1978)* on Oct 31.
- For visual checks: `npm run build && npx vite preview`, then screenshot with headless Chrome. Headless Chrome won't render narrower than ~500px, so use `--window-size=500,…` for mobile.
