# DevDash

A personal developer dashboard that tracks your GitHub activity, manages tasks, and shows live weather — all in one place.

## Features

- **Dashboard** — Greeting, GitHub profile overview, quick stats (tasks, stars, forks, languages), recent activity feed, recent repositories, and live weather widget
- **GitHub Explorer** — Search any GitHub user, view their profile and repositories with sort and filter
- **Task Manager** — Full CRUD task list with localStorage persistence, All/Active/Completed filters
- **Weather Widget** — Search any city for live conditions (temperature, humidity, wind speed) with persistent city preference
- **Activity Feed** — Real-time GitHub events feed showing commits, PRs, issues, stars, and more
- **Error Boundary** — Graceful crash recovery

## Tech Stack

- **React 19** with Vite
- **React Router v7** for client-side routing
- **Lucide React** for icons
- **Pure CSS** with GitHub-dark theme — no UI framework
- **GitHub REST API** for profile, repos, and events
- **wttr.in** for weather data

## Setup

```bash
npm install
npm run dev
```

### Optional: GitHub Token

By default, GitHub's anonymous rate limit is 60 req/hr. For 5000 req/hr, add a personal access token:

1. Create a token at https://github.com/settings/tokens (classic, no scopes needed)
2. Create a `.env` file in the project root:

```
VITE_GITHUB_TOKEN=ghp_your_token_here
```

3. Restart the dev server

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |