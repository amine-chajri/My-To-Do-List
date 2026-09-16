import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/authContext.js'

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand">
          <span className="brand-mark">✓</span>
          <span className="brand-name">
            My <span>To-Do</span> List
          </span>
        </Link>

        <nav className="nav-links">
          <NavLink to="/" end className="nav-link">
            Home
          </NavLink>
          {user && (
            <NavLink to="/todos" className="nav-link">
              My Todos
            </NavLink>
          )}
          {user?.role === 'admin' && (
            <NavLink to="/admin" className="nav-link">
              Admin
            </NavLink>
          )}
        </nav>

        <div className="nav-auth">
          {!user ? (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">
                Sign in
              </Link>
              <Link to="/register" className="btn btn-yellow btn-sm">
                Get started
              </Link>
            </>
          ) : (
            <>
              <span className="nav-user">{user.name}</span>
              <span className="nav-role">{user.role}</span>
              <button type="button" onClick={logout} className="btn btn-ghost btn-sm">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}