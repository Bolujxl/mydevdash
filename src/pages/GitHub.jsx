import { useState, useMemo } from 'react'
import { Search, Loader2, MapPin, Users, FolderGit2, Globe } from 'lucide-react'
import useFetch from '../hooks/useFetch'
import RepoCard from '../components/RepoCard'
import '../styles/GitHub.css'

function GitHub() {
  const [username, setUsername] = useState('')
  const [searchedUser, setSearchedUser] = useState('')
  const [filter, setFilter] = useState('')
  const [sortBy, setSortBy] = useState('updated')

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
      setSortBy('updated')
    }
  }

  const filteredRepos = useMemo(() => {
    if (!repos || !Array.isArray(repos)) return []
    let list = [...repos].filter((r) =>
      r.name.toLowerCase().includes(filter.toLowerCase())
    )
    if (sortBy === 'stars') {
      list.sort((a, b) => b.stargazers_count - a.stargazers_count)
    } else if (sortBy === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name))
    }
    return list
  }, [repos, filter, sortBy])

  const loading = profileLoading || reposLoading
  const error = profileError || reposError

  return (
    <div className="github-page">
      <h1 className="page-title">
        <Globe size={22} className="page-title-icon" />
        GitHub Explorer
      </h1>

      <form className="github-search" onSubmit={handleSearch}>
        <Search size={18} className="github-search-icon" />
        <input
          type="text"
          className="github-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter GitHub username..."
        />
        <button type="submit" className="github-btn">Search</button>
      </form>

      {!searchedUser && (
        <div className="github-empty">
          <Search size={48} className="empty-icon" />
          <p>Search for a GitHub user to explore their profile and repositories.</p>
        </div>
      )}

      {loading && (
        <div className="github-loading">
          <Loader2 size={20} className="spin-icon" />
          <span>Loading profile...</span>
        </div>
      )}

      {error && !loading && (
        <div className="github-error">
          <p>
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
              <p className="profile-login">@{profile.login}</p>
              {profile.bio && <p className="profile-bio">{profile.bio}</p>}
              <div className="profile-meta">
                {profile.location && (
                  <span><MapPin size={13} /> {profile.location}</span>
                )}
                <span><Users size={13} /> {profile.followers} followers</span>
                <span><Users size={13} /> {profile.following} following</span>
                <span><FolderGit2 size={13} /> {profile.public_repos} repos</span>
              </div>
            </div>
          </div>

          {repos && Array.isArray(repos) && (
            <div className="repos-section">
              <div className="repos-header">
                <h2 className="section-title">
                  Repositories ({filteredRepos.length})
                </h2>
                <div className="repos-controls">
                  <input
                    type="text"
                    className="repo-filter"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    placeholder="Filter repos by name..."
                  />
                  <select
                    className="repo-sort"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="updated">Recent</option>
                    <option value="stars">Stars</option>
                    <option value="name">Name</option>
                  </select>
                </div>
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