import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Edit, 
  MessageCircle, 
  Calendar, 
  MapPin, 
  Star, 
  Plus, 
  MoreVertical,
  CheckCircle,
  Clock,
  User,
  BookOpen,
  MessageSquare,
  Award
} from 'lucide-react'
import { useUserStore } from '../stores/userStore'
import Button from '../components/atoms/Button'

const ProfilePage = () => {
  const { user } = useUserStore()
  const [activeTab, setActiveTab] = useState('about')
  const [isEditing, setIsEditing] = useState(false)
  const [isOwnProfile, setIsOwnProfile] = useState(true) // For demo purposes

  const tabs = [
    { id: 'about', label: 'About', icon: User },
    { id: 'skills', label: 'Skills', icon: BookOpen },
    { id: 'reviews', label: 'Reviews', icon: MessageSquare },
    { id: 'history', label: 'History', icon: Award },
  ]

  const skillsOffered = [
    {
      id: 1,
      name: 'React Development',
      category: 'programming',
      level: 'advanced',
      description: 'Expert in React, Redux, and modern JavaScript',
      isAvailable: true,
    },
    {
      id: 2,
      name: 'UI/UX Design',
      category: 'design',
      level: 'intermediate',
      description: 'Creating beautiful and functional user interfaces',
      isAvailable: true,
    },
  ]

  const skillsWanted = [
    {
      id: 3,
      name: 'Guitar',
      category: 'music',
      level: 'beginner',
      description: 'Want to learn acoustic guitar basics',
      isAvailable: false,
    },
  ]

  const reviews = [
    {
      id: 1,
      reviewer: 'Sarah Johnson',
      rating: 5,
      comment: 'Excellent teacher! Very patient and knowledgeable.',
      date: '2024-01-15',
    },
    {
      id: 2,
      reviewer: 'Mike Chen',
      rating: 4,
      comment: 'Great experience learning React. Highly recommended!',
      date: '2024-01-10',
    },
  ]

  const swapHistory = [
    {
      id: 1,
      skill: 'React Development',
      partner: 'Sarah Johnson',
      date: '2024-01-15',
      status: 'completed',
    },
    {
      id: 2,
      skill: 'UI/UX Design',
      partner: 'Mike Chen',
      date: '2024-01-10',
      status: 'completed',
    },
  ]

  const getSkillLevelColor = (level) => {
    const colors = {
      beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      intermediate: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      advanced: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      expert: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    }
    return colors[level] || colors.beginner
  }

  const getCategoryIcon = (category) => {
    const icons = {
      programming: '💻',
      design: '🎨',
      marketing: '📢',
      languages: '🌍',
      music: '🎵',
      cooking: '👨‍🍳',
      fitness: '💪',
      business: '💼',
      education: '📚',
      other: '✨',
    }
    return icons[category] || icons.other
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
          {/* Avatar Section */}
          <div className="relative">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl md:text-4xl text-gray-500 dark:text-gray-400">
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </span>
              )}
            </div>
            {isOwnProfile && (
              <button className="absolute -bottom-1 -right-1 p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors">
                <Edit className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                {user?.firstName} {user?.lastName}
              </h1>
              {isOwnProfile && <CheckCircle className="h-5 w-5 text-green-500" />}
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>{user?.location || 'Location not specified'}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>Member since {new Date(user?.createdAt || Date.now()).getFullYear()}</span>
              </div>
            </div>

            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-1">
                {renderStars(user?.rating || 4.5)}
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  ({reviews.length} reviews)
                </span>
              </div>
              <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                <Award className="h-4 w-4" />
                <span>{user?.totalSwaps || 0} swaps completed</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              {isOwnProfile ? (
                <Button
                  variant="primary"
                  size="sm"
                  icon={<Edit className="h-4 w-4" />}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={<MessageCircle className="h-4 w-4" />}
                  >
                    Message
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<Calendar className="h-4 w-4" />}
                  >
                    Request Swap
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          <AnimatePresence mode="wait">
            {activeTab === 'about' && (
              <motion.div
                key="about"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    About
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {user?.bio || 'No bio added yet. This is where you can share a bit about yourself, your interests, and what you hope to learn or teach through skill swapping.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      Availability
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Weekdays</span>
                        <span className="text-gray-900 dark:text-white">6 PM - 9 PM</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Weekends</span>
                        <span className="text-gray-900 dark:text-white">10 AM - 6 PM</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      Communication Preferences
                    </h4>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <div>• Video calls preferred</div>
                      <div>• Text messages for coordination</div>
                      <div>• Flexible with time zones</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'skills' && (
              <motion.div
                key="skills"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Skills
                  </h3>
                  {isOwnProfile && (
                    <Button
                      variant="primary"
                      size="sm"
                      icon={<Plus className="h-4 w-4" />}
                    >
                      Add Skill
                    </Button>
                  )}
                </div>

                {/* Skills Offered */}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                    Skills Offered ({skillsOffered.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {skillsOffered.map((skill) => (
                      <div
                        key={skill.id}
                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl">{getCategoryIcon(skill.category)}</span>
                            <h5 className="font-medium text-gray-900 dark:text-white">
                              {skill.name}
                            </h5>
                          </div>
                          {isOwnProfile && (
                            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {skill.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-1 text-xs rounded-full ${getSkillLevelColor(skill.level)}`}>
                            {skill.level}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            skill.isAvailable 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                          }`}>
                            {skill.isAvailable ? 'Available' : 'Unavailable'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skills Wanted */}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                    Skills Wanted ({skillsWanted.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {skillsWanted.map((skill) => (
                      <div
                        key={skill.id}
                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl">{getCategoryIcon(skill.category)}</span>
                            <h5 className="font-medium text-gray-900 dark:text-white">
                              {skill.name}
                            </h5>
                          </div>
                          {isOwnProfile && (
                            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {skill.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-1 text-xs rounded-full ${getSkillLevelColor(skill.level)}`}>
                            {skill.level}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'reviews' && (
              <motion.div
                key="reviews"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Reviews ({reviews.length})
                  </h3>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      {renderStars(user?.rating || 4.5)}
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {user?.rating || 4.5} average
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {review.reviewer}
                          </h4>
                          <div className="flex items-center space-x-1 mt-1">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'history' && (
              <motion.div
                key="history"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Swap History ({swapHistory.length})
                </h3>

                <div className="space-y-4">
                  {swapHistory.map((swap) => (
                    <div
                      key={swap.id}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {swap.skill}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            with {swap.partner}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="inline-block px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            {swap.status}
                          </span>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {new Date(swap.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

export default ProfilePage 