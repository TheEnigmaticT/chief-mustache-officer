import { useState } from 'react';
import { ExternalLink, Youtube, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import RobustImage from './RobustImage';
import logger from '../utils/logger';
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

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

const isYouTubeShort = (videoId: string): boolean => {
  return videoId.length === 11;
}

const FeaturedContent = ({ featuredPosts, featuredVideos }: FeaturedContentProps) => {
  const [failedVideos, setFailedVideos] = useState<Record<string, boolean>>({});
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const getFallbackImage = (index: number): string => {
    const imageNum = (index % 7) + 2;
    return `/img/image-${imageNum}`;
  };

  const regularVideos = featuredVideos.filter(video => !isYouTubeShort(video.videoId));
  const shortVideos = featuredVideos.filter(video => isYouTubeShort(video.videoId));

  const handleVideoClick = (videoId: string) => {
    setSelectedVideo(prev => prev === videoId ? null : videoId);
  };

  return (
    <section id="content" className="section bg-white">
      <div className="container mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-navy mb-4">Latest Content</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-4">
            Check out my latest blog posts and videos on marketing, growth, and startup success
          </p>
          <Button 
            variant="outline"
            size="sm"
            onClick={logger.downloadLogs}
            className="flex items-center gap-2"
          >
            <Download size={16} />
            Download Logs
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <div className="flex items-center mb-6">
              <h3 className="text-2xl font-semibold text-navy">Featured Blog Posts</h3>
              <Link to="/publications" className="ml-auto text-mustache hover:text-mustache-light text-sm font-medium">
                View All →
              </Link>
            </div>
            <div className="space-y-8">
              {featuredPosts.map((post, index) => {
                const primaryImage = post.ogImage || post.imageUrl;
                
                const fallbacks = [
                  primaryImage,
                  getFallbackImage(index),
                  getFallbackImage(index) + '.png',
                  getFallbackImage((index + 1) % 7 + 2),
                  '/placeholder.svg'
                ].filter(Boolean);
                
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

          <div>
            <div className="flex items-center mb-6">
              <h3 className="text-2xl font-semibold text-navy">Latest YouTube Videos</h3>
              <Link to="/publications" className="ml-auto text-mustache hover:text-mustache-light text-sm font-medium">
                View All →
              </Link>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                {regularVideos.map((video, index) => {
                  const fallbacks = [
                    video.thumbnailUrl,
                    `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`,
                    `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`,
                    getFallbackImage(index),
                    getFallbackImage(index) + '.png',
                    '/placeholder.svg'
                  ].filter(Boolean);
                  
                  return (
                    <div key={video.id} className="overflow-hidden rounded-lg shadow-md">
                      <div className="aspect-video w-full relative">
                        {selectedVideo === video.videoId ? (
                          <a 
                            href={`https://www.youtube.com/watch?v=${video.videoId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full h-full"
                          >
                            <div className="relative w-full h-full">
                              <RobustImage
                                src={`https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`}
                                fallbacks={fallbacks}
                                alt={video.title}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
                                <Youtube className="text-white" size={48} />
                                <p className="text-white mt-2 font-semibold text-center px-2">Click to watch on YouTube</p>
                              </div>
                            </div>
                          </a>
                        ) : (
                          <div 
                            className="relative w-full h-full cursor-pointer" 
                            onClick={() => handleVideoClick(video.videoId)}
                          >
                            <RobustImage
                              src={`https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`}
                              fallbacks={fallbacks}
                              alt={video.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center hover:bg-opacity-50 transition-all">
                              <Youtube className="text-white" size={48} />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="p-3">
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

              <div className="space-y-4">
                {shortVideos.length > 0 && (
                  <div className="bg-gray-100 rounded-lg p-3 mb-4">
                    <h4 className="font-medium text-navy mb-2">YouTube Shorts</h4>
                    <Carousel className="w-full">
                      <CarouselContent>
                        {shortVideos.map((video, index) => {
                          const fallbacks = [
                            video.thumbnailUrl,
                            `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`,
                            `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`,
                            getFallbackImage(index),
                            getFallbackImage(index) + '.png',
                            '/placeholder.svg'
                          ].filter(Boolean);
                          
                          return (
                            <CarouselItem key={video.id}>
                              <div className="overflow-hidden rounded-lg shadow-md">
                                <div className="aspect-[9/16] w-full">
                                  <a 
                                    href={`https://www.youtube.com/shorts/${video.videoId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full h-full"
                                  >
                                    <div className="relative w-full h-full">
                                      <RobustImage
                                        src={`https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`}
                                        fallbacks={fallbacks}
                                        alt={video.title}
                                        className="w-full h-full object-cover"
                                      />
                                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                                        <Youtube className="text-white" size={36} />
                                      </div>
                                    </div>
                                  </a>
                                </div>
                                <div className="p-2">
                                  <h4 className="font-medium text-navy text-sm">{video.title}</h4>
                                  <p className="text-xs text-gray-500 mt-1">{video.date}</p>
                                </div>
                              </div>
                            </CarouselItem>
                          );
                        })}
                      </CarouselContent>
                    </Carousel>
                  </div>
                )}
                
                {regularVideos.length > 2 && (
                  <div className="overflow-hidden rounded-lg shadow-md">
                    <div className="aspect-video w-full relative">
                      <a 
                        href={`https://www.youtube.com/watch?v=${regularVideos[2].videoId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full h-full"
                      >
                        <div className="relative w-full h-full">
                          <RobustImage
                            src={`https://i.ytimg.com/vi/${regularVideos[2].videoId}/hqdefault.jpg`}
                            fallbacks={[
                              regularVideos[2].thumbnailUrl,
                              `https://i.ytimg.com/vi/${regularVideos[2].videoId}/hqdefault.jpg`,
                              getFallbackImage(2),
                              '/placeholder.svg'
                            ].filter(Boolean)}
                            alt={regularVideos[2].title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center hover:bg-opacity-50 transition-all">
                            <Youtube className="text-white" size={36} />
                          </div>
                        </div>
                      </a>
                    </div>
                    <div className="p-3">
                      <h4 className="font-medium text-navy">{regularVideos[2].title}</h4>
                      <p className="text-sm text-gray-500 mt-1">{regularVideos[2].date}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedContent;
