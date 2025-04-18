import React, { useState, useEffect } from 'react';
import { getCorrectImagePath, debugLog } from '../utils/imageUtils';

/**
 * React component for images with robust fallback handling (without loading indicator)
 */
const RobustImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  fallbacks?: string[];
  [key: string]: any; // Allows passing other img attributes like style, width, height etc.
}> = ({ src, alt, className, fallbacks = [], ...props }) => {
  // Initialize imgSrc optimistically or with a transparent pixel/placeholder
  // Let's start with the intended src and let onError handle failures.
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [currentAttemptSrc, setCurrentAttemptSrc] = useState<string>(src); // Track which src (original or fallback) is being attempted

  // Effect to update image source when props change or errors occur
  useEffect(() => {
    let isMounted = true; // Prevent state updates on unmounted component

    const loadImage = async (source: string) => {
      // debugLog(`Attempting to load: ${source}`); // Optional debugging
      // We assume getCorrectImagePath checks validity and returns placeholder on failure
      // Or simply rely on the native onError handler for simplicity now
      // Let's simplify: We set the source, and let onError handle it.
      if (isMounted) {
         // Update imgSrc only if the attempt source changes
         if (source !== imgSrc) {
            setImgSrc(source);
         }
      }
    };

    // When the src prop changes, reset the attempt to the new src
    if (src !== currentAttemptSrc && !fallbacks.includes(src)) {
         setCurrentAttemptSrc(src);
         setImgSrc(src); // Optimistically set to new src prop
         // debugLog(`New src prop detected: ${src}`); // Optional debugging
    } else {
        // If currentAttemptSrc is different from imgSrc (likely after an error), load it
         if (currentAttemptSrc !== imgSrc) {
            loadImage(currentAttemptSrc);
        }
    }


    return () => {
      isMounted = false;
    };
    // Depend on the source we are trying to load
  }, [src, currentAttemptSrc, fallbacks, imgSrc]);

  // Handle native image loading errors
  const handleError = () => {
    debugLog(`Error loading: ${imgSrc}. Current attempt src: ${currentAttemptSrc}`);
    const currentSrcIndexInFallbacks = fallbacks.indexOf(currentAttemptSrc);

    // Determine the next source to try
    let nextSrcToTry: string | null = null;
    if (currentAttemptSrc === src && fallbacks.length > 0) {
      // If original src failed, try the first fallback
      nextSrcToTry = fallbacks[0];
    } else if (currentSrcIndexInFallbacks !== -1 && currentSrcIndexInFallbacks + 1 < fallbacks.length) {
      // If a fallback failed, try the next one in the list
      nextSrcToTry = fallbacks[currentSrcIndexInFallbacks + 1];
    }

    if (nextSrcToTry && nextSrcToTry !== currentAttemptSrc) {
        debugLog(`Falling back to: ${nextSrcToTry}`);
        setCurrentAttemptSrc(nextSrcToTry); // Trigger useEffect to load the fallback
    } else {
        // If no more fallbacks or something went wrong, use the final placeholder
        debugLog(`No more fallbacks, setting placeholder.`);
        if (imgSrc !== '/placeholder.svg') { // Avoid unnecessary state update
             setImgSrc('/placeholder.svg');
        }
        // Optionally reset currentAttemptSrc to avoid infinite loops if placeholder also fails
        setCurrentAttemptSrc('/placeholder.svg');
    }
  };

  return (
    // Render only the img tag. Its visibility/opacity is controlled by the parent.
    <img
      src={imgSrc} // Use the state variable which handles fallbacks
      alt={alt}
      className={className} // Apply className directly
      onError={handleError} // Use the native onError handler
      // Consider removing lazy loading if pre-loading is critical for the crossfade
      // loading="lazy"
      {...props} // Spread remaining props (like style)
    />
  );
};

export default RobustImage;