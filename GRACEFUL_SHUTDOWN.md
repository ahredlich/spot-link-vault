# Graceful Shutdown System

## Overview

This application now includes a comprehensive graceful shutdown system that ensures all processes are properly terminated when you close Claude Code or stop the development server.

## Components

### 1. Process Wrapper (`dev-server.js`)
- Wraps the Vite dev server in a managed process
- Handles SIGINT, SIGTERM, and SIGHUP signals
- Cleans up port 8080 to prevent "port already in use" errors
- Includes 5-second timeout protection for force exit

### 2. Frontend Cleanup (`src/lib/shutdown.ts`)
- Manages Supabase realtime subscriptions
- Cancels pending HTTP requests
- Clears event listeners
- Handles browser close/refresh events
- Supports React Query cache cleanup

### 3. Shutdown Utilities (`src/lib/shutdown-utils.ts`)
- Provides development mode detection
- Logs shutdown events with timestamps
- Tracks critical operations
- Detects shutdown reasons
- Offers safe cleanup wrappers

### 4. Vite Configuration
- Added server shutdown handlers
- Configured HMR with proper cleanup
- Handles WebSocket connection cleanup

## Usage

### Starting the Development Server

```bash
# Use the new graceful shutdown wrapper (recommended)
npm run dev

# Or run directly
node dev-server.js

# Fallback to direct Vite (without graceful shutdown)
npm run dev:direct
```

### Manual Cleanup

```bash
# Stop all Vite processes
npm run stop
```

### In Your Application Code

```typescript
import { initializeShutdownHandlers, registerCleanupCallback } from '@/lib/shutdown';
import { registerCriticalOperation, unregisterOperation } from '@/lib/shutdown-utils';

// Initialize shutdown handlers on app start
initializeShutdownHandlers({
  autoCleanupOptions: {
    clearStorage: false,
    preserveStorageKeys: ['theme', 'user-preferences'],
    signOut: false
  }
});

// Register custom cleanup tasks
registerCleanupCallback('save-draft', async () => {
  await saveDraftToServer();
}, 10); // Priority 10

// Track critical operations
const opId = registerCriticalOperation('save-data', 'Saving user data');
try {
  await saveUserData();
} finally {
  unregisterOperation(opId);
}
```

## Features

### Signal Handling
- **SIGINT (Ctrl+C)**: Graceful shutdown with cleanup
- **SIGTERM**: System termination signal handling
- **SIGHUP**: Terminal hangup signal handling

### Resource Cleanup
- Supabase realtime connections
- HTTP request cancellation
- Event listener removal
- Port binding cleanup
- WebSocket connection termination

### Error Protection
- Individual cleanup operations wrapped in try-catch
- Errors logged but don't block shutdown
- 5-second timeout prevents hanging
- Force exit as last resort

### Cross-Platform Support
- Works on macOS, Linux, and Windows
- Platform-specific process killing
- Handles different signal behaviors

## Troubleshooting

### Port Already in Use
If you still get "port already in use" errors:
1. Run `npm run stop` to kill all Vite processes
2. Check for processes on port 8080: `lsof -i :8080`
3. Kill specific process: `kill -9 <PID>`

### Shutdown Not Working
1. Check console for error messages
2. Verify signal handlers are registered
3. Try manual cleanup with `npm run stop`
4. Force kill as last resort: `pkill -9 -f vite`

## Benefits

1. **Clean Process Termination**: No orphaned processes when closing Claude Code
2. **Port Conflict Prevention**: Automatic cleanup of port 8080
3. **Resource Management**: Proper cleanup of database connections and subscriptions
4. **Developer Experience**: Reliable restarts without manual intervention
5. **Error Prevention**: Prevents memory leaks and connection issues

## Development Notes

- The graceful shutdown system is automatically active when using `npm run dev`
- Shutdown events are logged with timestamps for debugging
- Critical operations are tracked to prevent data loss
- All cleanup operations have individual error handling

When you close Claude Code or stop the server, you'll see shutdown messages in the console confirming that all resources have been properly cleaned up.