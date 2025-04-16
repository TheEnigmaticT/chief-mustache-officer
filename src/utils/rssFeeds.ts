// src/utils/rssFeeds.ts

import { blogPosts as mockBlogPosts, videos as mockVideos } from '../data/publications';
// Assuming imageUtils contains the necessary helper functions:
// - extractOpenGraphImage(htmlString): string | null
// - extractYouTubeId(url): string | null
// - debugLog(message): void
import { extractOpenGraphImage, extractYouTubeId, debugLog } from './imageUtils';

// --- Interfaces ---

/**
 * Represents a blog post item.
 */
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  url: string;
  date: string; // Formatted date string
  imageUrl?: string;
  ogImage?: string; // Specifically extracted Open Graph image
}

/**
 * Represents a video item.
 */
export interface Video {
  id: string;
  title: string;
  thumbnailUrl: string;
  videoUrl: string;
  videoId: string;
  date: string; // Formatted date string
}

// --- Constants ---

const CORS_PROXY_URL = 'https://api.allorigins.win/raw?url=';

// --- Fetch Functions ---

/**
 * Fetches blog posts from the WordPress feed using a CORS proxy,
 * with fallback to mock data.
 */
export const fetchBlogPosts = async (): Promise<BlogPost[]> => {
  console.log('Fetching blog posts...');
  // Use the standard WordPress feed URL
  const feedUrl = 'https://crowdtamers.com/feed/';
  const proxiedFeedUrl = CORS_PROXY_URL + encodeURIComponent(feedUrl);

  try {
    console.log('Attempting to fetch blog feed via CORS proxy:', proxiedFeedUrl);
    const response = await fetch(proxiedFeedUrl);

    if (!response.ok) {
      // Log specific error before throwing
      const errorText = await response.text().catch(() => 'Could not read error response.');
      console.error(`Blog feed fetch failed with status ${response.status}: ${errorText}`);
      throw new Error(`Failed to fetch blog feed: ${response.status} ${response.statusText}`);
    }

    const xmlText = await response.text();
    console.log('Blog feed XML fetched, parsing...');

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    const errorNode = xmlDoc.querySelector('parsererror');
    if (errorNode) {
        console.error('Error parsing blog XML:', errorNode.textContent);
        throw new Error('Failed to parse blog feed XML');
    }

    const items = xmlDoc.querySelectorAll('item');
    if (items.length > 0) {
      console.log(`Parsed ${items.length} blog items.`);
      return Array.from(items).map((item, index) => {
        const title = item.querySelector('title')?.textContent || `Post ${index + 1}`;
        const link = item.querySelector('link')?.textContent || '';
        const guid = item.querySelector('guid')?.textContent || link || `blog-${index}`; // Use guid or link for ID
        const pubDate = item.querySelector('pubDate')?.textContent || new Date().toISOString();
        const description = item.querySelector('description')?.textContent || '';

        // Namespace-aware querySelector for content:encoded
        const contentEncoded = item.getElementsByTagNameNS('*', 'encoded')[0]?.textContent || '';

        let imageUrl = '';
        let ogImage: string | null = null;

        // 1. Try Open Graph image from content:encoded
         if (contentEncoded) {
           ogImage = extractOpenGraphImage(contentEncoded); // Assuming this function exists and works
           if (ogImage) {
             debugLog(`Found OpenGraph image for "${title}": ${ogImage}`);
             imageUrl = ogImage;
           }
         }

        // 2. Try extracting regular image from content:encoded if no OG image
        if (!imageUrl && contentEncoded) {
          const imgMatch = contentEncoded.match(/<img[^>]+src="([^">]+)"/i);
          if (imgMatch && imgMatch[1]) {
            imageUrl = imgMatch[1];
            debugLog(`Found img tag src in content:encoded for "${title}": ${imageUrl}`);
           }
        }

        // 3. Try extracting from media:content or enclosure (Common in some feeds)
        if (!imageUrl) {
            const mediaContent = item.getElementsByTagNameNS('*', 'content')[0]; // Check media:content
            if (mediaContent && mediaContent.getAttribute('medium') === 'image') {
                imageUrl = mediaContent.getAttribute('url') || '';
            } else {
                 const enclosure = item.querySelector('enclosure'); // Check enclosure tag
                 if (enclosure && enclosure.getAttribute('type')?.startsWith('image/')) {
                     imageUrl = enclosure.getAttribute('url') || '';
                 }
            }
             if (imageUrl) debugLog(`Found image via media:content or enclosure for "${title}": ${imageUrl}`);
        }

        // 4. Use placeholder if no image found
        if (!imageUrl) {
          imageUrl = `/img/image-${(index % 7) + 2}.jpg`; // Default fallback (ensure these images exist)
          debugLog(`Using fallback image for "${title}": ${imageUrl}`);
        }

        // Create excerpt from description (preferred) or content
        let excerptSource = description || contentEncoded || '';
        excerptSource = excerptSource.replace(/<style[^>]*>.*?<\/style>/gs, ''); // Remove style blocks
        excerptSource = excerptSource.replace(/<script[^>]*>.*?<\/script>/gs, ''); // Remove script blocks
        excerptSource = excerptSource.replace(/<[^>]*>/g, ''); // Remove remaining HTML tags
        excerptSource = excerptSource.replace(/\s+/g, ' ').trim(); // Normalize whitespace
        const excerpt = excerptSource.substring(0, 150) + (excerptSource.length > 150 ? '...' : '');

        return {
          id: guid, // Use GUID or link as a more stable ID
          title,
          excerpt,
          url: link,
          date: new Date(pubDate).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
          }),
          imageUrl: imageUrl,
          ogImage: ogImage || undefined // Store ogImage if found
        };
      });
    } else {
       console.warn('No <item> elements found in the blog feed. Falling back to mock data.');
       return mockBlogPosts; // Fallback to mock data if no items parsed
    }
  } catch (error) {
    console.error('Failed to fetch or parse blog posts:', error);
    console.log('Using mock blog data due to error.');
    return mockBlogPosts; // Return mock data as fallback on any error
  }
};

