// src/utils/rssFeeds.ts

// Assuming mock data and utils are correctly imported
import { blogPosts as mockBlogPosts, videos as mockVideos } from '../data/publications';
import { extractYouTubeId, debugLog } from './imageUtils'; // extractOpenGraphImage likely not needed now

// --- Interfaces ---

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  url: string;
  date: string;
  imageUrl?: string; // The primary image URL found or placeholder
  // ogImage field removed
}

export interface Video {
  // ... same as before ...
  id: string;
  title: string;
  thumbnailUrl: string;
  videoUrl: string;
  videoId: string;
  date: string;
}

// --- Constants ---
const CORS_PROXY_URL = 'https://api.allorigins.win/raw?url=';
const YOUTUBE_CHANNEL_ID = 'UCMHNan83yARidp0Ycgq8lWw';
const YOUTUBE_FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=CHANNEL_ID`;
const PROXIED_YOUTUBE_FEED_URL = CORS_PROXY_URL + encodeURIComponent(YOUTUBE_FEED_URL);
// *** UPDATE Blog Feed URL ***
const BLOG_FEED_URL = 'https://crowdtamers.com/blog/feed/'; // Updated URL
const PROXIED_BLOG_FEED_URL = CORS_PROXY_URL + encodeURIComponent(BLOG_FEED_URL);
const KNOWN_GOOD_PLACEHOLDER = '/placeholder.svg'; // Keep placeholder as final fallback

// --- Fetch Functions ---

/**
 * Fetches blog posts, parses feed including DIRECTLY EMBEDDED images.
 */
export const fetchBlogPosts = async (): Promise<BlogPost[]> => {
  console.log('🚀 Blog Posts Fetch Attempt (Parsing Feed Images)');
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

        let imageUrl = ''; // Initialize imageUrl
        let imageSource = 'None';

        // --- Start Image Extraction from Feed ---

        // 1. Look for <media:content> (Preferred Method)
        // Use namespace URI 'http://search.yahoo.com/mrss/'
        const mediaContent = item.getElementsByTagNameNS('http://search.yahoo.com/mrss/', 'content')[0];
        if (mediaContent && mediaContent.getAttribute('medium') === 'image') {
            imageUrl = mediaContent.getAttribute('url') || '';
            if (imageUrl) {
                imageSource = 'MediaContent';
            }
        }

        // 2. If no media:content, look for <img> in <content:encoded>
        if (!imageUrl && contentEncoded) {
            const imgMatch = contentEncoded.match(/<img[^>]+src="([^">]+)"/i);
            if (imgMatch && imgMatch[1]) {
                imageUrl = imgMatch[1];
                imageSource = 'ContentImgTag';
            }
        }

        // 3. If still no image, look for <img> in <description>
        if (!imageUrl && description) {
             const imgMatch = description.match(/<img[^>]+src="([^">]+)"/i);
             if (imgMatch && imgMatch[1]) {
                 imageUrl = imgMatch[1];
                 imageSource = 'DescriptionImgTag';
             }
        }

        // 4. Assign Fallback if no image found by any method
        if (!imageUrl) {
            imageUrl = KNOWN_GOOD_PLACEHOLDER;
            imageSource = 'FallbackPlaceholder';
        }

        console.log(`[BlogItem ${index + 1} "${title.substring(0,30)}..."] Final Image URL Assigned: ${imageUrl.substring(0, 60)}... (Source: ${imageSource})`);

        // Create Excerpt (same as before)
        let excerptSource = description || contentEncoded || '';
        excerptSource = excerptSource.replace(/<style[^>]*>.*?<\/style>/gs, '').replace(/<script[^>]*>.*?<\/script>/gs, '');
        excerptSource = excerptSource.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
        const excerpt = excerptSource.substring(0, 150) + (excerptSource.length > 150 ? '...' : '');

        return {
          id: guid, title, excerpt, url: link,
          date: new Date(pubDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          imageUrl: imageUrl, // Assign the final URL found (or placeholder)
          // No ogImage field anymore
        };
      });
      console.log("Finished processing blog items (with direct image parsing).");
      return posts;
    } else {
      console.warn('No <item> elements found in blog feed. Using mocks.');
      return mockBlogPosts;
    }
  } catch (error: any) {
    console.error('Failed during fetchBlogPosts. Error:', error);
    console.log('Using mock blog data due to fetch/parse error.');
    return mockBlogPosts;
  }
};

// --- fetchYouTubeVideos (Should remain the same - assuming hardcoded URL worked or needs separate debugging) ---
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


// --- loadFeaturedContent (remains the same) ---
export const loadFeaturedContent = async () => {
  console.log('>>> Starting loadFeaturedContent...');
  try {
    console.log('>>> Calling Promise.allSettled for fetchBlogPosts and fetchYouTubeVideos...');
    const results = await Promise.allSettled([
      fetchBlogPosts(),
      fetchYouTubeVideos()
    ]);
    console.log('>>> Promise.allSettled finished. Results:', results);

    let blogPosts: BlogPost[];
    if (results[0].status === 'fulfilled') {
      console.log('>>> Blog posts fetch succeeded.');
      blogPosts = results[0].value;
    } else {
      console.error('>>> Blog posts fetch failed:', results[0].reason);
      blogPosts = mockBlogPosts;
    }

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
      console.error('>>> UNEXPECTED ERROR within loadFeaturedContent:', error);
      return { /* Return mock data */ };
  }
};