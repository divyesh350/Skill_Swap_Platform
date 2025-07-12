// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'skill_swap_token',
  USER: 'skill_swap_user',
  THEME: 'skill_swap_theme',
} as const

// Skill Categories
export const SKILL_CATEGORIES = [
  { value: 'programming', label: 'Programming', icon: '💻' },
  { value: 'design', label: 'Design', icon: '🎨' },
  { value: 'marketing', label: 'Marketing', icon: '📢' },
  { value: 'languages', label: 'Languages', icon: '🌍' },
  { value: 'music', label: 'Music', icon: '🎵' },
  { value: 'cooking', label: 'Cooking', icon: '👨‍🍳' },
  { value: 'fitness', label: 'Fitness', icon: '💪' },
  { value: 'business', label: 'Business', icon: '💼' },
  { value: 'education', label: 'Education', icon: '📚' },
  { value: 'other', label: 'Other', icon: '✨' },
] as const

// Skill Levels
export const SKILL_LEVELS = [
  { value: 'beginner', label: 'Beginner', color: 'green' },
  { value: 'intermediate', label: 'Intermediate', color: 'blue' },
  { value: 'advanced', label: 'Advanced', color: 'purple' },
  { value: 'expert', label: 'Expert', color: 'red' },
] as const

// Swap Status Colors
export const SWAP_STATUS_COLORS = {
  pending: 'yellow',
  accepted: 'green',
  rejected: 'red',
  completed: 'blue',
  cancelled: 'gray',
} as const

// Navigation Items
export const NAVIGATION_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: 'Home' },
  { path: '/skills', label: 'Skills', icon: 'BookOpen' },
  { path: '/swap-requests', label: 'Swap Requests', icon: 'Users' },
  { path: '/chat', label: 'Chat', icon: 'MessageCircle' },
  { path: '/profile', label: 'Profile', icon: 'User' },
] as const

// Admin Navigation Items
export const ADMIN_NAVIGATION_ITEMS = [
  { path: '/admin', label: 'Dashboard', icon: 'BarChart3' },
  { path: '/admin/users', label: 'Users', icon: 'Users' },
  { path: '/admin/skills', label: 'Skills', icon: 'BookOpen' },
  { path: '/admin/swaps', label: 'Swaps', icon: 'Repeat' },
  { path: '/admin/reports', label: 'Reports', icon: 'Flag' },
] as const

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 50,
} as const

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
} as const

// Validation Rules
export const VALIDATION_RULES = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 20,
    PATTERN: /^[a-zA-Z0-9_]+$/,
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
  },
  BIO: {
    MAX_LENGTH: 500,
  },
  SKILL_NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
  },
  SKILL_DESCRIPTION: {
    MAX_LENGTH: 1000,
  },
} as const

// Animation Durations
export const ANIMATION_DURATIONS = {
  FAST: 0.2,
  NORMAL: 0.3,
  SLOW: 0.5,
} as const

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'Resource not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
} as const

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Successfully logged in!',
  REGISTER: 'Account created successfully!',
  LOGOUT: 'Successfully logged out!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  SKILL_ADDED: 'Skill added successfully!',
  SKILL_UPDATED: 'Skill updated successfully!',
  SKILL_DELETED: 'Skill deleted successfully!',
  SWAP_REQUESTED: 'Swap request sent successfully!',
  SWAP_ACCEPTED: 'Swap request accepted!',
  SWAP_REJECTED: 'Swap request rejected.',
  SWAP_COMPLETED: 'Swap marked as completed!',
  MESSAGE_SENT: 'Message sent successfully!',
} as const

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const

// Theme Options
export const THEME_OPTIONS = [
  { value: 'light', label: 'Light', icon: 'Sun' },
  { value: 'dark', label: 'Dark', icon: 'Moon' },
  { value: 'system', label: 'System', icon: 'Monitor' },
] as const 