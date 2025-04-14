
import { parseString } from 'xml2js';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  url: string;
  date: string;
  featured?: boolean;
}

export interface Video {
  id: string;
  title: string;
  thumbnailUrl: string;
  videoUrl: string;
  date: string;
  featured?: boolean;
}

// Function to fetch and parse blog RSS
export const fetchBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    const response = await fetch('https://crowdtamers.com/author/admin/feed/');
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
          // Strip HTML tags for excerpt
          const excerpt = description.replace(/<[^>]*>/g, '').substring(0, 150) + '...';
          
          return {
            id: `blog-${index}`,
            title: item.title[0],
            excerpt: excerpt,
            url: item.link[0],
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
    const response = await fetch('https://www.youtube.com/feeds/videos.xml?channel_id=UCMHNan83yARidp0Ycgq8lWw');
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
          const videoId = entry.id[0].split(':').pop();
          const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
          const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
          
          return {
            id: `video-${index}`,
            title: entry.title[0],
            thumbnailUrl: thumbnailUrl,
            videoUrl: videoUrl,
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
