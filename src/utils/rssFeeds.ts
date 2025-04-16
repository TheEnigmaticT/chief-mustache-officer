// src/utils/rssFeeds.ts

import { blogPosts as mockBlogPosts, videos as mockVideos } from '../data/publications';
// Re-add extractOpenGraphImage if needed for other parts, but not used in this simplified fetchBlogPosts
import { /* extractOpenGraphImage, */ extractYouTubeId, debugLog } from './imageUtils';

// --- Interfaces ---
export interface BlogPost { /* ... same as before ... */ }
export interface Video { /* ... same as before ... */ }

// --- Constants ---
const CORS_PROXY_URL = 'https://api.allorigins.win/raw?url=';
const YOUTUBE_CHANNEL_ID = 'UCMHNan83yARidp0Ycgq8lWw'; // Still defined, though URL is hardcoded below
const YOUTUBE_FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=CHANNEL_ID`;
const PROXIED_YOUTUBE_FEED_URL = CORS_PROXY_URL + encodeURIComponent(YOUTUBE_FEED_URL);
const BLOG_FEED_URL = 'https://crowdtamers.com/feed/';
const PROXIED_BLOG_FEED_URL = CORS_PROXY_URL + encodeURIComponent(BLOG_FEED_URL);
const KNOWN_GOOD_PLACEHOLDER = '/placeholder.svg'; // Use this directly

// --- Helper Function (Commented out - Not used in simplified version) ---
/*
const fetchOgImageForPost = async (postUrl: string): Promise<string | null> => {
  // ... OG image fetching logic ...
};
*/

// --- Updated Fetch Functions ---

/**
 * SIMPLIFIED: Fetches blog posts, parses feed, assigns placeholder image.
 */
export const fetchBlogPosts = async (): Promise<BlogPost[]> => {
  console.log('🚀 Blog Posts Fetch Attempt (SIMPLIFIED)'); // Indicate simplified version
  console.log('Attempting to fetch blog feed URL:', PROXIED_BLOG_FEED_URL);

  try {
    const response = await fetch(PROXIED_BLOG_FEED_URL);
    console.log('Blog Fetch Response:', { status: response.status, ok: response.ok });
    if (!response.ok) throw new Error(`Blog Feed Fetch Failed: ${response.status}`);

    const xmlText = await response.text();
    console.log(`Blog XML Text Length: ${xmlText.length}`);
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    const errorNode = xmlDoc.querySelector('parsererror');
    if (errorNode) throw new Error('Blog Feed Parse Error');

    const items = xmlDoc.querySelectorAll('item');
    console.log(`Found ${items.length} blog items`);
    if (items.length > 0) {
      const posts = Array.from(items).map((item, index) => {
        const title = item.querySelector('title')?.textContent || `Post ${index + 1}`;
        const link = item.querySelector('link')?.textContent || '';
        const guid = item.querySelector('guid')?.textContent || link || `blog-${index}`;
        const pubDate = item.querySelector('pubDate')?.textContent || new Date().toISOString();
        const description = item.querySelector('description')?.textContent || '';
        const contentEncoded = item.getElementsByTagNameNS('*', 'encoded')[0]?.textContent || '';

        let excerptSource = description || contentEncoded || '';
        excerptSource = excerptSource.replace(/<style[^>]*>.*?<\/style>/gs, '').replace(/<script[^>]*>.*?<\/script>/gs, '');
        excerptSource = excerptSource.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
        const excerpt = excerptSource.substring(0, 150) + (excerptSource.length > 150 ? '...' : '');

        // *** Directly assign placeholder ***
        const finalImageUrl = KNOWN_GOOD_PLACEHOLDER;
        console.log(`[BlogItem ${index + 1}] Assigning placeholder: ${finalImageUrl}`);

        return {
          id: guid, title, excerpt, url: link,
          date: new Date(pubDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          imageUrl: finalImageUrl,
          ogImage: undefined // No OG image fetched in this version
        };
      });
      console.log("Finished processing blog items (simplified).");
      return posts;
    } else {
      console.warn('No <item> elements found in blog feed. Using mocks.');
      return mockBlogPosts;
    }
  } catch (error: any) {
    console.error('Failed during simplified fetchBlogPosts. Error:', error);
    console.log('Using mock blog data due to simplified fetch error.');
    return mockBlogPosts;
  }
};


// --- fetchYouTubeVideos (Keep the version with hardcoded URL) ---
export const fetchYouTubeVideos = async (): Promise<Video[]> => {
    console.log('Fetching YouTube videos...');
    console.log('Attempting to fetch YouTube feed via CORS proxy:', PROXIED_YOUTUBE_FEED_URL);
    try {
      const response = await fetch(PROXIED_YOUTUBE_FEED_URL);
      console.log('YouTube Fetch Response:', { status: response.status, ok: response.ok });
      if (!response.ok) throw new Error(`YouTube Feed Fetch Failed: ${response.status}`);

      const xmlText = await response.text();
       console.log(`YouTube XML Text Length: ${xmlText.length}`);
       const parser = new DOMParser();
       const xmlDoc = parser.parseFromString(xmlText, "application/xml");
       const errorNode = xmlDoc.querySelector('parsererror');
       if (errorNode) throw new Error('YouTube Feed Parse Error');

       const entries = xmlDoc.querySelectorAll('entry');
        console.log(`Found ${entries.length} YouTube entries`);
       if (entries.length === 0) {
           console.warn("No entries found in YouTube feed. Using mocks.");
           return mockVideos;
       }

       const videos = Array.from(entries).slice(0, 6).map((entry, index) => {
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
        console.log("Finished processing YouTube items.");
       return videos;
    } catch (error: any) {
       console.error('Failed during fetchYouTubeVideos. Error:', error);
       console.log('Using mock YouTube video data due to error.');
       return mockVideos;
    }
};


// --- Load Function (Add more logging) ---
export const loadFeaturedContent = async () => {
  console.log('>>> Starting loadFeaturedContent...');
  try {
    // Add log before calling Promise.allSettled
    console.log('>>> Calling Promise.allSettled for fetchBlogPosts and fetchYouTubeVideos...');
    const results = await Promise.allSettled([
      fetchBlogPosts(),
      fetchYouTubeVideos()
    ]);
    // Add log after Promise.allSettled resolves
    console.log('>>> Promise.allSettled finished. Results:', results);

    // Check blog post results
    let blogPosts: BlogPost[];
    if (results[0].status === 'fulfilled') {
      console.log('>>> Blog posts fetch succeeded.');
      blogPosts = results[0].value;
    } else {
      console.error('>>> Blog posts fetch failed:', results[0].reason);
      blogPosts = mockBlogPosts;
    }

    // Check video results
    let videos: Video[];
    if (results[1].status === 'fulfilled') {
      console.log('>>> YouTube videos fetch succeeded.');
      videos = results[1].value;
    } else {
      console.error('>>> YouTube videos fetch failed:', results[1].reason);
      videos = mockVideos;
    }

    console.log(`>>> Final Loaded Counts - Blog Posts: ${blogPosts.length}, Videos: ${videos.length}`);
    console.log(`>>> Blog post source: ${results[0].status === 'fulfilled' ? 'Fetched' : 'Mock'}`);
    console.log(`>>> Video source: ${results[1].status === 'fulfilled' ? 'Fetched' : 'Mock'}`);

    console.log('>>> loadFeaturedContent returning data.');
    return {
      featuredBlogPosts: blogPosts.slice(0, 3),
      featuredVideos: videos.slice(0, 3),
      allBlogPosts: blogPosts,
      allVideos: videos
    };
  } catch (error) {
      // Catch unexpected errors within loadFeaturedContent itself
      console.error('>>> UNEXPECTED ERROR within loadFeaturedContent:', error);
      // Return mock data in case of such an error
      return {
          featuredBlogPosts: mockBlogPosts.slice(0, 3),
          featuredVideos: mockVideos.slice(0, 3),
          allBlogPosts: mockBlogPosts,
          allVideos: mockVideos
      };
  }
};