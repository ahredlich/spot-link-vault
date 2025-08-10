import { supabase } from '@/integrations/supabase/client';
import { QueryClient } from '@tanstack/react-query';
import type { RealtimeChannel } from '@supabase/supabase-js';

/**
 * Interface for cleanup callbacks
 */
interface CleanupCallback {
  name: string;
  callback: () => void | Promise<void>;
  priority?: number; // Lower numbers run first
}

/**
 * Shutdown manager class to handle application cleanup
 */
class ShutdownManager {
  private cleanupCallbacks: CleanupCallback[] = [];
  private isShuttingDown = false;
  private activeChannels: Set<RealtimeChannel> = new Set();
  private abortControllers: Set<AbortController> = new Set();
  private eventListeners: Array<{ target: EventTarget; type: string; listener: EventListener }> = [];

  /**
   * Register a cleanup callback
   */
  registerCleanupCallback(callback: CleanupCallback): void {
    this.cleanupCallbacks.push(callback);
    // Sort by priority (lower numbers first)
    this.cleanupCallbacks.sort((a, b) => (a.priority || 100) - (b.priority || 100));
  }

  /**
   * Unregister a cleanup callback by name
   */
  unregisterCleanupCallback(name: string): void {
    this.cleanupCallbacks = this.cleanupCallbacks.filter(cb => cb.name !== name);
  }

  /**
   * Track a realtime channel for cleanup
   */
  trackChannel(channel: RealtimeChannel): void {
    this.activeChannels.add(channel);
  }

  /**
   * Untrack a realtime channel
   */
  untrackChannel(channel: RealtimeChannel): void {
    this.activeChannels.delete(channel);
  }

  /**
   * Track an AbortController for cleanup
   */
  trackAbortController(controller: AbortController): void {
    this.abortControllers.add(controller);
  }

  /**
   * Untrack an AbortController
   */
  untrackAbortController(controller: AbortController): void {
    this.abortControllers.delete(controller);
  }

  /**
   * Track an event listener for cleanup
   */
  trackEventListener(target: EventTarget, type: string, listener: EventListener): void {
    this.eventListeners.push({ target, type, listener });
  }

  /**
   * Close all Supabase realtime subscriptions
   */
  private async closeRealtimeSubscriptions(): Promise<void> {
    try {
      // Close tracked channels
      for (const channel of this.activeChannels) {
        try {
          await supabase.removeChannel(channel);
        } catch (error) {
          console.error('Error removing channel:', error);
        }
      }
      this.activeChannels.clear();

      // Close all channels from Supabase client
      const channels = supabase.getChannels();
      await Promise.all(
        channels.map(channel => 
          supabase.removeChannel(channel).catch(error => 
            console.error('Error removing channel:', error)
          )
        )
      );
    } catch (error) {
      console.error('Error closing realtime subscriptions:', error);
    }
  }

  /**
   * Abort all pending requests
   */
  private abortPendingRequests(): void {
    try {
      for (const controller of this.abortControllers) {
        try {
          controller.abort('Application shutting down');
        } catch (error) {
          console.error('Error aborting request:', error);
        }
      }
      this.abortControllers.clear();
    } catch (error) {
      console.error('Error aborting pending requests:', error);
    }
  }

  /**
   * Remove all tracked event listeners
   */
  private removeEventListeners(): void {
    try {
      for (const { target, type, listener } of this.eventListeners) {
        try {
          target.removeEventListener(type, listener);
        } catch (error) {
          console.error('Error removing event listener:', error);
        }
      }
      this.eventListeners = [];
    } catch (error) {
      console.error('Error removing event listeners:', error);
    }
  }

