export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  url: string;
  date: string;
  imageUrl?: string;
  ogImage?: string;  // Add support for Open Graph images
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
  embedUrl?: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Where Gaming Is Going -- And Why It Is Wrong",
    excerpt: "An analysis of current gaming industry trends and why many predictions about the future of gaming might be missing the mark completely.",
    url: "https://crowdtamers.com/where-gaming-is-going",
    date: "June 15, 2023",
    imageUrl: "/img/image-2",
    ogImage: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    featured: true
  },
  {
    id: "2",
    title: "Think Big, Build Small",
    excerpt: "How to apply the minimum viable product approach to ambitious projects without compromising your long-term vision.",
    url: "https://crowdtamers.com/think-big-build-small",
    date: "March 22, 2023",
    imageUrl: "/img/image-3",
    ogImage: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    featured: true
  },
  {
    id: "3",
    title: "Download VS Cloud Gaming",
    excerpt: "A deep dive into the pros and cons of traditional game downloads versus cloud gaming services, with predictions for the future of game distribution.",
    url: "https://crowdtamers.com/download-vs-cloud",
    date: "November 10, 2022",
    imageUrl: "/img/image-6",
    ogImage: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    featured: true
  },
  {
    id: "4",
    title: "Creating a digital business for humans",
    excerpt: "How to maintain a human touch in an increasingly digital business landscape, with practical examples from successful companies.",
    url: "https://crowdtamers.com/digital-business-humans",
    date: "September 5, 2022",
    imageUrl: "/img/image-7",
    ogImage: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "5",
    title: "Digital pioneers share their secrets: 3 reasons why selling DRM-free content is the future",
    excerpt: "Insights from leaders in digital content distribution on why DRM-free approaches are gaining traction and transforming industries.",
    url: "https://crowdtamers.com/drm-free-future",
    date: "July 18, 2022",
    imageUrl: "/img/image-8",
    ogImage: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7"
  },
  {
    id: "6",
    title: "Building Marketing Teams That Scale",
    excerpt: "Essential strategies for building marketing teams that can grow with your business from startup to established company.",
    url: "https://crowdtamers.com/marketing-teams-scale",
    date: "June 2, 2022",
    imageUrl: "/img/image-1"
  },
  {
    id: "7",
    title: "The Growth Hacking Myth",
    excerpt: "Debunking common growth hacking misconceptions and presenting a more sustainable approach to marketing-driven growth.",
    url: "https://crowdtamers.com/growth-hacking-myth",
    date: "April 15, 2022",
    imageUrl: "/img/image-2"
  },
  {
    id: "8",
    title: "Marketing Attribution Models for Startups",
    excerpt: "A practical guide to implementing marketing attribution models when you're just starting out and resources are limited.",
    url: "https://crowdtamers.com/attribution-models",
    date: "February 28, 2022",
    imageUrl: "/img/image-3"
  }
];

export const videos: Video[] = [
  {
    id: "1",
    title: "5 Marketing Strategies That Actually Work for Early-Stage Startups",
    thumbnailUrl: "/img/image-7",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    videoId: "dQw4w9WgXcQ",
    embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    date: "August 12, 2023",
    featured: true
  },
  {
    id: "2",
    title: "How to Create a Go-to-Market Strategy That Actually Works",
    thumbnailUrl: "/img/image-8",
    videoUrl: "https://www.youtube.com/watch?v=9bZkp7q19f0",
    videoId: "9bZkp7q19f0",
    embedUrl: "https://www.youtube.com/embed/9bZkp7q19f0",
    date: "July 25, 2023",
    featured: true
  },
  {
    id: "3",
    title: "The Content Marketing Framework I Used to Scale 15 Startups",
    thumbnailUrl: "/img/image-2",
    videoUrl: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
    videoId: "jNQXAC9IVRw",
    embedUrl: "https://www.youtube.com/embed/jNQXAC9IVRw",
    date: "June 18, 2023",
    featured: true
  },
  {
    id: "4",
    title: "Positioning Your B2B SaaS for Maximum Growth",
    thumbnailUrl: "/img/image-3",
    videoUrl: "https://www.youtube.com/watch?v=Y-P0Hs0ADJY",
    videoId: "Y-P0Hs0ADJY",
    embedUrl: "https://www.youtube.com/embed/Y-P0Hs0ADJY",
    date: "May 30, 2023"
  },
  {
    id: "5",
    title: "Why Most Startup Marketing Fails (And How to Fix It)",
    thumbnailUrl: "/img/image-6",
    videoUrl: "https://www.youtube.com/watch?v=M7lc1UVf-VE",
    videoId: "M7lc1UVf-VE",
    embedUrl: "https://www.youtube.com/embed/M7lc1UVf-VE",
    date: "April 22, 2023"
  },
  {
    id: "6",
    title: "Building Your First Growth Team: Roles and Responsibilities",
    thumbnailUrl: "/img/image-1",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    videoId: "dQw4w9WgXcQ",
    embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    date: "March 15, 2023"
  }
];

export const featuredBlogPosts = blogPosts.filter(post => post.featured);
export const featuredVideos = videos.filter(video => video.featured);
