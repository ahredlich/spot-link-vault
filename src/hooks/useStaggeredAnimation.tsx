import { useCallback, useEffect, useState, useRef, useMemo } from 'react';
import { useIntersectionObserver, useAnimationPerformance } from './useIntersectionObserver';
import { 
  AnimationType, 
  StaggeredAnimationOptions, 
  generateStaggeredAnimation, 
  getStaggeredAnimationClasses,
  animationTimings,
  defaultAnimationConfig
} from '@/lib/animations';

export interface UseStaggeredAnimationOptions extends StaggeredAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  disabled?: boolean;
  batchSize?: number;
  maxConcurrent?: number;
}

export interface StaggeredAnimationResult {
  containerRef: React.RefObject<HTMLDivElement>;
  getItemProps: (index: number) => {
    className: string;
    style: React.CSSProperties;
    'data-animation-index': number;
  };
  isVisible: boolean;
  hasAnimated: boolean;
  shouldAnimate: boolean;
  performance: {
    animationBatchCount: number;
    totalAnimationTime: number;
    averageFrameTime: number;
  };
}

/**
 * Performance-optimized hook for managing staggered animations
 * Features:
 * - Batched animation updates using requestAnimationFrame
 * - Optimized intersection observer with adaptive thresholds
 * - Memory-efficient state management for large item counts
 * - Performance monitoring and adaptive throttling
 * - Reduced re-renders through memoization
 */
