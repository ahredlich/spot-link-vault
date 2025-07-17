# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SpotLink Vault is a modern bookmark management application built with React, TypeScript, and Supabase. It features a glassmorphic design system with advanced performance optimizations for smooth animations and efficient rendering.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (runs on port 8080)
npm run dev

# Build for production
npm run build

# Build for development mode
npm run build:dev

# Run ESLint
npm run lint

# Preview production build
npm run preview
```

## Architecture & Key Components

### Tech Stack
- **Build Tool**: Vite with React SWC plugin
- **Framework**: React 18 with TypeScript
- **UI Library**: shadcn/ui (Radix UI based components)
- **Styling**: Tailwind CSS with custom glassmorphic theme
- **State Management**: React Query for server state, React Context for auth
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Routing**: React Router DOM v6

### Project Structure

The application follows a feature-based organization with clear separation of concerns:

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui base components
│   └── *.tsx           # Custom application components
├── hooks/              # Custom React hooks
├── pages/              # Route page components
├── integrations/       # External service integrations
│   └── supabase/       # Supabase client and types
├── lib/                # Utility functions
└── App.tsx             # Main application shell
```

### Key Architectural Patterns

1. **Authentication Flow**: Centralized through `AuthProvider` context and `useAuth` hook
2. **Data Fetching**: React Query manages server state with caching and optimistic updates
3. **Performance Optimization**: Comprehensive system including:
   - React.memo with custom comparison functions
   - GPU-accelerated CSS animations
   - Staggered animation batching
   - Viewport culling with intersection observers
   - CSS containment for rendering isolation

4. **Glassmorphic Design System**: Custom CSS variables and utility classes for consistent glass effects

### Performance Architecture

The application includes advanced performance optimizations documented in `PERFORMANCE_INTEGRATION_SUMMARY.md`:
- **CSS Performance**: GPU acceleration, containment properties, optimized transitions
- **React Optimizations**: Memoization, callback optimization, render tracking
- **Animation System**: Batched staggered animations with adaptive performance
- **Monitoring**: Development-only performance dashboard and test suite

## TypeScript Configuration

The project uses a relaxed TypeScript configuration for rapid development:
- `noImplicitAny`: false
- `strictNullChecks`: false
- `noUnusedParameters`: false
- `noUnusedLocals`: false
- Path alias: `@/*` maps to `./src/*`

## Important Implementation Details

### Supabase Integration
- Project ID: `wfzqmnpycltwafvqcdlx`
- Client configured in `src/integrations/supabase/client.ts`
- Types defined in `src/integrations/supabase/types.ts`

### Animation System
- Custom hooks: `useStaggeredAnimation`, `useIntersectionObserver`, `useZoomPerformance`
- Batched animations with configurable batch size (default: 8)
- Maximum 20 concurrent animations
- Adaptive performance based on device capabilities

### CSS Classes for Performance
- `.card-container-optimized`: GPU acceleration and containment
- `.gpu-accelerated`: Hardware acceleration utility
- `.bookmark-list-container`: Viewport culling for long lists

### Development Features
- Performance monitoring toggle (lightning bolt icon in development)
- Comprehensive performance test suite
- Real-time metrics display

## Critical Performance Considerations

When modifying animations or adding new features:
1. Always use CSS transforms instead of position/size properties
2. Apply `will-change: transform` judiciously (already optimized in base classes)
3. Use the existing animation hooks for consistency
4. Test with the performance monitoring tools
5. Respect reduced motion preferences

## Lovable Platform Integration

This project is integrated with Lovable (https://lovable.dev/projects/5ac67bf4-2270-440c-ad9c-7111429b69f4). Changes made through Lovable are automatically committed to the repository.