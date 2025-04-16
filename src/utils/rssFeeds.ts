// src/utils/rssFeeds.ts

import { blogPosts as mockBlogPosts, videos as mockVideos } from '../data/publications';
import { extractYouTubeId, debugLog } from './imageUtils';

// --- Interfaces ---
export interface BlogPost { /* ... same as before ... */ }
export interface Video { /* ... same as before ... */ }

// --- Constants ---
const CORS_PROXY_URL = 'https://api.allorigins.win/raw?url='; // Keep for blog posts
const YOUTUBE_CHANNEL_ID = 'UCMHNan83yARidp0Ycgq8lWw';
// *** Raw YouTube feed URL for rss2json ***
const YOUTUBE_FEED_URL_RAW = `https://www.youtube.com/feeds/videos.xml?channel_id=CHANNEL_ID`;
// *** Construct the rss2json API URL ***
const RSS2JSON_YOUTUBE_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(YOUTUBE_FEED_URL_RAW)}`;

const BLOG_FEED_URL = 'https://crowdtamers.com/blog/feed/';
const PROXIED_BLOG_FEED_URL = CORS_PROXY_URL + encodeURIComponent(BLOG_FEED_URL);
const KNOWN_GOOD_PLACEHOLDER = '/placeholder.svg';

// --- Fetch Functions ---

/**
 * Fetches blog posts (Working version - parsing feed images)
 */
export const fetchBlogPosts = async (): Promise<BlogPost[]> => {
    console.log('🚀 Blog Posts Fetch Attempt (Parsing Feed Images)');
    console.log('Attempting to fetch blog feed URL:', PROXIED_BLOG_FEED_URL);
    try {
      const response = await fetch(PROXIED_BLOG_FEED_URL);
      // ... (Rest of the working blog post fetch/parse logic from previous step) ...
      console.log('Blog Fetch Response:', { status: response.status, ok: response.ok });
      if (!response.ok) throw new Error(`Blog Feed Fetch Failed: ${response.status}`);
      const xmlText = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      const errorNode = xmlDoc.querySelector('parsererror');
      if (errorNode) throw new Error('Blog Feed Parse Error');
      const items = xmlDoc.querySelectorAll('item');
       if (items.length === 0) return mockBlogPosts; // Use mock if no items

      const posts = Array.from(items).map((item, index) => {
          // ... (Blog data extraction including image parsing from feed) ...
            const title = item.querySelector('title')?.textContent || `Post ${index + 1}`;
            const link = item.querySelector('link')?.textContent || '';
            const guid = item.querySelector('guid')?.textContent || link || `blog-${index}`;
            const pubDate = item.querySelector('pubDate')?.textContent || new Date().toISOString();
            const description = item.querySelector('description')?.textContent || '';
            const contentEncoded = item.getElementsByTagNameNS('*', 'encoded')[0]?.textContent || '';
            let imageUrl = ''; let imageSource = 'None';
            const mediaContent = item.getElementsByTagNameNS('http://search.yahoo.com/mrss/', 'content')[0];
            if (mediaContent && mediaContent.getAttribute('medium') === 'image') {
                imageUrl = mediaContent.getAttribute('url') || ''; if (imageUrl) imageSource = 'MediaContent';
            }
            if (!imageUrl && contentEncoded) { const imgMatch = contentEncoded.match(/<img[^>]+src="([^">]+)"/i); if (imgMatch && imgMatch[1]) { imageUrl = imgMatch[1]; imageSource = 'ContentImgTag'; }}
            if (!imageUrl && description) { const imgMatch = description.match(/<img[^>]+src="([^">]+)"/i); if (imgMatch && imgMatch[1]) { imageUrl = imgMatch[1]; imageSource = 'DescriptionImgTag'; }}
            if (!imageUrl) { imageUrl = KNOWN_GOOD_PLACEHOLDER; imageSource = 'FallbackPlaceholder'; }
            console.log(`[BlogItem ${index + 1}] Img: ${imageUrl.substring(0,60)}... (Src: ${imageSource})`);
            let excerptSource = description || contentEncoded || '';
            excerptSource = excerptSource.replace(/<style[^>]*>.*?<\/style>/gs, '').replace(/<script[^>]*>.*?<\/script>/gs, '');
            excerptSource = excerptSource.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
            const excerpt = excerptSource.substring(0, 150) + (excerptSource.length > 150 ? '...' : '');

          return { id: guid, title, excerpt, url: link, date: new Date(pubDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), imageUrl: imageUrl };
      });
      console.log("Finished processing blog items.");
      return posts;
    } catch (error: any) {
      console.error('Failed during fetchBlogPosts. Error:', error);
      return mockBlogPosts; // Fallback
    }
};

/**
 * Fetches YouTube video feed using RSS2JSON.COM API.
 */
export const fetchYouTubeVideos = async (): Promise<Video[]> => {
    console.log('Fetching YouTube videos via RSS2JSON...');
    console.log('Attempting to fetch YouTube feed from:', RSS2JSON_YOUTUBE_URL);

    try {
      const response = await fetch(RSS2JSON_YOUTUBE_URL);
      console.log('RSS2JSON YouTube Fetch Response:', { status: response.status, ok: response.ok });

      if (!response.ok) {
        // Log error text if possible
        const errorText = await response.text().catch(() => '[Could not read response body]');
        console.error(`RSS2JSON YouTube fetch failed with status ${response.status}: ${errorText.substring(0,500)}...`);
        throw new Error(`RSS2JSON fetch failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('RSS2JSON YouTube Data Received (Status):', data.status); // Log the status from the JSON payload

      // Check the status *within* the JSON response
      if (data.status !== 'ok') {
        console.error('RSS2JSON service returned an error status:', data.message || data.status);
        throw new Error(`RSS2JSON service error: ${data.status}`);
      }

      // Check if items array exists and is an array
      if (!data.items || !Array.isArray(data.items)) {
        console.error('RSS2JSON response missing items array or items is not an array:', data);
        throw new Error('Invalid items data from RSS2JSON');
      }

       console.log(`RSS2JSON returned ${data.items.length} YouTube items.`);
       if (data.items.length === 0) {
           console.warn("No items found in YouTube feed via RSS2JSON. Using mocks.");
           return mockVideos;
       }


      // Map the items from rss2json structure to our Video interface
      const videos = data.items.slice(0, 6).map((item: any, index: number) => {
        // Extract video ID from the link URL provided by rss2json
        const videoId = extractYouTubeId(item.link || '') || `unknown-${index}`;
        // Use the thumbnail provided by rss2json, or construct fallback
        const thumbnailUrl = item.thumbnail || (videoId !== `unknown-${index}` ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : KNOWN_GOOD_PLACEHOLDER);

        console.log(`[YouTubeItem ${index + 1} (rss2json)] Thumb: ${thumbnailUrl.substring(0,60)}..., VideoID: ${videoId}`);

        return {
          id: `video-${videoId}`, // Use extracted videoId for ID
          title: item.title || `Video ${index + 1}`,
          thumbnailUrl: thumbnailUrl,
          videoUrl: item.link || '',
          videoId: videoId,
          date: new Date(item.pubDate || Date.now()).toLocaleDateString('en-US', { // Use pubDate from item
            year: 'numeric', month: 'long', day: 'numeric'
          })
        };
      });

      console.log("Finished processing YouTube items from RSS2JSON.");
      return videos;

    } catch (error: any) {
      console.error('Failed during fetchYouTubeVideos (RSS2JSON). Error:', error);
      console.log('Using mock YouTube video data due to RSS2JSON error.');
      return mockVideos; // Fallback to mock data on any error
    }
};

