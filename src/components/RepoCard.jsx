import { Star, GitFork } from 'lucide-react'
import { getLangColor } from '../utils/langColors'

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
            <span
              className="language-dot"
              style={{ background: getLangColor(repo.language) }}
            />
            {repo.language}
          </span>
        )}
        <span className="repo-stat">
          <Star size={12} /> {repo.stargazers_count}
        </span>
        <span className="repo-stat">
          <GitFork size={12} /> {repo.forks_count}
        </span>
      </div>
    </div>
  )
}

export default RepoCard