
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

const FeaturedContent = ({ featuredPosts, featuredVideos }: FeaturedContentProps) => {
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
              {featuredPosts.map((post) => (
                <div key={post.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                  {post.imageUrl && (
                    <div className="mb-4 overflow-hidden rounded-lg">
                      <img 
                        src={post.imageUrl} 
                        alt={post.title} 
                        className="w-full h-48 object-cover hover:scale-105 transition-transform"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
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
              ))}
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
              {featuredVideos.map((video) => (
                <div key={video.id} className="overflow-hidden rounded-lg shadow-md">
                  <div className="aspect-video w-full">
                    <iframe
                      src={`https://www.youtube.com/embed/${video.videoId}`}
                      title={video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    ></iframe>
                  </div>
                  <div className="p-4">
                    <h4 className="font-medium text-navy">{video.title}</h4>
                    <p className="text-sm text-gray-500 mt-1">{video.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedContent;
