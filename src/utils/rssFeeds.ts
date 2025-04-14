
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

// Function to fetch and parse blog RSS with fallback
export const fetchBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    // Use a CORS proxy or direct request if possible
    const response = await fetch('https://cors-anywhere.herokuapp.com/https://crowdtamers.com/author/admin/feed/', {
      headers: {
        'Origin': window.location.origin
      }
    }).catch(() => {
      console.log('Fallback to mock blog posts due to CORS issues');
      throw new Error('CORS issue with blog feed');
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
        
        resolve(posts);
      });
    });
  } catch (error) {
    console.error('Failed to fetch blog posts:', error);
    return mockBlogPosts; // Return mock data on failure
  }
};

// Function to fetch and parse YouTube RSS with fallback to mock data
export const fetchYouTubeVideos = async (): Promise<Video[]> => {
  try {
    // Try to use a CORS proxy
    const channelId = "UCMHNan83yARidp0Ycgq8lWw"; // Ensure correct channel ID
    const response = await fetch(`https://cors-anywhere.herokuapp.com/https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`, {
      headers: {
        'Origin': window.location.origin
      }
    }).catch(() => {
      console.log('Fallback to mock videos due to CORS issues');
      throw new Error('CORS issue with YouTube feed');
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
        
        const entries = result.feed.entry || [];
        const videos: Video[] = entries.map((entry: any, index: number) => {
          const videoId = entry.videoId || 
                         (entry['yt:videoId'] ? entry['yt:videoId'][0] : '') || 
                         (entry.id ? extractYouTubeId(entry.id[0]) : '') ||
                         mockVideos[index % mockVideos.length].videoId;
                         
          const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
          const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
          
          return {
            id: `video-${index}`,
            title: entry.title ? entry.title[0] : `Video ${index}`,
            thumbnailUrl: thumbnailUrl,
            videoUrl: videoUrl,
            videoId: videoId,
            date: entry.published ? new Date(entry.published[0]).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }) : new Date().toLocaleDateString(),
            featured: index < 3 // First 3 videos are featured
          };
        });
        
        resolve(videos);
      });
    });
  } catch (error) {
    console.error('Failed to fetch YouTube videos:', error);
    return mockVideos; // Return mock data on failure
  }
};

// Update this function to handle the CORS fallback gracefully
export const loadFeaturedContent = async () => {
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
