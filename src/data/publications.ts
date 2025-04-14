
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

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Where Gaming Is Going -- And Why It Is Wrong",
    excerpt: "An analysis of current gaming industry trends and why many predictions about the future of gaming might be missing the mark completely.",
    url: "https://example.com/gaming-future",
    date: "June 15, 2023",
    imageUrl: "/lovable-uploads/image-2",
    featured: true
  },
  {
    id: "2",
    title: "Think Big, Build Small",
    excerpt: "How to apply the minimum viable product approach to ambitious projects without compromising your long-term vision.",
    url: "https://example.com/think-big-build-small",
    date: "March 22, 2023",
    imageUrl: "/lovable-uploads/image-3",
    featured: true
  },
  {
    id: "3",
    title: "Download VS Cloud Gaming",
    excerpt: "A deep dive into the pros and cons of traditional game downloads versus cloud gaming services, with predictions for the future of game distribution.",
    url: "https://example.com/download-vs-cloud",
    date: "November 10, 2022",
    imageUrl: "/lovable-uploads/image-6",
    featured: true
  },
  {
    id: "4",
    title: "Creating a digital business for humans",
    excerpt: "How to maintain a human touch in an increasingly digital business landscape, with practical examples from successful companies.",
    url: "https://example.com/digital-business-humans",
    date: "September 5, 2022",
    imageUrl: "/lovable-uploads/image-7"
  },
  {
    id: "5",
    title: "Digital pioneers share their secrets: 3 reasons why selling DRM-free content is the future",
    excerpt: "Insights from leaders in digital content distribution on why DRM-free approaches are gaining traction and transforming industries.",
    url: "https://example.com/drm-free-future",
    date: "July 18, 2022",
    imageUrl: "/lovable-uploads/image-8"
  },
  {
    id: "6",
    title: "Building Marketing Teams That Scale",
    excerpt: "Essential strategies for building marketing teams that can grow with your business from startup to established company.",
    url: "https://example.com/marketing-teams-scale",
    date: "June 2, 2022",
    imageUrl: "/lovable-uploads/image-1"
  },
  {
    id: "7",
    title: "The Growth Hacking Myth",
    excerpt: "Debunking common growth hacking misconceptions and presenting a more sustainable approach to marketing-driven growth.",
    url: "https://example.com/growth-hacking-myth",
    date: "April 15, 2022",
    imageUrl: "/lovable-uploads/image-2"
  },
  {
    id: "8",
    title: "Marketing Attribution Models for Startups",
    excerpt: "A practical guide to implementing marketing attribution models when you're just starting out and resources are limited.",
    url: "https://example.com/attribution-models",
    date: "February 28, 2022",
    imageUrl: "/lovable-uploads/image-3"
  }
];

export const videos: Video[] = [
  {
    id: "1",
    title: "5 Marketing Strategies That Actually Work for Early-Stage Startups",
    thumbnailUrl: "/lovable-uploads/image-7",
    videoUrl: "https://youtube.com/watch?v=example1",
    videoId: "dQw4w9WgXcQ", // Real YouTube video ID
    date: "August 12, 2023",
    featured: true
  },
  {
    id: "2",
    title: "How to Create a Go-to-Market Strategy That Actually Works",
    thumbnailUrl: "/lovable-uploads/image-8",
    videoUrl: "https://youtube.com/watch?v=example2",
    videoId: "9bZkp7q19f0", // Real YouTube video ID
    date: "July 25, 2023",
    featured: true
  },
  {
    id: "3",
    title: "The Content Marketing Framework I Used to Scale 15 Startups",
    thumbnailUrl: "/lovable-uploads/image-2",
    videoUrl: "https://youtube.com/watch?v=example3",
    videoId: "jNQXAC9IVRw", // Real YouTube video ID
    date: "June 18, 2023",
    featured: true
  },
  {
    id: "4",
    title: "Positioning Your B2B SaaS for Maximum Growth",
    thumbnailUrl: "/lovable-uploads/image-3",
    videoUrl: "https://youtube.com/watch?v=example4",
    videoId: "Y-P0Hs0ADJY", // Real YouTube video ID
    date: "May 30, 2023"
  },
  {
    id: "5",
    title: "Why Most Startup Marketing Fails (And How to Fix It)",
    thumbnailUrl: "/lovable-uploads/image-6",
    videoUrl: "https://youtube.com/watch?v=example5",
    videoId: "M7lc1UVf-VE", // Real YouTube video ID
    date: "April 22, 2023"
  },
  {
    id: "6",
    title: "Building Your First Growth Team: Roles and Responsibilities",
    thumbnailUrl: "/lovable-uploads/image-1",
    videoUrl: "https://youtube.com/watch?v=example6",
    videoId: "dQw4w9WgXcQ", // Real YouTube video ID
    date: "March 15, 2023"
  }
];

export const featuredBlogPosts = blogPosts.filter(post => post.featured);
export const featuredVideos = videos.filter(video => video.featured);
