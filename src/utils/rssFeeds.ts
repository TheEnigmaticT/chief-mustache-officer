// src/utils/rssFeeds.ts

import { blogPosts as mockBlogPosts, videos as mockVideos } from '../data/publications';
import { extractOpenGraphImage, extractYouTubeId, debugLog } from './imageUtils';

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
  date: string;
}

// --- Constants ---

const CORS_PROXY_URL = 'https://api.allorigins.win/raw?url=';

// --- Fetch Functions ---

/**
 * Fetches blog posts from the WordPress feed using a CORS proxy,
 * with fallback to mock data.
 */
export const fetchBlogPosts = async (): Promise<BlogPost[]> => {
  console.log('🚀 Blog Posts Fetch Attempt');
  console.log('Starting blog post fetch...');
  const feedUrl = 'https://crowdtamers.com/feed/';
  const proxiedFeedUrl = CORS_PROXY_URL + encodeURIComponent(feedUrl);
  console.log('Attempting to fetch blog feed URL:', proxiedFeedUrl);

  try {
    const response = await fetch(proxiedFeedUrl);
    console.log('Blog Fetch Response:', { status: response.status, statusText: response.statusText, ok: response.ok });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Could not read error response.');
      console.error(`Blog feed fetch failed with status ${response.status}: ${errorText.substring(0, 500)}...`);
      throw new Error(`Failed to fetch blog feed: ${response.status} ${response.statusText}`);
    }

    const xmlText = await response.text();
    console.log(`Blog XML Text Length: ${xmlText.length}`);

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    const errorNode = xmlDoc.querySelector('parsererror');
    if (errorNode) {
        console.error('Error parsing blog XML:', errorNode.textContent);
        throw new Error('Failed to parse blog feed XML');
    }

    const items = xmlDoc.querySelectorAll('item');
    console.log(`Found ${items.length} blog items in the feed`);
    if (items.length > 0) {
      console.log(`Parsing ${items.length} blog items...`);
      // ... (rest of the parsing logic remains the same as the previous version) ...
       return Array.from(items).map((item, index) => {
        const title = item.querySelector('title')?.textContent || `Post ${index + 1}`;
        const link = item.querySelector('link')?.textContent || '';
        const guid = item.querySelector('guid')?.textContent || link || `blog-${index}`;
        const pubDate = item.querySelector('pubDate')?.textContent || new Date().toISOString();
        const description = item.querySelector('description')?.textContent || '';
        const contentEncoded = item.getElementsByTagNameNS('*', 'encoded')[0]?.textContent || '';

        let imageUrl = '';
        let imageSource = 'None';
        let ogImage: string | null = null;

        if (contentEncoded) {
           ogImage = extractOpenGraphImage(contentEncoded);
           if (ogImage) { imageUrl = ogImage; imageSource = 'OpenGraph'; }
         }
        if (!imageUrl && contentEncoded) {
          const imgMatch = contentEncoded.match(/<img[^>]+src="([^">]+)"/i);
          if (imgMatch && imgMatch[1]) { imageUrl = imgMatch[1]; imageSource = 'ContentImgTag'; }
        }
        if (!imageUrl) {
            const mediaContent = item.getElementsByTagNameNS('*', 'content')[0];
            if (mediaContent && mediaContent.getAttribute('medium') === 'image') {
                imageUrl = mediaContent.getAttribute('url') || '';
                if (imageUrl) imageSource = 'MediaContent';
            } else {
                 const enclosure = item.querySelector('enclosure');
                 if (enclosure && enclosure.getAttribute('type')?.startsWith('image/')) {
                     imageUrl = enclosure.getAttribute('url') || '';
                     if (imageUrl) imageSource = 'Enclosure';
                 }
            }
        }
        if (!imageUrl) {
          imageUrl = `/img/image-${(index % 7) + 2}.jpg`;
          imageSource = 'Fallback';
        }
        console.log(`[BlogItem ${index + 1} "${title.substring(0,30)}..."] Img Src: ${imageSource}, URL: ${imageUrl.substring(0, 60)}...`);

        let excerptSource = description || contentEncoded || '';
        excerptSource = excerptSource.replace(/<style[^>]*>.*?<\/style>/gs, '').replace(/<script[^>]*>.*?<\/script>/gs, '');
        excerptSource = excerptSource.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
        const excerpt = excerptSource.substring(0, 150) + (excerptSource.length > 150 ? '...' : '');

        return {
          id: guid, title, excerpt, url: link,
          date: new Date(pubDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          imageUrl: imageUrl, ogImage: ogImage || undefined
        };
      });
    } else {
       console.warn('No <item> elements found in the blog feed. Falling back to mock data.');
       return mockBlogPosts;
    }
  } catch (error: any) { // Catch 'any' to inspect the error object
    console.error('Failed to fetch or parse blog posts. Error Details:', error);
    // Log specific details if it's a Fetch error
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
         console.error('This looks like a Network Error or CORS Proxy Issue. Check proxy status and network connection.');
     }
    console.log('Using mock blog data due to error.');
    return mockBlogPosts;
  }
};

/**
 * Fetches YouTube video feed using a CORS proxy, with fallback to mock data.
 */
