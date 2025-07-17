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
   * Throttle animation updates
   */
  throttleAnimation: (callback: () => void, delay: number = 16): (() => void) => {
    let lastCall = 0;
    return () => {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        callback();
      }
    };
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
};