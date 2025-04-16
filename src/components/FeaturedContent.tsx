
import { useState } from 'react';
import { ExternalLink, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';
import RobustImage from './RobustImage';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  url: string;
  date: string;
  imageUrl?: string;
  ogImage?: string;
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

// Helper function to determine if a video is a YouTube Short
const isYouTubeShort = (videoId: string): boolean => {
  // This is a simplistic check - in a real app you might want a more robust mechanism
  // Shorts are typically in vertical format, but the videoId format is the same
  return videoId.length === 11; // All YouTube video IDs are 11 characters
}

const FeaturedContent = ({ featuredPosts, featuredVideos }: FeaturedContentProps) => {
  const [failedVideos, setFailedVideos] = useState<Record<string, boolean>>({});

  // Get a fallback image based on index
  const getFallbackImage = (index: number): string => {
    const imageNum = (index % 7) + 2; // Use image-2 through image-8
    return `/img/image-${imageNum}`;
  };

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
                // First check if we have an Open Graph image
                const primaryImage = post.ogImage || post.imageUrl;
                
                // Create fallbacks array with local images
                const fallbacks = [
                  primaryImage,
                  getFallbackImage(index),
                  getFallbackImage(index) + '.png',
                  getFallbackImage((index + 1) % 7 + 2),
                  '/placeholder.svg'
                ].filter(Boolean); // Remove any empty values
                
                return (
                  <div key={post.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="mb-4 overflow-hidden rounded-lg">
                      <RobustImage 
                        src={primaryImage || fallbacks[0]}
                        fallbacks={fallbacks}
                        alt={post.title} 
                        className="w-full h-48 object-cover hover:scale-105 transition-transform"
                        height="192px"
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
                const fallbacks = [
                  video.thumbnailUrl,
                  `https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`,
                  `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`,
                  getFallbackImage(index),
                  getFallbackImage(index) + '.png',
                  '/placeholder.svg'
                ].filter(Boolean); // Remove any empty values
                
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
                        <div className="relative w-full h-full">
                          <RobustImage
                            src={video.thumbnailUrl || fallbacks[0]}
                            fallbacks={fallbacks}
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
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
