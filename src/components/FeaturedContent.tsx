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

// Helper function to add file extension if missing
const ensureImageExtension = (path: string): string => {
  if (!path) return '';
  if (path.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i)) return path;
  return `${path}.png`; // Add default extension
};

const getFallbackImage = (index: number): string => {
  const imageIndex = (index % 6) + 3; // Use image-3 through image-8
  return `/lovable-uploads/image-${imageIndex}`; // Don't add extension here, we'll add it when needed
};

// Helper function to determine if a video is a YouTube Short
const isYouTubeShort = (videoId: string): boolean => {
  // This is a simplistic check - in a real app you might want a more robust mechanism
  // Shorts are typically in vertical format, but the videoId format is the same
  return videoId.length === 11; // All YouTube video IDs are 11 characters
};

const FeaturedContent = ({ featuredPosts, featuredVideos }: FeaturedContentProps) => {
  const [failedVideos, setFailedVideos] = useState<Record<string, boolean>>({});
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Preload images with better error handling
    featuredPosts.forEach(post => {
      if (post.imageUrl) {
        const img = new Image();
        img.src = ensureImageExtension(post.imageUrl);
        img.onload = () => {
          setLoadedImages(prev => ({
            ...prev,
            [post.id]: true
          }));
        };
        img.onerror = () => {
          // If the image fails to load, try with a fallback
          console.log(`Image failed to load for post ${post.title}, trying fallback`);
          const fallbackPath = getFallbackImage(parseInt(post.id.replace(/\D/g, '')) || 0);
          img.src = ensureImageExtension(fallbackPath);
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
                        src={post.imageUrl ? ensureImageExtension(post.imageUrl) : ensureImageExtension(fallbackImg)} 
                        alt={post.title} 
                        className="w-full h-48 object-cover hover:scale-105 transition-transform"
                        loading="lazy"
                        onError={(e) => {
                          console.log(`Using fallback image for post: ${post.title}`);
                          const target = e.target as HTMLImageElement;
                          
                          // Try adding extension if not already present
                          if (!target.src.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i)) {
                            target.src = ensureImageExtension(post.imageUrl || fallbackImg);
                          } else {
                            // If that didn't work, use fallback
                            target.src = ensureImageExtension(fallbackImg);
                          }
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
                const isShort = isYouTubeShort(video.videoId);
                
                return (
                  <div key={video.id} className="overflow-hidden rounded-lg shadow-md">
                    <div className={`${isShort ? 'aspect-[9/16]' : 'aspect-video'} w-full`}>
                      {video.videoId && !failedVideos[video.id] ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${video.videoId}?rel=0${isShort ? '&loop=1' : ''}`}
                          title={video.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full"
                          loading="lazy"
                          onError={() => {
                            console.error(`Failed to load video: ${video.title}`);
                            setFailedVideos(prev => ({
                              ...prev,
                              [video.id]: true
                            }));
                          }}
                        ></iframe>
                      ) : (
                        <div 
                          className="bg-gray-200 w-full h-full flex items-center justify-center relative"
                          style={{
                            backgroundImage: `url(${ensureImageExtension(video.thumbnailUrl || fallbackImg)})`,
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