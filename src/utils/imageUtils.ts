// src/utils/imageUtils.ts

// Debug mode to help troubleshoot image loading
const DEBUG = true;

/**
 * Logs debug information if debug mode is enabled
 */
const debugLog = (message: string, ...args: any[]) => {
  if (DEBUG) {
    console.log(`[ImageDebug] ${message}`, ...args);
  }
};

/**
 * Checks if a URL is valid and accessible
 * @param url - URL to check
 */
export const checkImageUrl = (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};

/**
 * Gets the correct image path with multiple fallback options
 * @param path - Original image path
 */
export const getCorrectImagePath = async (path: string): Promise<string> => {
  if (!path) return '/placeholder.svg';
  
  debugLog('Trying path:', path);
  
  // List of possible extensions to try
  const extensions = ['', '.png', '.jpg', '.jpeg', '.webp', '.svg'];
  
  // List of possible base paths
  const basePaths = [
    '', // Original path as-is
    '/',
    '/lovable-uploads/',
    '/public/',
    '/assets/',
    '/images/'
  ];
  
  // Try each combination
  for (const basePath of basePaths) {
    for (const ext of extensions) {
      // Skip if the path already has this extension
      if (ext && path.toLowerCase().endsWith(ext.toLowerCase())) continue;
      
      // Create test path
      const testPath = `${basePath}${path.replace(/^\//, '')}${ext}`;
      
      // Check if this path works
      const exists = await checkImageUrl(testPath);
      if (exists) {
        debugLog('Found working path:', testPath);
        return testPath;
      }
    }
  }
  
  // If all else fails, return placeholder
  debugLog('No working path found, using placeholder');
  return '/placeholder.svg';
};

/**
 * React component for images with robust fallback handling
 */
import React, { useState, useEffect } from 'react';

export const RobustImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  fallbacks?: string[];
  [key: string]: any;
}> = ({ src, alt, className, fallbacks = [], ...props }) => {
  const [imgSrc, setImgSrc] = useState('/placeholder.svg');
  const [isLoading, setIsLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);
  
  useEffect(() => {
    const loadImage = async () => {
      setIsLoading(true);
      
      // Try original source first
      let path = await getCorrectImagePath(src);
      
      // If it failed and we have fallbacks, try those
      if (path === '/placeholder.svg' && fallbacks.length > 0 && attempt < fallbacks.length) {
        path = await getCorrectImagePath(fallbacks[attempt]);
      }
      
      setImgSrc(path);
      setIsLoading(false);
    };
    
    loadImage();
  }, [src, attempt, fallbacks]);
  
  const handleError = () => {
    debugLog('Image error, trying next fallback');
    if (attempt < fallbacks.length) {
      setAttempt(attempt + 1);
    } else {
      setImgSrc('/placeholder.svg');
    }
  };
  
  return (
    <>
      {isLoading && (
        <div className="bg-gray-200 animate-pulse flex items-center justify-center rounded" 
             style={{ width: '100%', height: props.height || '200px' }}>
          <span className="text-gray-500">Loading...</span>
        </div>
      )}
      <img
        src={imgSrc}
        alt={alt}
        className={`${className} ${isLoading ? 'hidden' : ''}`}
        onError={handleError}
        {...props}
      />
    </>
  );
};