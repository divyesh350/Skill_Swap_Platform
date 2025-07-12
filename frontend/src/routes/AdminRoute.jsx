import React from 'react'
import { Navigate } from 'react-router-dom'
import { useUserStore } from '../stores/userStore'

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated } = useUserStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!user?.isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

export default AdminRoute 