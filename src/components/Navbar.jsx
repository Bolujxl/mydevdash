import { NavLink } from 'react-router-dom'
import '../styles/Navbar.css'

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">⚡</span>
        <span className="navbar-title">DevDash</span>
      </div>
      <ul className="navbar-links">
        <li>
          <NavLink
            to="/"
            end
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/github"
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            GitHub
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/tasks"
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            Tasks
          </NavLink>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
