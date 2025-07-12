import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useUserStore } from '../stores/userStore'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useUserStore()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

export default ProtectedRoute 