// src/utils/rssFeeds.ts

import { blogPosts as mockBlogPosts, videos as mockVideos } from '../data/publications';
// *** NOTE: extractOpenGraphImage is likely NOT needed anymore, as we'll get the direct og:image URL ***
import { /* extractOpenGraphImage, */ extractYouTubeId, debugLog } from './imageUtils';

// --- Interfaces ---
export interface BlogPost { /* ... same as before ... */ }
export interface Video { /* ... same as before ... */ }

// --- Constants ---
const CORS_PROXY_URL = 'https://api.allorigins.win/raw?url=';
const YOUTUBE_CHANNEL_ID = 'UCMHNan83yARidp0Ycgq8lWw';
const YOUTUBE_FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=CHANNEL_ID`;
const PROXIED_YOUTUBE_FEED_URL = CORS_PROXY_URL + encodeURIComponent(YOUTUBE_FEED_URL);
const BLOG_FEED_URL = 'https://crowdtamers.com/feed/';
const PROXIED_BLOG_FEED_URL = CORS_PROXY_URL + encodeURIComponent(BLOG_FEED_URL);
const KNOWN_GOOD_PLACEHOLDER = '/placeholder.svg';

// --- Helper Function to Fetch and Parse OG Image ---

/**
 * Fetches a single blog post page via CORS proxy and extracts the og:image URL.
 * Returns the og:image URL or null if not found/error occurs.
 */
const fetchOgImageForPost = async (postUrl: string): Promise<string | null> => {
  if (!postUrl) return null;

  const proxiedPageUrl = CORS_PROXY_URL + encodeURIComponent(postUrl);
  debugLog(`Workspaceing page for OG Image: ${postUrl.substring(0, 60)}... via proxy`);

  try {
    const response = await fetch(proxiedPageUrl);
    if (!response.ok) {
      // Don't treat as fatal error for overall process, just log it for this post
      console.warn(`Failed to fetch page ${postUrl} for OG image: ${response.status}`);
      return null;
    }

    const htmlText = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, 'text/html');

    // Find the og:image meta tag
    const metaTag = doc.querySelector('meta[property="og:image"]');
    const imageUrl = metaTag?.getAttribute('content');

    if (imageUrl) {
      debugLog(`Found OG Image for ${postUrl.substring(0, 60)}... : ${imageUrl.substring(0, 60)}...`);
      return imageUrl;
    } else {
      debugLog(`No OG Image meta tag found for ${postUrl.substring(0, 60)}...`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching/parsing page ${postUrl} for OG image:`, error);
    return null; // Return null on error
  }
};


// --- Updated Fetch Functions ---

