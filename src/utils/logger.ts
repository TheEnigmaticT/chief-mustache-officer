// Browser compatible logger
// This version doesn't use Node.js fs/path APIs

// Store log entries in memory when running in browser
let inMemoryLogs: string[] = [];
const MAX_LOGS = 1000; // Limit number of logs kept in memory

// Get current timestamp formatted as YYYY-MM-DD_HH-MM-SS
const getTimestamp = () => {
  const now = new Date();
  return now.toISOString();
};

// Initialize log with header
inMemoryLogs.push(`=== Log started at ${new Date().toISOString()} ===\n\n`);

// Logger function to store logs
const writeToLog = (data: string) => {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${data}\n`;
  
  // Add to memory logs
  inMemoryLogs.push(logEntry);
  
  // Keep memory log size in check
  if (inMemoryLogs.length > MAX_LOGS) {
    inMemoryLogs.shift(); // Remove oldest log
  }
};

// Override console methods to also capture logs
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
const originalConsoleInfo = console.info;

// Replace console methods to also log to memory
console.log = function(...args: any[]) {
  originalConsoleLog.apply(console, args);
  writeToLog(`[LOG] ${args.map(arg => 
    typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ')}`);
};

console.error = function(...args: any[]) {
  originalConsoleError.apply(console, args);
  writeToLog(`[ERROR] ${args.map(arg => 
    typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ')}`);
};

console.warn = function(...args: any[]) {
  originalConsoleWarn.apply(console, args);
  writeToLog(`[WARN] ${args.map(arg => 
    typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ')}`);
};

console.info = function(...args: any[]) {
  originalConsoleInfo.apply(console, args);
  writeToLog(`[INFO] ${args.map(arg => 
    typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ')}`);
};

// Helper to get all logs
const getAllLogs = () => {
  return inMemoryLogs.join('');
};

// Helper to download logs as a text file
const downloadLogs = () => {
  const blob = new Blob([inMemoryLogs.join('')], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `vite_${getTimestamp().replace(/:/g, '-')}.log`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export default {
  log: console.log,
  error: console.error,
  warn: console.warn,
  info: console.info,
  getAllLogs,
  downloadLogs
};
