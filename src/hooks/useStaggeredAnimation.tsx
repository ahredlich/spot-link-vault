import { useCallback, useEffect, useState } from 'react';
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
}

/**
 * Hook for managing staggered animations with intersection observer
 * Provides performance-optimized staggered animations for card appearances
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
  } = options;

  // Use performance hook to check if animations should be enabled
  const { shouldAnimate: performanceShouldAnimate } = useAnimationPerformance();
  
  // Use intersection observer to trigger animations when visible
  const [containerRef, { isIntersecting, hasIntersected }] = useIntersectionObserver({
    threshold,
    rootMargin,
    triggerOnce,
    skip: disabled,
  });

  // Calculate optimal stagger delay if not provided
  const calculatedStaggerDelay = staggerDelay ?? animationTimings.getOptimalStaggerDelay(itemCount);

  // Track which items should be visible
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());

  // Determine if animations should run
  const shouldAnimate = !disabled && performanceShouldAnimate && hasIntersected;

  // Stagger the appearance of items when container becomes visible
  useEffect(() => {
    if (!shouldAnimate) {
      // If animations are disabled, show all items immediately
      setVisibleItems(new Set(Array.from({ length: itemCount }, (_, i) => i)));
      return;
    }

    if (!hasIntersected) return;

    // Clear existing items
    setVisibleItems(new Set());

    // Stagger the appearance of items
    let currentIndex = 0;
    const showNextItem = () => {
      if (currentIndex < itemCount) {
        setVisibleItems(prev => new Set([...prev, currentIndex]));
        currentIndex++;
        
        if (currentIndex < itemCount) {
          setTimeout(showNextItem, calculatedStaggerDelay);
        }
      }
    };

    // Start the staggered animation with initial delay
    const timeoutId = setTimeout(showNextItem, startDelay);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [shouldAnimate, hasIntersected, itemCount, calculatedStaggerDelay, startDelay]);

  // Function to get props for individual items
  const getItemProps = useCallback((index: number) => {
    const isItemVisible = visibleItems.has(index);
    
    if (!shouldAnimate) {
      // If animations are disabled, return minimal props
      return {
        className: '',
        style: {},
        'data-animation-index': index,
      };
    }

    // Generate animation styles
    const animationStyle = generateStaggeredAnimation(index, {
      type,
      duration,
      easing,
      staggerDelay: calculatedStaggerDelay,
      startDelay,
    });

    // Generate CSS classes
    const animationClasses = getStaggeredAnimationClasses(index, type);

    return {
      className: isItemVisible ? animationClasses : '',
      style: isItemVisible ? animationStyle : { opacity: 0 },
      'data-animation-index': index,
    };
  }, [
    visibleItems,
    shouldAnimate,
    type,
    duration,
    easing,
    calculatedStaggerDelay,
    startDelay,
  ]);

  return {
    containerRef,
    getItemProps,
    isVisible: isIntersecting,
    hasAnimated: hasIntersected,
    shouldAnimate,
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