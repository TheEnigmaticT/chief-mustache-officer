// src/utils/rssFeeds.ts

import { blogPosts as mockBlogPosts, videos as mockVideos } from '../data/publications';
import { extractYouTubeId, debugLog } from './imageUtils';
import { supabase } from "@/integrations/supabase/client";
import logger from './logger';

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
      logger.log('Starting blog feed fetch from: ' + BLOG_FEED_URL);
      const response = await fetch(PROXIED_BLOG_FEED_URL);
      console.log('Blog Fetch Response:', { status: response.status, ok: response.ok });
      logger.log(`Blog feed response status: ${response.status}, ok: ${response.ok}`);
      
      if (!response.ok) {
        const errorMsg = `Blog Feed Fetch Failed: ${response.status}`;
        logger.error(errorMsg);
        throw new Error(errorMsg);
      }
      
      const xmlText = await response.text();
      logger.log(`Blog feed XML received, length: ${xmlText.length} characters`);
      
      if (xmlText.length < 100) {
        logger.error('Blog feed returned suspiciously short content: ' + xmlText);
        return mockBlogPosts; // Likely an error page or empty response
      }

      logger.log('Raw XML Text:', xmlText); // Add this line
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      const errorNode = xmlDoc.querySelector('parsererror');
      
      if (errorNode) {
        logger.error('XML Parse Error: ' + errorNode.textContent);
        throw new Error('Blog Feed Parse Error');
      }
      
      const items = xmlDoc.querySelectorAll('item');
      logger.log(`Found ${items.length} blog items in feed`);
      
      if (items.length === 0) {
        logger.warn('No blog items found in feed, using mock data');
        return mockBlogPosts; // Use mock if no items
      }

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
      
      logger.log(`Successfully processed ${posts.length} blog posts from feed`);
      return posts;
    } catch (error: any) {
      logger.error(`Failed during fetchBlogPosts. Error: ${error.message || 'Unknown error'}`);
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
    logger.log('Starting YouTube video fetch from Supabase Edge Function');
    
    const { data: response, error } = await supabase.functions.invoke('fetch-youtube');
    
    if (error) {
      logger.error(`Supabase function error: ${error.message || JSON.stringify(error)}`);
      console.error('Error fetching videos:', error);
      // Make sure to add embedUrl to each mock video
      return mockVideos.map(v => ({
        ...v,
        embedUrl: v.embedUrl || `https://www.youtube.com/embed/${v.videoId}`
      }));
    }

    if (!Array.isArray(response)) {
      logger.error(`Invalid response format: ${JSON.stringify(response)}`);
      console.error('Invalid response format:', response);
      // Make sure to add embedUrl to each mock video
      return mockVideos.map(v => ({
        ...v,
        embedUrl: v.embedUrl || `https://www.youtube.com/embed/${v.videoId}`
      }));
    }

    logger.log(`Successfully fetched ${response.length} videos from Supabase`);
    return response;
  } catch (error: any) {
    logger.error(`Failed to fetch YouTube videos: ${error.message || 'Unknown error'}`);
    console.error('Failed to fetch YouTube videos:', error);
    // Make sure to add embedUrl to each mock video
    return mockVideos.map(v => ({
      ...v,
      embedUrl: v.embedUrl || `https://www.youtube.com/embed/${v.videoId}`
    }));
  }
};

// --- loadFeaturedContent function: enhanced with better logging ---
export const loadFeaturedContent = async () => {
  logger.log('>>> Starting loadFeaturedContent...');
  console.log('>>> Starting loadFeaturedContent...');
  let blogSource = 'Mock'; // Default to mock
  let videoSource = 'Mock'; // Default to mock

  try {
    logger.log('>>> Calling Promise.allSettled for blog posts and videos...');
    console.log('>>> Calling Promise.allSettled...');
    const results = await Promise.allSettled([ fetchBlogPosts(), fetchYouTubeVideos() ]);
    console.log('>>> Promise.allSettled finished.'); // Simplified log
    logger.log('>>> Promise.allSettled finished.');

    let blogPosts: BlogPost[];
    if (results[0].status === 'fulfilled') {
      blogPosts = results[0].value;
      // Check if mock data was returned by fetchBlogPosts (e.g., if feed had no items)
      if (blogPosts === mockBlogPosts) { // Check by reference IF fetch returns mock on empty
           logger.log('>>> Blog posts fetch returned mock data (or empty feed).');
           console.log('>>> Blog posts fetch returned mock data (or empty feed).');
           blogSource = 'Mock (or empty)';
      } else {
           logger.log('>>> Blog posts fetch succeeded.');
           console.log('>>> Blog posts fetch succeeded.');
           blogSource = 'Fetched';
      }
    } else {
      logger.error(`>>> Blog posts fetch failed: ${results[0].reason}`);
      console.error('>>> Blog posts fetch failed:', results[0].reason);
      blogPosts = mockBlogPosts; // Use mock data on failure
      blogSource = 'Mock (Fetch Failed)';
    }

    let videos: Video[];
    if (results[1].status === 'fulfilled') {
      videos = results[1].value;
      // Check if mock data was returned by fetchYouTubeVideos (due to internal error)
       if (videos === mockVideos.map(v => ({ ...v, embedUrl: v.videoId ? `https://www.youtube.com/embed/${v.videoId}` : '' }))) { // Check if it's the mapped mock data
           logger.log('>>> YouTube videos fetch failed internally, using mock data.');
           console.log('>>> YouTube videos fetch failed internally, using mock data.');
           videoSource = 'Mock (Fetch Failed)';
       } else {
          logger.log('>>> YouTube videos fetch succeeded.');
          console.log('>>> YouTube videos fetch succeeded.');
          videoSource = 'Fetched';
       }
    } else {
      // This case might not be hit if fetchYouTubeVideos always catches and returns mocks
      logger.error(`>>> YouTube videos fetch promise rejected: ${results[1].reason}`);
      console.error('>>> YouTube videos fetch promise rejected:', results[1].reason);
      videos = mockVideos.map(v => ({ ...v, embedUrl: v.videoId ? `https://www.youtube.com/embed/${v.videoId}` : '' })); // Use mock data
      videoSource = 'Mock (Promise Rejected)';
    }

    logger.log(`>>> Final Loaded Counts - Blog Posts: ${blogPosts.length}, Videos: ${videos.length}`);
    logger.log(`>>> Blog post source: ${blogSource}`);
    logger.log(`>>> Video source: ${videoSource}`);
    console.log(`>>> Final Loaded Counts - Blog Posts: ${blogPosts.length}, Videos: ${videos.length}`);
    console.log(`>>> Blog post source: ${blogSource}`);
    console.log(`>>> Video source: ${videoSource}`); // More accurate source logging
    console.log('>>> loadFeaturedContent returning data.');

    return {
      featuredBlogPosts: blogPosts.slice(0, 4),
      featuredVideos: videos.slice(0, 6),
      allBlogPosts: blogPosts,
      allVideos: videos
    };

  } catch (error: any) {
    const errorMsg = `>>> Critical error in loadFeaturedContent: ${error.message || 'Unknown error'}`;
    logger.error(errorMsg);
    console.error(errorMsg);
    const mockVidsWithEmbed = mockVideos.map(v => ({ ...v, embedUrl: v.videoId ? `https://www.youtube.com/embed/${v.videoId}` : '' }));
    return {
       featuredBlogPosts: mockBlogPosts.slice(0, 4),
       featuredVideos: mockVidsWithEmbed.slice(0, 6),
       allBlogPosts: mockBlogPosts,
       allVideos: mockVidsWithEmbed
     };
  }
};
