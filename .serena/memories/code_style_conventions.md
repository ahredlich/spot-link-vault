# Code Style and Conventions

## TypeScript Configuration
- **Strict Mode**: Partially enabled with some relaxed rules
- **noImplicitAny**: Disabled for flexibility
- **strictNullChecks**: Disabled 
- **skipLibCheck**: Enabled for faster compilation
- **Path Mapping**: `@/*` maps to `./src/*` for cleaner imports

## ESLint Configuration
- Uses TypeScript ESLint recommended rules
- React hooks rules enforced
- React refresh rules for development
- **@typescript-eslint/no-unused-vars**: Disabled
- Extends standard JavaScript and TypeScript recommended configs

## File Structure Conventions
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   └── *.tsx           # Custom components (PascalCase)
├── hooks/              # Custom React hooks (camelCase)
├── lib/                # Utility functions and configurations
├── pages/              # Page components (PascalCase)
├── integrations/       # External service integrations
├── App.tsx             # Main app component
├── main.tsx           # Entry point
└── index.css          # Global styles
```

## Component Naming
- **Components**: PascalCase (e.g., `BookmarkCard.tsx`)
- **Hooks**: camelCase starting with "use" (e.g., `useAuth.tsx`)
- **Utilities**: camelCase (e.g., `utils.ts`)
- **Pages**: PascalCase (e.g., `Index.tsx`)

## Import Conventions
- Use `@/` path alias for src imports
- Group imports: external libraries first, then internal modules
- Use named exports for components
- Default exports for pages and main components

## Styling Approach
- **Tailwind CSS**: Utility-first approach with custom glass morphism design
- **CSS Variables**: Extensive use for theming and glass effects
- **Component Variants**: Using `class-variance-authority` for component styling
- **Responsive Design**: Mobile-first approach with responsive breakpoints

## Component Structure
```typescript
// External imports
import { useState } from "react";
import { Button } from "@/components/ui/button";

// Internal imports
import { useAuth } from "@/hooks/useAuth";

// Types/interfaces
interface ComponentProps {
  title: string;
  onAction: () => void;
}

// Main component
const Component = ({ title, onAction }: ComponentProps) => {
  // Component logic
  return <div>{/* JSX */}</div>;
};

export default Component;
```

## State Management
- Use React hooks for local state
- React Query for server state
- Context API for global state (auth)
- Avoid prop drilling with proper component composition

## Error Handling
- Console.log for development debugging
- Proper error boundaries for production
- Graceful fallbacks for missing data

## Performance Considerations
- Lazy loading for routes
- Memoization for expensive calculations
- Proper dependency arrays for hooks
- Staggered animations for smooth UX