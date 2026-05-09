import '../styles/Tasks.css'

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
        <span className="task-checkmark"></span>
      </label>
      <span className="task-text">{task.text}</span>
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