export const useStaggeredAnimation = (
  itemCount: number,
  options: UseStaggeredAnimationOptions = { type: 'fade-in' }
): StaggeredAnimationResult => {
  const {
    type = 'fade-in',
    duration = defaultAnimationConfig.duration.normal,
    easing = defaultAnimationConfig.easing.smooth,
    staggerDelay,
    startDelay = 0,
    threshold = 0.1,
    rootMargin = '50px',
    triggerOnce = true,
    disabled = false,
    batchSize,
    maxConcurrent = 20,
  } = options;

  // Performance monitoring refs
  const animationBatchCount = useRef(0);
  const frameTimeHistory = useRef<number[]>([]);
  const lastFrameTime = useRef<number>(0);
  const animationStartTime = useRef<number>(0);
  const pendingAnimations = useRef<Set<number>>(new Set());
  const animationQueue = useRef<number[]>([]);
  const rafId = useRef<number | null>(null);

  // Use performance hook to check if animations should be enabled
  const { 
    shouldAnimate: performanceShouldAnimate, 
    getOptimalBatchSize, 
    getOptimalStaggerDelay: getPerformanceOptimalStaggerDelay 
  } = useAnimationPerformance();
  
  // Adaptive threshold based on item count for better performance
  const adaptiveThreshold = useMemo(() => {
    if (itemCount > 50) return 0.05; // Lower threshold for large lists
    if (itemCount > 20) return 0.08;
    return threshold;
  }, [itemCount, threshold]);

  // Use intersection observer to trigger animations when visible
  const [containerRef, { isIntersecting, hasIntersected }] = useIntersectionObserver({
    threshold: adaptiveThreshold,
    rootMargin,
    triggerOnce,
    skip: disabled,
  });

  // Calculate optimal stagger delay if not provided, using performance-aware calculation
  const calculatedStaggerDelay = useMemo(() => {
    if (staggerDelay) return staggerDelay;
    
    // Use performance-aware calculation that considers device capabilities
    const performanceDelay = getPerformanceOptimalStaggerDelay(itemCount);
    const fallbackDelay = animationTimings.getOptimalStaggerDelay(itemCount);
    
    return Math.max(performanceDelay, fallbackDelay);
  }, [staggerDelay, itemCount, getPerformanceOptimalStaggerDelay]);

  // Track which items should be visible - use Map for better performance with large counts
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const visibleItemsRef = useRef<Set<number>>(new Set());

  // Determine if animations should run
  const shouldAnimate = !disabled && performanceShouldAnimate && hasIntersected;

  // Use performance-aware batch size if not provided
  const effectiveBatchSize = useMemo(() => {
    return batchSize ?? getOptimalBatchSize();
  }, [batchSize, getOptimalBatchSize]);

  // Memoize animation configuration to prevent unnecessary recalculations
  const animationConfig = useMemo(() => ({
    type,
    duration,
    easing,
    staggerDelay: calculatedStaggerDelay,
    startDelay,
  }), [type, duration, easing, calculatedStaggerDelay, startDelay]);

  // Performance monitoring function
  const recordFrameTime = useCallback(() => {
    const currentTime = performance.now();
    if (lastFrameTime.current > 0) {
      const frameTime = currentTime - lastFrameTime.current;
      frameTimeHistory.current.push(frameTime);
      
      // Keep only last 10 frame times for rolling average
      if (frameTimeHistory.current.length > 10) {
        frameTimeHistory.current.shift();
      }
    }
    lastFrameTime.current = currentTime;
  }, []);

  // Batched animation processor using requestAnimationFrame
  const processBatchedAnimations = useCallback(() => {
    recordFrameTime();
    
    if (animationQueue.current.length === 0) {
      rafId.current = null;
      return;
    }

    // Process items in batches to prevent frame drops
    const batch = animationQueue.current.splice(0, effectiveBatchSize);
    animationBatchCount.current += 1;

    // Check if any items are actually new to avoid unnecessary updates
    const newItems: number[] = [];
    batch.forEach(index => {
      if (!visibleItemsRef.current.has(index)) {
        newItems.push(index);
        visibleItemsRef.current.add(index);
      }
      pendingAnimations.current.delete(index);
    });

    // Only update state if there are actually new items
    if (newItems.length > 0) {
      setVisibleItems(prev => {
        const newSet = new Set(prev);
        newItems.forEach(index => newSet.add(index));
        return newSet;
      });
    }

    // Continue processing if there are more items
    if (animationQueue.current.length > 0) {
      rafId.current = requestAnimationFrame(processBatchedAnimations);
    } else {
      rafId.current = null;
    }
  }, [effectiveBatchSize, recordFrameTime]);

  // Optimized staggered animation with batching
  useEffect(() => {
    if (!shouldAnimate) {
      // If animations are disabled, show all items immediately
      const allItems = new Set(Array.from({ length: itemCount }, (_, i) => i));
      setVisibleItems(allItems);
      visibleItemsRef.current = allItems;
      return;
    }

    if (!hasIntersected) return;

    // Reset state
    setVisibleItems(new Set());
    visibleItemsRef.current = new Set();
    animationBatchCount.current = 0;
    frameTimeHistory.current = [];
    pendingAnimations.current.clear();
    animationQueue.current = [];
    animationStartTime.current = performance.now();

    // Cancel any pending animations
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }

    // Limit concurrent animations for better performance
    const maxItems = Math.min(itemCount, maxConcurrent);
    
    // Schedule animations with optimized timing
    let currentIndex = 0;
    const scheduleNextBatch = () => {
      const batchEnd = Math.min(currentIndex + effectiveBatchSize, maxItems);
      const batchItems: number[] = [];
      
      for (let i = currentIndex; i < batchEnd; i++) {
        batchItems.push(i);
        pendingAnimations.current.add(i);
      }
      
      animationQueue.current.push(...batchItems);
      currentIndex = batchEnd;

      // Start processing if not already running
      if (!rafId.current) {
        rafId.current = requestAnimationFrame(processBatchedAnimations);
      }

      // Schedule next batch if there are more items
      if (currentIndex < maxItems) {
        setTimeout(scheduleNextBatch, calculatedStaggerDelay);
      }
    };

    // Start the staggered animation with initial delay
    const timeoutId = setTimeout(scheduleNextBatch, startDelay);

    return () => {
      clearTimeout(timeoutId);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
      pendingAnimations.current.clear();
      animationQueue.current = [];
    };
  }, [
    shouldAnimate,
    hasIntersected,
    itemCount,
    maxConcurrent
  ]);

  // Stable references for common styles to prevent unnecessary re-renders
  const emptyStyle = useMemo(() => ({}), []);
  const hiddenStyle = useMemo(() => ({ opacity: 0 }), []);
  const disabledProps = useMemo(() => ({
    className: '',
    style: emptyStyle,
  }), [emptyStyle]);

  // Memoized style cache for visible items to prevent recalculation
  const visibleStylesCache = useRef<Map<number, React.CSSProperties>>(new Map());
  const visibleClassesCache = useRef<Map<number, string>>(new Map());

  // Clear caches only when essential properties change
  useEffect(() => {
    visibleStylesCache.current.clear();
    visibleClassesCache.current.clear();
  }, [type, itemCount]);

  // Cleanup function to clear caches on unmount
  useEffect(() => {
    return () => {
      visibleStylesCache.current.clear();
      visibleClassesCache.current.clear();
    };
  }, []);

  // Optimized visibility check to reduce dependency sensitivity
  const isItemVisible = useCallback((index: number) => {
    return visibleItemsRef.current.has(index);
  }, []);

  // Memoized item props generator with optimized caching
  const getItemProps = useCallback((index: number) => {
    const itemVisible = isItemVisible(index);
    
    if (!shouldAnimate) {
      // Return stable reference for disabled animations
      return {
        ...disabledProps,
        'data-animation-index': index,
      };
    }

    if (!itemVisible) {
      // Return stable reference for hidden items
      return {
        className: '',
        style: hiddenStyle,
        'data-animation-index': index,
      };
    }

    // Use cached styles and classes for visible items
    let animationStyle = visibleStylesCache.current.get(index);
    if (!animationStyle) {
      animationStyle = generateStaggeredAnimation(index, animationConfig);
      visibleStylesCache.current.set(index, animationStyle);
    }

    let animationClasses = visibleClassesCache.current.get(index);
    if (!animationClasses) {
      animationClasses = getStaggeredAnimationClasses(index, type);
      visibleClassesCache.current.set(index, animationClasses);
    }

    return {
      className: animationClasses,
      style: animationStyle,
      'data-animation-index': index,
    };
  }, [isItemVisible, shouldAnimate, disabledProps, hiddenStyle, animationConfig, type]);

  // Performance metrics with stable reference
  const performanceMetrics = useMemo(() => {
    const totalTime = animationStartTime.current > 0 
      ? performance.now() - animationStartTime.current 
      : 0;
    
    const averageFrameTime = frameTimeHistory.current.length > 0
      ? frameTimeHistory.current.reduce((a, b) => a + b, 0) / frameTimeHistory.current.length
      : 0;

    return {
      animationBatchCount: animationBatchCount.current,
      totalAnimationTime: totalTime,
      averageFrameTime,
    };
  }, [visibleItems.size]); // Only recalculate when visible items count changes

  return {
    containerRef,
    getItemProps,
    isVisible: isIntersecting,
    hasAnimated: hasIntersected,
    shouldAnimate,
    performance: performanceMetrics,
  };
};

