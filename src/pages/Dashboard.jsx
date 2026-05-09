import { useState } from 'react'
import useFetch from '../hooks/useFetch'
import WeatherWidget from '../components/WeatherWidget'
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
    ? `https://api.github.com/users/${savedUsername}/repos?per_page=100`
    : null

  const { data: profile, loading: profileLoading } = useFetch(profileUrl)
  const { data: repos, loading: reposLoading } = useFetch(reposUrl)

  const totalStars = Array.isArray(repos)
    ? repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0)
    : 0

  const handleSetUsername = (e) => {
    e.preventDefault()
    const trimmed = usernameInput.trim()
    if (!trimmed) return
    setSavedUsername(trimmed)
    setUsernameInput('')
    try {
      localStorage.setItem(GH_USER_KEY, trimmed)
    } catch {
      // localStorage unavailable
    }
  }

  const handleChangeUsername = () => {
    setSavedUsername('')
    try {
      localStorage.removeItem(GH_USER_KEY)
    } catch {
      // localStorage unavailable
    }
  }

  const loading = profileLoading || reposLoading

  return (
    <div className="dashboard">
      <h1 className="dashboard-greeting">
        Good {getGreeting()}, {savedUsername || 'Dev'} 👋
      </h1>

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
              placeholder="e.g. torvalds"
              autoFocus
            />
            <button type="submit" className="gh-username-btn">
              Save
            </button>
          </div>
        </form>
      ) : null}

      <div className="dashboard-grid">
        <WeatherWidget />

        <div className="stats-section">
          <div className="stats-header">
            <h2 className="widget-title">📊 Quick Stats</h2>
            {savedUsername ? (
              <div className="gh-user-badge">
                <span className="gh-user-badge-icon">🐙</span>
                <span className="gh-user-badge-name">{savedUsername}</span>
                <button
                  className="gh-user-badge-change"
                  onClick={handleChangeUsername}
                  title="Change GitHub user"
                >
                  ✕
                </button>
              </div>
            ) : null}
          </div>

          <div className="stat-cards">
            <div className="stat-card">
              <span className="stat-icon">✅</span>
              <div className="stat-info">
                <span className="stat-value">{completedCount}</span>
                <span className="stat-label">Tasks completed</span>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-icon">📦</span>
              <div className="stat-info">
                <span className="stat-value">
                  {loading ? '...' : profile?.public_repos ?? '—'}
                </span>
                <span className="stat-label">Public repos</span>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-icon">👥</span>
              <div className="stat-info">
                <span className="stat-value">
                  {loading ? '...' : profile?.followers ?? '—'}
                </span>
                <span className="stat-label">Followers</span>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-icon">⭐</span>
              <div className="stat-info">
                <span className="stat-value">
                  {reposLoading ? '...' : totalStars.toLocaleString()}
                </span>
                <span className="stat-label">Total stars</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard