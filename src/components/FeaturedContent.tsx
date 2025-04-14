import { useState, useEffect } from 'react';
import { ExternalLink, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  url: string;
  date: string;
  imageUrl?: string;
}

interface Video {
  id: string;
  title: string;
  thumbnailUrl: string;
  videoUrl: string;
  videoId: string;
  date: string;
}

interface FeaturedContentProps {
  featuredPosts: BlogPost[];
  featuredVideos: Video[];
}

const getFallbackImage = (index: number): string => {
  const imageIndex = (index % 8) + 3; // Start from 3 to avoid using image-1 and image-2
  return `/lovable-uploads/image-${imageIndex}.png`; // Add the correct file extension
};

const FeaturedContent = ({ featuredPosts, featuredVideos }: FeaturedContentProps) => {
  const [failedVideos, setFailedVideos] = useState<Record<string, boolean>>({});
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Preload images
    featuredPosts.forEach(post => {
      if (post.imageUrl) {
        const img = new Image();
        img.src = post.imageUrl;
        img.onload = () => {
          setLoadedImages(prev => ({
            ...prev,
            [post.id]: true
          }));
        };
      }
    });
  }, [featuredPosts]);

  if (!featuredPosts.length && !featuredVideos.length) {
    return (
      <section id="content" className="section bg-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-navy mb-4">No Content Available</h2>
          <p className="text-lg text-gray-600">Please check back later for updates.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="content" className="section bg-white">
      <div className="container mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-navy mb-4">Latest Content</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Check out my latest blog posts and videos on marketing, growth, and startup success
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Featured Blog Posts */}
          <div>
            <div className="flex items-center mb-6">
              <h3 className="text-2xl font-semibold text-navy">Featured Blog Posts</h3>
              <Link to="/publications" className="ml-auto text-mustache hover:text-mustache-light text-sm font-medium">
                View All →
              </Link>
            </div>
            <div className="space-y-8">
              {featuredPosts.map((post, index) => {
                const fallbackImg = getFallbackImage(index);
                return (
                  <div key={post.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="mb-4 overflow-hidden rounded-lg">
                      <img 
                        src={post.imageUrl || fallbackImg} 
                        alt={post.title} 
                        className="w-full h-48 object-cover hover:scale-105 transition-transform"
                        loading="lazy"
                        onError={(e) => {
                          console.log(`Using fallback image for post: ${post.title}`);
                          const target = e.target as HTMLImageElement;
                          target.src = fallbackImg;
                        }}
                      />
                    </div>
                    <h4 className="text-xl font-semibold mb-2">{post.title}</h4>
                    <p className="text-sm text-gray-500 mb-2">{post.date}</p>
                    <p className="text-gray-700 mb-3">{post.excerpt}</p>
                    <a 
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer" 
                      className="inline-flex items-center text-mustache hover:text-mustache-light font-medium"
                    >
                      Read More <ExternalLink size={16} className="ml-1" />
                    </a>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Featured YouTube Videos */}
          <div>
            <div className="flex items-center mb-6">
              <h3 className="text-2xl font-semibold text-navy">Latest YouTube Videos</h3>
              <Link to="/publications" className="ml-auto text-mustache hover:text-mustache-light text-sm font-medium">
                View All →
              </Link>
            </div>
            <div className="space-y-6">
              {featuredVideos.map((video, index) => {
                const fallbackImg = getFallbackImage(index);
                return (
                  <div key={video.id} className="overflow-hidden rounded-lg shadow-md">
                    <div className="aspect-video w-full">
                      {video.videoId ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${video.videoId}`}
                          title={video.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full"
                          loading="lazy"
                        ></iframe>
                      ) : (
                        <div 
                          className="bg-gray-200 w-full h-full flex items-center justify-center relative"
                          style={{
                            backgroundImage: `url(${video.thumbnailUrl || fallbackImg})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                          }}
                        >
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <Youtube className="text-white" size={48} />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h4 className="font-medium text-navy">{video.title}</h4>
                      <p className="text-sm text-gray-500 mt-1">{video.date}</p>
                      <a 
                        href={video.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-mustache hover:text-mustache-light font-medium mt-2"
                      >
                        Watch on YouTube <ExternalLink size={16} className="ml-1" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedContent;
