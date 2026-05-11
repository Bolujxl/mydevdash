import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Zap, Sun, Moon, LayoutDashboard, GitBranch, ClipboardList, Activity, Menu, X } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import '../styles/Navbar.css'

function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const [open, setOpen] = useState(false)

  const close = () => setOpen(false)

  return (
    <>
      <button
        className="sidebar-hamburger"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Toggle menu"
      >
        <Menu size={20} />
      </button>

      {open && <div className="sidebar-overlay" onClick={close} />}

      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <button className="sidebar-close" onClick={close} aria-label="Close menu">
          <X size={18} />
        </button>

        <div className="sidebar-brand">
          <div className="sidebar-logo-wrap">
            <Zap size={18} />
          </div>
          <div>
            <div className="sidebar-title">DevDash</div>
            <div className="sidebar-version">v1.0</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-group">
            <p className="nav-group-label">Workspace</p>
            <NavLink
              to="/"
              end
              className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}
              onClick={close}
            >
              <LayoutDashboard size={17} />
              <span>Dashboard</span>
            </NavLink>
          </div>

          <div className="nav-group">
            <p className="nav-group-label">Tools</p>
            <NavLink
              to="/github"
              className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}
              onClick={close}
            >
              <GitBranch size={17} />
              <span>GitHub</span>
            </NavLink>
          <NavLink
            to="/tasks"
            className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}
            onClick={close}
          >
            <ClipboardList size={18} />
            <span>Tasks</span>
          </NavLink>
          <NavLink
            to="/activity"
            className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}
            onClick={close}
          >
            <Activity size={18} />
            <span>Activity</span>
          </NavLink>
          </div>
        </nav>

        <div className="sidebar-footer">
          <button
            className="sidebar-theme-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
          </button>
        </div>
      </aside>
    </>
  )
}

export default Navbar