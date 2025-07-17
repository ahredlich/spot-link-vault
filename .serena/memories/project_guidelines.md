# Project Guidelines and Design Patterns

## Design System
### Glass Morphism Theme
- **Primary aesthetic**: Modern glass morphism with subtle transparency and blur effects
- **Color scheme**: Gradient-based with primary/accent color combinations
- **CSS variables**: Extensive use of CSS custom properties for theming
- **Animation**: Smooth transitions and staggered animations for enhanced UX

### Component Variants
- **Glass variants**: glass-card, glass-primary, glass-secondary buttons
- **Responsive design**: Mobile-first approach with breakpoint-specific styles
- **Accessibility**: Proper ARIA labels and keyboard navigation support

## Development Patterns

### Component Structure
```typescript
// 1. External imports first
import { useState } from "react";
import { Button } from "@/components/ui/button";

// 2. Internal imports
import { useAuth } from "@/hooks/useAuth";

// 3. Types and interfaces
interface ComponentProps {
  // Define props
}

// 4. Main component
const Component = ({ prop }: ComponentProps) => {
  // Component logic
  return <div>{/* JSX */}</div>;
};

export default Component;
```

### State Management
- **Local state**: useState for component-specific state
- **Server state**: React Query for API data and caching
- **Global state**: Context API for authentication and theme
- **Form state**: React Hook Form for complex forms

### Error Handling
- **Development**: Console.log for debugging
- **Production**: Proper error boundaries and user-friendly messages
- **Async operations**: Loading states and error handling for all API calls

## Code Quality Standards

### TypeScript Usage
- **Flexible typing**: Some strict rules disabled for rapid development
- **Interface definitions**: Clear interfaces for component props
- **Path aliases**: Use `@/` for cleaner imports
- **Type inference**: Leverage TypeScript's type inference when possible

### Performance Considerations
- **Lazy loading**: Dynamic imports for routes
- **Memoization**: React.memo and useMemo for expensive operations
- **Staggered animations**: Custom hooks for smooth, performant animations
- **Bundle optimization**: Proper code splitting and tree shaking

### Security Best Practices
- **No hardcoded secrets**: All sensitive data via environment variables
- **Input validation**: Zod schemas for form validation
- **Supabase security**: Row-level security for database access
- **XSS prevention**: Proper data sanitization

## UI/UX Guidelines

### Animation Philosophy
- **Subtle and smooth**: Enhance UX without being distracting
- **Staggered animations**: Custom hooks for coordinated element animations
- **Performance-first**: CSS transforms and opacity for smooth 60fps animations
- **Accessibility**: Respect prefers-reduced-motion

### Responsive Design
- **Mobile-first**: Start with mobile layout, enhance for desktop
- **Breakpoints**: Use Tailwind's responsive prefixes consistently
- **Touch-friendly**: Adequate touch targets and gestures
- **Content strategy**: Prioritize essential content on smaller screens

### User Experience
- **Loading states**: Skeleton components for better perceived performance
- **Error states**: Clear, actionable error messages
- **Empty states**: Helpful prompts to guide user actions
- **Feedback**: Immediate visual feedback for user interactions

## Integration Patterns

### Supabase Integration
- **Client configuration**: Centralized Supabase client setup
- **Authentication**: Seamless auth flow with proper session management
- **Real-time**: WebSocket connections for live updates
- **Database queries**: Optimized queries with proper indexing

### External Dependencies
- **shadcn/ui**: Consistent component library usage
- **Lucide icons**: Standardized icon system
- **React Query**: Proper query key management and caching strategies
- **Form validation**: Zod schemas for type-safe validation

## Deployment Considerations

### Build Process
- **Development**: Fast HMR with Vite
- **Production**: Optimized bundle with tree shaking
- **Preview**: Local production testing before deployment
- **CI/CD**: Automated testing and deployment via Lovable platform

### Environment Management
- **Development**: Local development with mock data
- **Staging**: Full integration testing environment
- **Production**: Optimized for performance and security