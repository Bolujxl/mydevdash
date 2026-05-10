import { useState, useMemo } from 'react'
import {
  FolderGit2, Users, Star, CheckCircle2, GitFork,
  ChevronRight
} from 'lucide-react'
import useFetch from '../hooks/useFetch'
import WeatherWidget from '../components/WeatherWidget'
import ActivityFeed from '../components/ActivityFeed'
import '../styles/Dashboard.css'

const GH_USER_KEY = 'devdash_github_user'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'morning'
  if (hour < 18) return 'afternoon'
  return 'evening'
}

function getSavedUsername() {
  try {
    return localStorage.getItem(GH_USER_KEY) || 'bolujxl'
  } catch {
    return 'bolujxl'
  }
}

function Dashboard() {
  const [completedCount] = useState(() => {
    try {
      const tasks = JSON.parse(localStorage.getItem('devdash_tasks')) || []
      return tasks.filter((t) => t.done).length
    } catch {
      return 0
    }
  })
  const [usernameInput, setUsernameInput] = useState('')
  const [savedUsername, setSavedUsername] = useState(getSavedUsername)

  const profileUrl = savedUsername
    ? `https://api.github.com/users/${savedUsername}`
    : null
  const reposUrl = savedUsername
    ? `https://api.github.com/users/${savedUsername}/repos?per_page=100&sort=updated`
    : null
  const eventsUrl = savedUsername
    ? `https://api.github.com/users/${savedUsername}/events?per_page=30`
    : null

  const { data: profile, loading: profileLoading } = useFetch(profileUrl)
  const { data: repos, loading: reposLoading } = useFetch(reposUrl)
  const { data: events } = useFetch(eventsUrl)

  const totalStars = Array.isArray(repos)
    ? repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0)
    : 0

  const totalForks = Array.isArray(repos)
    ? repos.reduce((sum, r) => sum + (r.forks_count || 0), 0)
    : 0

  const uniqueLanguages = useMemo(() => {
    if (!Array.isArray(repos)) return 0
    const langs = new Set(repos.map((r) => r.language).filter(Boolean))
    return langs.size
  }, [repos])
  const recentRepos = useMemo(() => {
    if (!Array.isArray(repos)) return []
    return repos.slice(0, 4)
  }, [repos])

  const contributionStats = useMemo(() => {
    if (!Array.isArray(events)) return null
    let commits = 0
    let prs = 0
    let issues = 0
    for (const e of events) {
      if (e.type === 'PushEvent') commits += e.payload?.commits?.length || e.payload?.size || 0
      if (e.type === 'PullRequestEvent' && e.payload?.action === 'opened') prs++
      if (e.type === 'IssuesEvent' && e.payload?.action === 'opened') issues++
    }
    const parts = []
    if (commits) parts.push(`${commits} commits`)
    if (prs) parts.push(`${prs} PRs`)
    if (issues) parts.push(`${issues} issues`)
    return parts.length ? `Recent activity: ${parts.join(' · ')}` : null
  }, [events])

  const handleSetUsername = (e) => {
    e.preventDefault()
    const trimmed = usernameInput.trim()
    if (!trimmed) return
    setSavedUsername(trimmed)
    setUsernameInput('')
    try {
      localStorage.setItem(GH_USER_KEY, trimmed)
    } catch { /* noop */ }
  }

  const handleChangeUsername = () => {
    setSavedUsername('')
    try {
      localStorage.removeItem(GH_USER_KEY)
    } catch { /* noop */ }
  }

  const loading = profileLoading || reposLoading

  return (
    <div className="dashboard">
      {!savedUsername ? (
        <form className="gh-username-form" onSubmit={handleSetUsername}>
          <label className="gh-username-label" htmlFor="gh-username">
            Enter your GitHub username to populate your dashboard
          </label>
          <div className="gh-username-row">
            <input
              id="gh-username"
              type="text"
              className="gh-username-input"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              placeholder="e.g. bolujxl"
              autoFocus
            />
            <button type="submit" className="gh-username-btn">
              Save
            </button>
          </div>
        </form>
      ) : null}

      {loading && !profile ? (
        <div className="dash-loading">
          <div className="spinner" />
          <span>Loading your dashboard...</span>
        </div>
      ) : null}

      {profile ? (
        <>
          <div className="hero-card">
            <div className="hero-avatar-wrapper">
              <img
                src={profile.avatar_url}
                alt={profile.login}
                className="hero-avatar"
              />
            </div>
            <div className="hero-body">
              <div className="hero-top">
                <div>
                  <h1 className="hero-greeting">
                    Good {getGreeting()}, {profile.name || profile.login}
                  </h1>
                  <p className="hero-login">@{profile.login}</p>
                </div>
                <div className="hero-actions">
                  <span className="gh-badge" title="Change user" onClick={handleChangeUsername}>
                    {savedUsername}
                    <span className="gh-badge-x">×</span>
                  </span>
                  <a
                    href={profile.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hero-gh-link"
                  >
                    GitHub <ChevronRight size={14} />
                  </a>
                </div>
              </div>
              <div className="hero-numbers">
                <div className="hero-number">
                  <FolderGit2 size={16} />
                  <span>{profile.public_repos}</span>
                  <small>Repos</small>
                </div>
                <div className="hero-number">
                  <Users size={16} />
                  <span>{profile.followers}</span>
                  <small>Followers</small>
                </div>
                <div className="hero-number">
                  <Users size={16} />
                  <span>{profile.following}</span>
                  <small>Following</small>
                </div>
              </div>
            </div>
          </div>

          <div className="stat-cards-row">
            <div className="stat-card stat-card--green">
              <div className="stat-card-icon-wrap">
                <CheckCircle2 size={20} />
              </div>
              <div className="stat-card-body">
                <span className="stat-card-value">{completedCount}</span>
                <span className="stat-card-label">Tasks done</span>
              </div>
            </div>
            <div className="stat-card stat-card--blue">
              <div className="stat-card-icon-wrap">
                <Star size={20} />
              </div>
              <div className="stat-card-body">
                <span className="stat-card-value">{totalStars.toLocaleString()}</span>
                <span className="stat-card-label">Total stars</span>
              </div>
            </div>
            <div className="stat-card stat-card--purple">
              <div className="stat-card-icon-wrap">
                <FolderGit2 size={20} />
              </div>
              <div className="stat-card-body">
                <span className="stat-card-value">
                  {reposLoading ? '...' : uniqueLanguages}
                </span>
                <span className="stat-card-label">Languages used</span>
              </div>
            </div>
            <div className="stat-card stat-card--amber">
              <div className="stat-card-icon-wrap">
                <GitFork size={20} />
              </div>
              <div className="stat-card-body">
                <span className="stat-card-value">{totalForks.toLocaleString()}</span>
                <span className="stat-card-label">Total forks</span>
              </div>
            </div>
          </div>

          <div className="dashboard-grid">
            <div className="dash-section">
              <ActivityFeed events={events} summary={contributionStats} />
            </div>

            <WeatherWidget />
          </div>

          <div className="dash-section dash-section--full">
            <div className="dash-section-header">
              <h2 className="widget-title">
                <Star size={16} /> Recent Repositories
              </h2>
            </div>
            <div className="top-repos-grid">
              {recentRepos.map((repo) => (
                <a
                  key={repo.id}
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="top-repo-card"
                >
                  <div className="top-repo-name">{repo.name}</div>
                  {repo.description && (
                    <p className="top-repo-desc">{repo.description}</p>
                  )}
                  <div className="top-repo-meta">
                    {repo.language && (
                      <span className="top-repo-lang">
                        <span className="lang-dot" /> {repo.language}
                      </span>
                    )}
                    <span className="top-repo-stat">
                      <Star size={12} /> {repo.stargazers_count}
                    </span>
                    <span className="top-repo-stat">
                      <GitFork size={12} /> {repo.forks_count}
                    </span>
                  </div>
                </a>
              ))}
              {recentRepos.length === 0 && !reposLoading && (
                <p className="top-repos-empty">No repositories found.</p>
              )}
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}

export default Dashboard