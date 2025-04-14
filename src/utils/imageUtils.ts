
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
    
    // Set a timeout to prevent hanging on this check
    const timeout = setTimeout(() => {
      debugLog(`Image load timed out for: ${url}`);
      resolve(false);
    }, 3000);
    
    img.onload = () => {
      clearTimeout(timeout);
      debugLog(`Successfully loaded image: ${url}`);
      resolve(true);
    };
    
    img.onerror = () => {
      clearTimeout(timeout);
      debugLog(`Failed to load image: ${url}`);
      resolve(false);
    };
    
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
  
  // Check if URL already works as-is (either remote or local)
  if (path.startsWith('http')) {
    const exists = await checkImageUrl(path);
    if (exists) {
      return path;
    }
    debugLog('Remote URL failed, trying fallbacks');
  } else {
    // For local paths, check if they already have an extension
    const hasExtension = /\.(png|jpe?g|gif|svg|webp)$/i.test(path);
    
    // If path already has extension, try it directly first
    if (hasExtension) {
      const exists = await checkImageUrl(path);
      if (exists) {
        debugLog('Path works as-is:', path);
        return path;
      }
    }
  }
  
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
      
      // Strip leading slash from path if basePath has a trailing slash
      let pathWithoutLeadingSlash = path.replace(/^\/+/, '');
      
      // Create test path
      const testPath = `${basePath}${pathWithoutLeadingSlash}${ext}`;
      
      debugLog('Testing path:', testPath);
      
      // Check if this path works
      const exists = await checkImageUrl(testPath);
      if (exists) {
        debugLog('Found working path:', testPath);
        return testPath;
      }
    }
  }
  
  // If we still don't have a working image path, try with numeric suffixes
  // This handles cases where we might have image-2.png, image-3.png, etc.
  const matches = path.match(/^(.*?)(\d+)$/);
  if (matches) {
    const base = matches[1];
    const num = parseInt(matches[2]);
    
    // Try a few number variations
    for (let i = 2; i <= 8; i++) {
      if (i === num) continue; // Skip the original number
      
      const alternatePath = `${base}${i}`;
      debugLog('Trying alternate numbered path:', alternatePath);
      
      const result = await getCorrectImagePath(alternatePath);
      if (result !== '/placeholder.svg') {
        return result;
      }
    }
  }
  
  // If all else fails, return placeholder
  debugLog('No working path found, using placeholder');
  return '/placeholder.svg';
};

/**
 * Extract OpenGraph image from HTML content
 */
export const extractOpenGraphImage = (content: string): string | null => {
  if (!content) return null;
  
  // Look for Open Graph image meta tag
  const ogMatch = content.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
  if (ogMatch && ogMatch[1]) {
    debugLog('Found Open Graph image:', ogMatch[1]);
    return ogMatch[1];
  }
  
  // Look for any image in the content as fallback
  const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (imgMatch && imgMatch[1]) {
    debugLog('Found image in content:', imgMatch[1]);
    return imgMatch[1];
  }
  
  return null;
};

// Simplified version of extractYouTubeId from URL
export const extractYouTubeId = (url: string): string => {
  if (!url) return '';
  
  // Match various YouTube URL formats
  const regexPatterns = [
    /(?:youtube\.com\/(?:[^\/\n\s]+\/\s*[^\/\n\s]+\/\s*(?:watch\?(?:\S*?&)?v=)|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /^[a-zA-Z0-9_-]{11}$/ // Direct video ID
  ];
  
  for (const regex of regexPatterns) {
    const match = url.match(regex);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  // Check if the URL itself is a valid YouTube ID (11 characters)
  if (url.length === 11 && /^[a-zA-Z0-9_-]{11}$/.test(url)) {
    return url;
  }
  
  return '';
};

// Import React at the top separately
import React, { useState, useEffect } from 'react';

/**
 * React component for images with robust fallback handling
 */
export const RobustImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  fallbacks?: string[];
  [key: string]: any;
}> = ({ src, alt, className, fallbacks = [], ...props }) => {
  const [imgSrc, setImgSrc] = useState<string>('/placeholder.svg');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [attempt, setAttempt] = useState<number>(0);
  const [triedPaths, setTriedPaths] = useState<string[]>([]);
  
  useEffect(() => {
    const loadImage = async () => {
      setIsLoading(true);
      
      // Start with a clean slate when src changes
      if (triedPaths.length > 0 && !triedPaths.includes(src)) {
        setTriedPaths([]);
        setAttempt(0);
      }
      
      // Add src to tried paths
      if (!triedPaths.includes(src)) {
        setTriedPaths(prev => [...prev, src]);
      }
      
      // Try original source first
      let path = await getCorrectImagePath(src);
      
      // If it failed and we have fallbacks, try those
      if (path === '/placeholder.svg' && fallbacks.length > 0 && attempt < fallbacks.length) {
        const fallbackSrc = fallbacks[attempt];
        
        // Skip if we've already tried this path
        if (!triedPaths.includes(fallbackSrc)) {
          setTriedPaths(prev => [...prev, fallbackSrc]);
          path = await getCorrectImagePath(fallbackSrc);
        }
      }
      
      debugLog(`Setting image source to: ${path}`);
      setImgSrc(path);
      setIsLoading(false);
    };
    
    loadImage();
  }, [src, attempt, fallbacks, triedPaths]);
  
  const handleError = () => {
    debugLog('Image error, trying next fallback');
    if (attempt < fallbacks.length) {
      setAttempt(prev => prev + 1);
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
        loading="lazy"
        {...props}
      />
    </>
  );
};
