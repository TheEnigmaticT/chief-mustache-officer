
import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from 'fs';

// Custom plugin to initialize logging
const loggerPlugin = (): Plugin => {
  return {
    name: 'vite-plugin-logger',
    configureServer(server) {
      // Ensure logs directory exists
      const logsDir = path.resolve('./logs');
      if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
      }

      // Log server startup
      const timestamp = new Date().toISOString();
      const startupLogFile = path.join(logsDir, `vite_server_${timestamp.replace(/:/g, '-')}.log`);
      
      // Log server events
      server.httpServer?.on('listening', () => {
        fs.appendFileSync(startupLogFile, 
          `[${new Date().toISOString()}] Server started on port ${server.config.server.port}\n`);
      });

      // Log requests
      server.middlewares.use((req, res, next) => {
        const start = Date.now();
        res.on('finish', () => {
          const duration = Date.now() - start;
          fs.appendFileSync(startupLogFile, 
            `[${new Date().toISOString()}] ${req.method} ${req.url} ${res.statusCode} ${duration}ms\n`);
        });
        next();
      });
    }
  };
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // Add detailed logging
    hmr: {
      logger: {
        info: (msg) => {
          console.info(`[HMR] ${msg}`);
        },
        warn: (msg) => {
          console.warn(`[HMR] ${msg}`); 
        },
        error: (msg) => {
          console.error(`[HMR] ${msg}`);
        }
      }
    },
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    loggerPlugin(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Generate source maps for better error tracking
    sourcemap: true,
  },
}));
