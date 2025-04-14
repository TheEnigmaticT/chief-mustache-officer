
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

// Function to extract Open Graph image from HTML content
const extractOpenGraphImage = (content: string): string | undefined => {
  const ogRegex = /<meta\s+property="og:image"\s+content="([^">]+)"/i;
  const match = content.match(ogRegex);
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

// Function to fetch blog posts using RSS2JSON API
export const fetchBlogPosts = async (): Promise<BlogPost[]> => {
  console.log('Fetching blog posts with RSS2JSON API...');
  try {
    const rss2jsonUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent('https://crowdtamers.com/author/admin/feed/')}`;
    const response = await fetch(rss2jsonUrl);
    
    if (!response.ok) {
      throw new Error(`RSS2JSON API returned ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Blog RSS data received:', data);
    
    if (data.status !== 'ok' || !data.items || !Array.isArray(data.items)) {
      console.error('Invalid RSS2JSON response format:', data);
      return mockBlogPosts;
    }
    
    const posts: BlogPost[] = data.items.map((item: any, index: number) => {
      // Try to extract image URL from various sources with fallbacks
      const imageUrl = 
        item.thumbnail || 
        extractOpenGraphImage(item.content) || 
        extractImageFromContent(item.content) || 
        getLocalImage(index);
      
      // Create excerpt from description/content
      let excerpt = item.description || '';
      // Strip HTML tags for excerpt
      excerpt = excerpt.replace(/<[^>]*>/g, '').substring(0, 150) + '...';
      
      return {
        id: `blog-${index}`,
        title: item.title || `Blog Post ${index}`,
        excerpt: excerpt,
        url: item.link || '#',
        imageUrl: imageUrl,
        date: item.pubDate ? new Date(item.pubDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }) : new Date().toLocaleDateString(),
        featured: index < 3 // First 3 items are featured
      };
    });
    
    console.log(`Successfully parsed ${posts.length} blog posts`);
    return posts;
  } catch (error) {
    console.error('Failed to fetch blog posts:', error);
    console.log('Falling back to mock blog data');
    return mockBlogPosts;
  }
};

// Function to fetch YouTube videos with RSS2JSON API
export const fetchYouTubeVideos = async (): Promise<Video[]> => {
  console.log('Fetching YouTube videos with RSS2JSON API...');
  try {
    const channelId = "UCMHNan83yARidp0Ycgq8lWw";
    const rss2jsonUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`)}`;
    
    const response = await fetch(rss2jsonUrl);
    
    if (!response.ok) {
      throw new Error(`RSS2JSON API returned ${response.status}`);
    }
    
    const data = await response.json();
    console.log('YouTube RSS data received:', data);
    
    if (data.status !== 'ok' || !data.items || !Array.isArray(data.items)) {
      console.error('Invalid RSS2JSON response format:', data);
      return mockVideos;
    }
    
    const videos: Video[] = data.items.map((item: any, index: number) => {
      // Extract video ID using multiple fallback methods
      const videoId = extractYouTubeId(item.link);
      const finalVideoId = videoId || mockVideos[index % mockVideos.length].videoId;
      
      return {
        id: `video-${index}`,
        title: item.title || `Video ${index}`,
        thumbnailUrl: item.thumbnail || `https://i.ytimg.com/vi/${finalVideoId}/hqdefault.jpg`,
        videoUrl: item.link || `https://www.youtube.com/watch?v=${finalVideoId}`,
        videoId: finalVideoId,
        date: item.pubDate ? new Date(item.pubDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }) : new Date().toLocaleDateString(),
        featured: index < 3 // First 3 videos are featured
      };
    });
    
    console.log(`Successfully parsed ${videos.length} videos`);
    return videos;
  } catch (error) {
    console.error('Failed to fetch YouTube videos:', error);
    console.log('Falling back to mock video data');
    return mockVideos;
  }
};

// Update this function to handle the RSS2JSON API
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
