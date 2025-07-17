/**
 * Utilities for application shutdown process
 */

// Types
export interface ShutdownEvent {
  timestamp: number;
  type: 'info' | 'warning' | 'error' | 'debug';
  message: string;
  details?: any;
}

export interface PendingOperation {
  id: string;
  name: string;
  startTime: number;
  critical: boolean;
  promise?: Promise<any>;
}

export enum ShutdownReason {
  BROWSER_CLOSE = 'browser_close',
  TAB_CLOSE = 'tab_close',
  MANUAL = 'manual',
  ERROR = 'error',
  RELOAD = 'reload',
  NAVIGATION = 'navigation',
  UNKNOWN = 'unknown'
}

export interface WaitOptions {
  timeout?: number;
  checkInterval?: number;
  onProgress?: (remaining: number) => void;
}

// Constants
export const SHUTDOWN_TIMEOUTS = {
  DEFAULT: 5000,
  CRITICAL_OPERATION: 10000,
  QUICK_CLEANUP: 1000,
  MAX_WAIT: 30000,
} as const;

export const RETRY_LIMITS = {
  DEFAULT: 3,
  NETWORK_OPERATION: 5,
  CLEANUP_OPERATION: 2,
} as const;

export const CHECK_INTERVALS = {
  DEFAULT: 100,
  SLOW: 500,
  FAST: 50,
} as const;

// Internal state
const shutdownEvents: ShutdownEvent[] = [];
const pendingOperations = new Map<string, PendingOperation>();
let isDevMode: boolean | null = null;

/**
 * Detect if the app is running in development mode
 */
export function isDevelopmentMode(): boolean {
  if (isDevMode !== null) {
    return isDevMode;
  }

  // Check various indicators of development mode
  isDevMode = (
    // Check NODE_ENV
    process.env.NODE_ENV === 'development' ||
    // Check for localhost
    (typeof window !== 'undefined' && (
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname.startsWith('192.168.') ||
      window.location.hostname.startsWith('10.') ||
      window.location.hostname.endsWith('.local')
    )) ||
    // Check for development port
    (typeof window !== 'undefined' && (
      window.location.port === '3000' ||
      window.location.port === '5173' ||
      window.location.port === '5174' ||
      window.location.port === '8080'
    )) ||
    // Check for React DevTools
    (typeof window !== 'undefined' && '__REACT_DEVTOOLS_GLOBAL_HOOK__' in window) ||
    // Check for Vite
    (typeof window !== 'undefined' && '__VITE_IS_MODERN__' in window) ||
    // Check for webpack hot reload
    (typeof window !== 'undefined' && 'webpackHotUpdate' in window) ||
    false
  );

  return isDevMode;
}

/**
 * Log shutdown events with timestamps
 */
export function logShutdownEvent(
  type: ShutdownEvent['type'],
  message: string,
  details?: any
): void {
  const event: ShutdownEvent = {
    timestamp: Date.now(),
    type,
    message,
    details
  };

  shutdownEvents.push(event);

  // Log to console in development mode
  if (isDevelopmentMode()) {
    const timestamp = new Date(event.timestamp).toISOString();
    const prefix = `[SHUTDOWN ${type.toUpperCase()}] ${timestamp}`;
    
    switch (type) {
      case 'error':
        console.error(prefix, message, details || '');
        break;
      case 'warning':
        console.warn(prefix, message, details || '');
        break;
      case 'debug':
        console.debug(prefix, message, details || '');
        break;
      default:
        console.log(prefix, message, details || '');
    }
  }

  // Keep only the last 100 events to prevent memory issues
  if (shutdownEvents.length > 100) {
    shutdownEvents.splice(0, shutdownEvents.length - 100);
  }
}

/**
 * Get all shutdown events
 */
export function getShutdownEvents(): ReadonlyArray<ShutdownEvent> {
  return [...shutdownEvents];
}

/**
 * Clear shutdown events
 */
export function clearShutdownEvents(): void {
  shutdownEvents.length = 0;
}

/**
 * Register a critical operation
 */
export function registerCriticalOperation(
  id: string,
  name: string,
  promise?: Promise<any>
): void {
  pendingOperations.set(id, {
    id,
    name,
    startTime: Date.now(),
    critical: true,
    promise
  });
  
  logShutdownEvent('debug', `Critical operation registered: ${name}`, { id });
}

/**
 * Register a non-critical operation
 */
export function registerOperation(
  id: string,
  name: string,
  promise?: Promise<any>
): void {
  pendingOperations.set(id, {
    id,
    name,
    startTime: Date.now(),
    critical: false,
    promise
  });
  
  logShutdownEvent('debug', `Operation registered: ${name}`, { id });
}

