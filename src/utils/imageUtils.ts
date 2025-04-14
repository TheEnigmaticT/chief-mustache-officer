
// Debug mode to help troubleshoot image loading
const DEBUG = true;

/**
 * Logs debug information if debug mode is enabled
 */
export const debugLog = (message: string, ...args: any[]) => {
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
 * Gets the correct image path with simplified fallback options
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
  } 
  
  // SIMPLIFIED APPROACH: First try the path as-is
  const pathAsIs = await checkImageUrl(path);
  if (pathAsIs) {
    debugLog('Path works as-is:', path);
    return path;
  }
  
  // Then try with key extensions directly
  const extensions = ['.png', '.jpg', '.webp'];
  for (const ext of extensions) {
    // Skip if the path already has this extension
    if (path.toLowerCase().endsWith(ext.toLowerCase())) continue;
    
    const pathWithExt = `${path}${ext}`;
    debugLog('Testing with extension:', pathWithExt);
    
    const exists = await checkImageUrl(pathWithExt);
    if (exists) {
      debugLog('Found working path with extension:', pathWithExt);
      return pathWithExt;
    }
  }
  
  // Try the most common location for this app
  const lovablePath = `/lovable-uploads/${path.split('/').pop()}`;
  debugLog('Testing lovable path:', lovablePath);
  const lovableExists = await checkImageUrl(lovablePath);
  if (lovableExists) {
    debugLog('Found working lovable path:', lovablePath);
    return lovablePath;
  }
  
  // Try with extensions on the lovable path
  for (const ext of extensions) {
    const lovablePathWithExt = `${lovablePath}${ext}`;
    debugLog('Testing lovable path with extension:', lovablePathWithExt);
    
    const exists = await checkImageUrl(lovablePathWithExt);
    if (exists) {
      debugLog('Found working lovable path with extension:', lovablePathWithExt);
      return lovablePathWithExt;
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
