import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/authContext.js'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="loading-screen">
        <span className="spinner" />
        Loading…
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}