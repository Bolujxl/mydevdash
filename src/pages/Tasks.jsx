import { useState, useEffect } from 'react'
import { ClipboardList, CheckCircle2, ListTodo } from 'lucide-react'
import TaskItem from '../components/TaskItem'
import '../styles/Tasks.css'

const STORAGE_KEY = 'devdash_tasks'

function Tasks() {
  const [tasks, setTasks] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })
  const [newTask, setNewTask] = useState('')
  const [filterTab, setFilterTab] = useState('all')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  const handleAddTask = (e) => {
    e.preventDefault()
    if (!newTask.trim()) return

    const task = {
      id: Date.now(),
      text: newTask.trim(),
      done: false,
      createdAt: new Date().toISOString(),
    }

    setTasks((prev) => [task, ...prev])
    setNewTask('')
  }

  const handleToggle = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    )
  }

  const handleDelete = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  const filteredTasks = tasks.filter((task) => {
    if (filterTab === 'active') return !task.done
    if (filterTab === 'completed') return task.done
    return true
  })

  const remaining = tasks.filter((t) => !t.done).length

  return (
    <div className="tasks-page">
      <h1 className="page-title">
        <ClipboardList size={22} className="page-title-icon" />
        Task Manager
      </h1>

      <form className="task-form" onSubmit={handleAddTask}>
        <input
          type="text"
          className="task-input"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="What needs to be done?"
        />
        <button type="submit" className="task-add-btn">Add</button>
      </form>

      <div className="task-filters">
        {['all', 'active', 'completed'].map((tab) => (
          <button
            key={tab}
            className={`filter-btn ${filterTab === tab ? 'active' : ''}`}
            onClick={() => setFilterTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="task-count">
        {remaining} task{remaining !== 1 ? 's' : ''} remaining
      </div>

      <div className="task-list">
        {filteredTasks.length === 0 ? (
          <div className="task-empty">
            {filterTab === 'all' && (
              <>
                <ListTodo size={40} className="empty-icon" />
                <p>No tasks yet. Add one above!</p>
              </>
            )}
            {filterTab === 'active' && (
              <>
                <CheckCircle2 size={40} className="empty-icon" />
                <p>No active tasks. Great job!</p>
              </>
            )}
            {filterTab === 'completed' && (
              <>
                <ClipboardList size={40} className="empty-icon" />
                <p>No completed tasks yet.</p>
              </>
            )}
          </div>
        ) : (
          filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default Tasks