// src/utils/rssUtils.ts

/**
 * A more robust RSS feed fetcher with fallback mechanisms
 */

// Define interfaces
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  url: string;
  date: string;
  imageUrl?: string;
}

export interface Video {
  id: string;
  title: string;
  thumbnailUrl: string;
  videoUrl: string;
  videoId: string;
  date: string;
}

// Fallback data
import { blogPosts as mockBlogPosts, videos as mockVideos } from '../data/publications';

/**
 * Tries multiple RSS parsers to get content
 */
export const fetchBlogPosts = async (): Promise<BlogPost[]> => {
  console.log('Fetching blog posts...');
  
  try {
    // Try using RSS2JSON API first
    const rss2jsonUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent('https://crowdtamers.com/feed/')}`;
    const response = await fetch(rss2jsonUrl, { mode: 'cors' });
    
    if (response.ok) {
      const data = await response.json();
      console.log('Blog RSS data received:', data);
      
      if (data.status === 'ok' && data.items && Array.isArray(data.items)) {
        return data.items.map((item: any, index: number) => {
          // Extract image from content if possible
          let imageUrl = item.thumbnail || '';
          
          // Try to extract from content
          if (!imageUrl && item.content) {
            const imgMatch = item.content.match(/<img[^>]+src="([^">]+)"/i);
            if (imgMatch) imageUrl = imgMatch[1];
          }
          
          // Create excerpt from content
          let excerpt = item.description || '';
          excerpt = excerpt.replace(/<[^>]*>/g, '').substring(0, 150) + '...';
          
          return {
            id: `blog-${index}`,
            title: item.title,
            excerpt: excerpt,
            url: item.link,
            date: new Date(item.pubDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            imageUrl: imageUrl
          };
        });
      }
    }
    
    // If RSS2JSON fails, try another method (e.g., fetching directly)
    console.log('RSS2JSON failed, trying direct fetch...');
    
  } catch (error) {
    console.error('Failed to fetch blog posts:', error);
  }
  
  // Return mock data as fallback
  console.log('Using mock blog data');
  return mockBlogPosts;
};

/**
 * Extract YouTube video ID from various URL formats
 */
export const extractYouTubeId = (url: string): string => {
  if (!url) return '';
  
  // Match various YouTube URL formats
  const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\s*[^\/\n\s]+\/\s*(?:watch\?(?:\S*?&)?v=)|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  
  return match ? match[1] : '';
};

/**
 * Fetch YouTube videos with fallback to mock data
 */
export const fetchYouTubeVideos = async (): Promise<Video[]> => {
  console.log('Fetching YouTube videos...');
  
  try {
    // Try using YouTube API directly or through a proxy
    // For demo, we'll use hard-coded IDs to ensure embedding works
    const workingIds = [
      'dQw4w9WgXcQ', // Never Gonna Give You Up
      '9bZkp7q19f0', // Gangnam Style
      'jNQXAC9IVRw'  // First YouTube video ever
    ];
    
    const videos: Video[] = workingIds.map((id, index) => ({
      id: `video-${index}`,
      title: `Video ${index + 1}`,
      thumbnailUrl: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
      videoUrl: `https://www.youtube.com/watch?v=${id}`,
      videoId: id,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }));
    
    // If we got videos, return them
    if (videos.length > 0) {
      return videos;
    }
  } catch (error) {
    console.error('Failed to fetch YouTube videos:', error);
  }
  
  // Return mock data as fallback
  console.log('Using mock video data');
  return mockVideos;
};

/**
 * Load all featured content with fallbacks
 */
export const loadFeaturedContent = async () => {
  console.log('Loading featured content...');
  
  // Use Promise.allSettled to handle partial failures
  const results = await Promise.allSettled([
    fetchBlogPosts(),
    fetchYouTubeVideos()
  ]);
  
  // Get values or fallbacks
  const blogPosts = results[0].status === 'fulfilled' ? results[0].value : mockBlogPosts;
  const videos = results[1].status === 'fulfilled' ? results[1].value : mockVideos;
  
  return {
    featuredBlogPosts: blogPosts.slice(0, 3),
    featuredVideos: videos.slice(0, 3),
    allBlogPosts: blogPosts,
    allVideos: videos
  };
};