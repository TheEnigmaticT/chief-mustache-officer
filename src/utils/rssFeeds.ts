
import { parseString } from 'xml2js';

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
  return match ? match[1] : 'dQw4w9WgXcQ'; // Default to a known video ID if extraction fails
};

// Function to fetch and parse blog RSS
export const fetchBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    const response = await fetch('https://crowdtamers.com/author/admin/feed/', {
      mode: 'cors',
    });
    const xml = await response.text();
    
    return new Promise((resolve, reject) => {
      parseString(xml, (err, result) => {
        if (err) {
          console.error('Error parsing blog RSS:', err);
          resolve([]);
          return;
        }
        
        const items = result.rss.channel[0].item || [];
        const posts: BlogPost[] = items.map((item: any, index: number) => {
          // Extract description and create excerpt
          let description = item.description ? item.description[0] : '';
          // Extract image from content
          const content = item['content:encoded'] ? item['content:encoded'][0] : description;
          const imageUrl = extractImageFromContent(content) || `/lovable-uploads/image-${(index % 8) + 1}`; // Use local fallback images
          
          // Strip HTML tags for excerpt
          const excerpt = description.replace(/<[^>]*>/g, '').substring(0, 150) + '...';
          
          return {
            id: `blog-${index}`,
            title: item.title[0],
            excerpt: excerpt,
            url: item.link[0],
            imageUrl: imageUrl,
            date: new Date(item.pubDate[0]).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            featured: index < 3 // First 3 items are featured
          };
        });
        
        resolve(posts);
      });
    });
  } catch (error) {
    console.error('Failed to fetch blog posts:', error);
    return [];
  }
};

// Function to fetch and parse YouTube RSS
export const fetchYouTubeVideos = async (): Promise<Video[]> => {
  try {
    const response = await fetch('https://www.youtube.com/feeds/videos.xml?channel_id=UCMHNan83yARidp0Ycgq8lWw', {
      mode: 'cors',
    });
    const xml = await response.text();
    
    return new Promise((resolve, reject) => {
      parseString(xml, (err, result) => {
        if (err) {
          console.error('Error parsing YouTube RSS:', err);
          resolve([]);
          return;
        }
        
        const entries = result.feed.entry || [];
        const videos: Video[] = entries.map((entry: any, index: number) => {
          // Get video ID from link
          const videoId = entry.id[0].split(':').pop() || extractYouTubeId(entry.link[0].$.href);
          const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
          const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
          
          return {
            id: `video-${index}`,
            title: entry.title[0],
            thumbnailUrl: thumbnailUrl,
            videoUrl: videoUrl,
            videoId: videoId,
            date: new Date(entry.published[0]).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            featured: index < 3 // First 3 videos are featured
          };
        });
        
        resolve(videos);
      });
    });
  } catch (error) {
    console.error('Failed to fetch YouTube videos:', error);
    return [];
  }
};

export const loadFeaturedContent = async () => {
  try {
    const [blogPosts, videos] = await Promise.all([
      fetchBlogPosts(),
      fetchYouTubeVideos()
    ]);
    
    return {
      featuredBlogPosts: blogPosts.filter(post => post.featured).slice(0, 3),
      featuredVideos: videos.filter(video => video.featured).slice(0, 3),
      allBlogPosts: blogPosts,
      allVideos: videos
    };
  } catch (error) {
    console.error('Error loading featured content:', error);
    return {
      featuredBlogPosts: [],
      featuredVideos: [],
      allBlogPosts: [],
      allVideos: []
    };
  }
};
