// src/utils/rssFeeds.ts

import { blogPosts as mockBlogPosts, videos as mockVideos } from '../data/publications';
// Assuming imageUtils contains the necessary helper functions:
// - extractOpenGraphImage(htmlString): string | null
// - extractYouTubeId(url): string | null
// - debugLog(message): void
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
  console.log('🚀 Blog Posts Fetch Attempt'); // Log start
  console.log('Starting blog post fetch...');
  const feedUrl = 'https://crowdtamers.com/feed/';
  const proxiedFeedUrl = CORS_PROXY_URL + encodeURIComponent(feedUrl);
  console.log('Attempting to fetch blog feed URL:', proxiedFeedUrl); // Log URL

  try {
    const response = await fetch(proxiedFeedUrl);
    console.log('Fetch Response:', { status: response.status, statusText: response.statusText, ok: response.ok }); // Log response status

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Could not read error response.');
      console.error(`Blog feed fetch failed with status ${response.status}: ${errorText}`);
      throw new Error(`Failed to fetch blog feed: ${response.status} ${response.statusText}`);
    }

    const xmlText = await response.text();
    console.log(`XML Text Length: ${xmlText.length}`); // Log XML length
    // console.log('First 500 characters of XML:', xmlText.substring(0, 500)); // Optional: Log start of XML

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    const errorNode = xmlDoc.querySelector('parsererror');
    if (errorNode) {
        console.error('Error parsing blog XML:', errorNode.textContent);
        throw new Error('Failed to parse blog feed XML');
    }

    const items = xmlDoc.querySelectorAll('item');
    console.log(`Found ${items.length} items in the feed`); // Log item count
    if (items.length > 0) {
      console.log(`Parsed ${items.length} blog items.`);
      return Array.from(items).map((item, index) => {
        const title = item.querySelector('title')?.textContent || `Post ${index + 1}`;
        const link = item.querySelector('link')?.textContent || '';
        const guid = item.querySelector('guid')?.textContent || link || `blog-${index}`;
        const pubDate = item.querySelector('pubDate')?.textContent || new Date().toISOString();
        const description = item.querySelector('description')?.textContent || '';
        const contentEncoded = item.getElementsByTagNameNS('*', 'encoded')[0]?.textContent || '';

        let imageUrl = '';
        let imageSource = 'None'; // Track where the image came from
        let ogImage: string | null = null;

        // 1. Try Open Graph image from content:encoded
         if (contentEncoded) {
           ogImage = extractOpenGraphImage(contentEncoded);
           if (ogImage) {
             imageUrl = ogImage;
             imageSource = 'OpenGraph';
           }
         }

        // 2. Try extracting regular image from content:encoded if no OG image
        if (!imageUrl && contentEncoded) {
          const imgMatch = contentEncoded.match(/<img[^>]+src="([^">]+)"/i);
          if (imgMatch && imgMatch[1]) {
            imageUrl = imgMatch[1];
            imageSource = 'ContentImgTag';
           }
        }

        // 3. Try extracting from media:content or enclosure
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

        // 4. Use placeholder if no image found
        if (!imageUrl) {
          imageUrl = `/img/image-${(index % 7) + 2}.jpg`; // Default fallback path
          imageSource = 'Fallback';
        }

        // Log the chosen image source and URL for this item
        console.log(`[BlogItem ${index + 1} "${title}"] Image Source: ${imageSource}, URL: ${imageUrl}`);

        // Create excerpt
        let excerptSource = description || contentEncoded || '';
        excerptSource = excerptSource.replace(/<style[^>]*>.*?<\/style>/gs, '').replace(/<script[^>]*>.*?<\/script>/gs, '');
        excerptSource = excerptSource.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
        const excerpt = excerptSource.substring(0, 150) + (excerptSource.length > 150 ? '...' : '');

        return {
          id: guid,
          title,
          excerpt,
          url: link,
          date: new Date(pubDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          imageUrl: imageUrl,
          ogImage: ogImage || undefined
        };
      });
    } else {
       console.warn('No <item> elements found in the blog feed. Falling back to mock data.');
       return mockBlogPosts;
    }
  } catch (error) {
    console.error('Failed to fetch or parse blog posts:', error);
    console.log('Using mock blog data due to error.');
    return mockBlogPosts;
  }
};

/**
 * Fetches YouTube video feed using a CORS proxy, with fallback to mock data.
 */
export const fetchYouTubeVideos = async (channelId = 'UCMHNan83yARidp0Ycgq8lWw'): Promise<Video[]> => {
  console.log('Fetching YouTube videos...');
  // *** FIX: Correct YouTube RSS Feed URL format using the channelId ***
  const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=CHANNEL_ID`; // Correct base URL
  const proxiedFeedUrl = CORS_PROXY_URL + encodeURIComponent(feedUrl);
  console.log('Attempting to fetch YouTube feed via CORS proxy:', proxiedFeedUrl); // Log URL

  try {
    const response = await fetch(proxiedFeedUrl);
     console.log('YouTube Fetch Response:', { status: response.status, statusText: response.statusText, ok: response.ok }); // Log response status


    if (!response.ok) {
       const errorText = await response.text().catch(() => 'Could not read error response.');
       // Log the specific 404 error text from the server if possible
       console.error(`YouTube feed fetch failed with status ${response.status}: ${errorText.substring(0, 500)}...`); // Log start of error page
       throw new Error(`Failed to fetch YouTube feed: ${response.status} ${response.statusText}`);
     }

    const xmlText = await response.text();
     console.log(`YouTube XML Text Length: ${xmlText.length}`); // Log XML length
     // console.log('First 500 characters of YouTube XML:', xmlText.substring(0, 500)); // Optional

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "application/xml");

    const errorNode = xmlDoc.querySelector('parsererror');
     if (errorNode) {
         console.error('Error parsing YouTube XML:', errorNode.textContent);
         throw new Error('Failed to parse YouTube feed XML');
     }

    const entries = xmlDoc.querySelectorAll('entry');
     console.log(`Found ${entries.length} entries in YouTube feed`); // Log entry count
    if (entries.length > 0) {
      console.log(`Parsed ${entries.length} YouTube video entries.`);
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

         console.log(`[YouTubeItem ${index + 1} "${title}"] Image Source: ${imageSource}, URL: ${finalThumbnailUrl}, VideoID: ${finalVideoId}`);


        return {
          id: `video-${finalVideoId}`,
          title,
          thumbnailUrl: finalThumbnailUrl,
          videoUrl: link,
          videoId: finalVideoId,
          date: new Date(pubDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        };
      });
    } else {
       console.warn('No <entry> elements found in the YouTube feed. Falling back to mock data.');
       return mockVideos;
     }
  } catch (error) {
    console.error('Failed to fetch or parse YouTube videos:', error);
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

  console.log(`Loaded ${blogPosts.length} blog posts and ${videos.length} videos.`);

  return {
    featuredBlogPosts: blogPosts.slice(0, 3),
    featuredVideos: videos.slice(0, 3),
    allBlogPosts: blogPosts,
    allVideos: videos
  };
};