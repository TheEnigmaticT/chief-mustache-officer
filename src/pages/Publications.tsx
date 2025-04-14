
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Search, Youtube, FileText, ExternalLink } from 'lucide-react';
import { fetchBlogPosts, fetchYouTubeVideos } from '../utils/rssFeeds';
import { BlogPost, Video } from '../utils/rssFeeds';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";

const ITEMS_PER_PAGE = 6;

interface FilterOption {
  label: string;
  value: string;
}

const Publications = () => {
  const [activeTab, setActiveTab] = useState<'blog' | 'videos'>('blog');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'alphabetical'>('newest');
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const filterOptions: FilterOption[] = [
    { label: 'Newest First', value: 'newest' },
    { label: 'Oldest First', value: 'oldest' },
    { label: 'Alphabetical', value: 'alphabetical' }
  ];

  useEffect(() => {
    const loadContent = async () => {
      setIsLoading(true);
      try {
        const [loadedBlogPosts, loadedVideos] = await Promise.all([
          fetchBlogPosts(),
          fetchYouTubeVideos()
        ]);
        
        setBlogPosts(loadedBlogPosts);
        setVideos(loadedVideos);
      } catch (error) {
        console.error('Error loading content:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadContent();
  }, []);

  // Filter and sort blog posts
  const filteredBlogPosts = blogPosts
    .filter(post => 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === 'oldest') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else {
        return a.title.localeCompare(b.title);
      }
    });

  // Filter and sort videos
  const filteredVideos = videos
    .filter(video => 
      video.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === 'oldest') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else {
        return a.title.localeCompare(b.title);
      }
    });

  // Pagination
  const currentItems = activeTab === 'blog' 
    ? filteredBlogPosts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
    : filteredVideos.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  
  const totalPages = Math.ceil(
    (activeTab === 'blog' ? filteredBlogPosts.length : filteredVideos.length) / ITEMS_PER_PAGE
  );

  // Handle tab change
  const handleTabChange = (tab: 'blog' | 'videos') => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // Change page
  const changePage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate pagination links
  const renderPaginationLinks = () => {
    const links = [];
    
    // For smaller number of pages, show all
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        links.push(
          <PaginationItem key={i}>
            <PaginationLink 
              isActive={currentPage === i} 
              onClick={() => changePage(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
      return links;
    }
    
    // For larger numbers, show first, last, and those around current
    links.push(
      <PaginationItem key={1}>
        <PaginationLink 
          isActive={currentPage === 1} 
          onClick={() => changePage(1)}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );
    
    if (currentPage > 3) {
      links.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);
    
    for (let i = startPage; i <= endPage; i++) {
      links.push(
        <PaginationItem key={i}>
          <PaginationLink 
            isActive={currentPage === i} 
            onClick={() => changePage(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    if (currentPage < totalPages - 2) {
      links.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    if (totalPages > 1) {
      links.push(
        <PaginationItem key={totalPages}>
          <PaginationLink 
            isActive={currentPage === totalPages} 
            onClick={() => changePage(totalPages)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return links;
  };

  const renderSkeletons = () => {
    return Array(6).fill(0).map((_, i) => (
      <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/4 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-6" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      </div>
    ));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        {/* Header Section */}
        <section className="py-16 bg-navy text-white">
          <div className="container mx-auto px-4 md:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Publications</h1>
            <p className="text-xl max-w-3xl">
              Explore my collection of blog posts, articles, and video content on marketing, 
              growth strategies, and startup success.
            </p>
          </div>
        </section>

        {/* Filters Section */}
        <section className="bg-white py-8 border-b">
          <div className="container mx-auto px-4 md:px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
              {/* Tabs */}
              <div className="flex space-x-4">
                <button 
                  className={`px-6 py-2 font-medium rounded-md transition-colors flex items-center ${
                    activeTab === 'blog' 
                      ? 'bg-navy text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => handleTabChange('blog')}
                >
                  <FileText size={18} className="inline mr-2" />
                  Blog Posts
                </button>
                <button 
                  className={`px-6 py-2 font-medium rounded-md transition-colors flex items-center ${
                    activeTab === 'videos' 
                      ? 'bg-navy text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => handleTabChange('videos')}
                >
                  <Youtube size={18} className="inline mr-2" />
                  Videos
                </button>
              </div>

              {/* Sort and Search */}
              <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="appearance-none bg-gray-100 border border-gray-300 rounded-md py-2 pl-4 pr-10 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
                  >
                    {filterOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search publications..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
                  />
                  <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4 md:px-8">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {renderSkeletons()}
              </div>
            ) : activeTab === 'blog' ? (
              <div className="animate-fadeIn">
                {currentItems.length === 0 ? (
                  <div className="text-center py-12">
                    <h3 className="text-xl text-gray-600">No blog posts match your search criteria</h3>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {currentItems.map((post) => (
                      <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="p-6">
                          <h3 className="text-xl font-semibold text-navy mb-2">{post.title}</h3>
                          <p className="text-sm text-gray-500 mb-4">{post.date}</p>
                          <p className="text-gray-700 mb-6">{post.excerpt}</p>
                          <a 
                            href={post.url}
                            target="_blank"
                            rel="noopener noreferrer" 
                            className="inline-flex items-center text-mustache hover:text-mustache-light font-medium"
                          >
                            Read Full Article <ExternalLink size={16} className="ml-1" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="animate-fadeIn">
                {currentItems.length === 0 ? (
                  <div className="text-center py-12">
                    <h3 className="text-xl text-gray-600">No videos match your search criteria</h3>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {currentItems.map((video) => (
                      <a
                        key={video.id}
                        href={video.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group"
                      >
                        <div className="aspect-video relative">
                          <img 
                            src={video.thumbnailUrl} 
                            alt={video.title} 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Youtube size={48} className="text-white" />
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="text-lg font-semibold text-navy mb-2 group-hover:text-mustache transition-colors">
                            {video.title}
                          </h3>
                          <p className="text-sm text-gray-500">{video.date}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && !isLoading && (
              <div className="mt-12">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => changePage(Math.max(1, currentPage - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    
                    {renderPaginationLinks()}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => changePage(Math.min(totalPages, currentPage + 1))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Publications;
