# 🧑‍💻 Frontend Development Guidelines – Skill Swap Platform

## 📌 1. Project Overview

### Purpose

The Skill Swap Platform is a MERN-based web application enabling users to exchange skills in a peer-to-peer learning environment—eliminating monetary barriers.

### Core Features

- User registration and profile management
- Skill offering and requesting with categorization
- Real-time chat, swap request negotiation
- Personalized recommendations and search filters
- Admin tools for moderation and analytics

### Key User Flows

1. **Onboarding Flow** → Registration → Profile Wizard
2. **Discovery Flow** → Search/Recommendations → Profile View → Swap Request
3. **Swap Execution** → Negotiation → Messaging → Completion & Feedback

---

## 💪 2. Tech Stack Summary

| Tool / Library       | Usage Purpose                              |
| -------------------- | ------------------------------------------ |
| **ReactJS**          | Component-driven UI                        |
| **Tailwind CSS**     | Utility-first styling                      |
| **Framer Motion**    | Page and component animations              |
| **Zustand**          | Global state management                    |
| **React Router DOM** | Client-side routing                        |
| **React Hook Form**  | Form handling and validation (recommended) |

---

## 📂 3. Folder Structure

```
src/
├── assets/               # Static assets (images, svgs)
├── components/           # Reusable UI components (atoms, molecules)
├── constants/            # Static constants & enums
├── hooks/                # Custom React hooks
├── layouts/              # Layout components (auth, dashboard)
├── pages/                # Route-based components (mapped via React Router)
├── routes/               # Route configs & guards
├── services/             # API layer (fetchers, utils)
├── stores/               # Zustand stores
├── styles/               # Tailwind config, global styles
├── utils/                # Helper functions/utilities
└── App.tsx               # Root component
```

---

## 🧱 4. Component Architecture

### Smart vs Dumb

- **Smart Components**: Page-level, handle state & logic
- **Dumb Components**: UI-only, accept props, no side effects

### Atomic Design

Organize UI components:

```
components/
├── atoms/       # Buttons, Inputs, Avatars
├── molecules/   # Card, FormField, Header
├── organisms/   # ProfileEditor, SkillList
├── templates/   # Page layout sections
```

### Reusable Component Principles

- Props-driven
- Tailwind classes instead of CSS overrides
- Fully accessible (keyboard & ARIA)

---

## 🎨 5. Styling Rules

### Tailwind Best Practices

- Use utility classes directly in JSX
- Use `@apply` only in global styles
- Use `clsx()` or `classnames` for dynamic styles

### Responsive Design

- Tailwind's responsive classes (`md:`, `lg:`)
- Use `aspect-ratio`, `grid`, `flex-wrap` for layout

### Custom Themes

- Extend Tailwind via `tailwind.config.js`

```js
theme: {
  extend: {
    colors: {
      primary: '#3B82F6',
      secondary: '#64748B',
    },
  },
}
```

### Dark Mode

- Enable in Tailwind via `media` or `class` mode
- Example:

```js
darkMode: 'class' // Use 'media' for auto
```

---

## 🤝 6. Routing Strategy

### Routing System

- Use `React Router DOM v6` with `BrowserRouter`
- Create route configs:

```jsx
<Route path="/" element={<LandingPage />} />
<Route path="/dashboard" element={<Dashboard />} />
<Route path="/profile/:userId" element={<UserProfile />} />
```

### Nested Routes

- Use `Outlet` in layouts (`<DashboardLayout />`)

### Route Guards

- Create `ProtectedRoute` wrapper for auth checks
- Admin pages behind `AdminRoute` guard

---

## 🧠 7. State Management Plan

### Local vs Global

| State Type         | Location          |
| ------------------ | ----------------- |
| Form input state   | Local (component) |
| Auth/User profile  | Global (Zustand)  |
| Notifications      | Global            |
| Chat + Swap status | Global (modular)  |
| Modals visibility  | Local or Global   |

### Zustand Store Example

```js
// stores/userStore.ts
import { create } from 'zustand'

export const useUserStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}))
```

### Async State Flows

- Use `immer` middleware for immutable updates
- Use `useEffect` to sync Zustand with API

---

## 🎮 8. Animation Guidelines

### When to Use

- Page transitions
- Button hover/press
- Modal open/close
- Swap success/fail indicators

### Framer Motion Setup

```jsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
>
  <Dashboard />
</motion.div>
```

### Guidelines

- Use shared variants for consistency
- Keep transitions subtle, fast, and non-blocking

---

## 📝 9. Form Handling & Validation

### Library Recommendation

Use **React Hook Form** with **Zod** or **Yup** for schema-based validation.

### Example

```jsx
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

const { register, handleSubmit } = useForm({ resolver: zodResolver(schema) })
```

### Best Practices

- Validate on `blur`
- Display inline errors
- Disable submit during loading

---

## 🌐 10. API Integration Strategy

### Folder Structure

```
services/
├── apiClient.ts       # Axios/fetch wrapper
├── authService.ts     # /api/auth/*
├── userService.ts     # /api/users/*
├── skillService.ts    # /api/skills/*
```

### Fetch Pattern

```js
export async function getUserProfile() {
  try {
    const { data } = await api.get('/users/profile')
    return data
  } catch (err) {
    throw err
  }
}
```

### State Integration

- Store fetched results in Zustand or local state
- Show loading indicators, support optimistic UI where applicable

---

## 🚀 11. Performance Optimizations

- **Lazy load routes** with `React.lazy` & `Suspense`
- **Code splitting** by route & major component groups
- **Memoization** with `React.memo`, `useMemo`, `useCallback`
- **Debounce** search/filter inputs
- **Optimize images** (use `next-gen` formats, preload avatars)

---

## ♿ 12. Accessibility (a11y)

- Ensure **keyboard navigation** for all interactive elements
- Use **semantic HTML** (`<nav>`, `<button>`, `<label>`)
- Add ``** attributes** where needed
- Forms must include:
  - `<label htmlFor="input">`
  - Error messages with `aria-describedby`
- Focus ring visibility for all focusable components

---

## 🧪 13. Testing Guidelines

| Test Type       | Tool                  |
| --------------- | --------------------- |
| Unit Tests      | Jest                  |
| Component Tests | React Testing Library |
| E2E Tests       | Cypress               |

### Example Test

```jsx
test('renders dashboard', () => {
  render(<Dashboard />)
  expect(screen.getByText(/Your Swaps/i)).toBeInTheDocument()
})
```

### Suggested Coverage

- Critical flows: registration, skill add/edit, swap request
- Route guards & protected routes
- Zustand store logic
- Form validation behavior

---

## ✅ 14. Code Quality & Standards

### Linters & Formatters

- **ESLint** + `eslint-plugin-react`, `tailwindcss`
- **Prettier** for consistent formatting

### Naming Conventions

- Components: `PascalCase`
- Hooks/Functions: `camelCase`
- Zustand Stores: `useXStore`

### PR Checklist

-

---

### 📌 Document Version: `v1.0`

*Last updated: July 2025*\
*Maintainer: Frontend Lead*

