import React from 'react'
import { motion } from 'framer-motion'
import { useUserStore } from '@/stores/userStore'

const ProfilePage: React.FC = () => {
  const { user } = useUserStore()

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Profile
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Info */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <label className="form-label">Full Name</label>
              <p className="text-gray-900 dark:text-white">
                {user?.firstName} {user?.lastName}
              </p>
            </div>
            
            <div>
              <label className="form-label">Username</label>
              <p className="text-gray-900 dark:text-white">@{user?.username}</p>
            </div>
            
            <div>
              <label className="form-label">Email</label>
              <p className="text-gray-900 dark:text-white">{user?.email}</p>
            </div>
            
            <div>
              <label className="form-label">Bio</label>
              <p className="text-gray-900 dark:text-white">
                {user?.bio || 'No bio added yet'}
              </p>
            </div>
            
            <div>
              <label className="form-label">Location</label>
              <p className="text-gray-900 dark:text-white">
                {user?.location || 'No location specified'}
              </p>
            </div>
          </div>
          
          {/* Avatar */}
          <div className="flex flex-col items-center space-y-4">
            <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-32 h-32 rounded-full object-cover"
                />
              ) : (
                <span className="text-4xl text-gray-500 dark:text-gray-400">
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </span>
              )}
            </div>
            <button className="btn-outline text-sm">
              Change Avatar
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
            {user?.skills?.length || 0}
          </div>
          <div className="text-gray-600 dark:text-gray-400">Skills Shared</div>
        </div>
        
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
            {user?.totalSwaps || 0}
          </div>
          <div className="text-gray-600 dark:text-gray-400">Total Swaps</div>
        </div>
        
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
            {user?.rating || 0}
          </div>
          <div className="text-gray-600 dark:text-gray-400">Rating</div>
        </div>
      </motion.div>
    </div>
  )
}

export default ProfilePage 