  /**
   * Clear storage with optional preservation
   */
  private clearStorage(preserveKeys: string[] = []): void {
    try {
      // Clear localStorage
      const localStorageKeys = Object.keys(localStorage);
      for (const key of localStorageKeys) {
        if (!preserveKeys.includes(key)) {
          localStorage.removeItem(key);
        }
      }

      // Clear sessionStorage
      const sessionStorageKeys = Object.keys(sessionStorage);
      for (const key of sessionStorageKeys) {
        if (!preserveKeys.includes(key)) {
          sessionStorage.removeItem(key);
        }
      }
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }

  /**
   * Clear React Query cache
   */
  private clearQueryCache(queryClient?: QueryClient): void {
    try {
      if (queryClient) {
        queryClient.cancelQueries();
        queryClient.clear();
      }
    } catch (error) {
      console.error('Error clearing query cache:', error);
    }
  }

  /**
   * Execute all cleanup tasks
   */
  async cleanup(options: CleanupOptions = {}): Promise<void> {
    if (this.isShuttingDown) {
      console.warn('Cleanup already in progress');
      return;
    }

    this.isShuttingDown = true;
    const errors: Error[] = [];

    try {
      // Run custom cleanup callbacks first
      for (const { name, callback } of this.cleanupCallbacks) {
        try {
          await Promise.resolve(callback());
        } catch (error) {
          console.error(`Error in cleanup callback "${name}":`, error);
          errors.push(error as Error);
        }
      }

      // Close realtime subscriptions
      await this.closeRealtimeSubscriptions();

      // Abort pending requests
      this.abortPendingRequests();

      // Remove event listeners
      this.removeEventListeners();

      // Clear storage if requested
      if (options.clearStorage) {
        this.clearStorage(options.preserveStorageKeys);
      }

      // Clear React Query cache if provided
      if (options.queryClient) {
        this.clearQueryCache(options.queryClient);
      }

      // Sign out from Supabase if requested
      if (options.signOut) {
        try {
          await supabase.auth.signOut();
        } catch (error) {
          console.error('Error signing out:', error);
          errors.push(error as Error);
        }
      }

    } catch (error) {
      console.error('Unexpected error during cleanup:', error);
      errors.push(error as Error);
    } finally {
      this.isShuttingDown = false;
    }

    if (errors.length > 0 && !options.suppressErrors) {
      const error = new Error('Multiple errors occurred during cleanup');
      (error as any).errors = errors;
      throw error;
    }
  }

  /**
   * Get cleanup status
   */
  isCleanupInProgress(): boolean {
    return this.isShuttingDown;
  }
}

/**
 * Options for cleanup operation
 */
export interface CleanupOptions {
  clearStorage?: boolean;
  preserveStorageKeys?: string[];
  signOut?: boolean;
  queryClient?: QueryClient;
  suppressErrors?: boolean;
}

// Create singleton instance
const shutdownManager = new ShutdownManager();

/**
 * Initialize shutdown handlers
 */
export function initializeShutdownHandlers(options: {
  queryClient?: QueryClient;
  autoCleanupOptions?: CleanupOptions;
} = {}): void {
  // Handle beforeunload event
  const handleBeforeUnload = async (event: BeforeUnloadEvent) => {
    // If there are unsaved changes or ongoing operations, you can prompt the user
    if (shutdownManager.isCleanupInProgress()) {
      event.preventDefault();
      event.returnValue = '';
      return;
    }

    // Perform synchronous cleanup tasks
    try {
      // Note: beforeunload doesn't reliably support async operations
      // so we only do synchronous cleanup here
      shutdownManager['abortPendingRequests']();
      shutdownManager['removeEventListeners']();
    } catch (error) {
      console.error('Error in beforeunload cleanup:', error);
    }
  };

  // Handle visibilitychange for mobile/tab switching
  const handleVisibilityChange = async () => {
    if (document.visibilityState === 'hidden') {
      // Perform lightweight cleanup when page is hidden
      try {
        await cleanupRealtimeConnections();
      } catch (error) {
        console.error('Error in visibility change cleanup:', error);
      }
    }
  };

  window.addEventListener('beforeunload', handleBeforeUnload);
  document.addEventListener('visibilitychange', handleVisibilityChange);

  // Track these listeners for cleanup
  shutdownManager.trackEventListener(window, 'beforeunload', handleBeforeUnload);
  shutdownManager.trackEventListener(document, 'visibilitychange', handleVisibilityChange);
}

/**
 * Perform full cleanup
 */
export async function performCleanup(options: CleanupOptions = {}): Promise<void> {
  return shutdownManager.cleanup(options);
}

/**
 * Clean up only realtime connections
 */
export async function cleanupRealtimeConnections(): Promise<void> {
  return shutdownManager['closeRealtimeSubscriptions']();
}

/**
 * Register a custom cleanup callback
 */
export function registerCleanupCallback(
  name: string,
  callback: () => void | Promise<void>,
  priority = 100
): void {
  shutdownManager.registerCleanupCallback({ name, callback, priority });
}

/**
 * Unregister a cleanup callback
 */
export function unregisterCleanupCallback(name: string): void {
  shutdownManager.unregisterCleanupCallback(name);
}

/**
 * Track a realtime channel for automatic cleanup
 */
export function trackRealtimeChannel(channel: RealtimeChannel): void {
  shutdownManager.trackChannel(channel);
}

/**
 * Untrack a realtime channel
 */
export function untrackRealtimeChannel(channel: RealtimeChannel): void {
  shutdownManager.untrackChannel(channel);
}

/**
 * Create an AbortController that will be automatically aborted on shutdown
 */
export function createTrackedAbortController(): AbortController {
  const controller = new AbortController();
  shutdownManager.trackAbortController(controller);
  return controller;
}

/**
 * Track an event listener for automatic cleanup
 */
export function trackEventListener(
  target: EventTarget,
  type: string,
  listener: EventListener,
  options?: AddEventListenerOptions
): void {
  target.addEventListener(type, listener, options);
  shutdownManager.trackEventListener(target, type, listener);
}

/**
 * React hook for component-level cleanup registration
 */
export function useCleanupOnUnmount(
  name: string,
  callback: () => void | Promise<void>
): void {
  if (typeof window !== 'undefined' && 'useEffect' in window.React) {
    window.React.useEffect(() => {
      registerCleanupCallback(name, callback);
      return () => {
        unregisterCleanupCallback(name);
      };
    }, [name, callback]);
  }
}

// Export the manager instance for advanced usage
export { shutdownManager };