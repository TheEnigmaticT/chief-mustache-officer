/**
 * Utility functions for handling images and media throughout the application
 */

/**
 * Ensures an image path has a file extension
 * @param path - The image path to check/modify
 * @returns The image path with an extension
 */
export const ensureImageExtension = (path: string): string => {
    if (!path) return '';
    
    // If it already has an image extension, return as is
    if (path.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i)) {
      return path;
    }
    
    // Add default extension
    return `${path}.png`;
  };
  
  /**
   * Gets a fallback image path based on an index
   * @param index - Index used to determine which fallback image to use
   * @returns Path to a fallback image
   */
  export const getFallbackImage = (index: number): string => {
    // Use images 3-8 to avoid using potentially problematic images
    const imageIndex = (index % 6) + 3;
    return `/lovable-uploads/image-${imageIndex}`;
  };
  
  /**
   * Extracts YouTube video ID from a URL
   * @param url - YouTube URL to extract ID from
   * @returns YouTube video ID or empty string if not found
   */
  export const extractYouTubeId = (url: string): string => {
    if (!url) return '';
    
    // Match various YouTube URL formats
    const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\s*[^\/\n\s]+\/\s*(?:watch\?(?:\S*?&)?v=)|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    
    return match ? match[1] : '';
  };
  
  /**
   * Determines if a YouTube video is likely a Short
   * @param videoId - YouTube video ID
   * @returns Boolean indicating if it's likely a Short
   */
  export const isYouTubeShort = (videoId: string): boolean => {
    // This is a simplistic check - in a real app you would need a more robust check
    // Shorts are typically in vertical format, but the videoId format is the same
    return videoId.length === 11; // All YouTube video IDs are 11 characters
  };
  
  /**
   * React component for an image with built-in fallback handling
   */
  import React, { useState } from 'react';
  
  interface ImageWithFallbackProps {
    src: string;
    alt: string;
    fallbackSrc?: string;
    className?: string;
    [key: string]: any;
  }
  
  export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ 
    src, 
    alt, 
    fallbackSrc, 
    className,
    ...props 
  }) => {
    const [imgSrc, setImgSrc] = useState(ensureImageExtension(src));
    const [error, setError] = useState(false);
  
    const handleError = () => {
      if (!error && fallbackSrc) {
        setError(true);
        setImgSrc(ensureImageExtension(fallbackSrc));
      }
    };
  
    return (
      <img
        src={imgSrc}
        alt={alt}
        className={className}
        onError={handleError}
        {...props}
      />
    );
  };