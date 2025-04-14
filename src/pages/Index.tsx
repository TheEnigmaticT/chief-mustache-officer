import { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import FeaturedContent from '../components/FeaturedContent';
import TestimonialCard from '../components/TestimonialCard';
import ProjectCard from '../components/ProjectCard';
import { testimonials } from '../data/testimonials';
import { featuredProjects } from '../data/projects';
import { loadFeaturedContent } from '../utils/rssFeeds';
import { BlogPost, Video } from '../utils/rssFeeds';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

// Mock data to use when feeds fail to load
const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'How to Build a Million-Dollar Marketing Engine',
    excerpt: 'Learn the key strategies I used to build marketing systems that consistently deliver results for startups.',
    url: 'https://crowdtamers.com/million-dollar-marketing',
    date: '2025-03-15',
    imageUrl: '/lovable-uploads/image-2'
  },
  {
    id: '2',
    title: 'The Validation Framework Every Startup Needs',
    excerpt: 'Before you build anything, you need to validate your idea. Here\'s my proven framework for effective validation.',
    url: 'https://crowdtamers.com/validation-framework',
    date: '2025-02-28',
    imageUrl: '/lovable-uploads/image-3'
  },
  {
    id: '3',
    title: '5 Go-to-Market Strategies That Actually Work',
    excerpt: 'After launching 130+ startups, these are the GTM strategies I\'ve found to be consistently effective.',
    url: 'https://crowdtamers.com/gtm-strategies',
    date: '2025-01-20',
    imageUrl: '/lovable-uploads/image-6'
  }
];

const mockVideos: Video[] = [
  {
    id: '1',
    title: 'Marketing Minute: Customer Acquisition Cost',
    thumbnailUrl: '/lovable-uploads/image-7',
    videoUrl: 'https://www.youtube.com/watch?v=example1',
    videoId: 'dQw4w9WgXcQ',
    date: '2025-03-10'
  },
  {
    id: '2',
    title: 'Marketing Minute: Value Proposition Design',
    thumbnailUrl: '/lovable-uploads/image-8',
    videoUrl: 'https://www.youtube.com/watch?v=example2',
    videoId: '9bZkp7q19f0',
    date: '2025-02-25'
  },
  {
    id: '3',
    title: 'Marketing Minute: Positioning Strategy',
    thumbnailUrl: '/lovable-uploads/image-2',
    videoUrl: 'https://www.youtube.com/watch?v=example3',
    videoId: 'jNQXAC9IVRw',
    date: '2025-02-15'
  },
  {
    id: '4',
    title: 'Marketing Minute: Customer Journey Mapping',
    thumbnailUrl: '/lovable-uploads/image-3',
    videoUrl: 'https://www.youtube.com/watch?v=example4',
    videoId: 'Y-P0Hs0ADJY',
    date: '2025-02-05'
  }
];

const Index = () => {
  const [displayedTestimonials, setDisplayedTestimonials] = useState(testimonials.slice(0, 3));
  const [showAllTestimonials, setShowAllTestimonials] = useState(false);
  const [featuredBlogPosts, setFeaturedBlogPosts] = useState<BlogPost[]>([]);
  const [featuredVideos, setFeaturedVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadContent = async () => {
      setIsLoading(true);
      try {
        const content = await loadFeaturedContent();
        
        // If we have valid content, use it; otherwise use mock data
        if (content.featuredBlogPosts && content.featuredBlogPosts.length > 0) {
          setFeaturedBlogPosts(content.featuredBlogPosts);
        } else {
          setFeaturedBlogPosts(mockBlogPosts);
          console.log('Using mock blog posts due to loading failure');
        }
        
        if (content.featuredVideos && content.featuredVideos.length > 0) {
          setFeaturedVideos(content.featuredVideos);
        } else {
          setFeaturedVideos(mockVideos);
          console.log('Using mock videos due to loading failure');
        }
      } catch (error) {
        console.error('Error loading content:', error);
        setFeaturedBlogPosts(mockBlogPosts);
        setFeaturedVideos(mockVideos);
        toast({
          title: "Content Loading Issue",
          description: "Unable to fetch live content. Showing sample content instead.",
          variant: "default",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadContent();
  }, [toast]);

  const toggleTestimonials = () => {
    if (showAllTestimonials) {
      setDisplayedTestimonials(testimonials.slice(0, 3));
    } else {
      setDisplayedTestimonials(testimonials);
    }
    setShowAllTestimonials(!showAllTestimonials);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        
        <div id="content"></div>
        
        {isLoading ? (
          <section className="section bg-white">
            <div className="container mx-auto">
              <div className="mb-12 text-center">
                <h2 className="text-3xl md:text-4xl font-semibold text-navy mb-4">Latest Content</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Loading my latest blog posts and videos...
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-semibold mb-6">Recent Articles</h3>
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="rounded-lg border p-4">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2 mb-4" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-4/5" />
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-6">Recent Videos</h3>
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="rounded-lg border overflow-hidden">
                        <Skeleton className="h-40 w-full" />
                        <div className="p-4">
                          <Skeleton className="h-6 w-3/4 mb-2" />
                          <Skeleton className="h-4 w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <FeaturedContent 
            featuredPosts={featuredBlogPosts}
            featuredVideos={featuredVideos}
          />
        )}

        {/* Projects Section */}
        <section className="section bg-gray-50">
          <div className="container mx-auto">
            <div className="mb-12 text-center">
              <h2 className="text-3xl md:text-4xl font-semibold text-navy mb-4">Current Projects</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Here are some of the exciting projects I'm currently working on
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project) => (
                <ProjectCard 
                  key={project.id}
                  title={project.title}
                  description={project.description}
                  imageUrl={project.imageUrl}
                  technologies={project.technologies}
                  liveUrl={project.liveUrl}
                  repoUrl={project.repoUrl}
                  status={project.status}
                />
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Link 
                to="/projects" 
                className="btn btn-primary btn-lg"
              >
                View All Projects
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="section bg-white">
          <div className="container mx-auto">
            <div className="mb-12 text-center">
              <h2 className="text-3xl md:text-4xl font-semibold text-navy mb-4">What People Say</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Feedback from clients and collaborators I've worked with
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedTestimonials.map((testimonial) => (
                <TestimonialCard 
                  key={testimonial.id}
                  text={testimonial.text}
                  author={testimonial.author}
                  position={testimonial.position}
                  company={testimonial.company}
                />
              ))}
            </div>
            
            {testimonials.length > 3 && (
              <div className="mt-12 text-center">
                <button 
                  onClick={toggleTestimonials}
                  className="btn btn-outline btn-lg"
                >
                  {showAllTestimonials ? "Show Less" : "View More Testimonials"}
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
