// src/components/common/ProtectedRoute.jsx
// Redirects unauthenticated users to /login, preserving the intended path.
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <span className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    // Save the page they were trying to reach
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
