import { useEffect, useRef, useState, useCallback } from 'react';

export interface IntersectionObserverOptions {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
  skip?: boolean;
}

export interface IntersectionObserverResult {
  isIntersecting: boolean;
  hasIntersected: boolean;
  entry: IntersectionObserverEntry | null;
}

/**
 * Custom hook for intersection observer with performance optimizations
 * Used for triggering animations when elements come into view
 */
export const useIntersectionObserver = (
  options: IntersectionObserverOptions = {}
): [React.RefObject<HTMLDivElement>, IntersectionObserverResult] => {
  const {
    threshold = 0.1,
    rootMargin = '50px',
    triggerOnce = true,
    skip = false,
  } = options;

  const elementRef = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

  const observerCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      setEntry(entry);
      setIsIntersecting(entry.isIntersecting);

      if (entry.isIntersecting && !hasIntersected) {
        setHasIntersected(true);
      }
    },
    [hasIntersected]
  );

  useEffect(() => {
    const element = elementRef.current;
    if (!element || skip) return;

    // Skip if already intersected and triggerOnce is true
    if (hasIntersected && triggerOnce) return;

    const observer = new IntersectionObserver(observerCallback, {
      threshold,
      rootMargin,
    });

    observer.observe(element);

    return () => {
      observer.unobserve(element);
      observer.disconnect();
    };
  }, [observerCallback, threshold, rootMargin, triggerOnce, hasIntersected, skip]);

  return [
    elementRef,
    {
      isIntersecting,
      hasIntersected,
      entry,
    },
  ];
};

/**
 * Hook for staggered intersection observer
 * Manages multiple elements with staggered animation triggers
 */
export interface StaggeredIntersectionOptions extends IntersectionObserverOptions {
  staggerDelay?: number;
  maxStaggerItems?: number;
}

export const useStaggeredIntersectionObserver = (
  itemCount: number,
  options: StaggeredIntersectionOptions = {}
) => {
  const {
    staggerDelay = 100,
    maxStaggerItems = 10,
    ...intersectionOptions
  } = options;

  const [containerRef, containerResult] = useIntersectionObserver(intersectionOptions);
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!containerResult.hasIntersected) return;

    // Stagger the appearance of items
    const maxItems = Math.min(itemCount, maxStaggerItems);
    let currentIndex = 0;

    const showNextItem = () => {
      if (currentIndex < maxItems) {
        setVisibleItems(prev => new Set([...prev, currentIndex]));
        currentIndex++;
        
        if (currentIndex < maxItems) {
          setTimeout(showNextItem, staggerDelay);
        }
      }
    };

    // Start the staggered animation
    showNextItem();
  }, [containerResult.hasIntersected, itemCount, staggerDelay, maxStaggerItems]);

  const isItemVisible = useCallback((index: number) => {
    return visibleItems.has(index);
  }, [visibleItems]);

  const getItemDelay = useCallback((index: number) => {
    return Math.min(index, maxStaggerItems - 1) * staggerDelay;
  }, [staggerDelay, maxStaggerItems]);

  return {
    containerRef,
    containerResult,
    isItemVisible,
    getItemDelay,
    visibleItemCount: visibleItems.size,
  };
};

/**
 * Hook for performance-optimized animations
 * Includes reduced motion support and performance monitoring
 */
export const useAnimationPerformance = () => {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  const [isHighPerformance, setIsHighPerformance] = useState(true);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShouldReduceMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setShouldReduceMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    // Basic performance detection
    const checkPerformance = () => {
      const start = performance.now();
      requestAnimationFrame(() => {
        const delta = performance.now() - start;
        // If frame time is consistently high, reduce animations
        setIsHighPerformance(delta < 16.67); // 60fps threshold
      });
    };

    checkPerformance();
    const performanceInterval = setInterval(checkPerformance, 5000);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      clearInterval(performanceInterval);
    };
  }, []);

  return {
    shouldReduceMotion,
    isHighPerformance,
    shouldAnimate: !shouldReduceMotion && isHighPerformance,
  };
};