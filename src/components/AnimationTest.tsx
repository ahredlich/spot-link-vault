import React from 'react';
import { useStaggeredAnimation, useStaggeredFadeIn, useStaggeredSlideIn } from '@/hooks/useStaggeredAnimation';
import { animationTimings, defaultAnimationConfig } from '@/lib/animations';

/**
 * Test component to verify staggered animation system
 * This component demonstrates the animation utilities in action
 */
export const AnimationTest: React.FC = () => {
  const testItems = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    title: `Test Item ${i + 1}`,
    description: `This is test item number ${i + 1}`,
  }));

  // Test basic staggered animation
  const basicAnimation = useStaggeredAnimation(testItems.length, {
    type: 'fade-in',
    staggerDelay: 150,
  });

  // Test fade-in animation
  const fadeInAnimation = useStaggeredFadeIn(testItems.length, {
    staggerDelay: 100,
  });

  // Test slide-in animation
  const slideInAnimation = useStaggeredSlideIn(testItems.length, {
    staggerDelay: 120,
    startDelay: 200,
  });

  return (
    <div className="p-8 space-y-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Animation System Test</h1>
        <p className="text-muted-foreground">
          Testing staggered animations with intersection observer
        </p>
      </div>

      {/* Basic Animation Test */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Basic Staggered Animation</h2>
        <div 
          ref={basicAnimation.containerRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {testItems.map((item, index) => (
            <div
              key={item.id}
              {...basicAnimation.getItemProps(index)}
              className={`glass-card p-6 ${basicAnimation.getItemProps(index).className}`}
              style={basicAnimation.getItemProps(index).style}
            >
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
              <div className="mt-4 text-sm text-primary">
                Animation Index: {index}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          Status: {basicAnimation.hasAnimated ? 'Animated' : 'Waiting'} | 
          Should Animate: {basicAnimation.shouldAnimate ? 'Yes' : 'No'}
        </div>
      </section>

      {/* Fade-in Animation Test */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Fade-in Animation</h2>
        <div 
          ref={fadeInAnimation.containerRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {testItems.map((item, index) => (
            <div
              key={item.id}
              {...fadeInAnimation.getItemProps(index)}
              className={`glass-card-enhanced p-6 ${fadeInAnimation.getItemProps(index).className}`}
              style={fadeInAnimation.getItemProps(index).style}
            >
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
              <div className="mt-4 text-sm text-accent">
                Fade-in Index: {index}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Slide-in Animation Test */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Slide-in Animation</h2>
        <div 
          ref={slideInAnimation.containerRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {testItems.map((item, index) => (
            <div
              key={item.id}
              {...slideInAnimation.getItemProps(index)}
              className={`glass-card-secondary p-6 ${slideInAnimation.getItemProps(index).className}`}
              style={slideInAnimation.getItemProps(index).style}
            >
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
              <div className="mt-4 text-sm text-secondary-foreground">
                Slide-in Index: {index}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Animation Configuration Info */}
      <section className="glass-card p-6">
        <h2 className="text-2xl font-semibold mb-4">Animation Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Default Config</h3>
            <pre className="text-sm bg-muted p-3 rounded">
              {JSON.stringify(defaultAnimationConfig, null, 2)}
            </pre>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Animation Timings</h3>
            <div className="space-y-2 text-sm">
              <div>
                Total time for 6 items: {animationTimings.getTotalStaggerTime(6)}ms
              </div>
              <div>
                Optimal delay for 6 items: {animationTimings.getOptimalStaggerDelay(6)}ms
              </div>
              <div>
                Reduced motion: {animationTimings.shouldReduceMotion() ? 'Yes' : 'No'}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AnimationTest;