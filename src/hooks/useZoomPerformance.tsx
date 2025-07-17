import { useEffect, useCallback, useRef } from 'react';

interface ZoomPerformanceOptions {
  threshold?: number; // Performance threshold in ms
  onPerformanceIssue?: () => void;
  disabled?: boolean;
}

/**
 * Hook to monitor and optimize performance during zoom events
 * Detects pinch-to-zoom and scales back animations when performance is poor
 */
export const useZoomPerformance = (options: ZoomPerformanceOptions = {}) => {
  const {
    threshold = 16.67, // 60fps threshold
    onPerformanceIssue,
    disabled = false
  } = options;

  const performanceRef = useRef({
    isZooming: false,
    frameCount: 0,
    totalFrameTime: 0,
    lastFrameTime: 0,
    shouldReduceAnimations: false
  });

  const measurePerformance = useCallback(() => {
    if (disabled) return;

    const now = performance.now();
    const frameTime = now - performanceRef.current.lastFrameTime;
    
    if (performanceRef.current.lastFrameTime > 0) {
      performanceRef.current.totalFrameTime += frameTime;
      performanceRef.current.frameCount++;
      
      // Check average frame time over last 10 frames
      if (performanceRef.current.frameCount >= 10) {
        const avgFrameTime = performanceRef.current.totalFrameTime / performanceRef.current.frameCount;
        
        if (avgFrameTime > threshold) {
          performanceRef.current.shouldReduceAnimations = true;
          onPerformanceIssue?.();
        } else {
          performanceRef.current.shouldReduceAnimations = false;
        }
        
        // Reset counters
        performanceRef.current.frameCount = 0;
        performanceRef.current.totalFrameTime = 0;
      }
    }
    
    performanceRef.current.lastFrameTime = now;
  }, [threshold, onPerformanceIssue, disabled]);

  const handleZoomStart = useCallback(() => {
    if (disabled) return;
    
    performanceRef.current.isZooming = true;
    performanceRef.current.shouldReduceAnimations = true; // Immediately reduce animations during zoom
    
    // Start monitoring performance
    const monitorFrame = () => {
      if (performanceRef.current.isZooming) {
        measurePerformance();
        requestAnimationFrame(monitorFrame);
      }
    };
    
    requestAnimationFrame(monitorFrame);
  }, [measurePerformance, disabled]);

  const handleZoomEnd = useCallback(() => {
    if (disabled) return;
    
    performanceRef.current.isZooming = false;
    
    // Gradually restore animations after zoom ends
    setTimeout(() => {
      if (!performanceRef.current.isZooming) {
        performanceRef.current.shouldReduceAnimations = false;
      }
    }, 500); // Wait 500ms after zoom ends
  }, [disabled]);

  useEffect(() => {
    if (disabled) return;

    let startDistance = 0;
    let isZooming = false;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        startDistance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const currentDistance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        
        // Detect significant zoom change (more than 10 pixels)
        if (Math.abs(currentDistance - startDistance) > 10) {
          if (!isZooming) {
            isZooming = true;
            handleZoomStart();
          }
        }
      }
    };

    const handleTouchEnd = () => {
      if (isZooming) {
        isZooming = false;
        handleZoomEnd();
      }
    };

    // Also listen for wheel events (desktop zoom)
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) { // Ctrl + wheel = zoom
        if (!isZooming) {
          isZooming = true;
          handleZoomStart();
          
          // End zoom detection after a short delay
          setTimeout(() => {
            if (isZooming) {
              isZooming = false;
              handleZoomEnd();
            }
          }, 100);
        }
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
    document.addEventListener('wheel', handleWheel, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('wheel', handleWheel);
    };
  }, [handleZoomStart, handleZoomEnd, disabled]);

  return {
    isZooming: performanceRef.current.isZooming,
    shouldReduceAnimations: performanceRef.current.shouldReduceAnimations,
    avgFrameTime: performanceRef.current.frameCount > 0 
      ? performanceRef.current.totalFrameTime / performanceRef.current.frameCount 
      : 0
  };
};