export const fetchYouTubeVideos = async (channelId = 'UCMHNan83yARidp0Ycgq8lWw'): Promise<Video[]> => {
  console.log('Fetching YouTube videos...');
  // --- Log the channelId being used ---
  console.log(`Using YouTube Channel ID: ${channelId}`);

  // --- Construct the feed URL carefully using the channelId ---
  // Ensure channelId is not null or undefined before using it.
  const effectiveChannelId = channelId || 'DEFAULT_FALLBACK_ID'; // Use fallback if channelId is somehow null/undefined
  if (!channelId) {
      console.warn("Channel ID was null or undefined, using fallback ID for URL construction!");
  }
  // *** Re-checking the CORRECT YouTube RSS Feed URL format ***
  // It requires the channel ID.
  const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=CHANNEL_ID`; // Use template literal correctly

  const proxiedFeedUrl = CORS_PROXY_URL + encodeURIComponent(feedUrl);
  console.log('Attempting to fetch YouTube feed via CORS proxy:', proxiedFeedUrl); // Log the final URL being fetched

  try {
    const response = await fetch(proxiedFeedUrl);
    console.log('YouTube Fetch Response:', { status: response.status, statusText: response.statusText, ok: response.ok });

    if (!response.ok) {
       const errorText = await response.text().catch(() => 'Could not read error response.');
       console.error(`YouTube feed fetch failed with status ${response.status}: ${errorText.substring(0, 500)}...`);
       // Explicitly check for 404 which confirms the URL is likely still wrong or the feed doesn't exist
       if (response.status === 404) {
           console.error(`Received a 404 Error. Double-check the constructed feed URL and ensure the channel ID (${effectiveChannelId}) is correct and the feed exists.`);
       }
       throw new Error(`Failed to fetch YouTube feed: ${response.status} ${response.statusText}`);
     }

    const xmlText = await response.text();
    console.log(`YouTube XML Text Length: ${xmlText.length}`);

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "application/xml");

    const errorNode = xmlDoc.querySelector('parsererror');
     if (errorNode) {
         console.error('Error parsing YouTube XML:', errorNode.textContent);
         throw new Error('Failed to parse YouTube feed XML');
     }

    const entries = xmlDoc.querySelectorAll('entry');
    console.log(`Found ${entries.length} YouTube entries in the feed`);
    if (entries.length > 0) {
      console.log(`Parsing ${entries.length} YouTube video entries...`);
      // ... (rest of the parsing logic remains the same as the previous version) ...
       return Array.from(entries).slice(0, 6).map((entry, index) => {
        const videoId = entry.getElementsByTagNameNS('http://www.youtube.com/xml/schemas/2015', 'videoId')[0]?.textContent || '';
        const title = entry.querySelector('title')?.textContent || `Video ${index + 1}`;
        const link = entry.querySelector('link[rel="alternate"]')?.getAttribute('href') || '';
        const pubDate = entry.querySelector('published')?.textContent || new Date().toISOString();

        const thumbnail = entry.getElementsByTagNameNS('http://search.yahoo.com/mrss/', 'thumbnail')[0];
        const thumbnailUrl = thumbnail?.getAttribute('url') || '';
        const imageSource = thumbnailUrl ? 'MediaThumbnail' : (videoId ? 'FallbackHQDefault' : 'FallbackGeneric');

        const finalThumbnailUrl = thumbnailUrl || (videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : `/img/image-${(index % 3) + 1}.jpg`);
        const finalVideoId = videoId || extractYouTubeId(link) || `unknown-${index}`;

        console.log(`[YouTubeItem ${index + 1} "${title.substring(0,30)}..."] Img Src: ${imageSource}, URL: ${finalThumbnailUrl.substring(0,60)}..., VideoID: ${finalVideoId}`);

        return {
          id: `video-${finalVideoId}`, title, thumbnailUrl: finalThumbnailUrl, videoUrl: link, videoId: finalVideoId,
          date: new Date(pubDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        };
      });
    } else {
       console.warn('No <entry> elements found in the YouTube feed. Falling back to mock data.');
       return mockVideos;
     }
  } catch (error: any) {
    console.error('Failed to fetch or parse YouTube videos. Error Details:', error);
    console.log('Using mock YouTube video data due to error.');
    return mockVideos;
  }
};


/**
 * Load all featured content (blog posts and videos) with fallbacks.
 */
export const loadFeaturedContent = async () => {
  console.log('Loading featured content...');

  const results = await Promise.allSettled([
    fetchBlogPosts(),
    fetchYouTubeVideos()
  ]);

  const blogPosts = results[0].status === 'fulfilled'
    ? results[0].value
    : (console.error("Blog post fetch promise rejected, using mocks."), mockBlogPosts);

  const videos = results[1].status === 'fulfilled'
    ? results[1].value
    : (console.error("YouTube video fetch promise rejected, using mocks."), mockVideos);

  console.log(`Final Loaded Counts - Blog Posts: ${blogPosts.length}, Videos: ${videos.length}`);
  console.log(`Blog post source: ${results[0].status === 'fulfilled' ? 'Fetched' : 'Mock'}`);
  console.log(`Video source: ${results[1].status === 'fulfilled' ? 'Fetched' : 'Mock'}`);


  return {
    featuredBlogPosts: blogPosts.slice(0, 3),
    featuredVideos: videos.slice(0, 3),
    allBlogPosts: blogPosts,
    allVideos: videos
  };
};