/**
 * Unregister an operation
 */
export function unregisterOperation(id: string): void {
  const operation = pendingOperations.get(id);
  if (operation) {
    pendingOperations.delete(id);
    const duration = Date.now() - operation.startTime;
    logShutdownEvent('debug', `Operation completed: ${operation.name}`, { id, duration });
  }
}

/**
 * Check if any critical operations are in progress
 */
export function hasCriticalOperations(): boolean {
  for (const operation of pendingOperations.values()) {
    if (operation.critical) {
      return true;
    }
  }
  return false;
}

/**
 * Get all pending operations
 */
export function getPendingOperations(): PendingOperation[] {
  return Array.from(pendingOperations.values());
}

/**
 * Get critical pending operations
 */
export function getCriticalOperations(): PendingOperation[] {
  return Array.from(pendingOperations.values()).filter(op => op.critical);
}

/**
 * Wait for pending operations with timeout
 */
export async function waitForPendingOperations(
  options: WaitOptions = {}
): Promise<void> {
  const {
    timeout = SHUTDOWN_TIMEOUTS.DEFAULT,
    checkInterval = CHECK_INTERVALS.DEFAULT,
    onProgress
  } = options;

  const startTime = Date.now();
  
  logShutdownEvent('info', 'Waiting for pending operations', {
    count: pendingOperations.size,
    timeout
  });

  while (pendingOperations.size > 0) {
    const elapsed = Date.now() - startTime;
    const remaining = timeout - elapsed;
    
    if (elapsed >= timeout) {
      const operations = Array.from(pendingOperations.values());
      logShutdownEvent('warning', 'Timeout waiting for operations', {
        remaining: operations.map(op => ({ id: op.id, name: op.name }))
      });
      break;
    }

    if (onProgress) {
      onProgress(remaining);
    }

    // Try to await promises if available
    const promises = Array.from(pendingOperations.values())
      .filter(op => op.promise)
      .map(op => op.promise!);
    
    if (promises.length > 0) {
      await Promise.race([
        Promise.allSettled(promises),
        new Promise(resolve => setTimeout(resolve, checkInterval))
      ]);
    } else {
      await new Promise(resolve => setTimeout(resolve, checkInterval));
    }
  }

  logShutdownEvent('info', 'Finished waiting for operations', {
    duration: Date.now() - startTime,
    remaining: pendingOperations.size
  });
}

/**
 * Wait for critical operations only
 */
export async function waitForCriticalOperations(
  options: WaitOptions = {}
): Promise<void> {
  const criticalOps = getCriticalOperations();
  if (criticalOps.length === 0) {
    return;
  }

  const criticalIds = new Set(criticalOps.map(op => op.id));
  const modifiedOptions = {
    ...options,
    timeout: options.timeout || SHUTDOWN_TIMEOUTS.CRITICAL_OPERATION
  };

  await waitForPendingOperations({
    ...modifiedOptions,
    checkInterval: options.checkInterval || CHECK_INTERVALS.DEFAULT,
    onProgress: (remaining) => {
      // Remove non-critical operations from tracking
      for (const [id, op] of pendingOperations) {
        if (!criticalIds.has(id)) {
          pendingOperations.delete(id);
        }
      }
      if (options.onProgress) {
        options.onProgress(remaining);
      }
    }
  });
}

/**
 * Detect shutdown reason based on various signals
 */
export function detectShutdownReason(): ShutdownReason {
  if (typeof window === 'undefined') {
    return ShutdownReason.UNKNOWN;
  }

  // Check performance navigation type
  if (window.performance && window.performance.navigation) {
    const navType = window.performance.navigation.type;
    if (navType === 1) { // TYPE_RELOAD
      return ShutdownReason.RELOAD;
    }
  }

  // Check if it's a navigation event
  if (window.performance && window.performance.getEntriesByType) {
    const navEntries = window.performance.getEntriesByType('navigation');
    if (navEntries.length > 0) {
      const lastNav = navEntries[navEntries.length - 1] as any;
      if (lastNav.type === 'reload') {
        return ShutdownReason.RELOAD;
      }
      if (lastNav.type === 'navigate') {
        return ShutdownReason.NAVIGATION;
      }
    }
  }

  // Check if triggered by beforeunload (browser/tab close)
  if (window.event && window.event.type === 'beforeunload') {
    return ShutdownReason.BROWSER_CLOSE;
  }

  // Check document visibility
  if (document.visibilityState === 'hidden') {
    return ShutdownReason.TAB_CLOSE;
  }

  // Check for error conditions
  if (window.onerror || (window as any).__errorOccurred) {
    return ShutdownReason.ERROR;
  }

  // Default to unknown
  return ShutdownReason.UNKNOWN;
}

