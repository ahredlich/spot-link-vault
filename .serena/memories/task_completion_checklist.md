# Task Completion Checklist

When completing any coding task in this project, follow this checklist:

## Code Quality
- [ ] **Run ESLint**: `npm run lint` to check for code quality issues
- [ ] **Fix linting errors**: Address any linting errors or warnings
- [ ] **Type checking**: Ensure TypeScript types are correct (no implicit any issues)
- [ ] **Import organization**: Use proper import structure with `@/` aliases

## Testing & Verification
- [ ] **Manual testing**: Test the feature/fix manually in development mode
- [ ] **Responsive testing**: Check functionality on different screen sizes
- [ ] **Browser testing**: Verify cross-browser compatibility if applicable
- [ ] **Error handling**: Test error scenarios and edge cases

## Build Process
- [ ] **Development build**: `npm run build:dev` for development testing
- [ ] **Production build**: `npm run build` to ensure production readiness
- [ ] **Preview build**: `npm run preview` to test production build locally
- [ ] **Check bundle size**: Ensure no unnecessary bloat

## Code Review
- [ ] **Component structure**: Follow established patterns and conventions
- [ ] **Performance**: Check for unnecessary re-renders or expensive operations
- [ ] **Accessibility**: Ensure components are accessible (ARIA labels, keyboard navigation)
- [ ] **Security**: No hardcoded secrets or sensitive data

## Documentation
- [ ] **Component props**: Document complex component interfaces
- [ ] **Hook usage**: Document custom hooks and their purposes
- [ ] **README updates**: Update project documentation if needed

## Git Best Practices
- [ ] **Commit messages**: Write clear, descriptive commit messages
- [ ] **Branch naming**: Use descriptive branch names
- [ ] **Code review**: Request review for significant changes

## Deployment Readiness
- [ ] **Environment variables**: Check all required env vars are documented
- [ ] **Supabase integration**: Verify database connections and queries work
- [ ] **Production optimizations**: Ensure code is optimized for production

## Common Issues to Check
- [ ] **Memory leaks**: Proper cleanup of event listeners and subscriptions
- [ ] **Loading states**: Proper loading and error states for async operations
- [ ] **Form validation**: Proper form validation and error messages
- [ ] **Route handling**: Proper navigation and route protection

## Final Steps
- [ ] **Clean up**: Remove console.logs and debug code
- [ ] **Final lint**: Run `npm run lint` one more time
- [ ] **Final build**: Ensure `npm run build` succeeds without errors
- [ ] **Test preview**: Run `npm run preview` and do final manual testing