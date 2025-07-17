/**
 * Animation Configuration System
 * Provides centralized animation timing and configuration
 */

export interface AnimationConfig {
  staggerDelay: number;
  duration: {
    fast: number;
    normal: number;
    slow: number;
  };
  easing: {
    smooth: string;
    bounce: string;
    sharp: string;
  };
}

export const defaultAnimationConfig: AnimationConfig = {
  staggerDelay: 100, // Base delay between staggered animations in ms
  duration: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
  easing: {
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
  },
};

/**
 * Animation utility functions for staggered card appearances
 */

export type AnimationType = 'fade-in' | 'slide-in' | 'scale-in';

export interface StaggeredAnimationOptions {
  type: AnimationType;
  duration?: number;
  easing?: string;
  staggerDelay?: number;
  startDelay?: number;
}

/**
 * Generates CSS animation styles for staggered animations
 */
export const generateStaggeredAnimation = (
  index: number,
  options: StaggeredAnimationOptions
): React.CSSProperties => {
  const {
    type,
    duration = defaultAnimationConfig.duration.normal,
    easing = defaultAnimationConfig.easing.smooth,
    staggerDelay = defaultAnimationConfig.staggerDelay,
    startDelay = 0,
  } = options;

  const totalDelay = startDelay + (index * staggerDelay);

  const baseStyles: React.CSSProperties = {
    animationDuration: `${duration}ms`,
    animationTimingFunction: easing,
    animationDelay: `${totalDelay}ms`,
    animationFillMode: 'both',
  };

  switch (type) {
    case 'fade-in':
      return {
        ...baseStyles,
        animationName: 'fadeIn',
        opacity: 0,
      };
    case 'slide-in':
      return {
        ...baseStyles,
        animationName: 'slideIn',
        opacity: 0,
        transform: 'translateY(20px)',
      };
    case 'scale-in':
      return {
        ...baseStyles,
        animationName: 'scaleIn',
        opacity: 0,
        transform: 'scale(0.9)',
      };
    default:
      return baseStyles;
  }
};

/**
 * Generates CSS class names for staggered animations
 */
export const getStaggeredAnimationClasses = (
  index: number,
  type: AnimationType,
  options?: Partial<StaggeredAnimationOptions>
): string => {
  const classes = [`animate-${type}`];
  
  // Add stagger delay class based on index
  const staggerIndex = Math.min(index, 9); // Limit to 10 stagger classes
  if (staggerIndex > 0) {
    classes.push(`animate-stagger-${staggerIndex}`);
  }

  return classes.join(' ');
};

/**
 * Animation timing utilities
 */
export const animationTimings = {
  /**
   * Calculate total animation time including stagger
   */
  getTotalStaggerTime: (
    itemCount: number,
    staggerDelay: number = defaultAnimationConfig.staggerDelay,
    animationDuration: number = defaultAnimationConfig.duration.normal
  ): number => {
    return animationDuration + (itemCount - 1) * staggerDelay;
  },

  /**
   * Get optimal stagger delay based on item count
   */
  getOptimalStaggerDelay: (itemCount: number): number => {
    if (itemCount <= 3) return 150;
    if (itemCount <= 6) return 100;
    if (itemCount <= 12) return 75;
    return 50; // For large lists, use smaller delays
  },

  /**
   * Check if reduced motion is preferred
   */
  shouldReduceMotion: (): boolean => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },
};

/**
 * Animation state management
 */
export interface AnimationState {
  isAnimating: boolean;
  hasAnimated: boolean;
  animationPhase: 'entering' | 'idle' | 'exiting';
}

export const createAnimationState = (): AnimationState => ({
  isAnimating: false,
  hasAnimated: false,
  animationPhase: 'idle',
});

/**
 * Performance-optimized animation utilities
 */
export const animationPerformance = {
  /**
   * Request animation frame wrapper for smooth animations
   */
  requestAnimationFrame: (callback: () => void): number => {
    return window.requestAnimationFrame(callback);
  },

  /**
   * Cancel animation frame
   */
  cancelAnimationFrame: (id: number): void => {
    window.cancelAnimationFrame(id);
  },

  /**
   * Throttle animation updates with adaptive timing
   */
  throttleAnimation: (callback: () => void, delay: number = 16): (() => void) => {
    let lastCall = 0;
    let rafId: number | null = null;
    
    return () => {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        
        // Cancel any pending frame if we're calling too frequently
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
        }
        
        rafId = requestAnimationFrame(() => {
          callback();
          rafId = null;
        });
      }
    };
  },

  /**
   * Debounce animation updates for better performance
   */
  debounceAnimation: (callback: () => void, delay: number = 100): (() => void) => {
    let timeoutId: number | null = null;
    
    return () => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
      
      timeoutId = window.setTimeout(() => {
        callback();
        timeoutId = null;
      }, delay);
    };
  },

  /**
   * Batch multiple animation updates into a single frame
   */
  batchAnimations: (callbacks: (() => void)[]): void => {
    requestAnimationFrame(() => {
      callbacks.forEach(callback => callback());
    });
  },

  /**
   * Check if element is in viewport for performance optimization
   */
  isInViewport: (element: Element): boolean => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },

  /**
   * Check if element is near viewport (for preloading animations)
   */
  isNearViewport: (element: Element, margin: number = 100): boolean => {
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    
    return (
      rect.top >= -margin &&
      rect.left >= -margin &&
      rect.bottom <= viewportHeight + margin &&
      rect.right <= viewportWidth + margin
    );
  },

  /**
   * Measure animation performance
   */
  measureAnimationPerformance: (animationCallback: () => void): {
    duration: number;
    frameCount: number;
    averageFrameTime: number;
  } => {
    const startTime = performance.now();
    let frameCount = 0;
    let totalFrameTime = 0;
    
    const originalRaf = window.requestAnimationFrame;
    window.requestAnimationFrame = (callback) => {
      const frameStart = performance.now();
      return originalRaf(() => {
        const frameTime = performance.now() - frameStart;
        totalFrameTime += frameTime;
        frameCount++;
        callback();
      });
    };
    
    animationCallback();
    
    // Restore original RAF
    window.requestAnimationFrame = originalRaf;
    
    const duration = performance.now() - startTime;
    const averageFrameTime = frameCount > 0 ? totalFrameTime / frameCount : 0;
    
    return {
      duration,
      frameCount,
      averageFrameTime,
    };
  },

  /**
   * Optimize animation timing based on device capabilities
   */
  getOptimalAnimationTiming: (baseDelay: number, itemCount: number): number => {
    const hardwareConcurrency = navigator.hardwareConcurrency || 4;
    const deviceMemory = (navigator as { deviceMemory?: number }).deviceMemory || 4;
    
    // Base multiplier on hardware
    let multiplier = 1;
    if (hardwareConcurrency < 4) multiplier *= 1.5;
    if (deviceMemory < 4) multiplier *= 1.3;
    
    // Adjust for large item counts
    if (itemCount > 50) multiplier *= 1.2;
    if (itemCount > 100) multiplier *= 1.4;
    
    return Math.ceil(baseDelay * multiplier);
  },
};