/**
 * Safe cleanup wrapper that catches and logs errors
 */
export async function safeCleanup<T>(
  operation: () => T | Promise<T>,
  operationName: string
): Promise<T | undefined> {
  try {
    logShutdownEvent('debug', `Starting cleanup: ${operationName}`);
    const result = await Promise.resolve(operation());
    logShutdownEvent('debug', `Completed cleanup: ${operationName}`);
    return result;
  } catch (error) {
    logShutdownEvent('error', `Failed cleanup: ${operationName}`, {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    return undefined;
  }
}

/**
 * Safe cleanup with retry
 */
export async function safeCleanupWithRetry<T>(
  operation: () => T | Promise<T>,
  operationName: string,
  maxRetries: number = RETRY_LIMITS.CLEANUP_OPERATION
): Promise<T | undefined> {
  let lastError: Error | undefined;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        logShutdownEvent('info', `Retrying cleanup: ${operationName}`, { attempt });
      }
      
      const result = await safeCleanup(operation, operationName);
      if (result !== undefined || attempt === 0) {
        return result;
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < maxRetries) {
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, 100 * Math.pow(2, attempt)));
      }
    }
  }
  
  logShutdownEvent('error', `All retry attempts failed: ${operationName}`, {
    error: lastError?.message,
    maxRetries
  });
  
  return undefined;
}

/**
 * Execute cleanup operations in parallel with individual timeouts
 */
export async function parallelCleanup(
  operations: Array<{
    name: string;
    operation: () => void | Promise<void>;
    timeout?: number;
    critical?: boolean;
  }>
): Promise<void> {
  logShutdownEvent('info', 'Starting parallel cleanup', {
    count: operations.length
  });

  const promises = operations.map(({ name, operation, timeout, critical }) => {
    const timeoutMs = timeout || (critical ? SHUTDOWN_TIMEOUTS.CRITICAL_OPERATION : SHUTDOWN_TIMEOUTS.DEFAULT);
    
    return Promise.race([
      safeCleanup(operation, name),
      new Promise<void>((resolve) => {
        setTimeout(() => {
          logShutdownEvent('warning', `Cleanup timeout: ${name}`, { timeout: timeoutMs });
          resolve();
        }, timeoutMs);
      })
    ]);
  });

  await Promise.allSettled(promises);
  logShutdownEvent('info', 'Completed parallel cleanup');
}

/**
 * Create a timeout promise
 */
export function createTimeoutPromise(ms: number, message?: string): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(message || `Operation timed out after ${ms}ms`));
    }, ms);
  });
}

/**
 * Wrap an operation with timeout
 */
export async function withTimeout<T>(
  operation: Promise<T>,
  timeout: number,
  timeoutMessage?: string
): Promise<T> {
  return Promise.race([
    operation,
    createTimeoutPromise(timeout, timeoutMessage)
  ]);
}

/**
 * Check if browser supports beforeunload properly
 */
export function supportsBeforeUnload(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  
  // Check for mobile browsers that don't support beforeunload well
  const userAgent = navigator.userAgent.toLowerCase();
  const isMobile = /mobile|android|iphone|ipad|ipod/.test(userAgent);
  const isIOSSafari = /iphone|ipad|ipod/.test(userAgent) && /safari/.test(userAgent);
  
  return !isMobile || !isIOSSafari;
}

/**
 * Get a human-readable shutdown reason
 */
export function getShutdownReasonText(reason: ShutdownReason): string {
  switch (reason) {
    case ShutdownReason.BROWSER_CLOSE:
      return 'Browser window closed';
    case ShutdownReason.TAB_CLOSE:
      return 'Browser tab closed';
    case ShutdownReason.MANUAL:
      return 'Manual shutdown initiated';
    case ShutdownReason.ERROR:
      return 'Shutdown due to error';
    case ShutdownReason.RELOAD:
      return 'Page reload';
    case ShutdownReason.NAVIGATION:
      return 'Navigation to another page';
    case ShutdownReason.UNKNOWN:
    default:
      return 'Unknown shutdown reason';
  }
}

/**
 * Format duration in human-readable format
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`;
  } else if (ms < 60000) {
    return `${(ms / 1000).toFixed(1)}s`;
  } else {
    return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
  }
}