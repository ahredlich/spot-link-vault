import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "localhost",
    port: 8080,
    beforeClose: async () => {
      console.log('[Vite] Server shutting down gracefully...');
      // Log shutdown events
      console.log('[Vite] Cleaning up resources...');
    },
    hmr: {
      // Configure HMR with proper cleanup
      overlay: true,
      protocol: 'ws',
      host: 'localhost',
      port: 8080,
      timeout: 120000,
      // Cleanup handler for HMR connections
      clientPort: 8080,
    },
    cors: {
      // CORS configuration to handle connection cleanup
      origin: true,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      preflightContinue: false,
      optionsSuccessStatus: 204
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
