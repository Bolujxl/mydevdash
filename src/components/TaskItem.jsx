import '../styles/Tasks.css'

function getRelativeTime(dateStr) {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const seconds = Math.floor((now - then) / 1000)
  if (seconds < 60) return 'just now'
  const mins = Math.floor(seconds / 60)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return `${Math.floor(days / 30)}mo ago`
}

function TaskItem({ task, onToggle, onDelete }) {
  return (
    <div className={`task-item ${task.done ? 'done' : ''}`}>
      <label className="task-checkbox-label">
        <input
          type="checkbox"
          className="task-checkbox"
          checked={task.done}
          onChange={() => onToggle(task.id)}
        />
        <span className="task-checkmark" />
      </label>
      <div className="task-content">
        <span className="task-text">{task.text}</span>
        {task.note && <span className="task-note">{task.note}</span>}
        <span className="task-time">Added {getRelativeTime(task.createdAt)}</span>
      </div>
      <button
        className="task-delete"
        onClick={() => onDelete(task.id)}
        aria-label="Delete task"
      >
        ×
      </button>
    </div>
  )
}

export default TaskItem