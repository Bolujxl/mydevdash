# DevDash

Your personal developer command center — GitHub activity, task management, and weather in one dashboard.

## Features

- **Dashboard** — Personalized greeting, GitHub profile overview, quick stats (stars, forks, languages, completed tasks), recent activity feed, contribution heatmap (30-day), top repositories, and live weather
- **GitHub Explorer** — Search any user, view profile + repos with client-side sort (recent / stars / name) and name filter
- **Task Manager** — Add, toggle, delete tasks with localStorage persistence and All / Active / Completed tabs
- **Weather** — Live conditions via wttr.in, persisted city preference
- **Dark / Light mode** — Full CSS variable system toggled from the sidebar, persisted to localStorage
- **Responsive** — Fixed sidebar on desktop, collapsible drawer with overlay on mobile
- **Error boundary** — App-level crash recovery with reload fallback

## How it works

Three custom hooks drive the data layer:

| Hook | What it does |
|---|---|
| `useFetch(url)` | Generic fetcher with `AbortController` cleanup. Accepts `null` to skip. Attaches GitHub token from `.env` automatically. |
| `useTheme()` | Reads theme from `ThemeContext`, exposes `theme` + `toggleTheme`. |
| `useMemo` across pages | [`uniqueLanguages`](src/pages/Dashboard.jsx#L62) deduplicates repo languages via `Set`. [`contributionStats`](src/pages/Dashboard.jsx#L73) counts pushes / PRs / issues from the events array. [`filteredRepos`](src/pages/GitHub.jsx#L31) chains filter → sort in one pass. [`buildHeatmapData`](src/components/ContributionChart.jsx#L6) maps 30 days of events into intensity buckets. |

State that survives refresh lives in `localStorage`:
- `devdash_tasks` — task array
- `devdash_github_user` — your GitHub handle
- `devdash_weather_city` — last searched city
- `devdash_theme` — dark / light preference

## Tech stack

React 19 · Vite · React Router v7 · Lucide React · GitHub REST API · wttr.in · Pure CSS (no framework)

## Setup

```bash
npm install
npm run dev
```

### Optional: GitHub token

Bumps rate limit from 60/hr to 5000/hr. Create a classic token at https://github.com/settings/tokens (no scopes), then add a `.env`:

```
VITE_GITHUB_TOKEN=ghp_your_token
```

## Project structure

```
src/
├── hooks/          useFetch.js, useTheme.js
├── context/        ThemeProvider.jsx, ThemeContext.js
├── components/     Navbar, WeatherWidget, ActivityFeed,
│                   ContributionChart, RepoCard, TaskItem,
│                   ErrorBoundary
├── pages/          Dashboard, GitHub, Tasks, NotFound
├── styles/         Per-component CSS files + index.css (variables)
├── App.jsx         Routes + layout
└── main.jsx        Entry point
```

## Scripts

| Command | Does |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run preview` | Preview production build |