
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
  
  // Handle absolute URLs (including Open Graph images)
  if (path.startsWith('http')) {
    const exists = await checkImageUrl(path);
    if (exists) {
      debugLog('External URL works:', path);
      return path;
    }
    debugLog('External URL failed:', path);
  }
  
  // Remove any old /lovable-uploads paths
  let cleanPath = path;
  if (cleanPath.includes('/lovable-uploads/')) {
    cleanPath = cleanPath.replace('/lovable-uploads/', '/img/');
    debugLog('Converted old path to new path:', cleanPath);
  }
  
  // Always prioritize /img/ folder
  if (!cleanPath.includes('/img/') && !cleanPath.startsWith('/img/')) {
    const filename = cleanPath.split('/').pop();
    cleanPath = `/img/${filename}`;
    debugLog('Prioritizing img folder:', cleanPath);
  }
  
  // Try path as-is
  let exists = await checkImageUrl(cleanPath);
  if (exists) {
    debugLog('Path works as-is:', cleanPath);
    return cleanPath;
  }
  
  // Try with extensions
  // Remove any existing extension first
  const basePathWithoutExtension = cleanPath.replace(/\.(png|jpg|jpeg|gif|webp)$/i, '');
  debugLog('Base path without extension:', basePathWithoutExtension);
  
  // Try with various extensions
  const extensions = ['.png', '.jpg', '.webp', '.gif'];
  for (const ext of extensions) {
    const pathWithExt = `${basePathWithoutExtension}${ext}`;
    debugLog('Testing with extension:', pathWithExt);
    
    exists = await checkImageUrl(pathWithExt);
    if (exists) {
      debugLog('Found working path with extension:', pathWithExt);
      return pathWithExt;
    }
  }
  
  // If all else fails, return placeholder
  debugLog('No working path found, using placeholder');
  return '/placeholder.svg';
};

/**
 * Extract OpenGraph image from HTML content
 * Enhanced to extract from more patterns
 */
export const extractOpenGraphImage = (content: string): string | null => {
  if (!content) return null;
  
  // Look for Open Graph image meta tag (most common format)
  const ogMatch = content.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
  if (ogMatch && ogMatch[1]) {
    debugLog('Found Open Graph image:', ogMatch[1]);
    return ogMatch[1];
  }
  
  // Look for alternate format Open Graph meta tag
  const ogAltMatch = content.match(/<meta\s+content=["']([^"']+)["']\s+property=["']og:image["']/i);
  if (ogAltMatch && ogAltMatch[1]) {
    debugLog('Found alternate Open Graph image:', ogAltMatch[1]);
    return ogAltMatch[1];
  }
  
  // Look for Twitter image card
  const twitterMatch = content.match(/<meta\s+(?:property|name)=["']twitter:image["']\s+content=["']([^"']+)["']/i);
  if (twitterMatch && twitterMatch[1]) {
    debugLog('Found Twitter image:', twitterMatch[1]);
    return twitterMatch[1];
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
