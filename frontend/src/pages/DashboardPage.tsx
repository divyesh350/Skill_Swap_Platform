import React from 'react'
import { motion } from 'framer-motion'
import { useUserStore } from '@/stores/userStore'
import { BookOpen, Users, MessageCircle, TrendingUp } from 'lucide-react'

const DashboardPage: React.FC = () => {
  const { user } = useUserStore()

  const stats = [
    {
      title: 'My Skills',
      value: user?.skills?.length || 0,
      icon: <BookOpen className="h-6 w-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Active Swaps',
      value: user?.swapRequests?.filter(s => s.status === 'pending' || s.status === 'accepted').length || 0,
      icon: <Users className="h-6 w-6" />,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Unread Messages',
      value: 3, // This would come from chat store
      icon: <MessageCircle className="h-6 w-6" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Total Swaps',
      value: user?.totalSwaps || 0,
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white"
      >
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-primary-100">
          Ready to learn something new today? Check out the latest skill opportunities below.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.1 }}
            className="card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor} ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* My Skills */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            My Skills
          </h2>
          {user?.skills && user.skills.length > 0 ? (
            <div className="space-y-3">
              {user.skills.slice(0, 5).map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {skill.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {skill.category} • {skill.level}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    skill.isAvailable 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  }`}>
                    {skill.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              You haven't added any skills yet. Start by adding your first skill!
            </p>
          )}
        </div>

        {/* Recent Swap Requests */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Swap Requests
          </h2>
          {user?.swapRequests && user.swapRequests.length > 0 ? (
            <div className="space-y-3">
              {user.swapRequests.slice(0, 5).map((swap) => (
                <div
                  key={swap.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {swap.requestedSkill.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      with {swap.provider.firstName} {swap.provider.lastName}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    swap.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    swap.status === 'accepted' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    swap.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  }`}>
                    {swap.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              No recent swap requests. Start exploring skills to make your first swap!
            </p>
          )}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card"
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <BookOpen className="h-8 w-8 text-primary-600 mb-2" />
            <p className="font-medium text-gray-900 dark:text-white">Add New Skill</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Share what you can teach</p>
          </button>
          <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Users className="h-8 w-8 text-primary-600 mb-2" />
            <p className="font-medium text-gray-900 dark:text-white">Browse Skills</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Find something to learn</p>
          </button>
          <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <MessageCircle className="h-8 w-8 text-primary-600 mb-2" />
            <p className="font-medium text-gray-900 dark:text-white">View Messages</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Check your conversations</p>
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default DashboardPage 