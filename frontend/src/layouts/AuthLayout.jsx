import React from 'react'
import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Skill Swap Platform
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Connect, Learn, and Grow Together
          </p>
        </div>
        
        <div className="card">
          <Outlet />
        </div>
        
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2024 Skill Swap Platform. All rights reserved.
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default AuthLayout 