// --- loadFeaturedContent (remains the same) ---
export const loadFeaturedContent = async () => {
  // ... (same as before, calls the updated fetchYouTubeVideos) ...
   console.log('>>> Starting loadFeaturedContent...');
   try {
     console.log('>>> Calling Promise.allSettled...');
     const results = await Promise.allSettled([ fetchBlogPosts(), fetchYouTubeVideos() ]);
     console.log('>>> Promise.allSettled finished. Results:', results);
     // ... (rest of the result processing) ...
      let blogPosts: BlogPost[]; if (results[0].status === 'fulfilled') { console.log('>>> Blog posts fetch succeeded.'); blogPosts = results[0].value; } else { console.error('>>> Blog posts fetch failed:', results[0].reason); blogPosts = mockBlogPosts; }
      let videos: Video[]; if (results[1].status === 'fulfilled') { console.log('>>> YouTube videos fetch succeeded.'); videos = results[1].value; } else { console.error('>>> YouTube videos fetch failed:', results[1].reason); videos = mockVideos; }
      console.log(`>>> Final Loaded Counts - Blog Posts: ${blogPosts.length}, Videos: ${videos.length}`);
      console.log(`>>> Blog post source: ${results[0].status === 'fulfilled' ? 'Fetched' : 'Mock'}`);
      console.log(`>>> Video source: ${results[1].status === 'fulfilled' ? 'Fetched' : 'Mock'}`);
      console.log('>>> loadFeaturedContent returning data.');
      return { featuredBlogPosts: blogPosts.slice(0, 3), featuredVideos: videos.slice(0, 3), allBlogPosts: blogPosts, allVideos: videos };

   } catch (error) { /* ... error handling ... */ }
   return { /* Return mock data */ };
};