export const fetchBlogPosts = async (): Promise<BlogPost[]> => {
  console.log('🚀 Blog Posts Fetch Attempt (with OG Image scraping)');
  console.log('Attempting to fetch blog feed URL:', PROXIED_BLOG_FEED_URL);

  try {
    // 1. Fetch the main RSS Feed
    const response = await fetch(PROXIED_BLOG_FEED_URL);
    // ... (Check response.ok, handle errors as before) ...
     if (!response.ok) throw new Error(`Failed to fetch blog feed: ${response.status}`);


    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
     // ... (Check for parsererror as before) ...
     const errorNode = xmlDoc.querySelector('parsererror');
     if (errorNode) throw new Error('Failed to parse blog feed XML');


    const items = xmlDoc.querySelectorAll('item');
    console.log(`Found ${items.length} blog items in the feed`);

    if (items.length > 0) {
      // 2. Create initial post data objects from RSS items
      const initialPosts = Array.from(items).map((item, index) => {
        const title = item.querySelector('title')?.textContent || `Post ${index + 1}`;
        const link = item.querySelector('link')?.textContent || '';
        const guid = item.querySelector('guid')?.textContent || link || `blog-${index}`;
        const pubDate = item.querySelector('pubDate')?.textContent || new Date().toISOString();
        const description = item.querySelector('description')?.textContent || '';
        const contentEncoded = item.getElementsByTagNameNS('*', 'encoded')[0]?.textContent || '';

        // Create excerpt (can still do this here)
        let excerptSource = description || contentEncoded || '';
        excerptSource = excerptSource.replace(/<style[^>]*>.*?<\/style>/gs, '').replace(/<script[^>]*>.*?<\/script>/gs, '');
        excerptSource = excerptSource.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
        const excerpt = excerptSource.substring(0, 150) + (excerptSource.length > 150 ? '...' : '');

        return { // Return partial data, image URL will be added later
          id: guid, title, excerpt, url: link,
          date: new Date(pubDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          imageUrl: undefined, // Placeholder
          ogImage: undefined   // Will be populated if found
        };
      });

      // 3. Fetch OG Images concurrently for all posts
      console.log(`Workspaceing OG images for ${initialPosts.length} posts...`);
      const ogImageResults = await Promise.allSettled(
          initialPosts.map(post => fetchOgImageForPost(post.url))
      );
       console.log("Finished fetching OG images.");


      // 4. Combine initial post data with fetched OG images
      const finalPosts = initialPosts.map((post, index) => {
        let finalImageUrl = KNOWN_GOOD_PLACEHOLDER; // Default to placeholder
        let ogImageFound: string | undefined = undefined;
        const result = ogImageResults[index];

        if (result.status === 'fulfilled' && result.value) {
            finalImageUrl = result.value; // Use fetched OG image
            ogImageFound = result.value;
             console.log(`[BlogItem ${index + 1} "${post.title.substring(0,30)}..."] Final Image URL Assigned: ${finalImageUrl.substring(0, 60)}... (Source: OG Image)`);
        } else {
          // Log failure or lack of OG image for this specific post
          if (result.status === 'rejected') {
            console.warn(`Failed to get OG image for "${post.title}": ${result.reason}`);
          } else {
             console.log(`[BlogItem ${index + 1} "${post.title.substring(0,30)}..."] No OG image found. Final Image URL Assigned: ${finalImageUrl} (Source: FallbackPlaceholder)`);
          }
        }

        return {
          ...post, // Spread the initial data (id, title, excerpt, url, date)
          imageUrl: finalImageUrl,
          ogImage: ogImageFound,
        };
      });

      return finalPosts; // Return the posts with OG images (or placeholders)

    } else { /* ... handle no items found ... */ }
  } catch (error: any) { /* ... handle main fetch/parse errors ... */ }

  // Fallback to mock data if any major error occurred
  console.log('Using mock blog data due to error in fetching/processing.');
  return mockBlogPosts;
};


// --- fetchYouTubeVideos (remains the same as the previous version with hardcoded URL) ---
export const fetchYouTubeVideos = async (): Promise<Video[]> => {
   // ... (Keep the version with the hardcoded YOUTUBE_FEED_URL) ...
    console.log('Fetching YouTube videos...');
    console.log('Attempting to fetch YouTube feed via CORS proxy:', PROXIED_YOUTUBE_FEED_URL);

    try {
      const response = await fetch(PROXIED_YOUTUBE_FEED_URL);
      // ... rest of youtube fetch/parse logic ...
       if (!response.ok) throw new Error(`Failed YT fetch: ${response.status}`);
       const xmlText = await response.text();
       const parser = new DOMParser();
       const xmlDoc = parser.parseFromString(xmlText, "application/xml");
       const errorNode = xmlDoc.querySelector('parsererror');
       if (errorNode) throw new Error('Failed YT parse');
       const entries = xmlDoc.querySelectorAll('entry');
       if (entries.length === 0) return mockVideos; // Fallback if no entries

       const videos = Array.from(entries).slice(0, 6).map((entry, index) => {
           // ... video data extraction ...
            const videoId = entry.getElementsByTagNameNS('http://www.youtube.com/xml/schemas/2015', 'videoId')[0]?.textContent || '';
            const title = entry.querySelector('title')?.textContent || `Video ${index + 1}`;
            const link = entry.querySelector('link[rel="alternate"]')?.getAttribute('href') || '';
            const pubDate = entry.querySelector('published')?.textContent || new Date().toISOString();
            const thumbnail = entry.getElementsByTagNameNS('http://search.yahoo.com/mrss/', 'thumbnail')[0];
            const thumbnailUrl = thumbnail?.getAttribute('url') || '';
            const finalThumbnailUrl = thumbnailUrl || (videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : KNOWN_GOOD_PLACEHOLDER);
            const finalVideoId = videoId || extractYouTubeId(link) || `unknown-${index}`;

            console.log(`[YouTubeItem ${index + 1}] Thumb: ${finalThumbnailUrl.substring(0,60)}..., VideoID: ${finalVideoId}`);


           return {
             id: `video-${finalVideoId}`, title, thumbnailUrl: finalThumbnailUrl, videoUrl: link, videoId: finalVideoId,
             date: new Date(pubDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
           };
       });
       return videos;


    } catch (error: any) {
       console.error('Failed to fetch or parse YouTube videos. Error Details:', error);
       console.log('Using mock YouTube video data due to error.');
       return mockVideos;
    }
};


// --- loadFeaturedContent (remains the same) ---
export const loadFeaturedContent = async () => { /* ... same as before ... */ };