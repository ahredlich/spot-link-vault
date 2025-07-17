#!/usr/bin/env node
/**
 * Quick check to verify the dev server is running and responsive
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function checkServer() {
  console.log('🔍 Checking SpotLink Vault Development Server');
  console.log('=============================================\n');
  
  try {
    // Check if port 8080 is listening
    const { stdout } = await execAsync('lsof -i :8080 | grep LISTEN');
    if (stdout.trim()) {
      console.log('✅ Development server is running on port 8080');
      console.log('📍 Server details:');
      console.log(stdout.trim());
    } else {
      console.log('❌ No server detected on port 8080');
    }
  } catch (error) {
    console.log('❌ Error checking server status:', error.message);
  }
  
  try {
    // Try to fetch the homepage
    const { stdout } = await execAsync('curl -s -o /dev/null -w "%{http_code}" http://localhost:8080');
    const httpCode = stdout.trim();
    
    if (httpCode === '200') {
      console.log('✅ Server is responding with HTTP 200');
      console.log('🌐 Application is accessible at http://localhost:8080');
    } else {
      console.log(`⚠️  Server responding with HTTP ${httpCode}`);
    }
  } catch (error) {
    console.log('❌ Error checking server response:', error.message);
  }
  
  console.log('\n📋 Manual Testing Checklist:');
  console.log('1. Open http://localhost:8080 in your browser');
  console.log('2. Look for the ⚡ lightning bolt icon in the header (development mode)');
  console.log('3. Click the ⚡ icon to enable performance monitoring');
  console.log('4. Switch between grid and list views to test hover animations');
  console.log('5. Hover over multiple bookmark cards to test smoothness');
  console.log('6. Check the performance metrics display for frame times');
  console.log('7. Click "Test Performance" to run the built-in performance tests');
  console.log('8. Open browser DevTools > Performance tab to record interactions');
  
  console.log('\n🔍 What to Look For:');
  console.log('• Smooth hover animations without choppiness');
  console.log('• No "reloading" or flickering of bookmark content');
  console.log('• Consistent animation timing across multiple cards');
  console.log('• Performance metrics showing <16.67ms frame times');
  console.log('• GPU layer usage visible in DevTools Layers tab');
  console.log('• No layout thrashing during scroll or hover');
}

checkServer().catch(console.error);