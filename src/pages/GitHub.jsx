import { useState, useMemo } from 'react'
import useFetch from '../hooks/useFetch'
import RepoCard from '../components/RepoCard'
import '../styles/GitHub.css'

function GitHub() {
  const [username, setUsername] = useState('')
  const [searchedUser, setSearchedUser] = useState('')
  const [filter, setFilter] = useState('')

  // Only fetch when a user has been searched
  const profileUrl = searchedUser
    ? `https://api.github.com/users/${searchedUser}`
    : null
  const reposUrl = searchedUser
    ? `https://api.github.com/users/${searchedUser}/repos?per_page=100&sort=updated`
    : null

  const { data: profile, loading: profileLoading, error: profileError } = useFetch(profileUrl)
  const { data: repos, loading: reposLoading, error: reposError } = useFetch(reposUrl)

  const handleSearch = (e) => {
    e.preventDefault()
    if (username.trim()) {
      setSearchedUser(username.trim())
      setFilter('')
    }
  }

  // Memoized filtered repo list — recalculates only when repos or filter changes
  const filteredRepos = useMemo(() => {
    if (!repos || !Array.isArray(repos)) return []
    return repos.filter((r) =>
      r.name.toLowerCase().includes(filter.toLowerCase())
    )
  }, [repos, filter])

  const loading = profileLoading || reposLoading
  const error = profileError || reposError

  return (
    <div className="github-page">
      <h1 className="page-title">GitHub Explorer</h1>

      <form className="github-search" onSubmit={handleSearch}>
        <input
          type="text"
          className="github-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter GitHub username..."
        />
        <button type="submit" className="github-btn">Search</button>
      </form>

      {/* Empty state before any search */}
      {!searchedUser && (
        <div className="github-empty">
          <span className="empty-icon">🔍</span>
          <p>Search for a GitHub user to explore their profile and repositories.</p>
        </div>
      )}

      {loading && (
        <div className="github-loading">
          <div className="spinner"></div>
          <span>Loading profile...</span>
        </div>
      )}

      {error && !loading && (
        <div className="github-error">
          <p>
            ❌{' '}
            {error.includes('404')
              ? `User "${searchedUser}" not found. Check the username and try again.`
              : error}
          </p>
        </div>
      )}

      {!loading && !error && profile && (
        <>
          <div className="profile-card">
            <img
              src={profile.avatar_url}
              alt={profile.name || searchedUser}
              className="profile-avatar"
            />
            <div className="profile-info">
              <h2 className="profile-name">{profile.name || searchedUser}</h2>
              {profile.bio && <p className="profile-bio">{profile.bio}</p>}
              <div className="profile-stats">
                <span className="profile-stat">
                  <strong>{profile.followers}</strong> followers
                </span>
                <span className="profile-stat">
                  <strong>{profile.following}</strong> following
                </span>
                <span className="profile-stat">
                  <strong>{profile.public_repos}</strong> repos
                </span>
              </div>
            </div>
          </div>

          {repos && Array.isArray(repos) && (
            <div className="repos-section">
              <div className="repos-header">
                <h2 className="section-title">
                  Repositories ({filteredRepos.length})
                </h2>
                <input
                  type="text"
                  className="repo-filter"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  placeholder="Filter repos by name..."
                />
              </div>

              {filteredRepos.length === 0 ? (
                <p className="repos-empty">No repositories match your filter.</p>
              ) : (
                <div className="repos-grid">
                  {filteredRepos.map((repo) => (
                    <RepoCard key={repo.id} repo={repo} />
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default GitHub