/**
 * Fetches YouTube video feed using a CORS proxy, with fallback to mock data.
 */
export const fetchYouTubeVideos = async (channelId = 'UCMHNan83yARidp0Ycgq8lWw'): Promise<Video[]> => {
  console.log('Fetching YouTube videos...');
  // Correct YouTube RSS Feed URL format
  const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=CHANNEL_ID`;
  const proxiedFeedUrl = CORS_PROXY_URL + encodeURIComponent(feedUrl);

  try {
    console.log('Attempting to fetch YouTube feed via CORS proxy:', proxiedFeedUrl);
    const response = await fetch(proxiedFeedUrl);

    if (!response.ok) {
       // Log specific error before throwing
       const errorText = await response.text().catch(() => 'Could not read error response.');
       console.error(`YouTube feed fetch failed with status ${response.status}: ${errorText}`);
       throw new Error(`Failed to fetch YouTube feed: ${response.status} ${response.statusText}`);
     }

    const xmlText = await response.text();
    console.log('YouTube feed XML fetched, parsing...');

    const parser = new DOMParser();
    // Use "application/xml" or "text/xml" - both should work for YT feeds
    const xmlDoc = parser.parseFromString(xmlText, "application/xml");

    const errorNode = xmlDoc.querySelector('parsererror');
     if (errorNode) {
         console.error('Error parsing YouTube XML:', errorNode.textContent);
         throw new Error('Failed to parse YouTube feed XML');
     }

    // YouTube feed uses <entry> elements
    const entries = xmlDoc.querySelectorAll('entry');
    if (entries.length > 0) {
      console.log(`Parsed ${entries.length} YouTube video entries.`);
      return Array.from(entries).slice(0, 6).map((entry, index) => {
        // Namespace-aware querySelector for YouTube tags
        const videoId = entry.getElementsByTagNameNS('http://www.youtube.com/xml/schemas/2015', 'videoId')[0]?.textContent || '';
        const title = entry.querySelector('title')?.textContent || `Video ${index + 1}`;
        const link = entry.querySelector('link[rel="alternate"]')?.getAttribute('href') || '';
        const pubDate = entry.querySelector('published')?.textContent || new Date().toISOString(); // <published> tag

        // Extract thumbnail URL from <media:thumbnail>
        const thumbnail = entry.getElementsByTagNameNS('http://search.yahoo.com/mrss/', 'thumbnail')[0];
        const thumbnailUrl = thumbnail?.getAttribute('url') || '';

        // Fallback thumbnail using video ID if parsing failed
        const finalThumbnailUrl = thumbnailUrl || (videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : `/img/image-${(index % 3) + 1}.jpg`); // Add a generic fallback image too

        // Extract video ID from link as a fallback if yt:videoId tag fails
        const finalVideoId = videoId || extractYouTubeId(link) || `unknown-${index}`;

        return {
          id: `video-${finalVideoId}`,
          title,
          thumbnailUrl: finalThumbnailUrl,
          videoUrl: link,
          videoId: finalVideoId,
          date: new Date(pubDate).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
          })
        };
      });
    } else {
       console.warn('No <entry> elements found in the YouTube feed. Falling back to mock data.');
       return mockVideos; // Fallback to mock data if no entries parsed
     }
  } catch (error) {
    console.error('Failed to fetch or parse YouTube videos:', error);
    // Use your specific fallback list if needed, otherwise use mockVideos
    console.log('Using mock YouTube video data due to error.');
    // const workingVideos = [ ... ]; // Your specific fallback list
    // return workingVideos;
    return mockVideos;
  }
};


/**
 * Load all featured content (blog posts and videos) with fallbacks.
 * Uses Promise.allSettled to handle partial failures gracefully.
 */
export const loadFeaturedContent = async () => {
  console.log('Loading featured content...');

  const results = await Promise.allSettled([
    fetchBlogPosts(),
    fetchYouTubeVideos()
  ]);

  // Process results, using mock data if a fetch failed
  const blogPosts = results[0].status === 'fulfilled'
    ? results[0].value
    : (console.error("Blog post fetch failed, using mocks."), mockBlogPosts);

  const videos = results[1].status === 'fulfilled'
    ? results[1].value
    : (console.error("YouTube video fetch failed, using mocks."), mockVideos);

  console.log(`Loaded ${blogPosts.length} blog posts and ${videos.length} videos.`);

  return {
    featuredBlogPosts: blogPosts.slice(0, 3),
    featuredVideos: videos.slice(0, 3),
    allBlogPosts: blogPosts,
    allVideos: videos
  };
};