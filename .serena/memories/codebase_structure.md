# Codebase Structure

## Root Directory
```
spot-link-vault/
├── public/                 # Static assets
├── src/                   # Source code
├── supabase/              # Supabase configuration and migrations
├── .serena/               # Serena agent configuration
├── .kiro/                 # Kiro configuration
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.ts     # Tailwind CSS configuration
├── components.json        # shadcn/ui configuration
├── eslint.config.js       # ESLint configuration
├── vite.config.ts         # Vite build configuration
├── postcss.config.js      # PostCSS configuration
└── README.md             # Project documentation
```

## Source Directory Structure
```
src/
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui base components
│   ├── BookmarkCard.tsx  # Bookmark display component
│   ├── CollectionsSidebar.tsx  # Navigation sidebar
│   ├── AddBookmarkDialog.tsx   # Add bookmark modal
│   ├── LoadingSkeleton.tsx     # Loading states
│   └── AnimationTest.tsx       # Animation utilities
├── hooks/                 # Custom React hooks
│   └── useAuth.tsx       # Authentication hook
├── lib/                   # Utility functions
│   └── utils.ts          # Common utilities
├── pages/                 # Page components
│   ├── Index.tsx         # Main bookmark manager / landing page
│   ├── ImportExport.tsx  # Import/export functionality
│   ├── Auth.tsx          # Authentication page
│   └── NotFound.tsx      # 404 page
├── integrations/          # External service integrations
│   └── supabase/         # Supabase client and types
├── App.tsx               # Main application component
├── main.tsx              # Application entry point
├── index.css             # Global styles and CSS variables
├── App.css               # App-specific styles
└── vite-env.d.ts         # Vite type definitions
```

## Key Files and Their Purposes

### Application Entry
- **main.tsx**: React app entry point, renders App component
- **App.tsx**: Main app shell with routing, providers, and layout
- **index.css**: Global styles, CSS variables, and Tailwind imports

### Core Pages
- **Index.tsx**: Combined landing page and bookmark manager (huge file ~750 lines)
- **Auth.tsx**: Authentication and user management
- **ImportExport.tsx**: Bookmark import/export functionality
- **NotFound.tsx**: 404 error page

### Key Components
- **BookmarkCard.tsx**: Individual bookmark display with actions
- **CollectionsSidebar.tsx**: Navigation and collection management
- **AddBookmarkDialog.tsx**: Form for adding new bookmarks
- **LoadingSkeleton.tsx**: Loading state components

### Authentication
- **useAuth.tsx**: Custom hook managing user authentication state
- **supabase/**: Database integration and API calls

### Styling System
- **tailwind.config.ts**: Extended Tailwind configuration with glass morphism
- **components.json**: shadcn/ui configuration
- **index.css**: CSS variables for theming and glass effects

## Architecture Patterns
- **Component-based**: React functional components with hooks
- **Page-based routing**: React Router with lazy loading
- **State management**: React Query for server state, Context for auth
- **Design system**: shadcn/ui + custom glass morphism theme
- **Responsive design**: Mobile-first Tailwind approach

## Data Flow
1. **Authentication**: Supabase handles user auth via useAuth hook
2. **Data fetching**: React Query manages server state and caching
3. **UI State**: Local component state for UI interactions
4. **Routing**: React Router handles navigation between pages
5. **Styling**: Tailwind + CSS variables for dynamic theming