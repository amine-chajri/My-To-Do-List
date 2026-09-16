import { Link } from 'react-router-dom'
import { useAuth } from '../context/authContext.js'

const features = [
  {
    title: 'Create tasks',
    text: 'Add assignments and tasks in seconds with a title and an optional description.',
  },
  {
    title: 'Track progress',
    text: 'Mark tasks as done, edit them anytime, and keep a clear view of what is still pending.',
  },
  {
    title: 'Role-based access',
    text: 'Regular users manage their own tasks while admins can manage every user in the app.',
  },
]

export default function Hero() {
  const { user } = useAuth()

  return (
    <section className="hero">
      <div className="container hero-content">
        <span className="hero-badge">Full-Stack To-Do App</span>
        <h1 className="hero-title">
          Keep your tasks <span>in check.</span>
        </h1>
        <p className="hero-subtitle">
          My To-Do List is a full-stack to-do list manager. Create an account, log in, and organize
          all of your tasks in one place. Admins can also view and manage every user of the
          application from a single dashboard.
        </p>

        <div className="hero-actions">
          {!user ? (
            <>
              <Link to="/register" className="btn btn-yellow">
                Get started
              </Link>
              <Link to="/login" className="btn btn-outline">
                Sign in
              </Link>
            </>
          ) : (
            <Link
              to={user.role === 'admin' ? '/admin' : '/todos'}
              className="btn btn-yellow"
            >
              {user.role === 'admin' ? 'Open admin panel' : 'Open my todos'}
            </Link>
          )}
        </div>

        <div className="hero-features">
          {features.map((feature) => (
            <div key={feature.title} className="feature-card">
              <div className="feature-dot" />
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}