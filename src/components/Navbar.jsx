import { NavLink } from 'react-router-dom'
import { Zap, Sun, Moon, LayoutDashboard, Search, ClipboardList } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import '../styles/Navbar.css'

function Navbar() {
  const { theme, toggleTheme } = useTheme()

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <Zap size={24} className="sidebar-logo" />
        <span className="sidebar-title">DevDash</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to="/"
          end
          className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink
          to="/github"
          className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}
        >
          <Search size={18} />
          <span>GitHub</span>
        </NavLink>
        <NavLink
          to="/tasks"
          className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}
        >
          <ClipboardList size={18} />
          <span>Tasks</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button
          className="sidebar-theme-btn"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
        </button>
      </div>
    </aside>
  )
}

export default Navbar