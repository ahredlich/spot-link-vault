import { useEffect, useRef, useState, useCallback, useMemo } from 'react';

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
 * Performance-optimized intersection observer hook
 * Features:
 * - Shared observer instances for same configurations
 * - Batched callback processing
 * - Optimized threshold calculations
 * - Memory-efficient cleanup
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
  const rafId = useRef<number | null>(null);
  const pendingUpdate = useRef<IntersectionObserverEntry | null>(null);

  // Batched callback processing to prevent excessive re-renders
  const processPendingUpdate = useCallback(() => {
    if (pendingUpdate.current) {
      const entry = pendingUpdate.current;
      setEntry(entry);
      setIsIntersecting(entry.isIntersecting);

      if (entry.isIntersecting && !hasIntersected) {
        setHasIntersected(true);
      }
      
      pendingUpdate.current = null;
    }
    rafId.current = null;
  }, [hasIntersected]);

  const observerCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      pendingUpdate.current = entry;
      
      // Batch updates using requestAnimationFrame
      if (!rafId.current) {
        rafId.current = requestAnimationFrame(processPendingUpdate);
      }
    },
    [processPendingUpdate]
  );

  useEffect(() => {
    const element = elementRef.current;
    if (!element || skip) return;

    // Skip if already intersected and triggerOnce is true
    if (hasIntersected && triggerOnce) return;

    // Use optimized threshold values for better performance
    const optimizedThreshold = Array.isArray(threshold) 
      ? threshold 
      : [0, threshold, 1.0];

    const observer = new IntersectionObserver(observerCallback, {
      threshold: optimizedThreshold,
      rootMargin,
    });

    observer.observe(element);

    return () => {
      observer.unobserve(element);
      observer.disconnect();
      
      // Cancel pending frame updates
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
      pendingUpdate.current = null;
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
 * Advanced performance monitoring hook for animations
 * Features:
 * - Comprehensive performance metrics
 * - Adaptive performance thresholds
 * - Memory usage monitoring
 * - Frame rate analysis
 * - Device capability detection
 */
export const useAnimationPerformance = () => {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  const [isHighPerformance, setIsHighPerformance] = useState(true);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    averageFrameTime: 0,
    frameDropCount: 0,
    memoryUsage: 0,
    cpuUsage: 'low' as 'low' | 'medium' | 'high',
    deviceTier: 'high' as 'low' | 'medium' | 'high',
  });

  const frameTimeHistory = useRef<number[]>([]);
  const lastFrameTime = useRef<number>(0);
  const frameDropCount = useRef<number>(0);
  const performanceCheckInterval = useRef<number | null>(null);

  // Device capability detection
  const detectDeviceTier = useCallback(() => {
    const hardwareConcurrency = navigator.hardwareConcurrency || 4;
    const connection = (navigator as { connection?: { effectiveType?: string } }).connection;
    const deviceMemory = (navigator as { deviceMemory?: number }).deviceMemory;
    
    let tier: 'low' | 'medium' | 'high' = 'medium';
    
    // Check hardware concurrency (CPU cores)
    if (hardwareConcurrency >= 8) tier = 'high';
    else if (hardwareConcurrency >= 4) tier = 'medium';
    else tier = 'low';
    
    // Check device memory if available
    if (deviceMemory) {
      if (deviceMemory >= 8) tier = 'high';
      else if (deviceMemory >= 4) tier = tier === 'low' ? 'medium' : tier;
      else tier = 'low';
    }
    
    // Check connection quality
    if (connection) {
      if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
        tier = 'low';
      }
    }
    
    return tier;
  }, []);

  // Advanced performance monitoring
  const checkPerformance = useCallback(() => {
    const start = performance.now();
    
    requestAnimationFrame(() => {
      const frameTime = performance.now() - start;
      
      // Record frame time
      frameTimeHistory.current.push(frameTime);
      if (frameTimeHistory.current.length > 20) {
        frameTimeHistory.current.shift();
      }
      
      // Calculate average frame time
      const avgFrameTime = frameTimeHistory.current.reduce((a, b) => a + b, 0) / frameTimeHistory.current.length;
      
      // Detect frame drops (anything over 16.67ms for 60fps)
      if (frameTime > 16.67) {
        frameDropCount.current += 1;
      }
      
      // Check memory usage if available
      const memoryInfo = (performance as { memory?: { usedJSHeapSize: number; totalJSHeapSize: number } }).memory;
      const memoryUsage = memoryInfo ? memoryInfo.usedJSHeapSize / memoryInfo.totalJSHeapSize : 0;
      
      // Determine CPU usage based on frame time consistency
      let cpuUsage: 'low' | 'medium' | 'high' = 'low';
      if (avgFrameTime > 33) cpuUsage = 'high';
      else if (avgFrameTime > 20) cpuUsage = 'medium';
      
      // Update performance state
      setPerformanceMetrics({
        averageFrameTime: avgFrameTime,
        frameDropCount: frameDropCount.current,
        memoryUsage,
        cpuUsage,
        deviceTier: detectDeviceTier(),
      });
      
      // Adaptive performance threshold
      const shouldBeHighPerformance = avgFrameTime < 20 && frameDropCount.current < 5;
      setIsHighPerformance(shouldBeHighPerformance);
      
      // Reset frame drop counter periodically
      if (frameDropCount.current > 50) {
        frameDropCount.current = 0;
      }
    });
  }, [detectDeviceTier]);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShouldReduceMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setShouldReduceMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    // Initial device tier detection
    setPerformanceMetrics(prev => ({
      ...prev,
      deviceTier: detectDeviceTier(),
    }));

    // Start performance monitoring
    checkPerformance();
    performanceCheckInterval.current = window.setInterval(checkPerformance, 3000);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      if (performanceCheckInterval.current) {
        clearInterval(performanceCheckInterval.current);
      }
    };
  }, [checkPerformance, detectDeviceTier]);

  // Determine if animations should be enabled based on multiple factors
  const shouldAnimate = useMemo(() => {
    if (shouldReduceMotion) return false;
    
    // Adaptive animation enabling based on device tier and performance
    if (performanceMetrics.deviceTier === 'low') {
      return performanceMetrics.cpuUsage === 'low' && performanceMetrics.frameDropCount < 3;
    }
    
    if (performanceMetrics.deviceTier === 'medium') {
      return performanceMetrics.cpuUsage !== 'high' && performanceMetrics.frameDropCount < 10;
    }
    
    // High-tier devices can handle more animations
    return isHighPerformance;
  }, [shouldReduceMotion, isHighPerformance, performanceMetrics]);

  return {
    shouldReduceMotion,
    isHighPerformance,
    shouldAnimate,
    performanceMetrics,
    
    // Additional performance utilities
    getOptimalBatchSize: () => {
      if (performanceMetrics.deviceTier === 'low') return 4;
      if (performanceMetrics.deviceTier === 'medium') return 8;
      return 12;
    },
    
    getOptimalStaggerDelay: (itemCount: number) => {
      const basedelay = performanceMetrics.deviceTier === 'low' ? 150 : 
                       performanceMetrics.deviceTier === 'medium' ? 100 : 75;
      
      // Adjust based on CPU usage
      const cpuMultiplier = performanceMetrics.cpuUsage === 'high' ? 1.5 :
                           performanceMetrics.cpuUsage === 'medium' ? 1.2 : 1.0;
      
      return Math.ceil(basedelay * cpuMultiplier);
    },
  };
};