function RepoCard({ repo }) {
  return (
    <div className="repo-card">
      <h3 className="repo-name">
        <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
          {repo.name}
        </a>
      </h3>
      {repo.description && <p className="repo-desc">{repo.description}</p>}
      <div className="repo-meta">
        {repo.language && (
          <span className="repo-language">
            <span className="language-dot"></span>
            {repo.language}
          </span>
        )}
        <span className="repo-stat">⭐ {repo.stargazers_count}</span>
        <span className="repo-stat">🍴 {repo.forks_count}</span>
      </div>
    </div>
  )
}

export default RepoCard
