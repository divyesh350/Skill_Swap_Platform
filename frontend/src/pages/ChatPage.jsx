import React from 'react'
import { motion } from 'framer-motion'

const ChatPage = () => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Chat
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          View and send messages to other users.
        </p>
      </motion.div>
    </div>
  )
}

export default ChatPage 