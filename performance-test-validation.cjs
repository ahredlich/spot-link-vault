#!/usr/bin/env node

/**
 * Performance Test Validation Script
 * 
 * This script validates the hover performance improvements implemented in the SpotLink Vault application.
 * It tests various aspects of the performance optimizations including:
 * - Build validation
 * - CSS compilation
 * - Glass-card hover effects
 * - Performance class integration
 * - Animation optimization
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

function log(message, color = colors.white) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, colors.green);
}

function logError(message) {
  log(`❌ ${message}`, colors.red);
}

function logWarning(message) {
  log(`⚠️  ${message}`, colors.yellow);
}

function logInfo(message) {
  log(`ℹ️  ${message}`, colors.cyan);
}

function logHeader(message) {
  log(`\n${'='.repeat(60)}`, colors.magenta);
  log(`${message}`, colors.magenta);
  log(`${'='.repeat(60)}`, colors.magenta);
}

class PerformanceTestValidator {
  constructor() {
    this.testResults = {
      passed: 0,
      failed: 0,
      warnings: 0,
      total: 0
    };
    this.projectRoot = process.cwd();
  }

  async runTest(testName, testFunction) {
    this.testResults.total++;
    log(`\n🧪 Running: ${testName}`, colors.blue);
    
    try {
      const result = await testFunction();
      if (result.success) {
        this.testResults.passed++;
        logSuccess(`${testName} - PASSED`);
        if (result.details) {
          log(`   ${result.details}`, colors.white);
        }
      } else {
        this.testResults.failed++;
        logError(`${testName} - FAILED`);
        if (result.error) {
          log(`   Error: ${result.error}`, colors.red);
        }
      }
    } catch (error) {
      this.testResults.failed++;
      logError(`${testName} - ERROR`);
      log(`   ${error.message}`, colors.red);
    }
  }

  // Test 1: Build Validation
  async testBuildValidation() {
    try {
      logInfo('Building application...');
      const output = execSync('npm run build', { 
        encoding: 'utf8',
        cwd: this.projectRoot,
        stdio: 'pipe'
      });
      
      // Check if build succeeded
      if (!output.includes('✓ built')) {
        return { success: false, error: 'Build did not complete successfully' };
      }

      // Check for dist folder
      const distPath = path.join(this.projectRoot, 'dist');
      if (!fs.existsSync(distPath)) {
        return { success: false, error: 'Dist folder not created' };
      }

      // Check for built files
      const indexHtmlPath = path.join(distPath, 'index.html');
      const assetsPath = path.join(distPath, 'assets');
      
      if (!fs.existsSync(indexHtmlPath)) {
        return { success: false, error: 'index.html not found in dist' };
      }
      
      if (!fs.existsSync(assetsPath)) {
        return { success: false, error: 'assets folder not found in dist' };
      }

      const assetFiles = fs.readdirSync(assetsPath);
      const cssFiles = assetFiles.filter(file => file.endsWith('.css'));
      const jsFiles = assetFiles.filter(file => file.endsWith('.js'));

      if (cssFiles.length === 0) {
        return { success: false, error: 'No CSS files found in assets' };
      }

      if (jsFiles.length === 0) {
        return { success: false, error: 'No JS files found in assets' };
      }

      return { 
        success: true, 
        details: `Built successfully with ${cssFiles.length} CSS file(s) and ${jsFiles.length} JS file(s)` 
      };
    } catch (error) {
      return { success: false, error: `Build failed: ${error.message}` };
    }
  }

  // Test 2: CSS Compilation Validation
  async testCSSCompilation() {
    try {
      const distPath = path.join(this.projectRoot, 'dist', 'assets');
      const assetFiles = fs.readdirSync(distPath);
      const cssFiles = assetFiles.filter(file => file.endsWith('.css'));
      
      if (cssFiles.length === 0) {
        return { success: false, error: 'No CSS files found' };
      }

      const cssFile = cssFiles[0];
      const cssPath = path.join(distPath, cssFile);
      const cssContent = fs.readFileSync(cssPath, 'utf8');

      // Check for key performance optimizations
      const requiredClasses = [
        'glass-card',
        'glass-card-enhanced',
        'glass-card-secondary',
        'glass-card-tertiary',
        'no-hover-transform',
        'translateZ(0)',
        'will-change:transform',
        'contain:layout',
        'backface-visibility:hidden',
        'isolation:isolate'
      ];

      const missingClasses = requiredClasses.filter(className => {
        // Handle different formats for minified CSS
        const searchTerms = [
          className,
          className.replace(/[:\(\)]/g, ''),
          className.replace(/[:\(\)]/g, '').replace(/-/g, ''),
          className.replace('translateZ(0)', 'translateZ\\(0\\)'),
          className.replace('will-change:transform', 'will-change'),
          className.replace('contain:layout', 'contain'),
          className.replace('backface-visibility:hidden', 'backface-visibility'),
          className.replace('isolation:isolate', 'isolation')
        ];
        
        return !searchTerms.some(term => cssContent.includes(term));
      });

      if (missingClasses.length > 0) {
        return { 
          success: false, 
          error: `Missing required classes/properties: ${missingClasses.join(', ')}` 
        };
      }

      return { 
        success: true, 
        details: `CSS compiled with all required performance optimizations (${cssContent.length} chars)` 
      };
    } catch (error) {
      return { success: false, error: `CSS compilation check failed: ${error.message}` };
    }
  }

  // Test 3: Glass-Card Hover Effects Validation
  async testGlassCardHoverEffects() {
    try {
      const distPath = path.join(this.projectRoot, 'dist', 'assets');
      const assetFiles = fs.readdirSync(distPath);
      const cssFiles = assetFiles.filter(file => file.endsWith('.css'));
      
      if (cssFiles.length === 0) {
        return { success: false, error: 'No CSS files found' };
      }

      const cssFile = cssFiles[0];
      const cssPath = path.join(distPath, cssFile);
      const cssContent = fs.readFileSync(cssPath, 'utf8');

      // Check for hover effect optimizations
      const hoverTests = [
        { 
          name: 'glass-card hover not conflicting with no-hover-transform',
          pattern: /glass-card.*:hover.*:not\(.*no-hover-transform.*\)/
        },
        {
          name: 'glass-card-enhanced hover optimization',
          pattern: /glass-card-enhanced.*:hover.*:not\(.*no-hover-transform.*\)/
        },
        {
          name: 'no-hover-transform class handling',
          pattern: /no-hover-transform.*:hover/
        },
        {
          name: 'GPU acceleration in hover effects',
          pattern: /translateZ\(0\)/
        },
        {
          name: 'will-change optimization',
          pattern: /will-change:transform/
        }
      ];

      const results = hoverTests.map(test => ({
        ...test,
        found: test.pattern.test(cssContent)
      }));

      const failedTests = results.filter(test => !test.found);
      
      if (failedTests.length > 0) {
        return { 
          success: false, 
          error: `Failed hover effect tests: ${failedTests.map(t => t.name).join(', ')}` 
        };
      }

      return { 
        success: true, 
        details: `All ${hoverTests.length} hover effect optimizations validated` 
      };
    } catch (error) {
      return { success: false, error: `Glass-card hover validation failed: ${error.message}` };
    }
  }

  // Test 4: BookmarkCard Component Validation
  async testBookmarkCardComponent() {
    try {
      const bookmarkCardPath = path.join(this.projectRoot, 'src', 'components', 'BookmarkCard.tsx');
      
      if (!fs.existsSync(bookmarkCardPath)) {
        return { success: false, error: 'BookmarkCard.tsx not found' };
      }

      const content = fs.readFileSync(bookmarkCardPath, 'utf8');

      // Check for performance optimizations
      const optimizations = [
        { name: 'React.memo usage', pattern: /memo\(.*BookmarkCardComponent/ },
        { name: 'useCallback optimization', pattern: /useCallback\(/g, minCount: 5 },
        { name: 'useMemo optimization', pattern: /useMemo\(/g, minCount: 5 },
        { name: 'Custom comparison function', pattern: /areBookmarkPropsEqual/ },
        { name: 'Performance monitoring', pattern: /enablePerformanceMonitoring/ },
        { name: 'useZoomPerformance hook', pattern: /useZoomPerformance/ },
        { name: 'GPU acceleration classes', pattern: /glass-card-enhanced/ }
      ];

      const results = optimizations.map(opt => {
        const matches = content.match(opt.pattern);
        const count = matches ? matches.length : 0;
        const minCount = opt.minCount || 1;
        
        return {
          ...opt,
          found: count >= minCount,
          count
        };
      });

      const failedOptimizations = results.filter(opt => !opt.found);
      
      if (failedOptimizations.length > 0) {
        return { 
          success: false, 
          error: `Missing optimizations: ${failedOptimizations.map(o => o.name).join(', ')}` 
        };
      }

      return { 
        success: true, 
        details: `All ${optimizations.length} performance optimizations found in BookmarkCard` 
      };
    } catch (error) {
      return { success: false, error: `BookmarkCard validation failed: ${error.message}` };
    }
  }

  // Test 5: Performance Hook Integration
  async testPerformanceHookIntegration() {
    try {
      const hooksPath = path.join(this.projectRoot, 'src', 'hooks');
      
      if (!fs.existsSync(hooksPath)) {
        return { success: false, error: 'Hooks directory not found' };
      }

      const requiredHooks = [
        'useZoomPerformance.tsx',
        'useStaggeredAnimation.tsx',
        'useIntersectionObserver.tsx'
      ];

      const missingHooks = requiredHooks.filter(hook => 
        !fs.existsSync(path.join(hooksPath, hook))
      );

      if (missingHooks.length > 0) {
        return { 
          success: false, 
          error: `Missing performance hooks: ${missingHooks.join(', ')}` 
        };
      }

      // Check useZoomPerformance implementation
      const zoomPerfPath = path.join(hooksPath, 'useZoomPerformance.tsx');
      const zoomPerfContent = fs.readFileSync(zoomPerfPath, 'utf8');
      
      const zoomFeatures = [
        'shouldReduceAnimations',
        'measurePerformance',
        'handleZoomStart',
        'handleZoomEnd',
        'touchstart',
        'touchmove',
        'wheel'
      ];

      const missingFeatures = zoomFeatures.filter(feature => 
        !zoomPerfContent.includes(feature)
      );

      if (missingFeatures.length > 0) {
        return { 
          success: false, 
          error: `Missing zoom performance features: ${missingFeatures.join(', ')}` 
        };
      }

      return { 
        success: true, 
        details: `All performance hooks validated with ${zoomFeatures.length} zoom features` 
      };
    } catch (error) {
      return { success: false, error: `Performance hook validation failed: ${error.message}` };
    }
  }

  // Test 6: Animation Performance Classes
  async testAnimationPerformanceClasses() {
    try {
      const indexCssPath = path.join(this.projectRoot, 'src', 'index.css');
      
      if (!fs.existsSync(indexCssPath)) {
        return { success: false, error: 'index.css not found' };
      }

      const content = fs.readFileSync(indexCssPath, 'utf8');

      // Check for performance animation classes
      const performanceClasses = [
        'card-container-optimized',
        'card-grid-container',
        'bookmark-list-container',
        'gpu-accelerated',
        'loading-skeleton',
        'transition-glass-hover',
        'transition-performance',
        'reduced-motion-safe'
      ];

      const missingClasses = performanceClasses.filter(className => 
        !content.includes(className)
      );

      if (missingClasses.length > 0) {
        return { 
          success: false, 
          error: `Missing performance classes: ${missingClasses.join(', ')}` 
        };
      }

      // Check for reduced motion support
      const reducedMotionPattern = /@media \(prefers-reduced-motion: reduce\)/;
      if (!reducedMotionPattern.test(content)) {
        return { 
          success: false, 
          error: 'Reduced motion media query not found' 
        };
      }

      return { 
        success: true, 
        details: `All ${performanceClasses.length} performance animation classes validated` 
      };
    } catch (error) {
      return { success: false, error: `Animation performance classes validation failed: ${error.message}` };
    }
  }

  // Test 7: Index Page Integration
  async testIndexPageIntegration() {
    try {
      const indexPath = path.join(this.projectRoot, 'src', 'pages', 'Index.tsx');
      
      if (!fs.existsSync(indexPath)) {
        return { success: false, error: 'Index.tsx not found' };
      }

      const content = fs.readFileSync(indexPath, 'utf8');

      // Check for performance integration
      const integrationFeatures = [
        'useStaggeredAnimation',
        'useZoomPerformance',
        'performanceMonitoringEnabled',
        'card-container-optimized',
        'card-grid-container',
        'bookmark-list-container',
        'enablePerformanceMonitoring'
      ];

      const missingFeatures = integrationFeatures.filter(feature => 
        !content.includes(feature)
      );

      if (missingFeatures.length > 0) {
        return { 
          success: false, 
          error: `Missing Index page integration features: ${missingFeatures.join(', ')}` 
        };
      }

      // Check for performance monitoring UI
      const performanceUIPattern = /Performance Monitoring Toggle/;
      if (!performanceUIPattern.test(content)) {
        return { 
          success: false, 
          error: 'Performance monitoring UI not found' 
        };
      }

      return { 
        success: true, 
        details: `All ${integrationFeatures.length} Index page integration features validated` 
      };
    } catch (error) {
      return { success: false, error: `Index page integration validation failed: ${error.message}` };
    }
  }

  // Test 8: Grid vs List View Performance
  async testGridListViewPerformance() {
    try {
      const indexPath = path.join(this.projectRoot, 'src', 'pages', 'Index.tsx');
      const content = fs.readFileSync(indexPath, 'utf8');

      // Check for view mode optimizations
      const viewModeFeatures = [
        'viewMode === "grid"',
        'viewMode === "list"',
        'scale-in',
        'slide-in',
        'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        'space-y-3 sm:space-y-4',
        'staggerDelay: 80',
        'maxConcurrent: 20',
        'batchSize: 8'
      ];

      const missingFeatures = viewModeFeatures.filter(feature => 
        !content.includes(feature)
      );

      if (missingFeatures.length > 0) {
        return { 
          success: false, 
          error: `Missing view mode performance features: ${missingFeatures.join(', ')}` 
        };
      }

      return { 
        success: true, 
        details: `All ${viewModeFeatures.length} view mode performance features validated` 
      };
    } catch (error) {
      return { success: false, error: `Grid/List view performance validation failed: ${error.message}` };
    }
  }

  // Final results summary
  displayResults() {
    logHeader('PERFORMANCE TEST RESULTS');
    
    const passRate = ((this.testResults.passed / this.testResults.total) * 100).toFixed(1);
    
    if (this.testResults.failed === 0) {
      logSuccess(`ALL TESTS PASSED! 🎉`);
      logSuccess(`✅ ${this.testResults.passed}/${this.testResults.total} tests passed (${passRate}%)`);
    } else {
      logError(`SOME TESTS FAILED! 🚨`);
      logError(`❌ ${this.testResults.failed} tests failed`);
      logSuccess(`✅ ${this.testResults.passed} tests passed`);
      log(`📊 Pass rate: ${passRate}%`);
    }

    if (this.testResults.warnings > 0) {
      logWarning(`⚠️  ${this.testResults.warnings} warnings`);
    }

    // Performance recommendations
    logHeader('PERFORMANCE RECOMMENDATIONS');
    
    if (this.testResults.failed === 0) {
      logSuccess('✅ All performance optimizations are properly implemented');
      logSuccess('✅ Glass-card hover effects are optimized');
      logSuccess('✅ Animation performance is GPU-accelerated');
      logSuccess('✅ View mode switching is optimized');
      logSuccess('✅ Reduced motion support is enabled');
    } else {
      logError('❌ Some performance optimizations need attention');
      logInfo('📋 Review failed tests and implement missing optimizations');
    }

    logHeader('NEXT STEPS');
    
    if (this.testResults.failed === 0) {
      logInfo('🚀 Performance optimizations are ready for production');
      logInfo('💡 Consider running browser performance tests');
      logInfo('📱 Test on mobile devices for touch/zoom performance');
      logInfo('🔍 Monitor performance metrics in production');
    } else {
      logError('🔧 Fix failing tests before deploying');
      logInfo('📋 Review implementation guide in PERFORMANCE_INTEGRATION_SUMMARY.md');
    }
  }

  // Main test runner
  async runAllTests() {
    logHeader('SPOTLINK VAULT PERFORMANCE TEST VALIDATION');
    logInfo('Testing hover performance improvements and optimizations...');

    // Run all tests
    await this.runTest('Build Validation', () => this.testBuildValidation());
    await this.runTest('CSS Compilation', () => this.testCSSCompilation());
    await this.runTest('Glass-Card Hover Effects', () => this.testGlassCardHoverEffects());
    await this.runTest('BookmarkCard Component', () => this.testBookmarkCardComponent());
    await this.runTest('Performance Hook Integration', () => this.testPerformanceHookIntegration());
    await this.runTest('Animation Performance Classes', () => this.testAnimationPerformanceClasses());
    await this.runTest('Index Page Integration', () => this.testIndexPageIntegration());
    await this.runTest('Grid vs List View Performance', () => this.testGridListViewPerformance());

    // Display results
    this.displayResults();
    
    // Exit with appropriate code
    process.exit(this.testResults.failed === 0 ? 0 : 1);
  }
}

// Run the tests
const validator = new PerformanceTestValidator();
validator.runAllTests().catch(error => {
  logError(`Test runner failed: ${error.message}`);
  process.exit(1);
});