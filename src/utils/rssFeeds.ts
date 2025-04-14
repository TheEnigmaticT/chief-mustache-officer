
import { parseString } from 'xml2js';
import { blogPosts as mockBlogPosts, videos as mockVideos } from '../data/publications';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  url: string;
  date: string;
  imageUrl?: string;
  featured?: boolean;
}

export interface Video {
  id: string;
  title: string;
  thumbnailUrl: string;
  videoUrl: string;
  videoId: string;
  date: string;
  featured?: boolean;
}

// Function to extract image from HTML content
const extractImageFromContent = (content: string): string | undefined => {
  const imgRegex = /<img[^>]+src="([^">]+)"/i;
  const match = content.match(imgRegex);
  return match ? match[1] : undefined;
};

// Helper to extract YouTube video ID from URL
const extractYouTubeId = (url: string): string => {
  const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\s*[^\/\n\s]+\/\s*(?:watch\?(?:\S*?&)?v=)|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : '';
};

// Get a local image based on index
const getLocalImage = (index: number): string => {
  const imageIndex = (index % 8) + 1;
  return `/lovable-uploads/image-${imageIndex}`;
};

// List of possible CORS proxies to try
const corsProxies = [
  'https://cors-anywhere.herokuapp.com/',
  'https://api.allorigins.win/raw?url=',
  'https://api.codetabs.com/v1/proxy?quest='
];

// Function to try fetching with different proxies
const fetchWithProxies = async (url: string): Promise<Response> => {
  // Try each proxy in order
  for (const proxy of corsProxies) {
    try {
      console.log(`Trying proxy: ${proxy} for URL: ${url}`);
      const response = await fetch(`${proxy}${encodeURIComponent(url)}`, {
        headers: {
          'Origin': window.location.origin
        }
      });
      
      if (response.ok) {
        return response;
      }
    } catch (error) {
      console.log(`Proxy ${proxy} failed:`, error);
    }
  }
  
  // Try direct fetch as last resort (might work in some environments)
  try {
    const directResponse = await fetch(url);
    if (directResponse.ok) {
      return directResponse;
    }
  } catch (error) {
    console.log('Direct fetch failed:', error);
  }
  
  throw new Error('All fetch attempts failed');
};

// Function to fetch and parse blog RSS with fallback
export const fetchBlogPosts = async (): Promise<BlogPost[]> => {
  console.log('Fetching blog posts...');
  try {
    // Try to fetch from RSS
    const response = await fetchWithProxies('https://crowdtamers.com/author/admin/feed/')
      .catch(() => {
        console.log('All proxy attempts failed for blog feed');
        throw new Error('Could not fetch blog feed');
      });
    
    const xml = await response.text();
    
    return new Promise((resolve, reject) => {
      parseString(xml, (err, result) => {
        if (err) {
          console.error('Error parsing blog RSS:', err);
          resolve(mockBlogPosts);
          return;
        }
        
        if (!result || !result.rss || !result.rss.channel || !result.rss.channel[0]) {
          console.error('Invalid RSS structure');
          resolve(mockBlogPosts);
          return;
        }
        
        try {
          const items = result.rss.channel[0].item || [];
          const posts: BlogPost[] = items.map((item: any, index: number) => {
            // Extract description and create excerpt
            let description = item.description ? item.description[0] : '';
            // Extract image from content
            const content = item['content:encoded'] ? item['content:encoded'][0] : description;
            const imageUrl = extractImageFromContent(content) || getLocalImage(index);
            
            // Strip HTML tags for excerpt
            const excerpt = description.replace(/<[^>]*>/g, '').substring(0, 150) + '...';
            
            return {
              id: `blog-${index}`,
              title: item.title ? item.title[0] : `Blog Post ${index}`,
              excerpt: excerpt,
              url: item.link ? item.link[0] : '#',
              imageUrl: imageUrl,
              date: item.pubDate ? new Date(item.pubDate[0]).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : new Date().toLocaleDateString(),
              featured: index < 3 // First 3 items are featured
            };
          });
          
          console.log(`Successfully parsed ${posts.length} blog posts`);
          resolve(posts);
        } catch (parseError) {
          console.error('Error processing blog data:', parseError);
          resolve(mockBlogPosts);
        }
      });
    });
  } catch (error) {
    console.error('Failed to fetch blog posts:', error);
    console.log('Falling back to mock blog data');
    return mockBlogPosts; // Return mock data on failure
  }
};