/**
 * Simplified hook for basic staggered fade-in animations
 */
export const useStaggeredFadeIn = (
  itemCount: number,
  options: Omit<UseStaggeredAnimationOptions, 'type'> = {}
) => {
  return useStaggeredAnimation(itemCount, {
    ...options,
    type: 'fade-in',
  });
};

/**
 * Simplified hook for staggered slide-in animations
 */
export const useStaggeredSlideIn = (
  itemCount: number,
  options: Omit<UseStaggeredAnimationOptions, 'type'> = {}
) => {
  return useStaggeredAnimation(itemCount, {
    ...options,
    type: 'slide-in',
  });
};

/**
 * Hook for managing individual item animations within a staggered container
 */
export const useItemAnimation = (
  index: number,
  isVisible: boolean,
  animationType: AnimationType = 'fade-in'
) => {
  const [hasAnimated, setHasAnimated] = useState(false);
  const { shouldAnimate } = useAnimationPerformance();

  useEffect(() => {
    if (isVisible && !hasAnimated && shouldAnimate) {
      setHasAnimated(true);
    }
  }, [isVisible, hasAnimated, shouldAnimate]);

  const animationClasses = shouldAnimate && hasAnimated 
    ? getStaggeredAnimationClasses(index, animationType)
    : '';

  return {
    className: animationClasses,
    hasAnimated,
    shouldAnimate,
  };
};