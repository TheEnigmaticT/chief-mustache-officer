
import React, { useState, useEffect } from 'react';
import { getCorrectImagePath, debugLog } from '../utils/imageUtils';

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

export default RobustImage;
