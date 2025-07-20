#!/usr/bin/env node

/**
 * Dev Server Process Wrapper for Vite
 * 
 * This script wraps the Vite dev server to ensure proper process management,
 * graceful shutdowns, and port cleanup to prevent "port already in use" errors.
 */

import { spawn, exec } from 'child_process';
import path from 'path';
import process from 'process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const PORT = 8080;
const SHUTDOWN_TIMEOUT = 5000; // 5 seconds
const VITE_COMMAND = 'npx';
const VITE_ARGS = ['vite', '--host', '0.0.0.0', '--port', PORT.toString()];

// Track child processes
let viteProcess = null;
let isShuttingDown = false;
let shutdownTimer = null;

// Logging utilities
const log = (message) => {
  console.log(`[dev-server] ${new Date().toISOString()} - ${message}`);
};

const logError = (message, error = null) => {
  console.error(`[dev-server] ${new Date().toISOString()} - ERROR: ${message}`);
  if (error) {
    console.error(error);
  }
};

/**
 * Kill process using port
 * @param {number} port - Port number to free up
 * @returns {Promise<void>}
 */
const killProcessOnPort = (port) => {
  return new Promise((resolve) => {
    const platform = process.platform;
    let command;

    if (platform === 'win32') {
      // Windows command to find and kill process using the port
      command = `netstat -ano | findstr :${port} | findstr LISTENING`;
    } else {
      // Unix-like systems (macOS, Linux)
      command = `lsof -ti:${port}`;
    }

    exec(command, (error, stdout) => {
      if (error || !stdout.trim()) {
        log(`No process found on port ${port}`);
        resolve();
        return;
      }

      const pids = stdout.trim().split('\n').map(line => {
        if (platform === 'win32') {
          // Extract PID from Windows netstat output
          const parts = line.trim().split(/\s+/);
          return parts[parts.length - 1];
        }
        return line.trim();
      }).filter(pid => pid && !isNaN(pid));

      if (pids.length === 0) {
        resolve();
        return;
      }

      log(`Found process(es) on port ${port}: ${pids.join(', ')}`);

      const killCommand = platform === 'win32' 
        ? `taskkill /F /PID ${pids.join(' /PID ')}`
        : `kill -9 ${pids.join(' ')}`;

      exec(killCommand, (killError) => {
        if (killError) {
          logError(`Failed to kill process on port ${port}`, killError);
        } else {
          log(`Successfully killed process(es) on port ${port}`);
        }
        resolve();
      });
    });
  });
};

/**
 * Start the Vite dev server
 */
const startViteServer = async () => {
  log('Starting Vite dev server...');

  // First, ensure the port is free
  await killProcessOnPort(PORT);

  // Spawn Vite process
  viteProcess = spawn(VITE_COMMAND, VITE_ARGS, {
    stdio: 'inherit',
    shell: true,
    cwd: process.cwd()
  });

  viteProcess.on('error', (error) => {
    logError('Failed to start Vite dev server', error);
    process.exit(1);
  });

  viteProcess.on('exit', (code, signal) => {
    if (!isShuttingDown) {
      log(`Vite process exited unexpectedly with code ${code} and signal ${signal}`);
      process.exit(code || 1);
    }
  });

  log(`Vite dev server process started with PID ${viteProcess.pid}`);
};

/**
 * Gracefully shutdown the server
 * @param {string} signal - The signal that triggered the shutdown
 */
const gracefulShutdown = async (signal) => {
  if (isShuttingDown) {
    log('Shutdown already in progress...');
    return;
  }

  isShuttingDown = true;
  log(`Received ${signal}, starting graceful shutdown...`);

  // Set timeout for force exit
  shutdownTimer = setTimeout(() => {
    logError('Graceful shutdown timeout exceeded, forcing exit...');
    process.exit(1);
  }, SHUTDOWN_TIMEOUT);

  try {
    // Kill Vite process
    if (viteProcess && !viteProcess.killed) {
      log(`Killing Vite process (PID: ${viteProcess.pid})...`);
      
      if (process.platform === 'win32') {
        // On Windows, use taskkill to ensure child processes are also killed
        exec(`taskkill /F /T /PID ${viteProcess.pid}`, (error) => {
          if (error) {
            logError('Failed to kill Vite process tree', error);
          }
        });
      } else {
        // On Unix-like systems, kill the process group
        try {
          process.kill(-viteProcess.pid, 'SIGTERM');
        } catch (error) {
          // If process group kill fails, try regular kill
          viteProcess.kill('SIGTERM');
        }
      }

      // Give the process time to exit gracefully
      await new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (viteProcess.killed) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 100);

        // Force kill after 2 seconds if still running
        setTimeout(() => {
          if (!viteProcess.killed) {
            log('Force killing Vite process...');
            viteProcess.kill('SIGKILL');
          }
          clearInterval(checkInterval);
          resolve();
        }, 2000);
      });
    }

    // Clean up the port
    log(`Cleaning up port ${PORT}...`);
    await killProcessOnPort(PORT);

    log('Graceful shutdown completed');
    clearTimeout(shutdownTimer);
    process.exit(0);
  } catch (error) {
    logError('Error during shutdown', error);
    clearTimeout(shutdownTimer);
    process.exit(1);
  }
};

// Register signal handlers
const signals = ['SIGINT', 'SIGTERM', 'SIGHUP'];
signals.forEach((signal) => {
  process.on(signal, () => gracefulShutdown(signal));
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logError('Uncaught exception', error);
  gracefulShutdown('uncaughtException');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logError('Unhandled rejection at:', promise);
  logError('Reason:', reason);
  gracefulShutdown('unhandledRejection');
});

// Start the server
(async () => {
  try {
    log('Dev server wrapper starting...');
    log(`Working directory: ${process.cwd()}`);
    log(`Node version: ${process.version}`);
    log(`Platform: ${process.platform}`);
    
    await startViteServer();
  } catch (error) {
    logError('Failed to start dev server', error);
    process.exit(1);
  }
})();