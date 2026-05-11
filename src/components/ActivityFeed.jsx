import {
  GitCommit, GitPullRequest, CircleDot, Star,
  PlusCircle, GitFork, Trash2, AlertCircle,
  MessageSquare, GitBranch
} from 'lucide-react'
import '../styles/ActivityFeed.css'

function getRelativeTime(dateStr) {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const seconds = Math.floor((now - then) / 1000)

  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  return `${months}mo ago`
}

function getRepoName(fullName) {
  return fullName.split('/').pop()
}

function EventIcon({ type, size = 16 }) {
  const props = { size }
  switch (type) {
    case 'PushEvent':              return <GitCommit {...props} />
    case 'PullRequestEvent':       return <GitPullRequest {...props} />
    case 'PullRequestReviewEvent': return <MessageSquare {...props} />
    case 'IssuesEvent':            return <CircleDot {...props} />
    case 'WatchEvent':             return <Star {...props} />
    case 'CreateEvent':            return <PlusCircle {...props} />
    case 'DeleteEvent':            return <Trash2 {...props} />
    case 'ForkEvent':              return <GitFork {...props} />
    case 'MemberEvent':            return <PlusCircle {...props} />
    default:                       return <AlertCircle {...props} />
  }
}

function eventMessage(event) {
  const repo = getRepoName(event.repo.name)
  const url = `https://github.com/${event.repo.name}`

  switch (event.type) {
    case 'PushEvent': {
      const count = event.payload?.commits?.length ?? event.payload?.size
      if (count) {
        return <span>pushed <strong>{count}</strong> commit{count !== 1 ? 's' : ''} to <a href={url} target="_blank" rel="noopener noreferrer">{repo}</a></span>
      }
      return <span>pushed to <a href={url} target="_blank" rel="noopener noreferrer">{repo}</a></span>
    }
    case 'PullRequestEvent': {
      const action = event.payload?.action || 'updated'
      const pr = event.payload?.pull_request
      const prUrl = pr?.html_url || url
      return <span>{action} a pull request in <a href={prUrl} target="_blank" rel="noopener noreferrer">{repo}</a></span>
    }
    case 'IssuesEvent': {
      const action = event.payload?.action || 'opened'
      const issue = event.payload?.issue
      const issueUrl = issue?.html_url || url
      return <span>{action} an issue in <a href={issueUrl} target="_blank" rel="noopener noreferrer">{repo}</a></span>
    }
    case 'WatchEvent':
      return <span>starred <a href={url} target="_blank" rel="noopener noreferrer">{repo}</a></span>
    case 'CreateEvent': {
      const refType = event.payload?.ref_type || 'repository'
      return <span>created {refType === 'repository' ? 'repo' : refType} <a href={url} target="_blank" rel="noopener noreferrer">{repo}</a></span>
    }
    case 'DeleteEvent': {
      const refType = event.payload?.ref_type || 'branch'
      return <span>deleted {refType} in <a href={url} target="_blank" rel="noopener noreferrer">{repo}</a></span>
    }
    case 'ForkEvent':
      return <span>forked <a href={url} target="_blank" rel="noopener noreferrer">{repo}</a></span>
    case 'PullRequestReviewEvent':
      return <span>reviewed a PR in <a href={url} target="_blank" rel="noopener noreferrer">{repo}</a></span>
    default:
      return <span>did something in <a href={url} target="_blank" rel="noopener noreferrer">{repo}</a></span>
  }
}

function ActivityFeed({ events, summary, timeRange, onTimeRangeChange }) {
  const ranges = ['7d', '30d', '3mo']

  return (
    <div className="activity-feed">
      <div className="activity-header">
        <h2 className="activity-title">
          <GitBranch size={16} /> Recent Activity
        </h2>
        {onTimeRangeChange && (
          <div className="activity-range">
            {ranges.map((r) => (
              <button
                key={r}
                className={`activity-range-btn ${timeRange === r ? 'active' : ''}`}
                onClick={() => onTimeRangeChange(r)}
              >
                {r}
              </button>
            ))}
          </div>
        )}
      </div>
      {summary && <p className="activity-summary">{summary}</p>}
      {!events || events.length === 0 ? (
        <p className="activity-empty">No activity in this period.</p>
      ) : (
        <div className="activity-list">
          {events.map((event) => (
            <div key={event.id} className={`activity-item type-${event.type}`}>
              <div className="activity-icon-wrap">
                <EventIcon type={event.type} size={16} />
              </div>
              <div className="activity-body">
                <span className="activity-message">{eventMessage(event)}</span>
              </div>
              <span className="activity-time">{getRelativeTime(event.created_at)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ActivityFeed