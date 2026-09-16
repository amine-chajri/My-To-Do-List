import { Link } from 'react-router-dom'
import { useAuth } from '../context/authContext.js'

export default function Footer() {
  const { user } = useAuth()

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-col">
          <div className="footer-brand">
            My <span>To-Do</span> List
          </div>
          <p className="footer-desc">
            The simple task manager for everyone. Create an account, log in, and keep
            track of every assignment and task in one place.
          </p>
        </div>

        <div className="footer-col">
          <h4>Quick links</h4>
          <Link to="/">Home</Link>
          {user ? (
            <Link to="/todos">My Todos</Link>
          ) : (
            <Link to="/register">Get started</Link>
          )}
          {user?.role === 'admin' && <Link to="/admin">Admin panel</Link>}
        </div>

        <div className="footer-col">
          <h4>Contact</h4>
          <span>Online to-do service</span>
          <span>support@mytodolist.app</span>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          &copy; {new Date().getFullYear()} My To-Do List. All rights reserved.
        </div>
      </div>
    </footer>
  )
}