// Function to fetch and parse YouTube RSS with fallback to mock data
export const fetchYouTubeVideos = async (): Promise<Video[]> => {
  console.log('Fetching YouTube videos...');
  try {
    // Ensure correct channel ID
    const channelId = "UCMHNan83yARidp0Ycgq8lWw"; 
    const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    
    const response = await fetchWithProxies(url)
      .catch(() => {
        console.log('All proxy attempts failed for YouTube feed');
        throw new Error('Could not fetch YouTube feed');
      });
    
    const xml = await response.text();
    
    return new Promise((resolve, reject) => {
      parseString(xml, (err, result) => {
        if (err) {
          console.error('Error parsing YouTube RSS:', err);
          resolve(mockVideos);
          return;
        }
        
        if (!result || !result.feed || !result.feed.entry) {
          console.error('Invalid YouTube RSS structure');
          resolve(mockVideos);
          return;
        }
        
        try {
          const entries = result.feed.entry || [];
          const videos: Video[] = entries.map((entry: any, index: number) => {
            // Extract video ID using multiple fallback methods
            const videoId = entry['yt:videoId'] ? 
                            entry['yt:videoId'][0] : 
                            (entry.id ? extractYouTubeId(entry.id[0]) : '');
                           
            const finalVideoId = videoId || mockVideos[index % mockVideos.length].videoId;
            const videoUrl = `https://www.youtube.com/watch?v=${finalVideoId}`;
            const thumbnailUrl = entry.thumbnail && entry.thumbnail.length > 0 ? 
                                entry.thumbnail[0].$.url : 
                                `https://i.ytimg.com/vi/${finalVideoId}/hqdefault.jpg`;
            
            return {
              id: `video-${index}`,
              title: entry.title ? entry.title[0] : `Video ${index}`,
              thumbnailUrl: thumbnailUrl,
              videoUrl: videoUrl,
              videoId: finalVideoId,
              date: entry.published ? new Date(entry.published[0]).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : new Date().toLocaleDateString(),
              featured: index < 3 // First 3 videos are featured
            };
          });
          
          console.log(`Successfully parsed ${videos.length} videos`);
          resolve(videos);
        } catch (parseError) {
          console.error('Error processing video data:', parseError);
          resolve(mockVideos);
        }
      });
    });
  } catch (error) {
    console.error('Failed to fetch YouTube videos:', error);
    console.log('Falling back to mock video data');
    return mockVideos; // Return mock data on failure
  }
};

// Update this function to handle the CORS fallback gracefully
export const loadFeaturedContent = async () => {
  console.log('Loading featured content...');
  try {
    // Use Promise.allSettled to handle partial failures
    const results = await Promise.allSettled([
      fetchBlogPosts(),
      fetchYouTubeVideos()
    ]);
    
    // Get values or fallbacks
    const blogPosts = results[0].status === 'fulfilled' ? results[0].value : mockBlogPosts;
    const videos = results[1].status === 'fulfilled' ? results[1].value : mockVideos;
    
    // Ensure we have valid data
    const validBlogPosts = blogPosts.length > 0 ? blogPosts : mockBlogPosts;
    const validVideos = videos.length > 0 ? videos : mockVideos;
    
    return {
      featuredBlogPosts: validBlogPosts.filter(post => post.featured).slice(0, 3),
      featuredVideos: validVideos.filter(video => video.featured).slice(0, 3),
      allBlogPosts: validBlogPosts,
      allVideos: validVideos
    };
  } catch (error) {
    console.error('Error loading featured content:', error);
    return {
      featuredBlogPosts: mockBlogPosts.filter(post => post.featured).slice(0, 3),
      featuredVideos: mockVideos.filter(video => video.featured).slice(0, 3),
      allBlogPosts: mockBlogPosts,
      allVideos: mockVideos
    };
  }
};
