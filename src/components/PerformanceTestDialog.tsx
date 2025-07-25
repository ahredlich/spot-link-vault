import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Clock, Zap, Monitor, Cpu } from 'lucide-react';

interface PerformanceTest {
  id: string;
  name: string;
  description: string;
  test: () => Promise<{ passed: boolean; duration: number; details: string }>;
  status: 'pending' | 'running' | 'passed' | 'failed';
  duration?: number;
  details?: string;
}

interface PerformanceTestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PerformanceTestDialog: React.FC<PerformanceTestDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [tests, setTests] = useState<PerformanceTest[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  // Initialize tests
  useEffect(() => {
    const performanceTests: PerformanceTest[] = [
      {
        id: 'css-animations',
        name: 'CSS Animation Performance',
        description: 'Test CSS keyframe animations with GPU acceleration',
        test: async () => {
          const startTime = performance.now();
          
          // Create test element with animations
          const testElement = document.createElement('div');
          testElement.style.cssText = `
            position: fixed;
            top: -100px;
            left: -100px;
            width: 100px;
            height: 100px;
            background: linear-gradient(45deg, #ff0000, #00ff00);
            transform: translateZ(0);
            animation: testAnimation 100ms ease-in-out;
          `;
          
          document.body.appendChild(testElement);
          
          // Wait for animation to complete
          await new Promise(resolve => setTimeout(resolve, 150));
          
          const endTime = performance.now();
          document.body.removeChild(testElement);
          
          const duration = endTime - startTime;
          const passed = duration < 200; // Should complete within 200ms
          
          return {
            passed,
            duration,
            details: `Animation completed in ${duration.toFixed(2)}ms`
          };
        },
        status: 'pending'
      },
      {
        id: 'staggered-animation',
        name: 'Staggered Animation System',
        description: 'Test staggered animation performance with multiple elements',
        test: async () => {
          const startTime = performance.now();
          const elementCount = 20;
          const elements: HTMLElement[] = [];
          
          // Create multiple elements with staggered animations
          for (let i = 0; i < elementCount; i++) {
            const element = document.createElement('div');
            element.style.cssText = `
              position: fixed;
              top: -100px;
              left: -100px;
              width: 50px;
              height: 50px;
              background: hsl(${i * 18}, 70%, 50%);
              transform: translateZ(0);
              animation: testFadeIn 200ms ease-in-out ${i * 50}ms forwards;
              opacity: 0;
            `;
            
            document.body.appendChild(element);
            elements.push(element);
          }
          
          // Wait for all animations to complete
          await new Promise(resolve => setTimeout(resolve, 200 + (elementCount * 50) + 100));
          
          const endTime = performance.now();
          
          // Cleanup
          elements.forEach(element => {
            if (element.parentNode) {
              element.parentNode.removeChild(element);
            }
          });
          
          const duration = endTime - startTime;
          const passed = duration < 2000; // Should complete within 2 seconds
          
          return {
            passed,
            duration,
            details: `${elementCount} staggered animations completed in ${duration.toFixed(2)}ms`
          };
        },
        status: 'pending'
      },
      {
        id: 'gpu-acceleration',
        name: 'GPU Acceleration',
        description: 'Test GPU-accelerated transforms and effects',
        test: async () => {
          const startTime = performance.now();
          
          // Test GPU acceleration with 3D transforms
          const testElement = document.createElement('div');
          testElement.style.cssText = `
            position: fixed;
            top: -100px;
            left: -100px;
            width: 100px;
            height: 100px;
            background: linear-gradient(45deg, #ff0000, #00ff00);
            transform: translate3d(0, 0, 0) scale(1);
            transition: transform 100ms ease-in-out;
            backface-visibility: hidden;
            will-change: transform;
          `;
          
          document.body.appendChild(testElement);
          
          // Trigger GPU-accelerated transform
          await new Promise(resolve => {
            requestAnimationFrame(() => {
              testElement.style.transform = 'translate3d(100px, 100px, 0) scale(1.5)';
              setTimeout(resolve, 150);
            });
          });
          
          const endTime = performance.now();
          document.body.removeChild(testElement);
          
          const duration = endTime - startTime;
          const passed = duration < 200;
          
          return {
            passed,
            duration,
            details: `GPU transform completed in ${duration.toFixed(2)}ms`
          };
        },
        status: 'pending'
      },
      {
        id: 'containment-optimization',
        name: 'CSS Containment',
        description: 'Test CSS containment properties for layout optimization',
        test: async () => {
          const startTime = performance.now();
          
          // Create container with containment
          const container = document.createElement('div');
          container.style.cssText = `
            position: fixed;
            top: -200px;
            left: -200px;
            width: 200px;
            height: 200px;
            contain: layout style paint;
            overflow: hidden;
          `;
          
          document.body.appendChild(container);
          
          // Add multiple child elements
          for (let i = 0; i < 50; i++) {
            const child = document.createElement('div');
            child.style.cssText = `
              width: 20px;
              height: 20px;
              background: hsl(${i * 7}, 70%, 50%);
              display: inline-block;
              margin: 2px;
              transform: translateZ(0);
            `;
            container.appendChild(child);
          }
          
          // Force layout recalculation
          void container.offsetHeight;
          
          const endTime = performance.now();
          document.body.removeChild(container);
          
          const duration = endTime - startTime;
          const passed = duration < 50; // Should be very fast due to containment
          
          return {
            passed,
            duration,
            details: `Layout with containment completed in ${duration.toFixed(2)}ms`
          };
        },
        status: 'pending'
      },
      {
        id: 'glass-morphism',
        name: 'Glassmorphism Effects',
        description: 'Test backdrop-blur and glass effect performance',
        test: async () => {
          const startTime = performance.now();
          
          // Create glass effect element
          const glassElement = document.createElement('div');
          glassElement.style.cssText = `
            position: fixed;
            top: -100px;
            left: -100px;
            width: 200px;
            height: 200px;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 16px;
            transform: translateZ(0);
            transition: all 200ms ease-in-out;
          `;
          
          document.body.appendChild(glassElement);
          
          // Force repaint
          void glassElement.offsetHeight;
          
          // Test hover effect
          glassElement.style.transform = 'translateZ(0) scale(1.1)';
          glassElement.style.background = 'rgba(255, 255, 255, 0.2)';
          
          await new Promise(resolve => setTimeout(resolve, 250));
          
          const endTime = performance.now();
          document.body.removeChild(glassElement);
          
          const duration = endTime - startTime;
          const passed = duration < 300;
          
          return {
            passed,
            duration,
            details: `Glass effect rendered in ${duration.toFixed(2)}ms`
          };
        },
        status: 'pending'
      }
    ];
    
    setTests(performanceTests);
  }, []);

  const runTests = async () => {
    setIsRunning(true);
    setProgress(0);
    
    // Add required CSS keyframes for tests
    const style = document.createElement('style');
    style.textContent = `
      @keyframes testAnimation {
        0% { transform: translateY(0) translateZ(0); opacity: 0; }
        100% { transform: translateY(10px) translateZ(0); opacity: 1; }
      }
      @keyframes testFadeIn {
        0% { opacity: 0; transform: translateY(10px) translateZ(0); }
        100% { opacity: 1; transform: translateY(0) translateZ(0); }
      }
    `;
    document.head.appendChild(style);
    
    try {
      for (let i = 0; i < tests.length; i++) {
        const test = tests[i];
        
        setTests(prev => prev.map(t => 
          t.id === test.id ? { ...t, status: 'running' } : t
        ));
        
        try {
          const result = await test.test();
          
          setTests(prev => prev.map(t => 
            t.id === test.id ? { 
              ...t, 
              status: result.passed ? 'passed' : 'failed',
              duration: result.duration,
              details: result.details
            } : t
          ));
        } catch (error) {
          setTests(prev => prev.map(t => 
            t.id === test.id ? { 
              ...t, 
              status: 'failed',
              details: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
            } : t
          ));
        }
        
        setProgress(((i + 1) / tests.length) * 100);
        
        // Small delay between tests
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } finally {
      document.head.removeChild(style);
      setIsRunning(false);
    }
  };

  const resetTests = () => {
    setTests(prev => prev.map(test => ({ 
      ...test, 
      status: 'pending' as const,
      duration: undefined,
      details: undefined
    })));
    setProgress(0);
  };

  const getStatusIcon = (status: PerformanceTest['status']) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'running':
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <Monitor className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: PerformanceTest['status']) => {
    switch (status) {
      case 'passed':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Passed</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'running':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Running...</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  const passedTests = tests.filter(t => t.status === 'passed').length;
  const failedTests = tests.filter(t => t.status === 'failed').length;
  const totalTests = tests.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card-enhanced max-w-2xl max-h-[80vh] scrollbar-dialog">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Performance Test Suite
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[calc(80vh-6rem)]" scrollbarVariant="dialog">
          <div className="space-y-4">
          <div className="glass-card p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="text-sm">
                  <span className="font-medium">Status:</span> {passedTests}/{totalTests} tests passed
                </div>
                {failedTests > 0 && (
                  <div className="text-sm text-red-600">
                    {failedTests} failed
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetTests}
                  disabled={isRunning}
                >
                  Reset
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={runTests}
                  disabled={isRunning}
                  className="gap-2"
                >
                  <Cpu className="h-4 w-4" />
                  {isRunning ? 'Running Tests...' : 'Run Tests'}
                </Button>
              </div>
            </div>
            
            {isRunning && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
          </div>

          <div className="space-y-3">
            {tests.map((test) => (
              <Card key={test.id} className="glass-card p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getStatusIcon(test.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-sm">{test.name}</h3>
                      {getStatusBadge(test.status)}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {test.description}
                    </p>
                    {test.duration !== undefined && (
                      <div className="text-xs text-muted-foreground">
                        Duration: {test.duration.toFixed(2)}ms
                      </div>
                    )}
                    {test.details && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {test.details}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};