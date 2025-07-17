# Suggested Commands

## Development Commands
- `npm run dev` - Start development server with hot reloading
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality

## Installation
- `npm install` - Install all dependencies
- `npm i` - Short form of npm install

## Git Operations (Darwin/macOS)
- `git status` - Check repository status
- `git add .` - Stage all changes
- `git commit -m "message"` - Commit changes
- `git push` - Push to remote repository
- `git pull` - Pull latest changes

## File System Operations (Darwin/macOS)
- `ls` - List directory contents
- `ls -la` - List with detailed information including hidden files
- `cd <directory>` - Change directory
- `pwd` - Print working directory
- `find . -name "*.tsx"` - Find TypeScript React files
- `grep -r "pattern" src/` - Search for patterns in source files

## Package Management
- `npm list` - Show installed packages
- `npm outdated` - Check for outdated packages
- `npm update` - Update packages

## TypeScript
- `npx tsc --noEmit` - Type check without emitting files
- `npx tsc --watch` - Watch mode for type checking

## Supabase (if CLI installed)
- `supabase status` - Check local Supabase status
- `supabase start` - Start local Supabase development
- `supabase stop` - Stop local Supabase development

## Common Debugging
- `npm run dev -- --port 3001` - Run dev server on different port
- `npm run build 2>&1 | grep -i error` - Show only build errors
- `npm run lint -- --fix` - Auto-fix linting issues where possible