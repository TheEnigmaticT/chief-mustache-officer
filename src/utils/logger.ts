
import fs from 'fs';
import path from 'path';

// Create logs directory if it doesn't exist
const logsDir = path.resolve('./logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Get current timestamp formatted as YYYY-MM-DD_HH-MM-SS
const getTimestamp = () => {
  const now = new Date();
  return now.toISOString()
    .replace(/T/, '_')
    .replace(/\..+/, '')
    .replace(/:/g, '-');
};

// Create a new log file for this session
const currentLogFile = path.join(logsDir, `vite_${getTimestamp()}.log`);

// Write initial log header
fs.writeFileSync(currentLogFile, `=== Log started at ${new Date().toISOString()} ===\n\n`);

// Logger function to write to file
const writeToLogFile = (data: string) => {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${data}\n`;
  
  fs.appendFileSync(currentLogFile, logEntry);
};

// Override console methods to also write to file
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
const originalConsoleInfo = console.info;

// Replace console methods to also log to file
console.log = function(...args) {
  originalConsoleLog.apply(console, args);
  writeToLogFile(`[LOG] ${args.map(arg => 
    typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ')}`);
};

console.error = function(...args) {
  originalConsoleError.apply(console, args);
  writeToLogFile(`[ERROR] ${args.map(arg => 
    typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ')}`);
};

console.warn = function(...args) {
  originalConsoleWarn.apply(console, args);
  writeToLogFile(`[WARN] ${args.map(arg => 
    typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ')}`);
};

console.info = function(...args) {
  originalConsoleInfo.apply(console, args);
  writeToLogFile(`[INFO] ${args.map(arg => 
    typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ')}`);
};

export default {
  log: console.log,
  error: console.error,
  warn: console.warn,
  info: console.info,
  getLogFilePath: () => currentLogFile
};
