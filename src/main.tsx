
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
// Import logger to initialize console overrides
import './utils/logger';

// Log application startup
console.info('Application starting...');

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Failed to find the root element');
  throw new Error('Failed to find the root element');
}

try {
  createRoot(rootElement).render(<App />);
  console.log('Application successfully rendered');
} catch (error) {
  console.error('Error rendering application:', error);
  throw error;
}
