// src/utils/rssFeeds.ts

import { blogPosts as mockBlogPosts, videos as mockVideos } from '../data/publications';
import { extractYouTubeId, debugLog } from './imageUtils';
import { supabase } from "@/integrations/supabase/client";

// --- Interfaces ---
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  url: string;
  date: string;
  imageUrl?: string;
  ogImage?: string;
}

export interface Video {
  id: string;
  title: string;
  thumbnailUrl: string;
  videoUrl: string;
  videoId: string;
  embedUrl: string;
  date: string;
}

// --- Constants ---
const CORS_PROXY_URL = 'https://api.allorigins.win/raw?url=';
const YOUTUBE_CHANNEL_ID = 'UCMHNan83yARidp0Ycgq8lWw'; // *** DOUBLE CHECK THIS ID IS CORRECT ***

// *** Correct the RAW YouTube Feed URL format ***
const YOUTUBE_FEED_URL_RAW = `https://www.youtube.com/embed/$$`; // Use the standard feed format

// *** Rebuild the RSS2JSON URL with the corrected raw URL and Channel ID ***
const RSS2JSON_YOUTUBE_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(YOUTUBE_FEED_URL_RAW + YOUTUBE_CHANNEL_ID)}`;

const BLOG_FEED_URL = 'https://crowdtamers.com/blog/feed/';
const PROXIED_BLOG_FEED_URL = CORS_PROXY_URL + encodeURIComponent(BLOG_FEED_URL);
const KNOWN_GOOD_PLACEHOLDER = '/placeholder.svg';

// --- Fetch Functions ---

// fetchBlogPosts remains the same...
export const fetchBlogPosts = async (): Promise<BlogPost[]> => {
    console.log('🚀 Blog Posts Fetch Attempt (Parsing Feed Images)');
    console.log('Attempting to fetch blog feed URL:', PROXIED_BLOG_FEED_URL);
    try {
      const response = await fetch(PROXIED_BLOG_FEED_URL);
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
        //   console.log(`[BlogItem ${index + 1}] Img: ${imageUrl.substring(0,60)}... (Src: ${imageSource})`); // Optional: reduce log noise
          let excerptSource = description || contentEncoded || '';
          excerptSource = excerptSource.replace(/<style[^>]*>.*?<\/style>/gs, '').replace(/<script[^>]*>.*?<\/script>/gs, '');
          excerptSource = excerptSource.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
          const excerpt = excerptSource.substring(0, 150) + (excerptSource.length > 150 ? '...' : '');

        return { id: guid, title, excerpt, url: link, date: new Date(pubDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), imageUrl: imageUrl };
      });
    //   console.log("Finished processing blog items."); // Optional: reduce log noise
      return posts;
    } catch (error: any) {
      console.error('Failed during fetchBlogPosts. Error:', error);
      return mockBlogPosts; // Fallback
    }
};

/**
 * Fetches YouTube video feed using Supabase Edge Function
 */
export const fetchYouTubeVideos = async (): Promise<Video[]> => {
  try {
    console.log('Fetching videos from Supabase Edge Function...');
    const { data: response, error } = await supabase.functions.invoke('fetch-youtube');
    
    if (error) {
      console.error('Error fetching videos:', error);
      return mockVideos;
    }

    if (!Array.isArray(response)) {
      console.error('Invalid response format:', response);
      return mockVideos;
    }

    return response;
  } catch (error) {
    console.error('Failed to fetch YouTube videos:', error);
    return mockVideos;
  }
};

// --- loadFeaturedContent (Adjust logging for clarity) ---
export const loadFeaturedContent = async () => {
  console.log('>>> Starting loadFeaturedContent...');
  let blogSource = 'Mock'; // Default to mock
  let videoSource = 'Mock'; // Default to mock

  try {
    console.log('>>> Calling Promise.allSettled...');
    const results = await Promise.allSettled([ fetchBlogPosts(), fetchYouTubeVideos() ]);
    console.log('>>> Promise.allSettled finished.'); // Simplified log

    let blogPosts: BlogPost[];
    if (results[0].status === 'fulfilled') {
      // console.log('>>> Blog posts promise fulfilled.'); // Redundant with below
      blogPosts = results[0].value;
      // Check if mock data was returned by fetchBlogPosts (e.g., if feed had no items)
      if (blogPosts === mockBlogPosts) { // Check by reference IF fetch returns mock on empty
           console.log('>>> Blog posts fetch returned mock data (or empty feed).');
           blogSource = 'Mock (or empty)';
      } else {
           console.log('>>> Blog posts fetch succeeded.');
           blogSource = 'Fetched';
      }
    } else {
      console.error('>>> Blog posts fetch failed:', results[0].reason);
      blogPosts = mockBlogPosts; // Use mock data on failure
      blogSource = 'Mock (Fetch Failed)';
    }

    let videos: Video[];
    if (results[1].status === 'fulfilled') {
      // console.log('>>> YouTube videos promise fulfilled.'); // Redundant with below
      videos = results[1].value;
      // Check if mock data was returned by fetchYouTubeVideos (due to internal error)
       if (videos === mockVideos.map(v => ({ ...v, embedUrl: v.videoId ? `https://www.youtube.com/embed/${v.videoId}` : '' }))) { // Check if it's the mapped mock data
           console.log('>>> YouTube videos fetch failed internally, using mock data.');
           videoSource = 'Mock (Fetch Failed)';
       } else {
          console.log('>>> YouTube videos fetch succeeded.');
          videoSource = 'Fetched';
       }
    } else {
      // This case might not be hit if fetchYouTubeVideos always catches and returns mocks
      console.error('>>> YouTube videos fetch promise rejected:', results[1].reason);
      videos = mockVideos.map(v => ({ ...v, embedUrl: v.videoId ? `https://www.youtube.com/embed/${v.videoId}` : '' })); // Use mock data
      videoSource = 'Mock (Promise Rejected)';
    }

    console.log(`>>> Final Loaded Counts - Blog Posts: ${blogPosts.length}, Videos: ${videos.length}`);
    console.log(`>>> Blog post source: ${blogSource}`);
    console.log(`>>> Video source: ${videoSource}`); // More accurate source logging
    console.log('>>> loadFeaturedContent returning data.');

    return {
      featuredBlogPosts: blogPosts.slice(0, 3),
      featuredVideos: videos.slice(0, 6),
      allBlogPosts: blogPosts,
      allVideos: videos
    };

  } catch (error) {
    console.error('>>> Critical error in loadFeaturedContent:', error);
    const mockVidsWithEmbed = mockVideos.map(v => ({ ...v, embedUrl: v.videoId ? `https://www.youtube.com/embed/${v.videoId}` : '' }));
    return {
       featuredBlogPosts: mockBlogPosts.slice(0, 3),
       featuredVideos: mockVidsWithEmbed.slice(0, 6),
       allBlogPosts: mockBlogPosts,
       allVideos: mockVidsWithEmbed
     };
  }
};
